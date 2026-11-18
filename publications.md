---
layout: page
title: Publications
permalink: /publications/
description: Publications and research papers by Dimitris Ntounis in particle physics, Higgs boson studies, and future colliders.
---

<div class="publications-container">
    <!-- Scholar Profile and Metrics -->
    <div class="scholar-section">
        <div class="scholar-profile">
            <h2>Publications</h2>
            <p class="pub-profile-links">
                <a href="{{ site.author.google_scholar }}" target="_blank" class="scholar-link">
                    <i class="ai ai-google-scholar"></i> Google Scholar
                </a>
                |
                <a href="{{ site.author.inspire }}" target="_blank" class="scholar-link">
                    <i class="ai ai-inspire"></i> INSPIRE-HEP
                </a>
            </p>
        </div>
        <div class="scholar-metrics">
            <div class="metric-card">
                <div class="metric-value" data-count="{{ site.data.scholar_metrics.citations }}">0</div>
                <div class="metric-label">Citations</div>
            </div>
            <div class="metric-card">
                <div class="metric-value" data-count="{{ site.data.scholar_metrics.h_index }}">0</div>
                <div class="metric-label">h-index</div>
            </div>
            <div class="metric-card">
                <div class="metric-value" data-count="{{ site.data.scholar_metrics.i10_index }}">0</div>
                <div class="metric-label">i10-index</div>
            </div>
        </div>
        <p style="text-align: center; color: #666; font-size: 0.85rem; margin-top: 1rem;">
            Last updated: {{ site.data.scholar_metrics.last_updated }}
        </p>
    </div>

    <!-- ATLAS Authorship Note -->
    <div class="atlas-note">
        <p><em><i class="fas fa-info-circle"></i> As a qualified author of the ATLAS collaboration, I have signed many papers of the collaboration. Below you can find papers for which I had direct contribution or involvement.</em></p>
    </div>

    <!-- Search Box -->
    <div class="search-container">
        <input type="text" id="pubSearch" class="search-box" placeholder="Search publications..." aria-label="Search publications">
    </div>

    {%- comment -%}Counts skip the same `profiles` entries the list skips.{%- endcomment -%}
    {%- assign n_all = 0 -%}{%- assign n_first = 0 -%}{%- assign n_main = 0 -%}{%- assign n_news = 0 -%}
    {%- for publication in site.data.publications -%}
      {%- unless publication.profiles -%}
        {%- assign n_all = n_all | plus: 1 -%}
        {%- if publication.first_author -%}{%- assign n_first = n_first | plus: 1 -%}{%- endif -%}
        {%- if publication.main_contributor -%}{%- assign n_main = n_main | plus: 1 -%}{%- endif -%}
        {%- if publication.badges contains "news" -%}{%- assign n_news = n_news | plus: 1 -%}{%- endif -%}
      {%- endunless -%}
    {%- endfor %}
    <!-- Filter chips (work together with the search box) -->
    <div class="pub-filters" role="group" aria-label="Filter publications">
        <button type="button" class="pub-filter" data-filter="all" aria-pressed="true">All ({{ n_all }})</button>
        <button type="button" class="pub-filter" data-filter="first" aria-pressed="false">First author ({{ n_first }})</button>
        <button type="button" class="pub-filter" data-filter="main" aria-pressed="false">Main contributor ({{ n_main }})</button>
        <button type="button" class="pub-filter" data-filter="news" aria-pressed="false">In the news ({{ n_news }})</button>
    </div>
    <p class="pub-empty" id="pubEmpty" hidden>No publications match this filter and search.</p>

    <!-- Publications grouped by year -->
    <div class="publications-by-year">
        {% comment %}Get unique years from publications while preserving YAML order{% endcomment %}
        {% assign years = site.data.publications | map: "year" | uniq %}

        {% for year in years %}
        <div class="publication-year-section" id="year-{{ year }}">
            <h3 class="year-heading">{{ year }}</h3>
            <div class="year-publications">
                {% comment %}Loop through publications in YAML order, filtering by year{% endcomment %}
                {% for publication in site.data.publications %}
                {% if publication.year == year %}
                {% unless publication.profiles %}
                {%- assign is_news = false -%}
                {%- if publication.badges contains "news" -%}{%- assign is_news = true -%}{%- endif -%}
                {%- comment -%}Venue tile text: venue_short in the YAML wins, else a short map.{%- endcomment -%}
                {%- assign v = publication.venue -%}
                {%- if publication.venue_short -%}{%- assign vshort = publication.venue_short -%}
                {%- elsif v == "Phys. Rev. Lett." -%}{%- assign vshort = "PRL" -%}
                {%- elsif v == "Phys. Rev. Accel. Beams" -%}{%- assign vshort = "PRAB" -%}
                {%- elsif v == "PRX Energy" -%}{%- assign vshort = "PRX Energy" -%}
                {%- elsif v == "JHEP" -%}{%- assign vshort = "JHEP" -%}
                {%- elsif v == "JINST" -%}{%- assign vshort = "JINST" -%}
                {%- elsif v == "arXiv preprint" -%}{%- assign vshort = "arXiv" -%}
                {%- elsif v contains "Spec. Top." -%}{%- assign vshort = "EPJ ST" -%}
                {%- elsif v contains "EPJ Web" -%}{%- assign vshort = "EPJ WoC" -%}
                {%- elsif v contains "EPJ" or v contains "Eur. Phys. J." -%}{%- assign vshort = "EPJ" -%}
                {%- elsif v contains "PoS" -%}{%- assign vshort = "PoS" -%}
                {%- elsif v contains "Nucl. Instrum." -%}{%- assign vshort = "NIM A" -%}
                {%- elsif v contains "CERN Yellow" -%}{%- assign vshort = "CERN YR" -%}
                {%- elsif v contains "CERN" -%}{%- assign vshort = "CERN" -%}
                {%- else -%}{%- assign vshort = v | truncatewords: 2, "" -%}
                {%- endif %}
                <article class="publication-item{% if publication.first_author %} first-author{% endif %}{% if publication.main_contributor %} main-contributor{% endif %}{% if is_news %} in-the-news{% endif %}" data-searchable="{{ publication.title | downcase | escape }} {{ publication.authors | downcase | escape }} {{ publication.venue | downcase | escape }} {{ publication.year }}">
                    <div class="pub-row">
                        {%- if publication.thumbnail %}
                        <img class="pub-thumb" src="{{ publication.thumbnail | relative_url }}" alt="{{ publication.thumbnail_alt | escape }}" width="176" height="118" loading="lazy" decoding="async">
                        {%- else %}
                        <div class="pub-thumb pub-thumb--venue" aria-hidden="true">{{ vshort }}</div>
                        {%- endif %}
                        <div class="pub-body">
                            {%- if publication.first_author or publication.main_contributor or publication.badges %}
                            <div class="pub-badges">
                                {%- if publication.first_author %}<span class="pub-badge pub-badge--first">First author</span>{% endif %}
                                {%- if publication.main_contributor %}<span class="pub-badge pub-badge--main">Main contributor</span>{% endif %}
                                {%- for badge in publication.badges %}
                                {%- if badge == "news" %}<span class="pub-badge pub-badge--news">In the news</span>
                                {%- elsif badge == "workshop" %}<span class="pub-badge pub-badge--workshop">{{ publication.workshop_label | default: "Workshop" }}</span>
                                {%- endif %}
                                {%- endfor %}
                            </div>
                            {%- endif %}
                            <h4 class="pub-title">{{ publication.title }}</h4>
                            <div class="pub-authors">{{ publication.authors }}</div>
                            <div class="pub-venue">
                                {{ publication.venue }}{% if publication.volume %} {{ publication.volume }}{% endif %}{% if publication.pages %}, {{ publication.pages }}{% endif %} ({{ publication.year }})
                                {%- if publication.note %}<br><span class="pub-note">{{ publication.note }}</span>{% endif %}
                            </div>
                            <div class="pub-links">
                                {%- if publication.doi %}
                                <a href="https://doi.org/{{ publication.doi }}" target="_blank" rel="noopener" class="pub-link" aria-label="View DOI for {{ publication.title | escape }}">
                                    <i class="fas fa-external-link-alt" aria-hidden="true"></i> DOI
                                </a>
                                {%- endif %}
                                {%- if publication.arxiv %}
                                <a href="https://arxiv.org/abs/{{ publication.arxiv }}" target="_blank" rel="noopener" class="pub-link" aria-label="View arXiv:{{ publication.arxiv }} on arXiv">
                                    <i class="ai ai-arxiv" aria-hidden="true"></i> arXiv:{{ publication.arxiv }}
                                </a>
                                {%- endif %}
                                {%- if publication.url %}
                                <a href="{{ publication.url }}" target="_blank" rel="noopener" class="pub-link" aria-label="View {{ publication.url_label | default: 'publication page' }} for {{ publication.title | escape }}">
                                    <i class="fas fa-external-link-alt" aria-hidden="true"></i> {{ publication.url_label | default: "Link" }}
                                </a>
                                {%- endif %}
                                {%- if publication.pdf %}
                                <a href="{{ publication.pdf }}" target="_blank" rel="noopener" class="pub-link" aria-label="Download PDF of {{ publication.title | escape }}">
                                    <i class="fas fa-file-pdf" aria-hidden="true"></i> PDF
                                </a>
                                {%- endif %}
                            </div>
                        </div>
                    </div>

                    <!-- Structured Data for SEO -->
                    <script type="application/ld+json">
                    {
                        "@context": "https://schema.org",
                        "@type": "ScholarlyArticle",
                        "headline": "{{ publication.title | escape }}",
                        "author": {
                            "@type": "Person",
                            "name": "{{ publication.authors | escape }}"
                        },
                        "datePublished": "{{ publication.year }}",
                        "publisher": {
                            "@type": "Organization",
                            "name": "{{ publication.venue | escape }}"
                        }
                        {% if publication.doi %},
                        "identifier": {
                            "@type": "PropertyValue",
                            "propertyID": "DOI",
                            "value": "{{ publication.doi }}"
                        }
                        {% endif %}
                    }
                    </script>
                </article>
                {% endunless %}
                {% endif %}
                {% endfor %}
            </div>
        </div>
        {% endfor %}
    </div>
</div>

<script>
// Publication filtering: a chip (All / First author / Main contributor /
// In the news) and the search box combine; an item shows only if it matches
// both. Year sections with no visible items are hidden.
(function() {
    const search = document.getElementById('pubSearch');
    const chips = Array.from(document.querySelectorAll('.pub-filter'));
    const items = Array.from(document.querySelectorAll('.publication-item'));
    const sections = Array.from(document.querySelectorAll('.publication-year-section'));
    const empty = document.getElementById('pubEmpty');
    const filterClass = { first: 'first-author', main: 'main-contributor', news: 'in-the-news' };
    let filter = 'all';

    function apply() {
        const query = search ? search.value.trim().toLowerCase() : '';
        let shown = 0;
        items.forEach(function(item) {
            const okFilter = filter === 'all' || item.classList.contains(filterClass[filter]);
            const okSearch = !query || (item.getAttribute('data-searchable') || '').includes(query);
            const visible = okFilter && okSearch;
            item.hidden = !visible;
            if (visible) shown++;
        });
        sections.forEach(function(section) {
            section.hidden = !section.querySelector('.publication-item:not([hidden])');
        });
        if (empty) empty.hidden = shown > 0;
    }

    chips.forEach(function(chip) {
        chip.addEventListener('click', function() {
            filter = chip.dataset.filter;
            chips.forEach(function(c) {
                c.setAttribute('aria-pressed', c === chip ? 'true' : 'false');
            });
            apply();
        });
    });
    if (search) search.addEventListener('input', apply);
})();
</script>
