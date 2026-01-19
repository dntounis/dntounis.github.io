---
layout: page
title: Talks & Presentations
permalink: /talks/
description: Conference talks, invited presentations, and posters by Dimitris Ntounis on particle physics research.
---

<div class="talks-section">

<h2>Conference Talks</h2>

{% for event in site.data.talks.conference_talks %}
<div class="talk-year">
    <h3>{{ event.conference }}</h3>
    <div class="talk-date">{{ event.month | date: "%B" }} {{ event.year }}</div>

    {% for talk in event.talks %}
    <div class="talk-item">
        <div class="talk-title">
            <a href="{{ talk.url }}" target="_blank">{{ talk.title }}</a>
            {% if talk.type == "parallel" %}
            <span class="talk-type parallel">Parallel Session</span>
            {% elsif talk.type == "plenary" %}
            <span class="talk-type plenary">Plenary</span>
            {% elsif talk.type == "poster" %}
            <span class="talk-type poster">Poster</span>
            {% endif %}
        </div>
        <div class="talk-venue">
            <a href="{{ event.conference_url }}" target="_blank">{{ event.conference }}</a>
        </div>
    </div>
    {% endfor %}

    {% if event.other %}
    {% for item in event.other %}
    <div class="talk-item">
        <div class="talk-title">
            <a href="{{ item.url }}" target="_blank">{{ item.title }}</a>
            {% if item.type == "panel" %}
            <span class="talk-type panel">Panel</span>
            {% endif %}
        </div>
    </div>
    {% endfor %}
    {% endif %}
</div>
{% endfor %}

<h2>Invited Talks at Workshops & Meetings</h2>

{% assign invited_by_year = site.data.talks.invited_talks | group_by: "year" | sort: "name" | reverse %}

{% for year_group in invited_by_year %}
<div class="talk-year">
    <h3>{{ year_group.name }}</h3>

    {% assign sorted_talks = year_group.items | sort: "month" | reverse %}
    {% for talk in sorted_talks %}
    <div class="talk-item">
        <div class="talk-title">
            <a href="{{ talk.url }}" target="_blank">{{ talk.title }}</a>
            <span class="talk-type invited">Invited</span>
        </div>
        <div class="talk-venue">{{ talk.venue }}</div>
        <div class="talk-date">
            {% case talk.month %}
                {% when 1 %}January
                {% when 2 %}February
                {% when 3 %}March
                {% when 4 %}April
                {% when 5 %}May
                {% when 6 %}June
                {% when 7 %}July
                {% when 8 %}August
                {% when 9 %}September
                {% when 10 %}October
                {% when 11 %}November
                {% when 12 %}December
            {% endcase %} {{ talk.year }}
        </div>
    </div>
    {% endfor %}
</div>
{% endfor %}

</div>

<div class="cv-link">
    <p>For a complete list of presentations, including co-authored talks, see my <a href="{{ site.cv_pdf }}" target="_blank">CV <i class="fas fa-external-link-alt"></i></a></p>
</div>
