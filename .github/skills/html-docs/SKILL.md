---
name: html-docs
description: Use whenever you write, update, or restructure ANY project documentation (design docs, specs, notes, decisions, reviews, READMEs, reference material). Documentation in this repo is a static HTML website under docs/ - never Markdown.
---

# HTML documentation

All documentation in this repo is a **zero-build static website** in `docs/`. HTML is the single source of truth. Do not create `.md` documentation (the root `README.md` is only a short pointer to `docs/index.html`). If the user asks you to "document", "write up", "spec", "note", or "review" something, the output is an HTML page in `docs/`.

The site is read by humans in a browser and by agents parsing raw files, so every page must be:
- readable as raw HTML (no content injected by JS, no `fetch()`, no external CDN, no build step, works from `file://`)
- semantic and structured (facts are easy to extract without rendering)
- linked to the other documents it relates to

## Layout

```
docs/
  index.html            hub: overview, status table, document cards, open work
  <slug>.html           one page per document (kebab-case, no RTS_ prefix)
  assets/css/site.css   shared theme. All colours live in :root custom properties
  assets/js/site.js     progressive enhancement only (theme toggle, TOC scroll-spy,
                        collapsible h2 sections, sortable/filterable tables)
  assets/img/           images used by pages
```

Do not add per-page CSS/JS files for shared behaviour; extend `site.css` / `site.js`. Interactive widgets for one page may live in `assets/js/<slug>.js` and be loaded with `defer` from that page only. They must not be required to read the page's facts.

## Creating or editing a page

1. Copy [template.html](./template.html) to `docs/<slug>.html` and fill it in.
2. **Register the page everywhere it must appear** (static HTML, so repeat by hand):
   - the `<nav class="site-nav">` block in **every** page in `docs/` (put it in the right group: Design, Systems, Technical, Process, Art)
   - a card in the "Documents" section of `docs/index.html` and a row in its "Documentation Status" table
   - if the nav changes, update it in all pages; verify with the link check below
3. Page structure:
   - exactly one `<h1>`; each major topic is a `<section aria-labelledby="ID">` whose `<h2 id="ID">` ends with `<a class="anchor" href="#ID" aria-label="Link to this section">#</a>`; use `<h3>`/`<h4>` for sub-topics (also with `id` + anchor)
   - fill the "On this page" TOC (`<nav class="toc">`) to mirror the h2/h3 headings
   - the `doc-meta` bar shows status: `<span class="badge" data-status="KEY">Label</span>`. Keys: `locked`, `documented`, `baseline`, `placeholder`, `direction`, `draft`, `review`
4. Preserve existing wording and rules when restructuring; change content only when asked.

## Machine-readable data

Each page carries two script blocks in `<head>`:
- `application/ld+json` (`TechArticle`): headline, description, `isPartOf`, `citation` (hrefs of referenced pages)
- `application/json` with `id="doc-data"`: `slug`, `title`, `group`, `status {key,label}`, `references`, `referencedBy`, `constants`, `sections`

Keep them in sync with the page when you change it. Additionally:
- **Constants and tunables** appear in prose as `<code data-constant="name" data-value="value">name = value</code>` and are mirrored in `doc-data.constants`. A constant is defined in exactly one document; other documents link to it instead of restating it.
- **Tables** use `<thead>`/`<tbody>`, `<th scope="col">`, one fact per cell, wrapped in `<div class="table-wrap">`. Prefer a table over prose for anything comparing items (factions, units, costs, tiers).
- **Formulas**: `<p class="formula" data-formula="name"><var>x</var> = ...</p>` with plain HTML/entities (no TeX).
- Use semantic elements (`dl` for term/definition, `ol` for ordered steps, `figure`/`figcaption`, `abbr`, `time`).

## Linking documents

- Link with relative `href="other-page.html#section-id"` the first time a page mentions another document or a rule defined elsewhere. Link text is the document or section title, or the filename for code-style mentions.
- Every page ends with the `<aside class="doc-links">` block: "This document references" and "Referenced by". When you add or remove a link between pages, update both pages' blocks and their `doc-data` `references`/`referencedBy`.
- Never link to `.md` files or external CDNs. External links are allowed only for citations and must say where they go.

## Visual meaning

- **Images**: `<figure><img src="assets/img/NAME" alt="meaningful description" width=".." loading="lazy"><figcaption>...</figcaption></figure>`. Always write alt text that states what the image shows and why it matters.
- **Diagrams**: hand-written inline `<svg class="diagram" viewBox=".." role="img" aria-labelledby="t d">` with `<title>`/`<desc>` and real text labels, so agents can read nodes and edges. Colour with CSS variables (`var(--accent)`, `var(--ok)`, ...) via `fill`/`stroke` in a `style` attribute, never hard-coded hex, so themes and dark mode work. No Mermaid, no images of text.
- **Identity**: use the shared classes (`badge`, `card`, `doc-meta`, `formula`, `placeholder-box`). Add new shared styles to `site.css` using the existing variables. The art-direction page (`art-direction.html`) is the authority on visual identity once written.
- **Dynamic content**: use JS only to enhance (calculators, graph explorers, filters). The static HTML must still convey the facts when JS is off; label widgets with their inputs and the document that defines the rules they mirror.

## Accessibility and quality bar

- `lang="en"`, viewport meta, skip link, keyboard-operable controls, sufficient contrast in light and dark.
- No dead links, no duplicate ids, balanced tags.

## Verification (run after any docs change)

From the repo root:

```sh
python3 - <<'PY'
import re, glob, os
ids = {f: set(re.findall(r'id="([^"]+)"', open(f).read())) for f in glob.glob('docs/*.html')}
for f in glob.glob('docs/*.html'):
    s = open(f).read(); d = os.path.dirname(f)
    for p, fr in re.findall(r'(?:href|src)="([^"#:]*)(?:#([^"]*))?"', s):
        t = os.path.join(d, p) if p else f
        if p and not os.path.exists(t): print(f, 'missing', p)
        elif fr and t.endswith('.html') and fr not in ids.get(t, ()): print(f, 'bad anchor', p, fr)
PY
```

Then open the page in a browser (or Playwright), confirm there are no console errors, and check light and dark themes.
