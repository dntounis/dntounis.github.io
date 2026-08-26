---
title: >-
  Making Particle-In-Cell Beam-Beam Simulators faster and differentiable
description: >-
    Reimplementing the beam-beam interaction codes that collider design depends on so they run on GPUs and expose gradients
status: "current"
image: "/assets/images/gg_gradient_advantage.svg"
order: 8
tags: ["Machine Learning", "Future Colliders", "Differentiable Simulation", "Luminosity"]
links:
  - type: "paper"
    text: "GuineaGrad (ICML 2026 AI4Physics)"
    url: "https://openreview.net/forum?id=jonYN1gCsu"
---

## Differentiable and GPU-Accelerated Beam-Beam Simulation

### Research Context

Beam-beam interactions set the physics reach of every high-energy lepton collider: the field of each bunch distorts the opposing bunch, and that pinch determines luminosity, beamstrahlung energy spread, and pair-production backgrounds. The luminosity enhancement from this pinch typically has no closed form and must come out of expensive simulations using Particle-In-Cell (PIC) codes.

[GUINEA-PIG](https://cds.cern.ch/record/382453) has been the community standard for over two decades. It is an excellent forward simulator, but it exposes **no derivatives** and runs on a single CPU core. Collider design therefore proceeds by parameter scans, finite differences, or derivative-free optimizers — none of which scale well into the high-dimensional space of all possible beam configurations. I am approaching this bottleneck along two threads.

### GuineaGrad: differentiable beam-beam simulation

**GuineaGrad** reimplements the deterministic core of GUINEA-PIG in [JAX](https://github.com/jax-ml/jax), exposing automatic derivatives with respect to beam parameters. The difficulty lies not as much in the reimplementation but the differentiability, since several processes in the simulation pipeline (scatter-type charge deposition, FFT-based Poisson solver, stochastic sampling for quantum processes etc.) break automatic differentiation in different ways.

### Guinea-Pig X (GPX): a CUDA port for throughput

**Guinea-Pig X** is a CUDA port of GUINEA-PIG. Across reference configurations for several colliders, it delivers roughly an order-of-magnitude end-to-end speedup, while maintaining statistical parity with the legacy code. *Manuscript in preparation.*
