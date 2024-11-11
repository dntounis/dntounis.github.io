---
layout: page
title: Blog
permalink: /blog/
---

# Research Updates & Blog

Here you'll find updates about my research, conference experiences, and thoughts on [Your Field].

{% for post in site.posts %}
<div class="post-preview">
    <h2>
        <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
    </h2>
    <span class="post-date">{{ post.date | date: "%B %d, %Y" }}</span>
    {{ post.excerpt }}
    <a href="{{ post.url | relative_url }}">Read more...</a>
</div>
{% endfor %}
