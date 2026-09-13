# Jenishai — Portfolio

A single-page developer portfolio built around one interactive centerpiece: a bunny character that wakes up, walks, and guides the visitor down the page in sync with scroll position. Built with React, TypeScript, and GSAP's ScrollTrigger.

## Live Site

_Add your Netlify URL here after deploying._

## Features

- Scroll-driven bunny companion with waving, walking, turning, and idle states, built as a discrete state machine over a continuous scroll-progress value
- Contextual speech-bubble captions that fade in and out at precise scroll points
- A "dodge" effect: nearby UI elements (tech-stack icons, the first project card) ease out of the bunny's path and spring back once it passes
- A vertical project carousel with parallax drift, plus a pinned horizontal project track for additional work
- Full `prefers-reduced-motion` support — every animation has a static fallback
- Responsive layout down to mobile widths

## Tech Stack

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/) (rolldown-powered)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [GSAP 3](https://gsap.com/) with `@gsap/react` and `ScrollTrigger`
- [oxlint](https://oxc.rs/docs/guide/usage/linter.html) for linting

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Install

```bash
npm install
```

### Develop

```bash
npm run dev
```

Starts the Vite dev server (defaults to `http://localhost:5173`).

### Build

```bash
npm run build
```

Type-checks the project with `tsc -b`, then produces an optimized production build in `dist/`.

### Preview the production build locally

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

## Project Structure

```
src/
  components/
    Bunny/            Scroll-driven bunny character (state machine, sprite frames, thresholds)
    Hero.tsx           Full-bleed intro section with the split-reveal scroll effect
    Intro.tsx          Sticky left-column bio and tech-stack icons
    ProjectCarousel.tsx    Vertical parallax project cards
    HorizontalProjects.tsx Pinned horizontal project track + footer slide
    ProjectCard.tsx    Shared project card used by both carousels
    Footer.tsx         Contact section with social links
  hooks/
    useBunnyScroll.ts  Tracks scroll progress/direction and derives animation thresholds
  data/
    projects.ts        Project content (titles, taglines, links, media)
public/
  bunny/               Bunny sprite frames, organized by animation state
  icons/                Tech-stack and social icons
  projects/             Project screenshots and video previews
```

## Deploying to Netlify

1. Push this repository to GitHub.
2. In Netlify, choose **Add new site → Import an existing project** and select the repo.
3. Use these build settings (Netlify usually detects them automatically from `package.json`):
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
4. Deploy. Netlify will rebuild automatically on every push to the connected branch.

No environment variables are required — this is a fully static site.

## Accessibility

Every scroll-triggered animation is wrapped in a `prefers-reduced-motion` check via `gsap.matchMedia()`, so visitors who prefer reduced motion see the same content with instant, non-animated transitions instead.
