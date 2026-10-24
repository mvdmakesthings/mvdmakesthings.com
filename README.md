# mvdmakesthings.com

Source for [mvdmakesthings.com](https://mvdmakesthings.com), Michael VanDyke's maker hub:
projects, writing, art, and a resume. The home page opens on an exploded-view drawing of a
TV remote that you take apart with your pointer (or by scrolling on a phone). Its power
button switches the theme.

Static [Astro](https://astro.build) site, plain CSS, a little vanilla TypeScript, hosted on
Vercel. [How this site is built](https://mvdmakesthings.com/writing/how-this-site-is-built/)
explains the design; `PLAN.md` is the original brief.

## Commands

Needs Node 24 and pnpm (`corepack enable` picks up the pinned version).

| Command | What it does |
|---|---|
| `pnpm install` | Install dependencies |
| `pnpm dev` | Local dev server at http://localhost:4321 (drafts and resume TODOs visible) |
| `pnpm build` | Build the site into `dist/` |
| `pnpm preview` | Serve the built site |
| `pnpm test` | Build, then run the Playwright smoke and accessibility tests |
| `pnpm resume:pdf` | Build, then print `/resume/` to `public/resume.pdf` |
| `pnpm thumbnails` | Re-capture project screenshots from their live sites |

The first `pnpm test` or `pnpm resume:pdf` may need a browser: `pnpm exec playwright install chromium`.

## Publishing

Push to `main`. Vercel (project `mvdmakesthings`, team `mvd-makes-things`) builds and
deploys it to https://mvdmakesthings.com; `www` redirects to the apex. Every other branch
gets a preview URL.

## Content workflows

Everything you'd normally change lives in a data file. No components need touching.

### Add or change a project

Edit `src/data/projects.yaml`. Only the projects listed there appear on the site, in file
order, on the home page and on `/projects/`. Both pages link to the GitHub profile for
everything else; nothing is pulled from GitHub automatically.

```yaml
- slug: my-thing               # unique, lowercase
  title: My Thing
  summary: One or two sentences.
  stack: [Python, ESP32]
  status: active               # active | playtest | archived | client
  links:                       # any of: live, play, itch, source
    live: https://example.com
    source: https://github.com/mvdmakesthings/my-thing
  image: my-thing.png          # optional, in src/assets/projects/
  spec: |                      # optional; shown when the entry is expanded
    Why I built it and what I learned. Blank lines start new paragraphs.
```

- **Thumbnail:** for a project with a live or play link, set `image:` to a new filename and
  run `pnpm thumbnails my-thing` to screenshot it at 1200×750. Or drop any 16:10 image into
  `src/assets/projects/`. Without an `image`, the entry gets a typographic cover.
- **Private repos:** leave out `source`, since visitors would get a 404.

### Write a post

Add an `.mdx` (or `.md`) file to `src/content/writing/`. The filename becomes the URL:
`src/content/writing/shop-notes.mdx` publishes at `/writing/shop-notes/`.

```mdx
---
title: Shop notes
description: One sentence for the list, RSS, and link previews.
pubDate: 2026-11-01
updatedDate: 2026-11-03   # optional
tags: [woodworking]
draft: true               # optional; drafts show only in pnpm dev
---

Write here. Fenced code blocks are highlighted. For images, put the file next to the
post and write ![Alt text](./photo.jpg) so it gets resized.
```

Posts show up on `/writing/`, in the latest three on the home page, and in `/rss.xml`.

### Add an art piece

Each piece is one YAML file in `src/content/art/`, with its images beside it.

1. Put a still in `src/content/art/`, for example `river-study.jpg`. Any size works; the
   build makes resized copies. Gallery cards crop to 4:5; the lightbox shows the whole image.
2. Add `src/content/art/river-study.yaml`:

   ```yaml
   title: River study
   medium: Acrylic on panel
   year: 2025                  # optional
   dimensions: 24 × 30 in      # optional
   caption: A sentence or two about the piece.
   image: ./river-study.jpg
   alt: What the image shows, for people who can't see it.   # optional; defaults to the caption
   order: 1                    # optional; lower numbers first, then newest year
   ```

**Video and audio.** Add a `media` list to show Instagram reels or SoundCloud in the
lightbox. The visitor sees a still and a Play button; the provider's player loads only
after they press it, so Instagram and SoundCloud see nothing from a visit until then.

```yaml
media:
  - kind: instagram            # instagram | soundcloud
    url: https://www.instagram.com/reel/C6mTpDxOdMq/   # share links are fine; tracking parameters are dropped
    title: Hello, Hun           # optional; names the clip when there are several
    poster: ./hello-hun-1.jpg   # optional still for this clip; defaults to the piece's image
    alt: What the still shows.  # optional
  - kind: soundcloud
    url: https://soundcloud.com/alluvium_music   # a profile, a track, or a playlist
```

A piece with several clips lists them in the lightbox so visitors can switch between
them. `hello-hun.yaml`, `moondew.yaml`, and `alluvium.yaml` are working examples.

### Update the resume

Edit `src/data/resume.yaml`. The page renders whatever is there:

- `experience`: role, company, location, start, end, summary, highlights (most recent first).
- `skills`: groups, each a list of items.
- `education` and `talks`: delete any section's entries to hide it.
- Anything still starting with `TODO` is left off the public page. Run `pnpm dev` to see
  those entries outlined in copper.

Then run `pnpm resume:pdf` and commit `public/resume.pdf`, which the "Download the PDF"
link serves. The "Save as PDF" button prints the page with its print stylesheet. The repo
is public, so put nothing in the file you wouldn't put on LinkedIn.

### Site facts, navigation, and contact email

`src/data/site.ts` holds the name, description, social links, and nav.

- **Email:** set `email: 'you@example.com'` to add a mailto link to the bio and footer.
  The resume has its own optional `email` in `resume.yaml`.
- **Hide a nav item** (for example Writing until there's a second post): remove it from
  the `nav` array. The page itself stays published.
- **Bio:** the paragraphs are in `src/components/Bio.astro`; the photo is `assets/bio-photo.jpg`.

## Where things are

```
assets/bio-photo.jpg           bio photo (the OG image and touch icon are crops of it)
public/                        favicon, og.jpg, robots.txt, resume.pdf
scripts/                       capture-thumbnails.ts, resume-pdf.ts
src/content.config.ts          schemas for projects, writing, and art
src/content/writing/           posts
src/content/art/               gallery pieces (YAML + image)
src/data/                      site.ts, projects.yaml, resume.yaml
src/components/Teardown.astro  the remote: geometry, interaction script, styles
src/lib/axo.ts                 the build-time axonometric drawing helpers
src/styles/tokens.css          colors, type scale, spacing
src/styles/global.css          base styles, code blocks, print rules
tests/smoke.spec.ts            Playwright + axe
```

## Design rules

The remote is the one bold thing; everything else is a quiet catalog. Tokens come from the
bio photo: paper, ink, pencil, copper, teal, and kraft (kraft only for spec sheets and the
resume sidebar). No rounded cards, no drop shadows, no caps eyebrows, no motion the
visitor didn't cause beyond the remote's one-time assembly. Check text contrast in both
themes; `pnpm test` runs axe on every page.
