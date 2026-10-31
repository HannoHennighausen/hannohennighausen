---
layout: page
title: research
permalink: /research/
description: Minimal physical models of how cells and tissues sense and reshape their environment.
nav: true
nav_order: 3
---

<style>
  .research-intro { max-width: 46rem; margin: 0 0 1.5rem; }
  .feedback-diagram { margin: 1.75rem 0 2.5rem; }
  .feedback-diagram img.research-overview { display: block; width: 100%; max-width: 820px; height: auto; margin: 0 auto; }
  html[data-theme="dark"] .feedback-diagram img.research-overview { filter: invert(1) hue-rotate(180deg); }
  h2.category { margin-top: 1rem; }
  .project-list { margin-top: 0.5rem; }
  .project-item { display: flex; align-items: center; gap: 1.25rem; padding: 1.1rem 0; border-top: 1px solid var(--global-divider-color); text-decoration: none; color: inherit; }
  .project-list .project-item:last-child { border-bottom: 1px solid var(--global-divider-color); }
  .project-item .thumb { flex: 0 0 170px; width: 170px; }
  .project-item .thumb img { border-radius: 0; box-shadow: none; }
  .project-item .meta h3 { margin: 0 0 0.3rem; font-size: 1.2rem; }
  .project-item .meta p { margin: 0; color: var(--global-text-color-light); font-size: 0.92rem; }
  .project-item:hover .meta h3 { color: var(--global-theme-color); }
  @media (max-width: 576px) { .project-item { gap: 0.9rem; } .project-item .thumb { flex-basis: 104px; width: 104px; } }
</style>

<div class="research-intro" markdown="1">
I'm fascinated by emergent order and collective phenomena. My work connects cell–cell interactions — and in particular mechanical feedback loops — to the coarse-grained active forces that give rise to these phenomena. I love building bridges from microscopic detail to macroscopic behavior.
</div>

<div class="feedback-diagram">
  <img class="research-overview" src="{{ '/assets/img/research_overview.svg' | relative_url }}" alt="Cell–cell interactions, through a feedback loop, give rise to active forces, which give rise to emergent collective phenomena." />
</div>

<h2 class="category" id="projects">Projects</h2>

{% assign research_projects = site.projects | where: "category", "research" | sort: "importance" %}
<div class="project-list">
{% for project in research_projects %}
  <a class="project-item" href="{{ project.url | relative_url }}">
    <div class="thumb">{% include figure.liquid loading="eager" path=project.img class="img-fluid" zoomable=false %}</div>
    <div class="meta">
      <h3>{{ project.title }}</h3>
      {% if project.description %}<p>{{ project.description }}</p>{% endif %}
    </div>
  </a>
{% endfor %}
</div>
