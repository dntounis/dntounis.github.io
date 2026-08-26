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

Scientific knowledge is organized as a network of interconnected concepts, and that organization occasionally undergoes rapid reorganization. Understanding these episodes has traditionally relied on historical analysis and qualitative interpretation, while existing quantitative approaches characterize scientific change through citation networks, bibliometric indicators, or topic evolution. Those methods describe structures *external* to conceptual organization itself, and inherit the biases of external metadata.

This project asks a complementary question: **can conceptual reorganizations be detected directly in the geometry of document embedding spaces?** The claim behind it is a shift in how embedding spaces are used — not merely as representations for retrieval or semantic similarity, but as a **quantitative scientific observable** that can be measured, perturbed, statistically validated, and compared across independent historical case studies.

### Method: Counterfactual Ablation

The framework represents scientific documents and natural-language concept descriptions in a common embedding space, then measures the structural role of a concept by removing it. For a candidate concept, all associated documents are removed, the geometry is recomputed, and the resulting perturbation is compared before and after a candidate pivot year. If a concept genuinely reorganized an existing body of knowledge, removing it should perturb the post-emergence geometry far more than the pre-emergence geometry.

Because a geometric signature is easy to produce by accident, the framework is validated against several null hypotheses: removing temporally matched random documents instead of the target, scrambling concept labels while preserving the corpus's temporal structure, a single-document jackknife, and a look-elsewhere effect correction.

### Outlook

The immediate contribution is retrospective: establishing that historically recognized conceptual reorganizations leave measurable geometric signatures, and that embedding spaces can be treated not merely as semantic representations but as scientific objects of study. The longer-term ambition is to be able to detect future conceptual revolutions in science and beyond. However, whether systems that recognize the signatures of *past* reorganizations can help identify *emerging* ones remains open; this work is a prerequisite for asking that question, not an answer to it.

---

*With A. Schwartzman (SLAC Physics), C. Chafe (Stanford Music), and T. A. Ryckman (Stanford Philosophy). Manuscript in preparation.*
