---
layout: page
permalink: /papers/toy/
title: "Interactive template — toy example"
description: Hidden preview of the interactive paper-page template. Not linked from anywhere; safe to delete once the real paper pages exist.
nav: false
chart:
  plotly: true
---

This hidden page previews the reusable **interactive paper-page template**. The model below is a placeholder (a damped harmonic oscillator) used only to tune the look and behaviour — it is not physics from any paper.

## Explore the model

<div id="toy-explore"></div>

**Try this:** drag the damping ratio $\zeta$ down toward 0 to see nearly undamped oscillations, then raise it to watch the motion die out within a cycle. The dotted lines show the decay envelope $\pm e^{-\zeta\omega_0 t}$.

<script defer src="{{ '/assets/js/papers/framework.js' | relative_url }}"></script>
<script defer src="{{ '/assets/js/papers/toy.js' | relative_url }}"></script>
