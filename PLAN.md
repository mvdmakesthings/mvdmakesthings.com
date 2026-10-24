# mvdmakesthings.com — build plan

Brief for the agent that builds this site. Everything under "Locked decisions" was
settled with Michael and is not up for redesign. Everything under "Open items" needs
his input; build around it with clearly marked placeholders and ask at the end, not
at the start.

## 1. Who and what

- Person: **Michael VanDyke** (one word, no space in VanDyke; never "Van Dyke").
  Brand and handle: **MVD** / **mvdmakesthings**. Louisville, Kentucky.
- Self-description (from his GitHub profile README, usable as bio copy in first person):
  software engineering leader, visual artist, lifelong maker. Leads distributed
  engineering teams through modernization work (old systems into the cloud,
  observability, data-driven decisions). Stays close to the code: Swift/iOS, Python,
  TypeScript, traditional AI/ML, AWS. "As a kid, I used to take apart remote controls
  just to see the circuits, and pull pans out of the cabinets to play them like an
  instrument; not much has changed." Woodworking, electronics on the bench,
  painting, sculpture, interactive pieces. "The overlap between engineering and the
  creative arts is where I'm most at home."
- Links: GitHub `https://github.com/mvdmakesthings`, Instagram `@MVDMakesThings`,
  LinkedIn `https://www.linkedin.com/in/mjvandyke/`, itch.io
  `https://mvdmakesthings.itch.io/`.
- Bio photo: `assets/bio-photo.jpg` (1569×2000 portrait JPEG). Michael smiling in a
  restaurant at night: tan cap, round glasses, beard, black shirt with copper floral
  print, light gray blazer, warm bokeh with a few teal lights. Use it uncropped in the
  bio; a square crop centered on the face for the avatar and OG image.
- Audience: **hub first, hireable second.** The home page is a maker's hub (software,
  games, art side by side, in his voice). A clear path exists for someone who arrived
  to hire him: the resume page and a "Work with me" link in header and footer.

## 2. Locked decisions

| Decision | Choice |
|---|---|
| Framework | Astro, latest stable (check `npm view astro version`), static output, pnpm, Node 24 |
| Styling | Plain CSS with custom properties. No Tailwind, no component library |
| Interactivity | Vanilla TypeScript in Astro `<script>` tags and inline SVG. No Three.js, no GSAP, no framework islands unless a piece genuinely needs state (then Preact, one island) |
| Sections (v1) | Home, Projects, Writing (blog), Art (gallery), Resume, 404 |
| Projects | Hybrid: curated featured list in a data file, plus a "more on GitHub" list fetched at build time |
| Writing | MDX content collection, RSS feed |
| Art | Images in the repo plus one data file (title, medium, year, caption); grid and lightbox |
| Resume | Rendered from one data file, with a print stylesheet; a local script produces `public/resume.pdf` |
| Theme | Light and dark, follows system, user toggle persisted in localStorage |
| Hosting | Vercel, new project `mvdmakesthings` in team `mvd-makes-things`; `mvdmakesthings.com` apex, `www` redirects to apex; Vercel Web Analytics on |
| Repo | New public GitHub repo `mvdmakesthings/mvdmakesthings.com`, initialized from this folder |
| Design direction | Interactive and distinctive. The concept in section 4, not a template |

Existing infrastructure, verified on 2026-10-24: DNS for `mvdmakesthings.com` is on
Vercel nameservers (`ns1/ns2.vercel-dns.com`) in team `mvd-makes-things`. The apex
currently serves nothing. `groundwerk.mvdmakesthings.com` (Vercel project `stratus`)
and `planepoultrypanic.mvdmakesthings.com` (Vercel project `plane-poultry-panic`) are
live and must not be touched.

## 3. Research: what makes the memorable developer sites memorable

Looked at directly or read about during planning. Borrow the lesson, not the mechanic.

| Site | What the visitor does or sees | Lesson for us |
|---|---|---|
| bruno-simon.com | Drives a 3D car between projects (Three.js). Awwwards Site of the Year 2020, 400k+ visits | One playful mechanic can be the whole identity. Too heavy for this site; also gates content behind a loading screen |
| lynnandtonic.com | Redesigned yearly. Earlier versions changed layout every ~100px of width; widening the window cracked illustrations open to reveal more. Current version is a sparse typographic index | The browser itself (resize) as an input is cheap and delightful. Restraint reads as confidence |
| joshwcomeau.com | Opens on an animated rainbow of dashed arcs over a night skyline; articles contain live widgets that explain the idea | Interactivity that serves understanding; playful without 3D |
| henryheffernan.com | "Click START to begin," then a 3D CRT running a simulated 90s desktop OS | Total commitment to a metaphor. Cost: a gate before any content, bad for the hireable path |
| diana-adrianne.com | Portraits painted entirely in CSS; the page is a dark canvas until the art renders | Artist and engineer overlap made literal. The medium is the message |
| meesverberne.com | Pixelated background shifts with the pointer; the logo is an animated bird | Pointer-driven ambient motion, one signature mark |
| rleonardi.com/interactive-resume | A side-scrolling platformer you walk through to read his resume | Gamifying the resume is charming and risky for recruiters. Keep play in the hero; keep the resume conventional |
| Others cited in roundups | Andrew McCarthy (project names scramble into place on scroll), JReyes (Minecraft-style scroll journey), WoraWork (Zelda-style world), Robby Leonardi above | Scroll-as-journey is now common; cursor effects on every element read as template |

Synthesis: the sites people remember commit to one idea drawn from who the person
is, make the browser an instrument the visitor plays, and keep everything around
that idea quiet. They do not sprinkle hover effects everywhere.

## 4. Design concept: the teardown

The memorable thing: **the home page hero is an exploded-view drawing of a remote
control that the visitor takes apart.** It comes straight from Michael's own story
(taking apart remote controls to see the circuits) and from the vernacular of makers:
patent drawings, iFixit teardowns, exploded assembly diagrams in tool catalogs.

Headline beside it, in first person:

> I take things apart to see how they work.
> Then I make new ones.

Subline: "Michael VanDyke. Engineering leader, artist, and lifelong maker in
Louisville, Kentucky." Two links: "See what I've made" (Projects) and "Work with me"
(Resume). No arrow glyphs in link text.

How the hero works:

- The remote is one inline SVG, drawn by the agent, with a `<g>` per part stacked
  along the explode axis: top shell, rubber keypad, circuit board (with a small IR
  LED at the tip), batteries and contacts, bottom shell, battery door. Flat, two-tone
  line drawing in ink with copper and teal fills on the board. It should look like an
  engineering drawing, not a product render.
- One number drives everything: a CSS custom property `--explode` from 0 (assembled)
  to 1 (fully apart). Each part's transform is `translateY(calc(var(--explode) * <its offset>))`
  plus a slight rotation so the spread reads as 3D. A ~20-line script sets the
  variable from the pointer's position inside the hero on desktop and from scroll
  progress on touch devices. Resizing the window also nudges it (a nod to Lynn
  Fisher).
- Callouts with leader lines label the real parts honestly ("Rubber keypad",
  "IR LED", "Two AA batteries"). Labels fade in as the parts separate. They are
  information, not navigation; the header carries navigation.
- One answer-to-action detail: pressing the remote's power button toggles light/dark
  mode, and the IR LED blinks once in red as feedback. The header has an ordinary
  theme toggle too; the remote is the fun duplicate.
- On page load the remote assembles from exploded to together over ~900ms, once.
  That is the site's single orchestrated motion. Nothing else animates on load.
- `prefers-reduced-motion`: render statically at `--explode: 0.6` with callouts
  visible; the power button still toggles theme, without the blink.
- Reserve the hero's box size so there is no layout shift. Target under 30 KB for the
  SVG; simplify the drawing before adding detail.

Fallback if the remote proves too hard to draw convincingly: the same exploded
mechanic applied to the MVD monogram as three machined blocks with pins and a base
plate. Keep the copy identical.

Everything after the hero is a well-set catalog page. Spend the boldness once.

### Design tokens

Color is pulled from the bio photo. Deliberately not the cream-and-terracotta or
black-and-acid-green pairings that every generated portfolio has right now.

| Token | Light | Dark | Source and use |
|---|---|---|---|
| `--paper` | `#FBFBF9` | `#1B1814` | Vellum white; warm charcoal (the shop at night). Page background |
| `--ink` | `#000000` | `#EDE9E2` | True black, like the drawing pen. Text and line work |
| `--pencil` | `#6B665E` | `#9A9389` | Secondary text, rules, leader lines |
| `--copper` | `#A85A1C` | `#D8873F` | The shirt's floral print. Links, the active state, the remote's board |
| `--teal` | `#166A72` | `#4FB3BA` | The bokeh lights. The second accent for engineering and data, used less than copper |
| `--kraft` | `#E9DCC4` | `#2A2420` | The cap. Surface tint for spec sheets and the resume's sidebar only |

Check every text/background pair for WCAG AA. The copper on dark paper needs the
lighter value given above.

Type, self-hosted through Fontsource (verify exact package names; both are variable
fonts on Google Fonts if Fontsource lacks them):

- Display: **Big Shoulders Display**, weights 700 to 900. Condensed, industrial,
  Chicago-signage lineage. Used for the wordmark, page titles, the hero headline,
  project names. Set tight (`letter-spacing: -0.01em`), large.
- Body: **Newsreader**, optical size on, weight 400 and 500 with true italics.
  Serif body under a condensed display is the old tool-catalog pairing. Body at 18px,
  line-height 1.55, measure 65ch.
- Code in posts: **JetBrains Mono** or the system mono stack. Monospace is for code
  only, never for labels or metadata.
- Scale (1.25 ratio from 18px): 18, 22.5, 28, 35, 44, 55, 69. Hero headline fluid:
  `clamp(2.75rem, 7vw, 6.5rem)`.

Layout:

- Left-aligned throughout. Content column max 72rem, a 12-column grid at desktop,
  16px gutters at phone width, no horizontal scroll at 360px.
- The page is a drawing sheet. A thin ink border frames the content area at desktop
  widths, and the footer is a **title block** in the sheet's corner, the kind on
  engineering drawings, with real metadata: site name, "Michael VanDyke, Louisville",
  "Built with Astro", last build date, "Source on GitHub". It encodes information;
  it is not decoration.
- Structure devices: hairline rules between catalog entries, callout leader lines in
  the hero, a kraft-tinted panel for a spec sheet. No rounded cards with drop shadows,
  no eyebrow labels in caps, no "01 / 02 / 03" markers (nothing on the site is a
  numbered sequence except the resume timeline, where dates already do that job).
- Images get a 2px radius; containers get none.

Home page wireframe (desktop):

```
┌──────────────────────────────────────────────────────────────────┐
│ MVD                               Projects  Writing  Art  Resume ◐ │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  I take things apart               ┌───────────────────────┐     │
│  to see how they work.             │  exploded remote      │     │
│  Then I make new ones.             │  (parts spread along  │     │
│                                    │   the y axis as the   │     │
│  Michael VanDyke. Engineering      │   pointer moves;      │     │
│  leader, artist, and lifelong      │   callouts label      │     │
│  maker in Louisville, Kentucky.    │   the real parts)     │     │
│                                    └───────────────────────┘     │
│  See what I've made   Work with me                               │
├──────────────────────────────────────────────────────────────────┤
│ Things I've made                                                 │
│ ──────────────────────────────────────────────────────────────── │
│ [thumb]  Groundwerk            AI strategy tools for founders    │
│          Python, FastAPI, React             Live   Source        │
│ ──────────────────────────────────────────────────────────────── │
│ [thumb]  Plane Poultry Panic   16-bit airport escape game        │
│          Godot                       Play   itch.io   Source     │
│ ──────────────────────────────────────────────────────────────── │
│ ... (6 to 8 featured)                 More on GitHub (feed)      │
├──────────────────────────────┬───────────────────────────────────┤
│ Writing (latest 3 posts)     │ Art (3 pieces, link to gallery)   │
├──────────────────────────────┴───────────────────────────────────┤
│ [photo]  Bio paragraphs in first person. Links row.              │
├──────────────────────────────────────────────────────────────────┤
│ title block: mvdmakesthings.com │ Michael VanDyke, Louisville │  │
│ Built with Astro │ Rev 2026-10-24 │ Source on GitHub              │
└──────────────────────────────────────────────────────────────────┘
```

Mobile: single column. Hero text first, then the remote, which explodes as the
visitor scrolls past it. Header collapses to wordmark, a menu button, and the theme
toggle.

Second-level interactions, all answering a visitor's action:

- Project entries expand on click or tap (not hover alone) to show a short "spec
  sheet": why he built it, what he learned, status, stack. Optional per entry.
- Gallery lightbox with keyboard arrows, Escape, focus trap, swipe on touch.
- Resume page "Save as PDF" button calls `window.print()`; the print stylesheet makes
  it a clean one- or two-page document.
- View transitions via Astro's `ClientRouter`: header persists, page content
  cross-fades, the wordmark keeps its place. Keep durations under 250ms.

Copy voice: Michael's README voice. First person, plain verbs, sentence case, a
little wry, never salesy. Buttons say what happens ("Save as PDF", "Play in your
browser"). Empty states say what to do ("No posts yet. The first one is on its
way.").

### Review against the generic default

Before building, the agent re-reads this section and the tokens above and asks: if
the brief were "portfolio for a developer," would I have landed here? The cream
background, terracotta accent, rounded card grid, caps eyebrows, scramble-text,
and cursor trails were all considered and rejected for the reasons given. If any
piece of the build drifts back to those, fix the drift.

## 5. Content model

All content lives in files Michael can edit without touching components.

```
src/
  data/
    site.ts            name, handles, links, nav, description
    projects.yaml      featured projects (see schema)
    resume.yaml        roles, education, skills, talks (placeholders in v1)
    github.json        generated by scripts/fetch-github.ts; committed as a cache
    github-exclude.ts  repo names to hide from the feed
  content/
    writing/*.mdx      posts: title, description, pubDate, updatedDate?, tags, draft
    art/*.yaml         one file per piece: title, medium, year, dimensions?, caption, image
public/
  art/                 gallery images (Michael adds; v1 ships with 3 clearly marked placeholders)
  resume.pdf           produced by pnpm resume:pdf, committed
assets/
  bio-photo.jpg        provided
```

`projects.yaml` entry schema:

```yaml
- slug: groundwerk
  title: Groundwerk
  summary: AI strategy tools for founders. Each one interviews you, pushes back on thin answers, and writes a document that has passed its own quality gates.
  stack: [Python, FastAPI, LangGraph, React, Postgres]
  status: active            # active | playtest | archived | client
  links:
    live: https://groundwerk.mvdmakesthings.com
    source: https://github.com/mvdmakesthings/groundwerk
  image: groundwerk.png     # optional; in src/assets/projects/
  spec: |                   # optional expanded text
    ...
```

Featured projects for v1, in this order, blurbs drafted from the repos and to be
tightened by Michael:

1. **Groundwerk** — AI strategy tools for founders (brand strategy, business model).
   Live. Python/FastAPI backend, React frontend, Vercel.
2. **Plane Poultry Panic** — 16-bit action game: escape a chicken-overrun airport and
   catch the last flight. Godot/GDScript. Play in browser, itch.io, source.
3. **Ephemeris** — Swift framework for satellite tracking and orbital mechanics; parses
   TLE data, computes positions. Library and teaching tool.
4. **Mercator** — Tree-sitter AST toolkit that turns source repositories into code
   quality metrics and structure maps. Python.
5. **Compass** — strategic rhythm tool for engineering leadership. TypeScript.
6. **CoopCam** — two-device embedded bird camera: on-device ML classification, ESP-NOW
   link to a touchscreen display, no router.
7. **Moler Mosaic** — print large-scale artwork on a standard office printer. Live on
   GitHub Pages. The art-and-code overlap, literally.
8. **Skills** — curated Claude Code plugins that add structured workflows to AI
   sessions.

Optional ninth, status `client`: **The Refinery Hair Lounge** (custom WordPress site
with a stylist management system). Include only if Michael says yes.

GitHub feed: `scripts/fetch-github.ts` runs in `prebuild`. It fetches
`https://api.github.com/users/mvdmakesthings/repos?per_page=100&type=owner&sort=pushed`
(uses `GITHUB_TOKEN` if set, works without it), drops forks and anything in the
exclude list, keeps name, description, homepage, language, pushedAt, stars, archived,
and writes `src/data/github.json`. On any fetch failure it keeps the committed file
and prints a warning; the build never fails because of GitHub. Featured projects are
removed from the feed so nothing appears twice. Archived repos (2015 to 2018: breathe,
mirror-magic, iot_easy_button, kwadcat, sumobot, soundsoflouisville) show under a
collapsed "Earlier" group rather than being hidden. Exclude list to start: testbed,
enterprise-standards, mcp-enterprise-standards, mcp-enterprise-standards-v2,
time-tracking, compass_os, refinery-content-creator, RefineryHairLounge,
engineering-strategy, mvdmakesthings (the profile README repo), PlanePoultryPanic
(the game's source; the featured entry already links it).

Project thumbnails: for projects with a live URL, capture a 1200×750 screenshot with
Playwright during development and commit it to `src/assets/projects/`. For the rest,
render a typographic cover (project name in Big Shoulders on kraft, with the primary
language in copper) as a component, not an image.

Writing v1: the agent writes one real post, a colophon: "How this site is built"
(the teardown idea, the stack, the content files, what to steal). It can write that
truthfully. Nothing else is invented. If Michael has existing writing, it goes in
later.

Art v1: three placeholder entries with generated SVG placeholders in `public/art/`,
each file named `PLACEHOLDER-*.svg` so they are easy to find and replace. The
gallery page shows a short note linking to Instagram until real pieces are in.

Resume v1: `resume.yaml` is scaffolded with the structure and with placeholder values
marked `TODO`. Known facts can be filled in: name, title ("Technology strategist.
People-first leader." from his GitHub bio), Louisville, LinkedIn URL. The agent does
not invent employers, dates, or accomplishments. The page renders whatever is there,
so Michael fills the file and the page is done. Because the repo is public, the
resume contains nothing he would not put on LinkedIn.

## 6. Milestones

Work in this order. Each milestone ends in a commit (or a few) that builds and deploys.

**M0. Scaffold and pipeline.** `pnpm create astro@latest` (minimal template,
TypeScript strict) in this folder; add `@astrojs/mdx`, `@astrojs/sitemap`,
`@astrojs/rss`, `@vercel/analytics`; `git init`; `gh repo create
mvdmakesthings/mvdmakesthings.com --public --source . --push`; create the Vercel
project `mvdmakesthings` in team `mvd-makes-things` connected to the repo; add domains
`mvdmakesthings.com` and `www.mvdmakesthings.com` (www redirecting to apex). Done
when a placeholder page is live at https://mvdmakesthings.com with a valid
certificate. Report the domain step explicitly; it is the one outward-facing change.

**M1. Shell.** Tokens, fonts, base styles, header, footer title block, theme toggle
with no flash on load, 404 page, `ClientRouter`. Done when every route has the shell
and Lighthouse accessibility is 100 on the empty pages.

**M2. Hero teardown.** The SVG remote, the explode mechanic, callouts, power-button
theme toggle, load-in assembly, reduced-motion path, mobile scroll-driven variant.
Done when it works with pointer, touch, keyboard (the power button is a real button),
and reduced motion, with no layout shift. Take screenshots at 360, 768, 1280 and look
at them critically before moving on.

**M3. Projects.** `projects.yaml`, the GitHub feed script, the catalog list on home
and the full Projects page, expandable spec sheets, screenshots for live projects,
typographic covers for the rest.

**M4. Writing.** MDX collection, list page, post layout with good code blocks and
image handling, RSS, the colophon post.

**M5. Art.** Collection, gallery grid (CSS columns or grid, no JS masonry library),
lightbox, placeholders.

**M6. Resume.** `resume.yaml`, the page, print stylesheet, `pnpm resume:pdf` (a local
Playwright script that prints `/resume/` to `public/resume.pdf`, US Letter), download
link. Not run on Vercel.

**M7. Finish.** OG image per page (a static one from the square crop is enough for
v1), JSON-LD Person on home, sitemap and robots, `README.md` with "how to add a
project / post / art piece / resume entry", Playwright smoke tests (home renders, nav
works, theme toggle persists, lightbox keyboard nav, 404) with an axe accessibility
check, Lighthouse 95+ on performance, 100 on accessibility, at phone and desktop.

## 7. Acceptance criteria

- https://mvdmakesthings.com loads the finished home page; `www` redirects to apex.
- Groundwerk and Plane Poultry Panic subdomains are untouched and still live.
- The hero teardown works with pointer, touch, keyboard, resize, and reduced motion.
- Theme follows system, toggles from header and from the remote's power button,
  persists, and does not flash on load.
- Projects: 8 featured entries with correct links; GitHub feed renders from the
  committed JSON even when the API is unreachable.
- Writing: the colophon post renders, RSS validates.
- Art: gallery and lightbox work with placeholder entries; replacing a placeholder
  file and its YAML entry is the only step to add a real piece.
- Resume: renders from `resume.yaml`; print output is clean; `pnpm resume:pdf`
  produces the PDF locally.
- No horizontal scroll at 360px; visible focus everywhere; AA contrast in both themes.
- Lighthouse: performance 95+, accessibility 100, best practices 95+, SEO 100.
- `pnpm build` and the Playwright tests pass; the README explains every content
  workflow.
- Commits are small, logical, and independently deployable. Commit messages follow
  conventional best practices and do not mention Claude or Anthropic as co-authors.

## 8. Open items for Michael

Build around these; ask at the end.

1. Contact email to show on the site, if any (a `mailto` link in the bio and footer).
2. Confirm or reorder the featured eight; yes or no on the Refinery Hair Lounge entry.
3. Fill `resume.yaml`.
4. Drop real art images into `public/art/` and describe them in `src/content/art/`.
5. Whether the blog nav item should be hidden until there is a second post.

## 9. Guardrails for the agent

- Do not add Tailwind, a UI kit, Three.js, GSAP, Lenis, or a cursor library.
- Do not add motion to things the visitor did not touch, beyond the single load-in.
- Do not invent biography, employers, or art. Placeholders are marked `TODO` or
  `PLACEHOLDER`.
- Do not touch the `stratus` or `plane-poultry-panic` Vercel projects or their domains.
- Keep dependencies few; prefer the platform (View Transitions API, `<dialog>` for the
  lightbox, CSS scroll-driven animations where supported with a JS fallback).
- Verify Astro and integration APIs against the installed package docs, not memory.
- Screenshot your own work at three widths after each visual milestone and critique
  it: remove one thing before moving on.

## Sources consulted during planning

- https://bruno-simon.com and https://www.creativebloq.com/news/3d-car-portfolio
- https://lynnandtonic.com, https://lynnandtonic.com/thoughts/entries/case-study-2017-refresh/, https://lynnandtonic.com/thoughts/entries/case-study-2018-refresh
- https://www.joshwcomeau.com
- https://henryheffernan.com
- https://diana-adrianne.com
- https://meesverberne.com
- http://www.rleonardi.com/interactive-resume/
- https://reallygooddesigns.com/developer-portfolio-examples/
- https://muz.li/blog/top-100-most-creative-and-unique-portfolio-websites-of-2025/
- https://colorlib.com/wp/developer-portfolios/
- https://www.awwwards.com/inspiration_search/winner_category_portfolio/
