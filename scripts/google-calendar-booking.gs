/**
 * Google Apps Script for Meeting Booking System
 *
 * SETUP INSTRUCTIONS:
 * 1. Go to https://script.google.com and create a new project
 * 2. Copy this entire script into the editor
 * 3. Replace CALENDAR_ID with your Google Calendar ID (usually your email)
 * 4. Replace OWNER_EMAIL with your email for notifications
 * 5. Click on the gear icon (Project Settings) and check "Show 'appsscript.json' manifest"
 * 6. Edit appsscript.json and add:
 *    "oauthScopes": [
 *      "https://www.googleapis.com/auth/calendar",
 *      "https://www.googleapis.com/auth/script.send_mail"
 *    ]
 * 7. Run the testCalendarAccess() function first to authorize the script
 * 8. Deploy > New deployment > Web app
 *    - Description: Meeting Booking API
 *    - Execute as: Me (your email)
 *    - Who has access: Anyone
 * 9. Copy the web app URL and update APPS_SCRIPT_URL in contact.md
 *
 * IMPORTANT: After any changes, create a NEW deployment (not edit existing)
 */

// Configuration - UPDATE THESE VALUES
const CALENDAR_ID = 'dntounis@stanford.edu'; // Your Google Calendar ID
const OWNER_EMAIL = 'dimitris.ntounis@gmail.com'; // Email for notifications
const OWNER_NAME = 'Dimitris Ntounis';
const MEETING_DURATION_MINUTES = 60;
const AVAILABLE_HOUR = 19; // 7 PM Pacific
const AVAILABLE_DAYS = [1, 2, 3, 4, 5]; // Monday to Friday
const TIMEZONE = 'America/Los_Angeles';

/**
 * Handle GET requests - return busy times
 */
function doGet(e) {
  try {
    // Handle case when called without parameters (e.g., during testing)
    const params = (e && e.parameter) ? e.parameter : {};
    const startDate = params.start || new Date().toISOString().split('T')[0];
    const endDate = params.end || getDateNDaysFromNow(28);

    const busySlots = getBusySlots(startDate, endDate);

    const output = {
      success: true,
      busySlots: busySlots,
      availableHour: AVAILABLE_HOUR,
      availableDays: AVAILABLE_DAYS,
      timezone: TIMEZONE
    };

    return ContentService
      .createTextOutput(JSON.stringify(output))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    Logger.log('doGet error: ' + error.message);
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.message
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handle POST requests - create calendar event
 */
function doPost(e) {
  try {
    let data;

    // Handle both JSON and form data
    if (e && e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else if (e && e.parameter) {
      data = e.parameter;
    } else {
      throw new Error('No data received. This endpoint requires POST data.');
    }

    Logger.log('Received booking request: ' + JSON.stringify(data));

    // Validate required fields
    if (!data.date || !data.name || !data.email || !data.topic) {
      throw new Error('Missing required fields: date, name, email, or topic');
    }

    // Check if slot is still available
    if (isSlotBusy(data.date)) {
      return ContentService
        .createTextOutput(JSON.stringify({
          success: false,
          error: 'This time slot is no longer available. Please select another time.'
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // Create the calendar event
    const event = createCalendarEvent(data);
    Logger.log('Event created: ' + event.getId());

    // Send confirmation emails
    sendConfirmationEmails(data, event);

    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Meeting booked successfully',
        eventId: event.getId()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    Logger.log('doPost error: ' + error.message + '\n' + error.stack);
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.message
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Get busy slots from calendar
 */
function getBusySlots(startDateStr, endDateStr) {
  const calendar = CalendarApp.getCalendarById(CALENDAR_ID);
  if (!calendar) {
    Logger.log('Cannot access calendar: ' + CALENDAR_ID);
    throw new Error('Cannot access calendar. Please check calendar permissions.');
  }

  const busySlots = [];

  // Check each potential meeting slot individually
  let currentDate = new Date(startDateStr + 'T12:00:00'); // Start at noon to avoid date boundary issues
  const endDateObj = new Date(endDateStr + 'T12:00:00');

  while (currentDate <= endDateObj) {
    const dayOfWeek = currentDate.getDay();

    if (AVAILABLE_DAYS.includes(dayOfWeek)) {
      // Create slot times in Pacific timezone
      const dateStr = Utilities.formatDate(currentDate, TIMEZONE, 'yyyy-MM-dd');
      const slotStart = createDateInTimezone(dateStr, AVAILABLE_HOUR, 0, TIMEZONE);
      const slotEnd = new Date(slotStart.getTime() + MEETING_DURATION_MINUTES * 60 * 1000);

      Logger.log('Checking slot: ' + dateStr + ' from ' + slotStart + ' to ' + slotEnd);

      // Get events only for this specific time slot
      const events = calendar.getEvents(slotStart, slotEnd);

      // Filter out all-day events and check for real conflicts
      const conflictingEvents = events.filter(event => {
        // Skip all-day events - they don't block time slots
        if (event.isAllDayEvent()) {
          return false;
        }

        const eventStart = event.getStartTime();
        const eventEnd = event.getEndTime();

        // Check for actual overlap
        const overlaps = (eventStart < slotEnd && eventEnd > slotStart);
        if (overlaps) {
          Logger.log('  Conflict found: "' + event.getTitle() + '" from ' + eventStart + ' to ' + eventEnd);
        }
        return overlaps;
      });

      if (conflictingEvents.length > 0) {
        busySlots.push(dateStr);
        Logger.log('Slot busy: ' + dateStr);
      }
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  Logger.log('Total busy slots found: ' + busySlots.length);
  return busySlots;
}

/**
 * Create a Date object for a specific time in a specific timezone
 */
function createDateInTimezone(dateStr, hour, minute, timezone) {
  // Parse the date string
  const parts = dateStr.split('-');
  const year = parseInt(parts[0]);
  const month = parseInt(parts[1]) - 1; // JavaScript months are 0-indexed
  const day = parseInt(parts[2]);

  // Create a date string that Utilities.parseDate can understand
  const timeStr = padZero(hour) + ':' + padZero(minute) + ':00';
  const fullDateStr = dateStr + ' ' + timeStr;

  // Use Utilities to parse in the correct timezone
  const date = Utilities.parseDate(fullDateStr, timezone, 'yyyy-MM-dd HH:mm:ss');
  return date;
}

/**
 * Check if a specific slot is busy (used when booking)
 */
function isSlotBusy(dateStr) {
  const calendar = CalendarApp.getCalendarById(CALENDAR_ID);
  if (!calendar) {
    throw new Error('Cannot access calendar');
  }

  // Create slot times in Pacific timezone
  const slotStart = createDateInTimezone(dateStr, AVAILABLE_HOUR, 0, TIMEZONE);
  const slotEnd = new Date(slotStart.getTime() + MEETING_DURATION_MINUTES * 60 * 1000);

  Logger.log('Checking if slot is busy: ' + dateStr + ' from ' + slotStart + ' to ' + slotEnd);

  const events = calendar.getEvents(slotStart, slotEnd);

  // Filter out all-day events
  const conflictingEvents = events.filter(event => {
    if (event.isAllDayEvent()) {
      return false;
    }
    const eventStart = event.getStartTime();
    const eventEnd = event.getEndTime();
    const overlaps = (eventStart < slotEnd && eventEnd > slotStart);
    if (overlaps) {
      Logger.log('  Conflict: "' + event.getTitle() + '" ' + eventStart + ' - ' + eventEnd);
    }
    return overlaps;
  });

  return conflictingEvents.length > 0;
}

/**
 * Create a calendar event
 */
function createCalendarEvent(data) {
  const calendar = CalendarApp.getCalendarById(CALENDAR_ID);
  if (!calendar) {
    throw new Error('Cannot access calendar for event creation');
  }

  // Create times in Pacific timezone
  const startTime = createDateInTimezone(data.date, AVAILABLE_HOUR, 0, TIMEZONE);
  const endTime = new Date(startTime.getTime() + MEETING_DURATION_MINUTES * 60 * 1000);

  Logger.log('Creating event: ' + data.date + ' from ' + startTime + ' to ' + endTime);

  const title = `Meeting: ${data.name} - ${data.topic}`;
  const description = `
Meeting with ${data.name}
Email: ${data.email}
Affiliation: ${data.affiliation || 'Not specified'}
Topic: ${data.topic}

Additional Notes:
${data.message || 'None'}

---
Booked via website scheduling system
  `.trim();

  const event = calendar.createEvent(title, startTime, endTime, {
    description: description,
    guests: data.email,
    sendInvites: true
  });

  // Set reminders
  event.addPopupReminder(30); // 30 minutes before
  event.addEmailReminder(60); // 1 hour before

  return event;
}

/**
 * Send confirmation emails
 */
function sendConfirmationEmails(data, event) {
  const startTime = createDateInTimezone(data.date, AVAILABLE_HOUR, 0, TIMEZONE);
  const formattedDate = Utilities.formatDate(startTime, TIMEZONE, 'EEEE, MMMM d, yyyy');
  const formattedTime = Utilities.formatDate(startTime, TIMEZONE, 'h:mm a z');

  // Email to owner
  const ownerSubject = `New Meeting Booked: ${data.name} - ${data.topic}`;
  const ownerBody = `
A new meeting has been booked through your website.

Date: ${formattedDate}
Time: ${formattedTime}

Visitor Details:
- Name: ${data.name}
- Email: ${data.email}
- Affiliation: ${data.affiliation || 'Not specified'}
- Topic: ${data.topic}

Additional Notes:
${data.message || 'None'}

The event has been automatically added to your Google Calendar and an invitation has been sent to ${data.email}.
  `.trim();

  MailApp.sendEmail({
    to: OWNER_EMAIL,
    subject: ownerSubject,
    body: ownerBody
  });

  // Confirmation email to visitor
  const visitorSubject = `Meeting Confirmed with ${OWNER_NAME} - ${formattedDate}`;
  const visitorBody = `
Dear ${data.name},

Your meeting with ${OWNER_NAME} has been confirmed.

Date: ${formattedDate}
Time: ${formattedTime}
Duration: ${MEETING_DURATION_MINUTES} minutes
Topic: ${data.topic}

A calendar invitation has been sent to your email address.

If you need to reschedule or cancel, please reply to this email.

Best regards,
${OWNER_NAME}
  `.trim();

  MailApp.sendEmail({
    to: data.email,
    replyTo: OWNER_EMAIL,
    subject: visitorSubject,
    body: visitorBody
  });
}

// Utility functions
function getDateNDaysFromNow(n) {
  const date = new Date();
  date.setDate(date.getDate() + n);
  return date.toISOString().split('T')[0];
}

function formatDateKey(date) {
  return date.toISOString().split('T')[0];
}

function padZero(num) {
  return num.toString().padStart(2, '0');
}

/**
 * TEST FUNCTION - Run this FIRST to authorize the script
 * This will prompt you to grant calendar and email permissions
 */
function testCalendarAccess() {
  try {
    const calendar = CalendarApp.getCalendarById(CALENDAR_ID);
    if (calendar) {
      Logger.log('SUCCESS: Calendar access OK');
      Logger.log('Calendar name: ' + calendar.getName());

      // Test fetching busy slots
      const today = new Date().toISOString().split('T')[0];
      const busySlots = getBusySlots(today, getDateNDaysFromNow(7));
      Logger.log('Busy slots in next 7 days: ' + JSON.stringify(busySlots));

      // Test email access
      const remainingQuota = MailApp.getRemainingDailyQuota();
      Logger.log('Email quota remaining: ' + remainingQuota);

      Logger.log('\n=== AUTHORIZATION SUCCESSFUL ===');
      Logger.log('You can now deploy this script as a web app.');
    } else {
      Logger.log('ERROR: Cannot access calendar with ID: ' + CALENDAR_ID);
      Logger.log('Make sure the calendar ID is correct and you have access to it.');
    }
  } catch (error) {
    Logger.log('ERROR: ' + error.message);
    Logger.log('You may need to grant additional permissions.');
  }
}

/**
 * Manual test for creating a booking (for debugging)
 */
function testBooking() {
  const testData = {
    date: getDateNDaysFromNow(3), // 3 days from now
    name: 'Test User',
    email: OWNER_EMAIL, // Send to yourself for testing
    affiliation: 'Test University',
    topic: 'Research Collaboration',
    message: 'This is a test booking from the Apps Script'
  };

  Logger.log('Testing booking with data: ' + JSON.stringify(testData));

  // Simulate POST request
  const mockEvent = {
    postData: {
      contents: JSON.stringify(testData)
    }
  };

  const result = doPost(mockEvent);
  Logger.log('Result: ' + result.getContent());
}
