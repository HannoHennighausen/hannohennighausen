---
layout: page
permalink: /cv/
title: CV
nav: true
nav_order: 4
cv_pdf: # [TODO: add CV PDF filename in assets/pdf/ for the download button]
description: Curriculum vitae of Hanno I. Hennighausen.
toc:
  sidebar: left
---

<style>
.cv-summary { margin-bottom: 1.2rem; }
.cv-section-title { font-weight: 500; margin-top: 1.7rem; }
.cv-entry { display: flex; gap: 1.4rem; padding: 0.75rem 0; }
.cv-left { flex: 0 0 165px; }
.cv-date { color: var(--global-theme-color); font-weight: 600; font-size: 0.95rem; }
.cv-loc { color: var(--global-text-color-light); font-size: 0.85rem; margin-top: 1px; }
.cv-logos { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; margin-top: 9px; }
.cv-logos img { height: 44px; width: auto; max-width: 150px; background: #fff; padding: 4px 6px; border-radius: 6px; border: 0.5px solid var(--global-divider-color); box-sizing: border-box; }
.cv-right { flex: 1; min-width: 0; }
.cv-degree { font-weight: 600; }
.cv-inst { font-size: 0.95rem; }
.cv-area { font-style: italic; font-size: 0.9rem; color: var(--global-text-color-light); margin-bottom: 0.3rem; }
.cv-right ul { margin: 0.25rem 0 0; padding-left: 1.1rem; }
.cv-right li { font-size: 0.92rem; padding: 0.05rem 0; }
.cv-bullets { margin: 0; padding-left: 1.1rem; }
.cv-bullets li { padding: 0.18rem 0; }
.cv-award { padding: 0.25rem 0; }
.cv-award-date { color: var(--global-theme-color); font-weight: 600; margin-left: 0.5rem; }
.cv-skill { padding: 0.22rem 0; }
.cv-skill-lines { margin-top: 2px; }
.cv-skill-lines > div { font-size: 0.92rem; padding: 1px 0; }
@media (max-width: 576px) { .cv-entry { flex-direction: column; gap: 0.5rem; } .cv-left { flex-basis: auto; } .cv-logos img { height: 40px; } }
</style>

{% assign cv = site.data.cv.cv %}
{% if page.cv_pdf %}
<a href="{{ page.cv_pdf | relative_url }}" class="btn btn-sm z-depth-0" target="_blank" rel="noopener noreferrer"><i class="fa-solid fa-file-pdf"></i> Download CV (PDF)</a>
{% endif %}
{% if cv.summary %}<p class="cv-summary">{{ cv.summary }}</p>{% endif %}
{% for pair in cv.sections %}
{% assign entries = pair[1] %}
{% assign first = entries[0] %}
<h2 class="cv-section-title">{{ pair[0] }}</h2>
{% if first.institution %}
{% for e in entries %}
<div class="cv-entry">
<div class="cv-left">
<div class="cv-date">{{ e.start_date }}{% if e.end_date and e.end_date != e.start_date %}–{{ e.end_date }}{% endif %}</div>
{% if e.location %}<div class="cv-loc">{{ e.location }}</div>{% endif %}
{% if e.logos %}<div class="cv-logos">{% for l in e.logos %}<img src="/assets/img/logos/{{ l }}" alt="{{ e.institution }}">{% endfor %}</div>{% endif %}
</div>
<div class="cv-right">
{% if e.studyType %}<div class="cv-degree">{{ e.studyType }}</div>{% endif %}
<div class="cv-inst">{{ e.institution }}</div>
{% if e.area %}<div class="cv-area">{{ e.area }}</div>{% endif %}
{% if e.highlights %}<ul>{% for h in e.highlights %}<li>{{ h | markdownify | remove: '<p>' | remove: '</p>' }}</li>{% endfor %}</ul>{% endif %}
</div>
</div>
{% endfor %}
{% elsif first.bullet %}
<ul class="cv-bullets">{% for e in entries %}<li>{{ e.bullet | markdownify | remove: '<p>' | remove: '</p>' }}</li>{% endfor %}</ul>
{% elsif first.title %}
{% for e in entries %}<div class="cv-award">{{ e.title }}{% if e.date %}<span class="cv-award-date">{{ e.date }}</span>{% endif %}</div>{% endfor %}
{% elsif first.keywords or first.name %}
{% for e in entries %}<div class="cv-skill"><strong>{{ e.name }}{% unless e.lines %}:{% endunless %}</strong>{% if e.keywords %} {{ e.keywords }}{% endif %}{% if e.lines %}<div class="cv-skill-lines">{% for ln in e.lines %}<div>{{ ln | markdownify | remove: '<p>' | remove: '</p>' }}</div>{% endfor %}</div>{% endif %}</div>{% endfor %}
{% endif %}
{% endfor %}
