// Citations Chart
function createCitationsChart() {
    const ctx = document.getElementById('citationsChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['2020', '2021', '2022', '2023', '2024'],
            datasets: [{
                label: 'Citations',
                data: [10, 25, 45, 70, 100],
                borderColor: getComputedStyle(document.documentElement)
                    .getPropertyValue('--primary-color'),
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Citation Growth'
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Research Topics Bubble Chart
function createBubbleChart() {
    const data = [
        { name: "Machine Learning", value: 40 },
        { name: "Data Science", value: 30 },
        { name: "AI", value: 25 },
        { name: "Neural Networks", value: 20 }
    ];

    const width = 400;
    const height = 400;

    const svg = d3.select("#topicsChart")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    const pack = d3.pack()
        .size([width, height])
        .padding(2);

    const root = d3.hierarchy({ children: data })
        .sum(d => d.value);

    const nodes = pack(root).leaves();

    const bubbles = svg.selectAll(".bubble")
        .data(nodes)
        .enter()
        .append("g")
        .attr("transform", d => `translate(${d.x},${d.y})`);

    bubbles.append("circle")
        .attr("r", d => d.r)
        .attr("fill", getComputedStyle(document.documentElement)
            .getPropertyValue('--primary-color'))
        .attr("opacity", 0.7);

    bubbles.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", ".3em")
        .text(d => d.data.name)
        .style("font-size", d => `${d.r/5}px`);
}

// Initialize visualizations
document.addEventListener('DOMContentLoaded', () => {
    createCitationsChart();
    createBubbleChart();
});
