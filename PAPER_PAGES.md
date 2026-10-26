# Adding an interactive paper page

A short how-to for adding a new paper page with a slider-driven plot, like the
ones on the research projects. Everything lives in **CI-safe folders**
(`assets/js/`, `assets/json/`, `scripts/`, and the page markdown) — no theme
(gem) files are touched, so `npm run lint:style-contract` stays green.

This file is excluded from the built site (see the `exclude` list in `_config.yml`).

## The pieces

| File | Role |
|------|------|
| `assets/js/papers/framework.js` | Shared engine. Builds sliders/toggles, the Plotly plot, lazy-init, theme-following, reset/presets. Don't edit per paper. |
| `assets/js/papers/<paper>.js` | **Per-paper config**: parameters, the model function, plot labels. This is the main thing you write. |
| `assets/json/papers/<paper>.json` | Optional data (experimental overlay, or precomputed sweep curves). Keep under ~2 MB. |
| `assets/js/papers/equation_diagram.js` | Optional: the hover-to-highlight "anatomy of an equation" diagram. |
| `scripts/<paper>_sweep.py` | Optional: a Python sweep that writes the JSON for precomputed mode. |
| the page (`_projects/N_project.md` or `_pages/...`) | Front matter + a mount `<div>` + `<script>` tags. |

Plotly is loaded by the theme when the page front matter sets `chart: { plotly: true }`.
**Do not name a JS file with a leading underscore** — Jekyll skips `_*` files.

## Quick start (live mode)

A "live" model is a closed-form function evaluated in the browser (no data files).

**1. Write the config** `assets/js/papers/mypaper.js`:

```js
document.addEventListener("DOMContentLoaded", function () {
  if (!window.PaperInteractive) return;
  PaperInteractive.create("#mypaper-explore", {
    plotAria: "One sentence describing the plot for screen readers.",
    params: [
      // symbol is LaTeX without delimiters; scale:"log" makes a log slider
      { key: "a", symbol: "\\alpha", label: "some rate", unit: "1/s", min: 0, max: 10, step: 0.1, value: 2, digits: 1 },
    ],
    // optional on/off switches, read in model() as state.<key>
    toggles: [{ key: "showData", label: "show experimental data", value: false }],
    // optional quick-set buttons
    presets: [{ label: "Regime A", values: { a: 0.5 } }],
    plot: { xtitle: "x (unit)", ytitle: "y (unit)", xrange: [0, 10], showlegend: true },
    model: function (state, colors) {
      // colors = { text, accent, grid, muted } — follow light/dark automatically
      var x = [], y = [];
      for (var i = 0; i < 300; i++) { var xi = (10 * i) / 299; x.push(xi); y.push(Math.exp(-state.a * xi)); }
      return {
        traces: [{ x: x, y: y, mode: "lines", name: "model", line: { color: colors.accent, width: 2.5 } }],
        // optional layout overrides (shapes, annotations, margin, ...)
        layout: {},
      };
    },
  });
});
```

**2. Add to the page** (front matter + body):

```liquid
---
layout: page
title: My paper
chart:
  plotly: true
---

## Explore the model

<div id="mypaper-explore"></div>

<script defer src="{{ '/assets/js/papers/framework.js' | relative_url }}"></script>
<script defer src="{{ '/assets/js/papers/mypaper.js' | relative_url }}"></script>
```

**3. Preview** with `bundle exec jekyll serve` (or `docker compose up -d`) and open the page.

That's it — adding a paper = **one config JS + a mount div + two script tags**.

## The config API (`PaperInteractive.create(mount, config)`)

- `mount` — CSS selector or element for the viewer container.
- `params[]` — one slider each: `{ key, symbol (LaTeX), label, unit, min, max, step, value, digits, scale }`. `scale: "log"` = logarithmic slider. `value` is the default (Reset returns here).
- `toggles[]` — `{ key, label, value }` checkboxes; read as `state.<key>` in `model`.
- `presets[]` — `{ label, values: { key: v, ... } }` quick-set buttons.
- `plot` — `{ xtitle, ytitle, xrange, yrange, showlegend }`.
- `model(state, colors)` — returns `{ traces, layout }`. `traces` are Plotly traces; use `colors.accent/text/grid/muted` so the plot matches the theme (and re-themes on the dark-mode toggle). `layout` is merged over sensible defaults.
- `plotAria` — a one-sentence description for screen readers.

The plot lazily initializes when scrolled into view and throttles redraws while a slider is dragged — you don't manage any of that.

## Precomputed mode (PDE / simulation results)

When the model needs a solver, precompute a sweep and ship the curves as JSON:

1. Write `scripts/<paper>_sweep.py` that loops over the control parameter(s) and writes `assets/json/papers/<paper>.json` (keep it under ~2 MB — downsample x, round values). Decide the grid resolution before running (ask if unsure).
2. In the config, `fetch` the JSON once, then `PaperInteractive.create(...)` inside the `.then`, and in `model` snap the slider to the nearest grid value (or interpolate if safe) and return the stored curve. See `assets/js/papers/shape_asymmetry.js` for the fetch-then-build pattern (it loads an experimental overlay the same way).

## Optional: the equation diagram

To show an equation with hover-highlighted terms (see "Asymmetric cell droplets"):

```html
<div class="eq-diagram" data-eq-latex="\class{et et-KEY1}{term1} = \class{et et-KEY2}{term2} \cdots">
  <div class="eq-callout cb-KEY1" data-term="KEY1"><strong>Title.</strong> explanation with $math$.</div>
  <div class="eq-callout cb-KEY2" data-term="KEY2"><strong>Title.</strong> ...</div>
  <div class="eq-center"></div>
</div>
<script defer src="{{ '/assets/js/papers/equation_diagram.js' | relative_url }}"></script>
```

The `\class{et et-KEY}{...}` in the LaTeX and the `data-term="KEY"` on each callout must use the same KEYs. The component places the callouts in the four corners, draws arrows, and wires hover. The current keys are hard-wired to four (`curv, ca, vel, h2`); to reuse with different terms, edit the `KEYS`/`CORNER` lists at the top of `equation_diagram.js`.

## Linking from research and publications

- The **research card** links to the project page automatically (it's a `_projects/*.md` file with `category: research`).
- On the **publications** entry, add to the `.bib` entry in `_bibliography/papers.bib`:
  - `website = {/projects/N_project/}` → a "Website" button to the interactive page.
  - `preview = {myfig.jpg}` with the image in `assets/img/publication_preview/` → a thumbnail. `assets/js/publication_preview_links.js` (loaded on `publications.md` and `about.md`) makes that thumbnail link to the `website`.

## Gotchas

- `$...$` for inline math in markdown/HTML bodies; the centered diagram equation goes in the `data-eq-latex` attribute to avoid kramdown mangling backslashes.
- Keep the plot background transparent and pull colors from `colors.*` so dark mode works.
- The light-mode accent is set in `assets/css/main.scss` (a shadow of the theme's file that configures `$purple-color`); dark mode uses the theme's cyan.
