# gustavo-oliveira7.github.io

Personal site of a backend engineer: a project register pulled live from the GitHub API, and
long-form writing about Java and Go. Built with [Astro](https://astro.build), published to GitHub
Pages.

**Live:** https://gustavo-oliveira7.github.io

---

## Running it locally

Requires **Node 22+**. The `.nvmrc` file pins the right version.

```bash
nvm use          # switches to Node 22
npm install      # first time only
npm run dev      # http://localhost:4321
```

| Command | What it does |
| --- | --- |
| `npm run dev` | Local server with hot reload |
| `npm run build` | Generates the site into `dist/` |
| `npm run preview` | Serves `dist/` to check before publishing |
| `npm run check` | Type-checks every page and component |

---

## Publishing a piece

1. Add a `.md` file under `src/content/writing/`.
   The filename becomes the URL — `caching-in-go.md` → `/writing/caching-in-go`.

2. Start it with frontmatter:

```markdown
---
title: "Title of the piece"
summary: "One or two sentences. Shown in listings and link previews. Plain text — no markdown."
date: 2026-09-01
tags: ["Go", "Performance"]
draft: false
---

Body in Markdown. Code blocks are highlighted with a theme derived from
the site's own palette, so they match the panels on the home page.
```

3. Commit and push. **The site republishes itself in about a minute.**

```bash
git add . && git commit -m "writing: caching in go" && git push
```

Set `draft: true` to keep a piece in the repository but off the published site.

---

## How the GitHub data stays current

Repositories are never hand-written anywhere. Three layers keep them fresh:

| Layer | Runs | Updates |
| --- | --- | --- |
| **Build** | On every push | Everything: new repos, descriptions, languages, counts |
| **Scheduled Action** | Every 6 hours | Rebuilds and republishes with no input from you |
| **Browser** | When someone opens `/work` | Stars, forks and last-push dates, live |

A new repository therefore appears within six hours, unattended. To publish one immediately:

```bash
gh workflow run deploy.yml
```

Change the `cron` in [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) to adjust the
frequency.

---

## About LinkedIn

**There is no automatic way to pull data from LinkedIn.** Their public API for personal profiles
was retired, and scraping the site breaks the Terms of Service — the practical risk is your account
being restricted. Any service promising otherwise is scraping on your behalf.

So the site does two things instead:

- **Links** the profile from the rail, from the home page and from every piece;
- **Mirrors** your experience in [`src/data/experience.ts`](src/data/experience.ts), kept by hand.

Update LinkedIn, update that file, push. Empty arrays hide their section, which is better than
publishing placeholder text.

Every piece also carries a **Share on LinkedIn** button — that is the loop that actually brings
readers: publish here, post there.

---

## What to edit, and where

| To change | File |
| --- | --- |
| Name, role, headline, intro copy, links | [`src/site.config.ts`](src/site.config.ts) |
| Which repositories are featured | `featuredProjects` in the same file |
| Hide a repository from the site | `hiddenProjects` in the same file |
| The toolkit table | `toolkit` in the same file |
| Experience, education, certifications | [`src/data/experience.ts`](src/data/experience.ts) |
| Colours, type, spacing | the `:root` block in [`src/styles/global.css`](src/styles/global.css) |
| Code highlighting colours | [`astro.config.mjs`](astro.config.mjs) |
| The Java/Go panels on the home page | [`src/components/SplitSignature.astro`](src/components/SplitSignature.astro) |

---

## Design notes

The direction is technical documentation rather than a marketing page, and three rules keep it
coherent. Breaking them is what makes this kind of layout drift back into a template.

1. **Martian Mono never sets a sentence.** It is the display voice — names, section headings,
   labels. Reading text is always Literata; data and code are always IBM Plex Mono.
2. **Colour is information.** Cobalt marks what is interactive. The Java and Go swatches encode
   language and nothing else. There is no decorative colour.
3. **Structure comes from rules and space, not cards.** No shadows, corners stay at 2px, and
   repositories are grouped by language because that is true about the code — not numbered, which
   would imply a sequence that does not exist.

The signature element is the pair of panels on the home page: one operation written the way each
language insists on writing it. That is the only place the design raises its voice.

---

## Structure

```
src/
├── site.config.ts             # single source of personal config and copy
├── content/writing/           # the pieces, in Markdown
├── data/experience.ts         # experience (the LinkedIn mirror)
├── lib/
│   ├── github.ts              # GitHub API integration and grouping
│   └── text.ts                # reading time, dates, language colours
├── layouts/Base.astro         # head, SEO, theme, page frame
├── components/
│   ├── Rail.astro             # fixed left rail: identity and navigation
│   ├── SplitSignature.astro   # the Java/Go panels
│   ├── ProjectEntry.astro     # one repository row
│   ├── WritingEntry.astro     # one piece row
│   └── Icon.astro
├── pages/
│   ├── index.astro            # home
│   ├── work.astro             # repositories, grouped by language
│   ├── writing/               # index and individual pieces
│   ├── about.astro
│   ├── rss.xml.ts
│   └── 404.astro
└── styles/global.css          # design tokens and shared components
```

---

## Custom domain (optional)

1. Create `public/CNAME` containing the domain, e.g. `gustavooliveira.dev`.
2. Update `site` in [`astro.config.mjs`](astro.config.mjs).
3. Point the domain's DNS at GitHub Pages and set it under **Settings → Pages**.
