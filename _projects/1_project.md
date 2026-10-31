---
layout: page
title: Tissues spread like liquids
description: Active wetting transition in cell aggregates
img: assets/img/active_wetting.jpg
importance: 1
category: research
related_publications: false
chart:
  plotly: true
---

<div class="row align-items-center">
  <div class="col-md-7" markdown="1">
Spreading cell aggregates behave like droplets: they can stay as a compact cluster or spread out completely, like water on clean glass. This liquid-drop analogy was established by a series of in vitro experiments, which showed that three-dimensional cell aggregates placed on a substrate spread much as droplets do {% cite douezan2011spreading douezan2012wetting douezan2012dewetting gonzalezrodriguez2012soft beaune2014how yousafzai2022cellmatrix wang2023contractility pahlavan2026active --file references %}. The same physics has recently been implicated in mouse embryo implantation {% cite cavanaugh2026elevated --file references %}. We show that this partial-to-total wetting transition in active tissues is set by active forces and by dynamic material properties such as friction.

[arXiv:2608.28912](https://arxiv.org/abs/2608.28912)
  </div>
  <div class="col-md-5">
    {% include figure.liquid loading="eager" path="assets/img/active_wetting.jpg" class="img-fluid" zoomable=true %}
  </div>
</div>

## Active forces in a living droplet

Cells generate active forces, and both cell–cell and cell–substrate adhesions are needed to transmit them across the cluster. So, unlike in a passive droplet, active forces are present everywhere in the tissue — and they are largest at the edge. Our model has three of them:

1. **Active traction.** To migrate, the cells in contact with the substrate push against it to crawl forward. These tractions follow each cell's front–back polarity, which experiments show points outward and is strongest at the edge.
2. **Contractility.** Every cell is contractile; acting along the polarity field, this produces an active contractile stress.
3. **Surface tension.** The contractility and cell–cell adhesion of the cells _not_ touching the substrate act as an effective surface tension at the contact line, pulling inward or outward depending on the geometry.

In a passive droplet these forces act only at the contact line. Here they are generated throughout the basal layer and drive active flows inside the tissue.

## Spreading velocity sets the fate of the cluster

The central idea is simple: the spreading velocity decides what the cluster does. A positive value means it **spreads**, a negative one means it **retracts**, and zero means it sits at a **steady state**. Locating these zeros of the spreading velocity $V(L)$ maps out the active wetting transition. We distinguish **stable** steady states (filled circles ●) from **unstable** ones (open circles ○).

Play with the three active forces below and check your intuition:

- What happens as you increase the outward traction $T_\mathrm{a}$?
- What happens as you increase the contractility $\zeta$?

<div id="aw-explore"></div>

The curve is the spreading velocity $V$ versus cluster half-width $L$ (Eq. C7 of the paper); the markers are its steady states. Parameters start from the paper's Table C1.

- Can you find a parameter regime where $V(L)$ is **tristable** — three steady states at once? There, what is the effect of each force on the stable and unstable branches?

## Dissipation also controls the transition

Here is the most striking difference from passive wetting. Because the active forces drive flows in the basal layer, the magnitude of those flows is set by _dissipative_ parameters — the tissue's viscosity and friction. Tuning these can therefore **stabilize or destabilize** the wetting state. In a passive droplet, friction and viscosity would only change how _fast_ the droplet relaxes toward equilibrium — never _whether_ the transition happens at all. Activity overturns that: can you find a regime where **lowering** the friction coefficient $\xi$ makes the partial-wetting state disappear?

<!-- [TODO: embed the short summary movie here (.mp4, muted/looping/autoplay with a poster) — "I hope this short animation clarifies the transition."] -->

## Learn more

For the full derivation, the picture as a dynamical system, and the 2D geometry, take a look at the paper — a wonderful collaboration with M. J. Franco-Oñate and Ricard Alert.

## References

<div class="publications">
{% bibliography --file references --cited_in_order %}
</div>

<script defer src="{{ '/assets/js/papers/framework.js' | relative_url }}"></script>
<script defer src="{{ '/assets/js/papers/active_wetting.js' | relative_url }}"></script>
