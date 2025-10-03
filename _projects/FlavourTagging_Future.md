---
title: >-
  Jet Flavor Tagging Studies for Future Colliders
description: >-
    Investigating jet tagging capabilities for different detector options
status: "current"  # or "completed"
order: 3
image: "/assets/images/stagging_test_test_test.png"
tags: ["Future Colliders","Machine Learning", "Higgs Boson", "Jets" ]
links:
  - type: "talk"
    text: "ECFA2024 Talk"
    url: "https://indico.in2p3.fr/event/32629/contributions/143002/"
  - type: "paper"
    text: "arXiv"
    url: "https://arxiv.org/abs/2501.16584"

---

#Evaluating Detector Design Impact on Jet Flavor Tagging for Future Colliders

##Research Context
This study presents a comprehensive evaluation of jet flavor tagging performance for proposed detector concepts at future electron-positron colliders. Jet flavor tagging—the ability to identify the type of quark or gluon that initiated a jet—is crucial for precision measurements of Higgs boson properties, particularly its couplings to bottom, charm, and strange quarks.

##Technical Approach

We developed a unified analysis framework to enable fair comparisons between detector concepts:

- Detectors evaluated: SiD (ILC), IDEA (FCC-ee), and FCCeeDetWithSiTracking
- Simulation: Delphes fast simulation with advanced modules for particle identification (PID), including time-of-flight measurements and ionization cluster counting
- Algorithm: ParticleNet, a Graph Neural Network architecture adapted for e⁺e⁻ collision environments, trained on Higgsstrahlung events (e⁺e⁻ → ZH)

##Key Results
#Detector Comparison

- All three detector concepts achieve excellent flavor tagging performance, representing an order of magnitude improvement over current LHC experiments
- IDEA and FCCeeDetWithSiTracking demonstrate superior discrimination, particularly for strange-quark tagging, due to dedicated PID capabilities
- For s-tagging, SiD's mistag rates are 1.4–2.5× larger than detectors with PID—highlighting the critical role of kaon identification

#Detector Parameter Studies

We systematically investigated variations in the SiD detector design:

- Vertex detector geometry: Modest degradation in heavy flavor tagging with increasing radial distance of first layer (10-16 mm range)
- Calorimeter resolution: Flavor tagging performance shows remarkable robustness against ECAL and HCAL energy and spatial resolution variations
- Practical implications: Results suggest potential cost optimization opportunities in calorimeter systems without significantly compromising flavor tagging capabilities

#Impact and Future Directions

This work provides the first systematic, apples-to-apples comparison of jet flavor tagging across multiple future collider detector concepts using a consistent framework. The flexible analysis pipeline enables rapid re-evaluation as detector designs evolve, providing valuable feedback for optimization studies. While these fast simulation results offer important insights, validation with full Geant4-based simulation remains essential for confirming the observed trends and informing final detector design decisions for future e⁺e⁻ colliders.
