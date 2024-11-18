---
title: >-
  Jet Flavor Tagging Studies for Future Colliders
description: >-
    Investigating jet tagging capabilities for different detector options
status: "current"  # or "completed"
order: 3
image: "/assets/images/Hss_ROC.png"
tags: ["Future Colliders","Machine Learning", "Higgs Boson", "Jets" ]
links:
  - type: "talk"
    text: "ECFA2024 Talk"
    url: "https://indico.in2p3.fr/event/32629/contributions/143002/"
---

# Evaluating Detector Performance for Future Electron-Positron Colliders

## Research Context
This ongoing study investigates detector capabilities for future electron-positron colliders, focusing on identifying  collimated sprays of particles (or "jets") originating from strange quarks ("strange-tagging"). This capability is crucial for measuring how strongly the Higgs boson interacts with strange quarks, one of the fundamental particles of the second generation of fermions in the Standard Model.

## Technical Challenge
A key aspect of particle identification (PID) at future colliders is the ability to distinguish between different types of particles (kaons, pions, and protons) carrying momenta up to tens of GeV. This study compares different detector concepts in order to evaluate the effect of PID on strange-tagging.

## Methodology
In order to evaluate jet-tagging capabilities for different detector models, we employ the following methodology:
- Generate typical particle physics events with jets of different flavors and perform fast-detector simulation using Delphes to model the interaction of the jet constituent particles with various detector configurations
- Train ParticleNet, a Graph Neural Network (GNN) architecture that uses low-level information of the jet constituents, for multiclass classification of the jets based on the flavor of the initiating quark.

## Preliminary Results
Our initial findings :
- verify the well-known fact that PID capabilities significantly improve strange-tagging performance
- indicate that enhanced calorimeter resolution shows particular benefits for distinguishing strange quarks from charm and bottom quarks
- quantify the differences in mistag rates across different detector configurations

## Future Work

Our ongoing priorities in this project include:
1. Refining our estimates of improved calorimeter resolution and timing capabilities
2. Systematically evaluating  different subdetector systems' contributions
3. Validating fast-simulation results against more accurate, full-detector simulation

This work contributes to the broader study program for future colliders and aims to inform detector design decisions for future electron-positron colliders.