/**
 * Theme Management
 * Handles dark/light mode toggle with localStorage persistence
 */

function initializeTheme() {
    // Check for saved preference, then system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = savedTheme || (prefersDark ? 'dark' : 'light');

    document.documentElement.setAttribute('data-theme', theme);
    updateThemeIcon(theme);
}

function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';

    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateThemeIcon(next);

    // Update visualizations for new theme if they exist
    updateVisualizationsTheme(next);
}

function updateThemeIcon(theme) {
    const toggle = document.getElementById('themeToggle');
    if (toggle) {
        toggle.setAttribute('aria-label',
            theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
        );
    }
}

/**
 * Update chart/visualization colors when theme changes
 * Called when theme is toggled - updates any Chart.js or D3 visualizations
 */
function updateVisualizationsTheme(theme) {
    // Get computed CSS variables for current theme
    const root = document.documentElement;
    const textColor = getComputedStyle(root).getPropertyValue('--text-color').trim();
    const backgroundColor = getComputedStyle(root).getPropertyValue('--background-color').trim();

    // Update Chart.js instances if they exist
    if (typeof Chart !== 'undefined' && Chart.instances) {
        Object.values(Chart.instances).forEach(chart => {
            if (chart.options.scales) {
                // Update axis colors
                Object.values(chart.options.scales).forEach(scale => {
                    if (scale.ticks) scale.ticks.color = textColor;
                    if (scale.grid) scale.grid.color = theme === 'dark' ? '#30363d' : '#e1e4e8';
                });
            }
            if (chart.options.plugins && chart.options.plugins.legend) {
                chart.options.plugins.legend.labels.color = textColor;
            }
            chart.update('none');
        });
    }

    // Update D3 visualizations if they exist
    const d3Visualizations = document.querySelectorAll('.d3-visualization');
    d3Visualizations.forEach(viz => {
        viz.style.color = textColor;
    });
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    initializeTheme();
});

// Listen for system preference changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
        const theme = e.matches ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', theme);
        updateThemeIcon(theme);
        updateVisualizationsTheme(theme);
    }
});
