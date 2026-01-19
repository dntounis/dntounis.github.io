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
                <div class="publication-item{% if publication.first_author %} first-author{% endif %}{% if publication.main_contributor %} main-contributor{% endif %}" data-searchable="{{ publication.title | downcase }} {{ publication.authors | downcase }} {{ publication.venue | downcase }} {{ publication.year }}">
                    <div class="pub-title">{{ publication.title }}</div>
                    <div class="pub-authors">{{ publication.authors }}</div>
                    <div class="pub-venue">
                        {% if publication.venue == "Phys. Rev. Lett." %}
                        <span class="prl-badge">PRL</span>
                        {% elsif publication.venue == "JHEP" %}
                        <span class="jhep-badge">JHEP</span>
                        {% elsif publication.venue == "PRX Energy" %}
                        <span class="prx-badge">PRX</span>
                        {% elsif publication.venue == "Phys. Rev. Accel. Beams" %}
                        <span class="prx-badge">PRAB</span>
                        {% elsif publication.venue == "arXiv preprint" %}
                        <span class="arxiv-badge">arXiv</span>
                        {% elsif publication.venue == "JINST" %}
                        <span class="jinst-badge">JINST</span>
                        {% elsif publication.venue contains "PoS" %}
                        <span class="pos-badge">PoS</span>
                        {% elsif publication.venue contains "EPJ" %}
                        <span class="epj-badge">EPJ</span>
                        {% elsif publication.venue contains "Nucl. Instrum." %}
                        <span class="nima-badge">NIMA</span>
                        {% elsif publication.venue contains "CERN" %}
                        <span class="cern-badge">CERN</span>
                        {% endif %}
                        {{ publication.venue }}{% if publication.volume %} {{ publication.volume }}{% endif %}{% if publication.pages %}, {{ publication.pages }}{% endif %}
                        {% if publication.note %}<br><em style="font-size: 0.85rem;">{{ publication.note }}</em>{% endif %}
                    </div>
                    <div class="pub-links">
                        {% if publication.doi %}
                        <a href="https://doi.org/{{ publication.doi }}" target="_blank" class="pub-link" aria-label="View DOI for {{ publication.title }}">
                            <i class="fas fa-external-link-alt"></i> DOI
                        </a>
                        {% endif %}
                        {% if publication.arxiv %}
                        <a href="https://arxiv.org/abs/{{ publication.arxiv }}" target="_blank" class="pub-link" aria-label="View on arXiv">
                            <i class="ai ai-arxiv"></i> arXiv:{{ publication.arxiv }}
                        </a>
                        {% endif %}
                        {% if publication.pdf %}
                        <a href="{{ publication.pdf }}" target="_blank" class="pub-link" aria-label="Download PDF">
                            <i class="fas fa-file-pdf"></i> PDF
                        </a>
                        {% endif %}
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
                </div>
                {% endunless %}
                {% endif %}
                {% endfor %}
            </div>
        </div>
        {% endfor %}
    </div>
</div>

<script>
// Publication search with year section visibility management
document.getElementById('pubSearch').addEventListener('input', function(e) {
    const query = e.target.value.toLowerCase();

    // Search through publications
    document.querySelectorAll('.publication-item').forEach(function(item) {
        const searchable = item.getAttribute('data-searchable');
        if (searchable.includes(query)) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });

    // Hide year sections that have no visible publications
    document.querySelectorAll('.publication-year-section').forEach(function(section) {
        const visiblePubs = section.querySelectorAll('.publication-item[style=""], .publication-item:not([style])');
        const hiddenPubs = section.querySelectorAll('.publication-item[style*="display: none"]');

        if (hiddenPubs.length === section.querySelectorAll('.publication-item').length) {
            section.style.display = 'none';
        } else {
            section.style.display = '';
        }
    });
});
</script>
