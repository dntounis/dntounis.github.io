---
layout: page
title: Contact
description: Get in touch with Dimitris Ntounis by email.
description: Get in touch with Dimitris Ntounis - schedule a meeting or send a message.
---

<div class="contact-page">

<h2>Get In Touch</h2>

<div class="contact-info{% unless site.show_blog %} contact-info--two{% endunless %}">
    <div class="contact-item contact-email">
        <i class="fas fa-envelope"></i>
        <div>
            <strong>Email</strong><br>
            <a href="mailto:dntounis@stanford.edu">dntounis@stanford.edu</a><br>
            <a href="mailto:dntounis@slac.stanford.edu">dntounis@slac.stanford.edu</a><br>
            <a href="mailto:dimitrios.ntounis@cern.ch">dimitrios.ntounis@cern.ch</a>
        </div>
    </div>
    <div class="contact-item contact-office">
        <i class="fas fa-building"></i>
        <div>
            <strong>Office</strong><br>
            Building 084, Room B235-A<br>
            <a href="https://vue.slac.stanford.edu/slac-visitor-map" target="_blank">SLAC National Accelerator Laboratory</a>
        </div>
    </div>
    {% if site.show_blog %}
    <div class="contact-item contact-blog">
        <i class="fas fa-pen-nib"></i>
        <div>
            <strong>Blog</strong><br>
            <a href="https://dimitrisntounis.substack.com" target="_blank">Substack</a>
        </div>
    </div>
    {% endif %}
</div>

<p class="contact-note">To arrange a meeting, or for anything else, email is the best way to reach me.</p>

</div>

<style>
.contact-page {
    max-width: 800px;
    margin: 0 auto;
}

.contact-info {
    display: grid;
    grid-template-columns: 2fr 1.5fr 1fr;
    gap: 1.5rem;
    margin: 2rem 0 3rem;
}

/* Blog card hidden (show_blog: false): two equal columns, no empty slot. */
.contact-info--two {
    grid-template-columns: 1fr 1fr;
}

@media (max-width: 900px) {
    .contact-info {
        grid-template-columns: 1fr 1fr;
    }
    .contact-email {
        grid-column: span 2;
    }
    .contact-info--two .contact-email {
        grid-column: span 1;
    }
}

@media (max-width: 600px) {
    .contact-info {
        grid-template-columns: 1fr;
    }
    .contact-email {
        grid-column: span 1;
    }
}

.contact-item {
    display: flex;
    gap: 1rem;
    align-items: flex-start;
    padding: 1.5rem;
    background: #f8f9fa;
    border-radius: 8px;
    border-left: 4px solid #8C1515;
    overflow: hidden;
}

.contact-item i {
    font-size: 1.5rem;
    color: #8C1515;
    margin-top: 0.25rem;
    flex-shrink: 0;
}

.contact-item > div {
    min-width: 0;
    overflow: hidden;
}

.contact-item a {
    color: #8C1515;
    text-decoration: none;
    word-break: break-all;
    font-size: 0.9rem;
}

.contact-item a:hover {
    text-decoration: underline;
}


.contact-note {
    font-size: 1rem;
    color: var(--muted-text, #555a61);
    margin: 0 0 2rem;
}

/* Dark mode */
[data-theme="dark"] .contact-item {
    background: #161b22;
    border-left-color: #58a6ff;
}

[data-theme="dark"] .contact-item i {
    color: #58a6ff;
}

[data-theme="dark"] .contact-item a {
    color: #58a6ff;
}

</style>
