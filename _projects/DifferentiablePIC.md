---
title: >-
  Making Particle-In-Cell Beam-Beam Simulators faster and differentiable
description: >-
    Reimplementing the beam-beam interaction codes that collider design depends on so they run on GPUs and expose gradients
status: "current"
image: "/assets/images/gpx_legacy_parity.png"
order: 8
tags: ["Machine Learning", "Future Colliders", "Differentiable Simulation", "Luminosity"]
links:
  - type: "paper"
    text: "GuineaGrad (ICML 2026 AI4Physics)"
    url: "https://openreview.net/forum?id=jonYN1gCsu"
---

## Differentiable and GPU-Accelerated Beam-Beam Simulation

### Research Context

Beam-beam interactions set the physics reach of every high-energy lepton collider: the field of each bunch distorts the opposing bunch, and that pinch determines luminosity, beamstrahlung energy spread, and pair-production backgrounds. At a linear collider the disruption is strong (\\(D_y \gg 1\\)), so the luminosity enhancement has no closed form and must come out of a full particle-in-cell simulation.

[GUINEA-PIG](https://cds.cern.ch/record/382453) has been the community standard for over two decades. It is an excellent forward simulator, but it exposes **no derivatives** and runs on a single CPU core. Collider design therefore proceeds by parameter scans, finite differences, or derivative-free optimizers — none of which scale gracefully into the high-dimensional space of beam sizes, emittances, offsets, crossing angles, energy spread, and bunch charge. This project addresses both limitations, along two threads.

### GuineaGrad: differentiable beam-beam simulation

**GuineaGrad** reimplements the deterministic core of GUINEA-PIG in JAX, exposing automatic derivatives of luminosity and beamstrahlung observables with respect to beam parameters — to our knowledge the first differentiable beam-beam simulator. The difficulty is not the reimplementation but the differentiability: scatter-type charge deposition, the FFT-based Poisson solve, beamstrahlung special functions, and stochastic pair-production sampling each break automatic differentiation in a different way. This distinguishes the problem from differentiable lattice tracking, since beam-beam simulation requires differentiating through a **collective strong-strong interaction** between two intense bunches.

Validated against GUINEA-PIG at the level of its own run-to-run fluctuation, the simulator makes gradient-based multi-objective collider design practical in regimes where derivative-free search stops producing usable answers altogether.

### Guinea-Pig X (GPX): a CUDA port for throughput

**Guinea-Pig X** is a CUDA port of the CLIC GUINEA-PIG code — same physics, same output records, with the field solves and per-event Monte-Carlo samplers moved onto the GPU. Across reference configurations spanning FCC-ee, C³, CLIC, and ILC it delivers roughly an order-of-magnitude end-to-end speedup, and since one simulation occupies one GPU, throughput scales near-linearly with GPU count. Statistical parity with the legacy code is established by multi-seed Kolmogorov–Smirnov tests on the output records, complemented by a per-record classifier calibrated against a legacy-versus-legacy null. *Manuscript in preparation.*

### Why this matters

GPX makes the existing design workflow substantially cheaper without asking anyone to change how they work. GuineaGrad changes what the workflow can be — opening up gradient-based multi-objective design, sensitivity analysis, and eventually end-to-end optimization of collider and detector parameters as a single problem.
