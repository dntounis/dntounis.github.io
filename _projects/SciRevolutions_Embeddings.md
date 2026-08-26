---
title: >-
  Detecting Scientific Revolutions in Document Embedding Spaces
description: >-
    Treating embedding geometry as a quantitative observable of conceptual reorganization, and using counterfactual ablation to detect scientific revolutions
status: "current"
image: "/assets/images/counterfactual_ablation_framework.svg"
order: 7
tags: ["AI4Science", "Machine Learning", "Representation Learning", "History of Science"]
---

## Geometric Signatures of Conceptual Reorganization

### Research Context

Scientific knowledge is organized as a network of interconnected concepts, and that organization occasionally undergoes rapid reorganization — special relativity, Gödel's incompleteness theorems, the Higgs mechanism, deep learning. Understanding these episodes has traditionally relied on historical analysis and qualitative interpretation, while existing quantitative approaches characterize scientific change through citation networks, bibliometric indicators, or topic evolution. Those methods describe structures *external* to conceptual organization itself, and inherit the biases of external metadata.

This project asks a complementary question: **can conceptual reorganizations be detected directly in the geometry of document embedding spaces?** The claim behind it is a shift in how embedding spaces are used — not merely as representations for retrieval or semantic similarity, but as a **quantitative scientific observable** that can be measured, perturbed, statistically validated, and compared across independent historical case studies.

### Method: Counterfactual Ablation

The framework represents scientific documents and natural-language concept descriptions in a common embedding space, then measures the structural role of a concept by removing it. Each historical case defines a small fixed set of concepts — the target plus contextual concepts spanning the surrounding subfields — with documents assigned only when they clear both a similarity threshold and a confusion-aware margin to the runner-up. For a candidate concept, all associated documents are removed, the geometry is recomputed, and the resulting perturbation is compared before and after a candidate pivot year.

The intuition is simple: if a concept genuinely reorganized an existing body of knowledge, removing it should perturb the post-emergence geometry far more than the pre-emergence geometry. **That asymmetry is the observable** — obtained without citation graphs, expert annotation, or supervised training. It decomposes into a total-inertia response and a pairwise-distance response, whose relative dominance is itself diagnostic of *how* a field reorganized.

Because a geometric signature is easy to produce by accident, the framework is validated against several null hypotheses: removing temporally matched random documents instead of the target, scrambling concept labels while preserving the corpus's temporal structure, a single-document jackknife, and a look-elsewhere correction for scanning candidate pivot years.

### Results

Applied across historical case studies spanning physics, mathematics, and machine learning, the observable identifies the principal conceptual reorganization in most cases, and does so with interpretable structure: concepts whose influence was concentrated *before* a transition show the opposite sign, consistent with their declining structural role. It also separates **concentrated conceptual breakthroughs** from **broad, distributed paradigm shifts** — a distinction citation-based measures do not naturally express — and the exceptions are informative in their own right, marking where an innovation is hard to resolve inside an ongoing revolution, or where unsupervised document assignment rather than the geometry is the limiting factor. Rerunning the full pipeline across sentence-transformer models from different training paradigms leaves the principal conclusions stable, while the concept rankings shift in ways that reveal what each encoder's training objective preserves.

### Outlook

The immediate contribution is retrospective: establishing that historically recognized conceptual reorganizations leave measurable geometric signatures, and that embedding spaces can be treated not merely as semantic representations but as scientific objects of study. The longer-term ambition is prospective — detecting the "quiet revolutions" Kuhn described, which unfold over decades before being recognized as transformative. Whether systems that recognize the signatures of *past* reorganizations can help identify *emerging* ones remains open; this work is a prerequisite for asking that question, not an answer to it. The framework is domain-agnostic and applies to any text-rich field whose conceptual structures evolve over time.

---

*With A. Schwartzman (SLAC Physics), C. Chafe (Stanford Music), and T. A. Ryckman (Stanford Philosophy). Manuscript in preparation.*
