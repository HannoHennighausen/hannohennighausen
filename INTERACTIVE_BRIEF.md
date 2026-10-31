# Brief: interactive paper pages

The site from `SITE_BRIEF.md` is built and working. This brief adds a reusable **paper page** with an interactive, slider-driven plot, so each paper's results can be explored, like a Desmos graph. Read `CLAUDE.md` first and inspect the current state of the repository before changing anything.

## Ground rules

- Don't break or restyle what already works. Extend the existing research/project pages rather than replacing them.
- Work step by step. After each step, preview locally, summarize the changes, and wait for my OK.
- Never commit or push without asking me first.
- Never invent physics, equations, parameter values, or results. Use placeholders and ask me.
- Add `INTERACTIVE_BRIEF.md` and any helper scripts folder (e.g. `scripts/`) to the `exclude` list in `_config.yml`.
- Keep pages fast and mobile-friendly. Every interactive element must work with touch, in dark mode, and on a narrow screen.

## What every paper page should contain (in this order)

1. Title, authors (my name highlighted), and link badges: arXiv, PDF, code, and journal once published.
2. A short plain-language summary (2–4 sentences).
3. The key figure, with caption.
4. A summary movie: self-hosted `.mp4` (muted, looping, autoplay, `playsinline`, with a poster frame), or a YouTube/Vimeo embed for longer videos.
5. **Explore the model**: the interactive plot.
   - Sliders for the key parameters, labeled with math symbols (MathJax) and units, plus a live numeric readout.
   - Sensible defaults and ranges, and a "reset" button.
   - One or two lines of "Try this:" guidance, e.g. "increase the active traction until the cluster wets the surface completely."
   - Optional: a toggle between preset regimes.
6. A citation block with BibTeX.

Any section without content is simply hidden, so pages with only some of these still look clean.

## Technical approach

- Build one reusable layout/include (follow al-folio's conventions, e.g. `_includes/*.liquid`). Paper pages then set everything in front matter: title, arxiv, figure, video, poster, and an `interactive` block naming the plot script or data file. Adding a paper should mean creating one Markdown file plus one small script.
- Use Plotly.js for plots. Check first whether al-folio already bundles it; otherwise load one pinned version consistently. Use the theme's CSS variables so plot colors follow light and dark mode.
- Lazy-initialize each plot when it scrolls into view, and throttle redraws while a slider is dragged.
- Support two modes, chosen per paper:
  - **Live mode:** the model is a closed-form function or cheap computation, written as a JavaScript function in `assets/js/papers/<paper>.js`. Sliders call it directly.
  - **Precomputed mode:** the model needs a PDE solver or simulation. A Python script in `scripts/<paper>_sweep.py` runs a parameter sweep and writes `assets/json/papers/<paper>.json`. The sliders snap to grid values (or interpolate between them if that's safe) and display the stored solution. Keep each JSON under ~2 MB; ask me before choosing grid resolution.
- Optional third mode for later: embed an external interactive (Desmos graph, or a marimo WASM export) in a responsive iframe.

## Steps

**Step 1. Inspect.** Read `CLAUDE.md`, look at the current research pages and layouts, and tell me your plan for where the new layout and files will live.

**Step 2. Template with a toy example.** Build the layout with a clearly labeled placeholder model (e.g. a damped oscillator with two sliders) on a hidden test page. Show me the result on desktop and mobile widths and in dark mode. Iterate on the look with me before going further.

**Step 3. First real paper.** Ask me which paper to start with, and ask me for:
- the equation(s) or the Python function behind the key result;
- the parameters to expose, with ranges, defaults, units, and symbols;
- what should be plotted (axes, curves, or a 2D field/shape);
- the figure, the summary movie, and the "Try this" text.

Then tell me whether it fits live or precomputed mode and why. In precomputed mode, write the sweep script and either run it (if the environment allows) or tell me exactly how to run it.

The two arXiv papers are the first candidates:
- Active wetting transition from partial-to-total wetting in collective cell migration (arXiv:2608.28912)
- Asymmetric contact angles in collectively migrating cell clusters (arXiv:2610.03536)

The unpublished projects get no interactive content until I confirm my coauthors agree.

**Step 4. Connect it.** Link the paper page from its research card and its publications entry (e.g. a "website" or "interactive" badge in the BibTeX entry).

**Step 5. Second paper.** Repeat Step 3 for the other preprint, to prove the template really is reusable.

**Step 6. Maintenance guide.** Write `PAPER_PAGES.md` (excluded from the site): a short how-to for adding a new paper page myself, covering the files to create, the front-matter fields, and how to run a sweep script. Include a copy-paste template.

**Step 7. Final check.** Test page load speed, mobile layout, dark mode, keyboard use of the sliders, and all links. Ask me before the final commit and push.
