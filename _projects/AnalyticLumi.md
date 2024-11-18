---
title: >-
  Automatized Luminosity Optimization for future \\(e^{+}e^{-}\\) colliders
description: >-
    Developing a luminosity optimization framework that takes into acount non-analytic contributions to the luminosity modeled through a Gaussian Process surrogate
status: "current"  # or "completed"
order: 2
image: "/assets/images/pareto_frontier_plot.png"
tags: ["Future Colliders", "Optimization"]
links:
  - type: "talk"
    text: "LCWS2024 Talk"
    url: "https://agenda.linearcollider.org/event/10134/contributions/54659/"

---
# Automated Luminosity Optimization for Future Electron-Positron Colliders

## Project Overview
In this project, originally conceived as part of Stanford's [AA 222/CS 361 -  Engineering Design Optimization](https://aa222.stanford.edu) and awarded the best final project award for the 2023-2024 version of the course, we developed a novel optimization framework for maximizing the collision rate, or "luminosity", at future electron-positron colliders while maintaining controlled background levels.

## Technical Approach
In this study, we developed a new luminosity optimization strategy based on the following:

### Surrogate Modeling
- Developed a Gaussian Process surrogate model to approximate the beam-beam enhancement factor $H_{D}$, which is a non-analytic contribution to the luminosity.
- Trained the  on PIC (Particle-In-Cell) simulation points with careful hyperparameter optimization

### Optimization Framework
- Constructed a constrained optimization problem over six beam parameters:
  - Bunch population
  - Horizontal/vertical emittances
  - Horizontal/vertical beta functions
  - Bunch length
- Implemented both single-objective constrained optimization and multi-objective approaches
- Applied bounds based on technical feasibility and background constraints

## Key Results
The methodology demonstrated significant improvements across multiple proposed collider designs:
- Achieved luminosity gains of 22-35% for most collider scenarios while maintaing or reducing beam-induced background levels
- Identified optimal operating points within technically feasible parameter ranges
- Discovered a luminosity saturation effect at specific background levels

## Impact
The optimization framework provides:
- Automated tool for collider parameter optimization
- Potential for increased physics reach through higher collision rates
- Framework for evaluating design trade-offs between luminosity and backgrounds across different collider proposals (e.g. CLIC, ILC, C$^3$)

## Future Developments

We are still working on improving the analysis, focusing on:
- Further validation against full detector simulations
- Integration with detailed beam dynamics studies
- Extension to additional collider scenarios and constraints
- Refinement of the surrogate model with additional training data
