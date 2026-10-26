---
layout: page
title: Asymmetric cell droplets
description: A thin-film shape equation for asymmetric, actively driven migrating cell clusters.
img: assets/img/shape_asymmetry.jpg
importance: 2
category: research
related_publications: false
chart:
  plotly: true
---

<div class="row align-items-center">
  <div class="col-md-7" markdown="1">
Directionally migrating clusters aren't fully symmetric: their front and back meet the surface at different angles. In clusters of frog neural-crest cells, experiments in Elias Barriga's lab measured a lower contact angle at the front than at the rear. Using thin-film hydrodynamics, we derive a shape equation for actively driven cell droplets that explains where this asymmetry comes from.

[arXiv:2610.03536](https://arxiv.org/abs/2610.03536)
  </div>
  <div class="col-md-5">
    {% include figure.liquid loading="eager" path="assets/img/shape_asymmetry.jpg" class="img-fluid rounded z-depth-1" zoomable=true %}
  </div>
</div>

## The shape equation

The mechanism reads from the bottom up: an imbalance in active traction — the same imbalance that drives directed migration — sets up flows in the basal cell layer. These flows drive a flow field in the layers above which, through the physics of wetting, builds a pressure gradient. That gradient couples to the free surface and tips the droplet into an asymmetric shape.

All of this collapses into a single equation for the height profile $h(x)$. Hover over each piece to see what it contributes:

<div class="eq-diagram" data-eq-latex="\class{et et-curv}{h'''(x)} = 3\,\class{et et-ca}{\mathrm{Ca}}\;\dfrac{\class{et et-vel}{1 - \dfrac{v(x)}{V_T}}}{\class{et et-h2}{h^2(x)}}">
  <div class="eq-callout cb-ca" data-term="ca"><strong>Capillary number</strong> $\mathrm{Ca}=\mu V_T/\gamma$: viscous forces (tissue viscosity $\mu$, migration speed $V_T$) versus surface tension $\gamma$. It sets how strongly the flow mismatch distorts the shape.</div>
  <div class="eq-callout cb-curv" data-term="curv"><strong>The shape.</strong> Surface tension resists bending through the Young–Laplace pressure ($P\approx-\gamma h''$), so this third derivative is how the profile responds.</div>
  <div class="eq-center"></div>
  <div class="eq-callout cb-h2" data-term="h2"><strong>Height.</strong> The local thickness $h^2(x)$ of the cluster — an additional source of nonlinearity.</div>
  <div class="eq-callout cb-vel" data-term="vel"><strong>Active flows drive the asymmetry.</strong> The mismatch between the basal-layer flow $v(x)$ and the migration speed $V_T$. If the flow were uniform ($v\equiv V_T$) this vanishes and the droplet stays symmetric.</div>
</div>

## Explore the model

For a small velocity mismatch the shape equation can be solved in closed form (Eq. D9), and that is what the slider drives here. Move the capillary number $\mathrm{Ca}$ to watch the profile tip from symmetric to lopsided, with the peak sliding toward the rear. Switch on the experimental data to compare the theory with the measured average height profile and its SEM band — the two line up best around $\mathrm{Ca}\approx 6\times10^{-3}$.

<div id="sa-explore"></div>

## Learn more

For the full nonlinear shape equation (solved numerically in Julia), the experiments on neural-crest clusters, and the link to classical dynamic-wetting theory, see the paper — a collaboration with Jaime A. Espina and Elias H. Barriga, whose lab performed the experiments, and Ricard Alert.

<script defer src="{{ '/assets/js/papers/equation_diagram.js' | relative_url }}"></script>
<script defer src="{{ '/assets/js/papers/framework.js' | relative_url }}"></script>
<script defer src="{{ '/assets/js/papers/shape_asymmetry.js' | relative_url }}"></script>
