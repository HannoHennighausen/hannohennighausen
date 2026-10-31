# Site brief: hannohennighausen.github.io

You are helping me, Hanno Iwasaki Hennighausen, build my personal academic website from the al-folio template in this repository. Read `CLAUDE.md` first and follow its conventions for where content lives and how the theme works. Then follow this brief step by step.

## Ground rules

- Work through the steps below in order. After each step, build and preview the site locally, summarize what you changed, and wait for my OK before moving on.
- Never commit or push without asking me first.
- Use only the text in this brief or text I give you. Do not invent publications, dates, links, or facts. Where something is missing, insert a clearly marked placeholder like `[TODO: ...]` and ask me for it.
- Add `SITE_BRIEF.md` to the `exclude` list in `_config.yml` so this file is not published.
- Never put my phone number or any recommender/referee details on the site.
- Keep the design clean and minimal (al-folio default style). Dark mode toggle stays on.

## Assets to ask me for

At the start, show me this checklist and ask me which items I have ready. Ask for the rest when you reach the step that needs them.

1. Profile photo (square or portrait, well lit). Compress to under ~500 KB.
2. Links: Google Scholar, ORCID, LinkedIn, and anything else I want shown. GitHub is `HannoHennighausen`.
3. BibTeX for my two arXiv preprints (from arXiv "Export BibTeX citation" or INSPIRE).
4. Full CV as a PDF (typos fixed) for the download button.
5. For each of the four research projects: one cover image (figure or simulation snapshot) and optionally a short movie.
   Movies: `.mp4` (H.264), ideally under ~10 MB, played muted, looping, and autoplaying, like an animated figure. Ask me whether longer videos should be embedded from YouTube/Vimeo instead.
6. Personal projects (title, short description, image) if I want a personal-projects section.
7. Missing details: months for the news items marked TODO, programming languages and tools for the skills line, and an expected PhD completion date.
8. Optional: accent color preference and a favicon.

## Step 1: Configuration

- `_config.yml`: name "Hanno I. Hennighausen" (confirm with me whether to use the full name "Hanno Iwasaki Hennighausen"), `url: https://hannohennighausen.github.io`, `baseurl:` empty, email `hanno@hennighausen.de`.
- Set up social links from the asset list.
- Configure jekyll-scholar so my name is highlighted in author lists (last name Hennighausen, first name Hanno).
- Navigation: keep **about**, **publications**, **research** (the projects collection, renamed in the nav), and **cv**. Disable or hide blog, repositories, teaching, books, and any other pages I am not using. Ask me before deleting files; prefer hiding.

## Step 2: About (homepage)

Subtitle: PhD candidate in theoretical physics · MPI-PKS & CSBD, Dresden

Bio (use exactly):

> I'm a theoretical physicist finishing my PhD at the Max Planck Institute for the Physics of Complex Systems and the Center for Systems Biology Dresden, supervised by Ricard Alert. I study how cells and tissues sense and reshape their physical environment, and how the resulting feedback loops organize collective behavior, from cell clusters steered by internal stiffness gradients to tissues that spread like active liquids. My approach is to distill complex biological behavior and experimental data into minimal physical models, in close collaboration with experimental labs. Along the way I've built a toolkit in continuum modeling, numerical simulation, and quantitative data analysis.

Show the profile photo, the social icons, news, and selected publications on the homepage.

News items (one entry each, newest first). Delete the theme's demo news:

- Oct 2026: New preprint on asymmetric contact angles in collectively migrating cell clusters, with J. Espina, E. Barriga, and R. Alert. [arXiv:2610.03536](https://arxiv.org/abs/2610.03536)
- [TODO: month] 2026: Invited seminar at the Biozentrum, University of Basel.
- Aug 2026 (confirm): New preprint on active wetting in collective cell migration, with M. J. Franco-Oñate and R. Alert. [arXiv:2608.28912](https://arxiv.org/abs/2608.28912)
- [TODO: month] 2026: Talk at the APS Global Physics Summit, Denver.
- Jan–Mar 2026: Guest researcher at the University of Barcelona with Ricard Alert.
- 2025: Best Poster Award at the IMPRS-CellDevoSys PhD retreat.

## Step 3: Publications

Replace the demo entries in `_bibliography/papers.bib` with my BibTeX (ask me for it). Mark both preprints `selected={true}`, and add `arxiv` fields so the arXiv badges and links appear. Expected entries:

- M. J. Franco-Oñate, H. I. Hennighausen, R. Alert. Active wetting transition from partial-to-total wetting in collective cell migration. arXiv:2608.28912.
- H. I. Hennighausen, J. Espina, E. Barriga, R. Alert. Asymmetric contact angles in collectively migrating cell clusters. arXiv:2610.03536.

Ask me whether to list papers in preparation (titles only) or leave them off until they're on arXiv.

## Step 4: Research

Replace the demo projects with these four cards, each with its own project page. Use the cover image as the card thumbnail. On each project page, put the blurb, then the image or looping movie, and a link to the paper where one exists. Use a category "research" for these. If I provide personal projects, put them in a second category "personal" and show both categories on the page.

**Tissues that spread like liquids**
Spreading cell monolayers behave like droplets: they can stay as a compact cluster or spread out completely, like water on clean glass. We show that this partial-to-total wetting transition in active tissues is controlled by active forces and by dynamic material properties such as friction. (arXiv:2608.28912)

**Lopsided cell droplets**
Migrating cell clusters aren't symmetric: their front and back meet the surface at different angles. Using thin-film hydrodynamics, we derive a shape equation for actively driven cell droplets that explains this asymmetry. (arXiv:2610.03536)

**How a tissue knows which way is out**
At a free edge, as in a healing wound, cells polarize outward. We propose a minimal mechanical feedback that produces this outward polarity and also creates stable density patterns, a dynamical route to microenvironments that could coincide with patterns of proliferation or differentiation.

**Steering from within: internal durotaxis**
Neural crest cell clusters migrate directionally even without external cues, guided by stiffness gradients inside the cluster itself. A mechanosensitive pathway can translate substrate stiffness into this internal pattern, giving robust migration and directional memory in noisy environments.

Before this step goes live, remind me to confirm with my coauthors that the last two (unpublished) projects can be described at this level of detail.

## Step 5: CV page

Use the theme's built-in CV mechanism (see `CLAUDE.md` / the theme docs) with the content below, and add a prominent "Download full CV (PDF)" button linking to my PDF in `assets/pdf/`.

**Education**
- 2022–present: PhD (Dr. rer. nat.), Max Planck Institute for the Physics of Complex Systems and Center for Systems Biology Dresden; degree from TU Dresden. Thesis: Internal mechanical guidance of collective cell migration. Supervisor: Prof. Ricard Alert. University advisor: Prof. Otger Campàs. [TODO: expected completion]
- 2020–2022: M.Sc. Physics, Philipps University Marburg. Thesis: Modeling stochastic protein dynamics in bacteria, at the MPI for Terrestrial Microbiology (Dept. of Prof. Victor Sourjik, group of Dr. Sean Murray). Awarded highest grade.
- 2020: Guest researcher, Johns Hopkins University, Baltimore, with Prof. Brian Camley. Project: Polarization under stress in a collective cell migration model.
- 2016–2019: B.Sc. Physics, Heidelberg University. Thesis: A two-dimensional finite element implementation of a red blood cell in a microfluidic channel, with Prof. Ulrich Schwarz.

**Fellowships and visits**
- 2022–present: International Max Planck Research School for Cell, Developmental and Systems Biology
- 2026: Guest researcher, University of Barcelona, with Prof. Ricard Alert
- 2017–2022: Scholarship, Evangelisches Studienwerk Villigst (German national scholarship foundation for outstanding students)

**Awards**
- 2025: Best Poster Award, IMPRS PhD retreat
- 2025: Selected to present the Biological Physics Division to the MPI-PKS Scientific Advisory Board
- 2022: M.Sc. thesis awarded highest grade

**Selected talks**
- 2026: Invited seminar, Biozentrum Basel, Switzerland
- 2026: APS Global Physics Summit, Denver, USA
- 2025: Gordon Research School on Directed Cell Migration, Lucca, Italy
- 2025: Seminar, group of Prof. Xavier Trepat, IBEC Barcelona (online)
- 2025, 2023: Seminar, MPI of Molecular Cell Biology and Genetics, Dresden
- 2024: Physical Biology Circle Meeting, Oeiras, Portugal

**Teaching and outreach**
- 2025: Teaching assistant, Mathematical Methods, TU Dresden
- 2024: Teaching assistant, Electrodynamics, TU Dresden
- 2025: Supervised two high-school internships at CSBD and MPI-PKS
- 2023–2024: Organizer, Science on Board (Dresden-wide PhD chalk talks and science communication)
- 2023–2024: Elected student representative, IMPRS for Cell, Developmental and Systems Biology
- 2021–2022: Elected spokesperson for scholarship holders in Marburg; organizer of a workshop on digital transformation (Evangelisches Studienwerk Villigst)

**Peer review**
Co-reviewer for Physical Review X and Nature Communications.

**Skills**
- Theory: active matter hydrodynamics, continuum mechanics, thin-film and fluid mechanics, wetting, nonlinear dynamical systems, reaction-diffusion systems
- Computation: numerical PDE solvers, finite element simulations, Gillespie and Monte Carlo simulations
- Data: quantitative and statistical analysis of experimental data
- Programming: [TODO: ask me]
- Experimental exposure: zebrafish morphogenesis and regeneration, microscopy, and wet-lab work (one-month collaborative project; led the theoretical modeling)

## Step 6: Polish

- Check the site on a narrow (mobile) viewport and in dark mode.
- Set the Open Graph preview image (my photo or a research figure) so links shared on LinkedIn and Slack look good.
- Check all links and remove any leftover demo content.
- Ask me before the final commit and push, then confirm the live site at https://hannohennighausen.github.io updated.
