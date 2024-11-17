---
layout: page
title: Publications
permalink: /publications/
---

{% include publications-list.html %}



## Journal Articles

1. Author(s) (Year). "Paper Title." *Journal Name*, Volume(Issue), Pages.
   [PDF](link) | [Code](link) | [BibTeX](link)

## Conference Papers

1. Author(s) (Year). "Paper Title." *Conference Name*, Location.
   [PDF](link) | [Code](link) | [BibTeX](link)







# Publications

## Journal Articles
{% for pub in site.data.publications %}
{% if pub.type == 'article' %}
<div class="publication">
  <div class="pub-citation">{{ pub.citation }}</div>
  
  <div class="pub-links">
    {% if pub.doi %}
    <a href="https://doi.org/{{ pub.doi }}" target="_blank">DOI</a>
    {% endif %}
    {% if pub.url %}
    <a href="{{ pub.url }}" target="_blank">PDF</a>
    {% endif %}
    <a href="javascript:void(0)" onclick="toggleBibtex('{{ pub.key }}')">BibTeX</a>
  </div>

  <div id="{{ pub.key }}-bibtex" class="bibtex" style="display: none;">
    <pre><code>{{ pub.bibtex }}</code></pre>
  </div>
</div>
{% endif %}
{% endfor %}

## Conference Papers
{% for pub in site.data.publications %}
{% if pub.type == 'inproceedings' %}
<div class="publication">
  <!-- Same structure as above -->
</div>
{% endif %}
{% endfor %}

<script>
function toggleBibtex(key) {
  var element = document.getElementById(key + '-bibtex');
  element.style.display = element.style.display === 'none' ? 'block' : 'none';
}
</script>




{% include publication-list.html %}
{% include metrics-display.html %}

