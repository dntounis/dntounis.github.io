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
            <p>For a complete list of publications and citations, please visit my 
                <a href="{{ site.author.google_scholar }}" target="_blank" class="scholar-link">
                    <i class="ai ai-google-scholar"></i> Google Scholar Profile
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
        <h3>Recent Publications</h3>
        {% for publication in site.data.publications limit:5 %}
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
                {% if publication.pdf %}
                <a href="{{ publication.pdf }}" target="_blank" class="pub-link">
                    <i class="fas fa-file-pdf"></i> PDF
                </a>
                {% endif %}
            </div>
        </div>
        {% endfor %}
    </div>
</div>