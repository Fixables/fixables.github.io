# Portfolio Rebuild Plan — Andy Setiawan (fixables.github.io)

## Context

The current site is a barebones vanilla HTML/CSS/JS portfolio. It has a frosted-glass navbar, a hero section, basic project cards, a CSS-based timeline, and a contact form. It is functional but it reads like a plain resume page, not a purpose-built engineering portfolio. There are no individual project pages, no interactive elements beyond a hamburger menu, and no visual identity that communicates "embedded systems / PCB / firmware engineer."

The goal is a full rebuild with individual project deep-dives, interactive 3D PCB viewing, and a premium technical aesthetic.

---

## 1. Diagnosis of Current Weaknesses

### Design
- Generic layout identical to thousands of student portfolios
- No visual identity — Poppins + grey cards is not distinctive
- Projects are just cards; there is no depth, no storytelling
- No visual hierarchy that draws a recruiter's eye to the most impressive work
- Skills section is flat tag soup with no grouping/priority signal
- No dark mode — misses the entire hardware/embedded aesthetic register

### Technical Architecture
- No component reuse — every page copies nav/footer HTML manually
- No routing — each page is a separate HTML file with full duplication
- No data layer — project content is hardcoded in HTML, unmaintainable
- Responsive via two separate CSS files — fragile, hard to update
- Zero interactivity beyond the 7-line hamburger script
- No build tooling, no TypeScript, no linting

### Content Presentation
- Projects have no individual pages — cannot tell a story, show images, or add 3D
- The resume has *more* content than the website (many strong details are commented out)
- Scholarship (CAD 400k+ full-ride) is buried — this is a standout credential
- 7 years of hands-on electronics repair experience at Tjahya Elektronik is undersold
- Haptic Knob (FOC + FreeRTOS + BLDC) is by far the most technically impressive project but gets one card
- No PCB design showcase at all — RoboMaestro PCB is an Altium project worth showing

---

## 2. Recommended Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | Next.js 14 (App Router) | Static export for GitHub Pages, React component model, file-based routing, excellent performance |
| Language | TypeScript | Type safety for project/experience data schemas |
| Styling | Tailwind CSS v3 | Utility-first, no CSS file sprawl, consistent spacing/color system, fast to iterate |
| Animation | Framer Motion | Production-grade microinteractions; scroll-triggered reveals; page transitions |
| 3D Viewer | React Three Fiber + @react-three/drei | Full control over PCB scene, lighting, camera; composable with React |
| Icons | Lucide React | Clean, consistent, tree-shakeable |
| Fonts | Inter (body) + JetBrains Mono (code/specs) | via next/font |
| Deployment | GitHub Pages via `next export` + GitHub Actions | Same host, zero-config |

**Why not plain HTML:** Cannot share components, cannot have dynamic routes for project pages, cannot add 3D without a module bundler, cannot use TypeScript or modern tooling. The rebuild investment pays off immediately when adding the second project page.

---

## 3. Site Architecture

### Pages
```
/                    → Home (hero, featured projects, skills, about snippet)
/projects            → All projects gallery with category filter
/projects/[slug]     → Individual project deep-dive page
/experience          → Timeline: work experience + education + design teams
/contact             → Contact form
```

### Component Structure
```
components/
  layout/
    Navbar.tsx          — sticky, responsive, active link highlighting
    Footer.tsx          — social links, email, copyright
    PageWrapper.tsx     — consistent page margin + fade-in
  sections/             — home page sections
    Hero.tsx
    FeaturedProjects.tsx
    SkillsGrid.tsx
    AboutSnippet.tsx
  projects/
    ProjectCard.tsx     — card for gallery grid
    ProjectFilter.tsx   — category filter tabs
    ProjectGallery.tsx  — image lightbox
    PCBViewer.tsx       — Three.js/R3F 3D model viewer
    TechBadge.tsx       — pill badge for tools/skills
  experience/
    Timeline.tsx
    TimelineEntry.tsx
  ui/
    Button.tsx
    SectionHeading.tsx
    AnimatedReveal.tsx  — Framer Motion scroll wrapper
```

### Data Architecture
```
data/
  projects.ts      — typed array of ProjectData objects
  experience.ts    — typed array of ExperienceEntry objects
  skills.ts        — categorized skills map

types/
  project.ts       — ProjectData interface
  experience.ts    — ExperienceEntry interface
```

**ProjectData interface:**
```typescript
interface ProjectData {
  slug: string
  title: string
  tagline: string
  category: 'firmware' | 'pcb' | 'embedded' | 'software' | 'robotics'
  tags: string[]
  date: string
  featured: boolean
  coverImage: string
  images: string[]
  model3d?: string          // path to .glb file for PCB viewer
  summary: string
  sections: {
    problem?: string
    goals?: string[]
    designDecisions?: string
    schematicHighlights?: string
    pcbHighlights?: string
    validation?: string
    challenges?: string
    results?: string
  }
  links: { label: string; url: string }[]
}
```

---

## 4. Visual / Design Direction

### Color Palette (dark mode primary)
- Background: `#09090b` (zinc-950)
- Surface: `#18181b` (zinc-900)
- Border: `#27272a` (zinc-800)
- Primary text: `#fafafa` (zinc-50)
- Secondary text: `#a1a1aa` (zinc-400)
- Accent: `#38bdf8` (sky-400) — electric but not neon
- Accent hover: `#0ea5e9` (sky-500)
- Code/mono text: `#86efac` (green-300) — subtle terminal feel

### Typography
- Headings: Inter 700/800, tight tracking (`tracking-tight`)
- Body: Inter 400/450, relaxed line-height
- Code snippets / spec values: JetBrains Mono
- Hero name: clamp(2.5rem, 6vw, 5rem) — scales with viewport

### Key Design Decisions
- **Dark background everywhere** — engineering/hardware aesthetic, not a blog
- **Generous whitespace** — 96px section gaps, not cramped
- **PCB trace motif** — subtle SVG grid/trace pattern as hero background (low opacity)
- **Project cards** — dark surface card, accent-colored category badge, hover lifts card with subtle glow
- **Section headings** — small monospace label ("01 — PROJECTS") above main heading
- **Skill section** — grouped by category (not flat soup), each category has a colored dot
- **Hero** — full-viewport, name + title + tagline, two CTAs (View Projects / Download CV), animated entrance
- **Featured projects on home** — 3 cards max, each with cover image, tags, one-line summary

### Animations (Framer Motion)
- Hero text: staggered fade-up on mount
- Section content: fade-up on scroll enter (once)
- Project cards: hover — y: -4px + box-shadow glow
- PCB viewer: auto-rotate on load, user can take control
- Page transitions: 150ms fade between routes

---

## 5. PCB 3D Viewer Approach

### Workflow
1. Export PCB from Altium as **STEP (.step)** file
2. Convert STEP → **GLB** using FreeCAD (free, scriptable) or an online converter
3. Compress GLB with `gltf-pipeline` or `gltfpack`
4. Load in-browser with **React Three Fiber** + `useGLTF` from `@react-three/drei`

### PCBViewer.tsx Component
- OrbitControls (rotate, zoom, pan) with damping
- Environment lighting: `preset="studio"` from drei for realistic PCB appearance
- Auto-rotate on idle, stops when user interacts
- Loading spinner while model fetches
- Fallback image if model not available
- "Drag to rotate / Scroll to zoom" hint overlay (dismisses after first interaction)
- Contained in a fixed-aspect-ratio canvas (`aspect-video` or `aspect-square`)

---

## 6. Individual Project Page Structure

Each `/projects/[slug]` page follows this layout:

```
[Hero image — full width, dark overlay]
  Category badge | Date
  Title
  Tagline (one line summary)
  [Tags row — Altium, ESP32, FreeRTOS, ...]
  [Links — GitHub, Demo, PDF]

[Two-column body]
Left (prose):
  Overview / Problem
  Goals & Constraints
  Design Decisions
  Schematic Highlights (+ image)
  PCB Layout Highlights (+ image)
  Validation & Testing
  Challenges & Tradeoffs
  Results

Right (sticky sidebar):
  Key Specs table (voltage, current, MCU, layers, etc.)
  Tools used
  Status badge (Ongoing / Complete)
  Download links

[Image Gallery — lightbox grid]

[3D PCB Viewer — if model3d exists]

[← Back to Projects]
```

**Dual-audience strategy:**
- Bold the key technical terms inline (recruiters skim bolded words)
- Lead each section with the *so what* before the *how*
- "Key Specs" sidebar gives technical readers instant data
- Image gallery lets non-specialists understand what was built visually

---

## 7. Migration / Rebuild Roadmap

### Phase 0 — Setup (1–2 hours)
- Initialize project with chosen framework
- Install: `framer-motion`, `@react-three/fiber`, `@react-three/drei`, `three`, `lucide-react`
- Configure for static export and GitHub Pages deployment
- Set up GitHub Actions workflow to build + deploy
- Copy `assets/` from current repo into `public/assets/`

### Phase 1 — Data Layer (1 hour)
- Write type definitions for project and experience data
- Populate `data/projects.ts` with all 12 projects from current site + resume details
- Populate `data/experience.ts` with all 8 experience entries
- Populate `data/skills.ts` with categorized skills from resume

### Phase 2 — Layout + Navigation (1–2 hours)
- Navbar — sticky, dark, mobile hamburger, active link highlighting
- Footer — social links, email, copyright
- Root layout — font setup, global styles

### Phase 3 — Home Page (2–3 hours)
- Hero — name, title, tagline, CTAs, PCB trace background SVG
- Featured Projects — 3 cards (Haptic Knob, RoboMaestro, Coin Picking Robot)
- Skills Grid — grouped by category
- About Snippet — 2-line bio, scholarship callout, link to experience
- Framer Motion scroll reveals

### Phase 4 — Projects Gallery Page (2 hours)
- Filter by category (firmware, pcb, embedded, robotics, software)
- Project cards — image, title, tags, category badge
- Animated grid layout

### Phase 5 — Individual Project Pages (3–4 hours)
- Dynamic route for each project slug
- Full project page layout per Section 6 above
- Image lightbox gallery with keyboard nav
- Static generation for all slugs at build time

### Phase 6 — Experience Page (1–2 hours)
- Vertical timeline with animated reveal per entry
- Education card with scholarship callout prominently displayed
- Design teams section

### Phase 7 — PCB 3D Viewer (2–3 hours)
- R3F canvas, OrbitControls, environment lighting
- Convert RoboMaestro PCB to GLB (requires STEP export from Altium)
- Integrate into RoboMaestro project page
- Reusable — drop `model3d` path into any future project

### Phase 8 — Contact + Polish (1–2 hours)
- Contact form (FormSubmit.co integration)
- Final animation pass
- Lighthouse audit — target 95+ performance, 100 accessibility
- Responsive QA at 375px, 768px, 1280px, 1920px

### Phase 9 — Deploy (30 min)
- GitHub Actions: build → deploy static output to GitHub Pages

---

## Files to Replace

| Current File | Action |
|---|---|
| `index.html` | Replace with framework home page |
| `projects.html` | Replace with framework route |
| `experience.html` | Replace with framework route |
| `contact.html` | Replace with framework route |
| `thank-you.html` | Replace with framework route |
| `style.css` | Delete — replaced by Tailwind |
| `mediaqueries.css` | Delete — replaced by Tailwind |
| `script.js` | Delete — replaced by framework |
| `assets/` | Keep — moved to `public/assets/` |
| `resume.tex` | Keep as reference |

---

## Verification Checklist

- [ ] Build completes without errors
- [ ] Static output contains valid HTML for all routes
- [ ] Lighthouse: Performance ≥ 95, Accessibility 100, SEO ≥ 95
- [ ] PCB viewer loads and responds to drag/scroll/pinch input
- [ ] Responsive at 375px, 768px, 1280px, 1920px
- [ ] Contact form submits successfully
- [ ] All project slugs resolve to pages with content
- [ ] Images are optimized
- [ ] GitHub Actions deploys to `fixables.github.io` on push to `main`
