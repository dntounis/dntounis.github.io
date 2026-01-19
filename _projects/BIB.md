---
title: >-
  Beam-Beam Backgrounds for the Cool Copper Collider
description: >-
    Comprehensive study of beam-beam backgrounds and detector compatibility for C³
status: "past"
order: 5
image: "/assets/images/SiD_hits_550.png"
tags: ["Future Colliders", "Beam-Induced Background", "C³"]
links:
  - type: "paper"
    text: "arXiv"
    url: "https://arxiv.org/abs/2511.01075"
  - type: "github"
    text: "GitHub"
    url: "https://github.com/dntounis/Beam_Beam_Backgrounds"
  - type: "talk"
    text: "LCWS2024 Talk"
    url: "https://agenda.linearcollider.org/event/10134/contributions/54713/"
---

## Overview

This study presents a comprehensive analysis of beam-beam backgrounds for the Cool Copper Collider (C³), a proposed electron-positron linear collider targeting precision Higgs physics at center-of-mass energies of 250 and 550 GeV. The work validates the compatibility of existing detector concepts with C³ beam parameters and provides a reusable simulation framework for future collider studies.

**Paper**: [arXiv:2511.01075](https://arxiv.org/abs/2511.01075) *(accepted for publication in JINST)*

**Code**: [GitHub Repository](https://github.com/dntounis/Beam_Beam_Backgrounds)

## Key Findings

### Detector Compatibility
- Evaluated the Silicon Detector (SiD) concept across three C³ operational scenarios: baseline, power-efficiency, and high-luminosity modes
- **The SiD detector remains compatible with C³ operations without requiring substantial design modifications**
- Quantified occupancy levels from incoherent pair production and hadron photoproduction backgrounds in all detector subsystems

### Background Characterization
- Full simulation of beam-beam interactions using the GUINEA-PIG PIC simulator
- Detailed modeling of photoproduced hadrons from beam-beam interactions
- Comprehensive tracking of background particles through the SiD detector using the Key4hep software stack
- Assessment of hit densities and timing distributions in the vertex detector, silicon tracker, and calorimeters

## Modular Simulation Framework

A key contribution of this work is the development of a **modular simulation framework** built on the Key4hep ecosystem. This framework provides:

- A versatile toolkit adaptable to different collider proposals and beam parameter configurations
- Standardized analysis methodology for background studies
- Easy integration with various detector geometries and simulation tools
- Reusable components for the broader future collider community

The framework is publicly available on [GitHub](https://github.com/dntounis/Beam_Beam_Backgrounds) and can be adapted for background studies at other proposed electron-positron colliders such as ILC, CLIC, or FCC-ee.

## Impact

This study provides essential input for:
- Validating detector technologies for C³ conditions
- Guiding detector timing and readout specifications
- Supporting the physics case for C³ as a viable Higgs factory option
- Enabling similar studies at other future collider proposals through the modular framework
