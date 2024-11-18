---
layout: page
title: Publications
permalink: /publications/
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
                <div class="metric-value">{{ site.data.scholar_metrics.citations }}</div>
                <div class="metric-label">Citations</div>
            </div>
            <div class="metric-card">
                <div class="metric-value">{{ site.data.scholar_metrics.h_index }}</div>
                <div class="metric-label">h-index</div>
            </div>
            <div class="metric-card">
                <div class="metric-value">{{ site.data.scholar_metrics.i10_index }}</div>
                <div class="metric-label">i10-index</div>
            </div>
        </div>
    </div>
    <!-- Recent Publications -->
    <div class="recent-publications">
        <h3>Publication Highlights</h3>
        {% for publication in site.data.publications %}
        {% unless publication.profiles %}
        <div class="publication-item">
            <div class="pub-title">{{ publication.title }}</div>
            <div class="pub-authors">{{ publication.authors }}</div>
            <div class="pub-venue">{{ publication.venue }} ({{ publication.year }})</div>
            <div class="pub-links">
                {% if publication.doi %}
                <a href="https://doi.org/{{ publication.doi }}" target="_blank" class="pub-link">
                    <i class="fas fa-external-link-alt"></i> DOI
                </a>
                {% endif %}
                {% if publication.arxiv %}
                <a href="https://arxiv.org/abs/{{ publication.arxiv }}" target="_blank" class="pub-link">
                    <i class="fas fa-archive"></i> arXiv
                </a>
                {% endif %}
                {% if publication.pdf %}
                <a href="{{ publication.pdf }}" target="_blank" class="pub-link">
                    <i class="fas fa-file-pdf"></i> PDF
                </a>
                {% endif %}
            </div>
        </div>
        {% endunless %}
        {% endfor %}
    </div>
</div>