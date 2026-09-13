# Portfolio Site — Design & Content Plan

## Concept

A single-page portfolio built around one signature moment: the visitor
lands on a full-bleed cover image, and as they start scrolling, the image
tears apart (like paper ripping) to reveal the real site underneath. Once
torn open, the layout splits into two columns for the rest of the scroll:

- **Left column (sticky):** intro block — name, one-line pitch, tech stack.
  Stays in place while the right column scrolls past it.
- **Right column (scrolling):** a vertical "carousel" of project cards —
  screenshots of your projects moving past like a top-down arcade racing
  game (think Micro Machines / top-down driving games): a continuous lane
  of cards drifting upward as the page scrolls, not a simple stacked list.

Overall motion direction from your feedback: **clean and minimal** — the
tear and the carousel are the two "hero" moments; everything else should
be understated (fades, slides, no bounce/elastic easing) so it reads as
professional to recruiters, not as a motion-design reel.

## Sitemap / Sections

1. **Cover (pre-tear)** — full-bleed hero image, minimal text (maybe just
   a "scroll" cue). This is what the visitor sees before any interaction.
2. **Reveal transition** — the tear effect itself, driven by scroll
   position (see Animation Plan below). Not really a "section," more a
   scroll-triggered transition between Cover and Main.
3. **Main (two-column)**
   - Left, sticky: "Hi, I'm Jenishai and I build businesses — not just
     apps — using AI-powered tools" (working copy, see Open Questions),
     plus a tech-stack list.
   - Right, scrolling: project carousel, one card per project with a
     screenshot, title, one-line description, and a link.
4. **Contact / footer** — email, LinkedIn/GitHub, maybe a resume download.
   Not covered by your answers yet — flagged below.

Optional sections you can add later without changing the core concept:
a dedicated Skills page/section (separate from the left intro block), a
resume download button, or a short blog/notes section for the AI
Buildcamp work.

## Animation Plan (GSAP)

**1. Tear-reveal hero**
- Layer the cover image as two halves (or a jagged-edge SVG clip-path)
  over the real Main section underneath.
- Drive the tear with `ScrollTrigger` in `scrub` mode tied to the first
  viewport of scroll: as scroll progress goes 0→1, animate a jagged
  `clip-path: polygon(...)` (or an SVG mask) so the two halves peel apart
  and slide off-screen, revealing Main underneath.
- Keep the tear itself snappy/precise rather than bouncy — matches the
  "clean, minimal" direction — but the jagged edge gives it the
  torn-paper character you described.
- Respect `prefers-reduced-motion`: fall back to a simple crossfade.

**2. Left intro block**
- `position: sticky` (or `ScrollTrigger.pin`) so it stays put while the
  right column scrolls past.
- Subtle fade/slide-in once the tear completes; no motion after that
  besides maybe a soft hover state on the tech-stack items.

**3. Right project carousel (arcade top-down effect)**
- Cards arranged in a vertical lane, moved via GSAP tied to scroll
  (either `ScrollTrigger` scrub on a transform, or `gsap.quickTo` with
  scroll velocity for a slight momentum/easing feel).
- To get the "top-down arcade" read: stagger cards with a small
  alternating horizontal offset (like lanes) and consistent card spacing,
  so the motion reads as a conveyor rather than a plain scrolling list.
  Loop/wrap the track with `gsap.utils.wrap` if you want it to feel
  endless; otherwise a bounded track tied 1:1 to page scroll is simpler
  and still reads as intended.
- Keep easing linear-ish (scrub: true, no elastic) to stay "clean and
  minimal" rather than playful/bouncy.

**4. General**
- All ScrollTrigger scrub animations, no autoplay timelines running
  independent of scroll — keeps the site calm and puts the visitor in
  control, which fits a job-search portfolio audience.
- Mobile: the two-column layout collapses to a single column; the tear
  effect can stay (it's just an image + clip-path) but the "arcade lane"
  carousel simplifies to a plain vertical scroll of cards, since the
  lane-offset effect needs horizontal room.

## Build Phases

1. **Content collection** — real project list + screenshots, finalized
   bio copy, tech stack list, contact links (see Open Questions).
2. **Static layout** — cover image, two-column Main, cards, footer — no
   animation yet. Get the structure and content right first.
3. **Tear-reveal effect** — the hero transition, in isolation.
4. **Sticky left column** — pin/sticky behavior + entrance animation.
5. **Right carousel** — scroll-driven card lane with the arcade-style
   motion.
6. **Responsive pass** — mobile/tablet layouts, reduced-motion fallback,
   performance check (scrub animations on scroll can get janky with large
   images — will optimize assets).
7. **Contact/footer + deploy.**

## Open Questions (needed before building real content)

- **Name spelling** — plan uses "Jenishai" from your message; confirm
  that's the spelling you want on the site.
- **Tech stack list** — which languages/frameworks/tools to list on the
  left (JS, React, and the rest of your bootcamp stack, plus anything
  from the AI Buildcamp track?).
- **Projects** — which projects to feature as cards (titles, one-line
  descriptions, links, and the screenshots themselves).
- **Contact/footer** — what belongs there: email, LinkedIn, GitHub,
  resume download?
- **Bio copy** — the line you gave ("I build businesses and not only
  apps and AI-powered tools") is great raw material; want me to tighten
  it into final copy, or is it close to final as-is?

Nothing above blocks starting Phase 2 (static layout) once the project
list and screenshots are in hand — the animation phases (3–5) can be
built against placeholder content in the meantime if you'd rather start
on those first.

---

## Status (implemented this pass)

Phase 2 (static layout) is built, styled in a dark, GSAP.com-inspired
theme (near-black background `#0e100f`, warm cream text `#fffce1`, vivid
green accent `#0ae448` / soft lime `#abff84`, Space Grotesk + JetBrains
Mono), plus a first pass at Phases 3–5:

- `src/components/Hero.tsx` + `src/lib/tornEdge.ts` — the tear-reveal
  cover. Both halves clip against one shared jagged boundary curve, so at
  rest the seam is invisible (interlocked), and a pinned, scrubbed
  ScrollTrigger timeline peels them apart as you scroll the first
  viewport.
- `src/components/Intro.tsx` — sticky left column (name, pitch, tech
  stack, contact CTA). Copy is still the placeholder wording from your
  message — see Open Questions above.
- `src/components/ProjectCarousel.tsx` + `ProjectCard.tsx` — right column
  of project cards, alternating lane offsets with a subtle per-card
  scroll-scrubbed parallax drift for the "top-down arcade" read, kept
  restrained per the clean/minimal direction.
- `src/data/projects.ts` — **6 template placeholder cards** (per your
  request: real showcases come later). Screenshot slots are dashed
  placeholder boxes, not real images.
- `src/components/Footer.tsx` — placeholder contact links.

Verified: `tsc -b` and `vite build` both pass; visually checked via a
headless render of the production build (hero at rest, mid-tear, and the
two-column scroll section all render as intended).

Not yet done: Phase 6 (deeper responsive/accessibility pass beyond the
single breakpoint already in place) and Phase 7 (real deploy). Swapping
in real name/copy/projects/contact links is a content edit, not a
rebuild — see Open Questions.
