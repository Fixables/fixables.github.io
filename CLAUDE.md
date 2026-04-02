# Portfolio — fixables.github.io

Andy Setiawan's EE portfolio. Static Next.js 14 site deployed on GitHub Pages at `fixables.github.io`.

## Stack
- **Next.js 14** App Router, `output: 'export'` (static), `trailingSlash: true`
- **TypeScript**, **Tailwind CSS v3**, **Framer Motion**, **Lucide React**
- **React Three Fiber + @react-three/drei** — 3D PCB viewer (GLB files)
- No backend, no database. All data lives in `data/` TypeScript files.

## Deployment
`npm run build` → static export → GitHub Pages. No SSR. Components that use canvas/WebGL use `dynamic(() => import(...), { ssr: false })`.

## Project Structure

```
app/
  layout.tsx              — root layout: PageBackground + Navbar + <main> + Footer
  page.tsx                — home: Hero + AboutMe + FeaturedProjects + SkillsGrid
  experience/page.tsx     — 'use client', tab toggle experience / education
  projects/
    page.tsx              — all projects grid with filters
    [slug]/page.tsx       — project detail: sections + gallery + PCBTabViewer
  contact/page.tsx        — contact form (FormSubmit)
  editbg/page.tsx         — background config editor (dev tool, NOT in navbar)
  not-found.tsx

components/
  layout/
    Navbar.tsx            — fixed, scroll-transparent, mobile hamburger
    Footer.tsx            — github / linkedin / email links
    PageBackground.tsx    — 'use client', position:fixed z-0, picks bg per page
  sections/
    Hero.tsx              — full-viewport hero (photo + text + CTAs), no own background
    AboutMe.tsx           — about section with photo, id="about"
    FeaturedProjects.tsx  — 3 featured project cards
    SkillsGrid.tsx        — 6 skill categories grid
    *Background.tsx       — 6 animated canvas backgrounds (see Background System)
    HeroBackground.tsx    — ORPHANED (replaced by PageBackground in layout)
  projects/
    PCBViewer.tsx         — R3F 3D viewer, auto-fits camera via Box3
    PCBViewerWrapper.tsx  — dynamic() wrapper with spinner fallback
    PCBTabViewer.tsx      — tabbed: 3D Model / 2D Layers / Schematic
    LayerViewer.tsx       — stacked PNG layer viewer with per-layer toggles
    SchematicViewer.tsx   — pan+zoom schematic viewer (SVG or PNG)
    BOMTable.tsx          — sortable BOM component list table
    FabStatsCard.tsx      — board dimensions, layers, trace/via specs
    ProjectCard.tsx       — card for project grid
    ProjectGallery.tsx    — lightbox image gallery
    ProjectFilter.tsx     — filter/search UI (already exists, wired to projects page)
    TechBadge.tsx         — colored tag pill
  experience/
    Timeline.tsx          — wraps TimelineEntry list
    TimelineEntry.tsx     — entry with logo, dates, bullet points
  ui/
    AnimatedReveal.tsx, Button.tsx, SectionHeading.tsx

data/
  projects.ts             — ProjectData[] — 14 projects
  experience.ts           — ExperienceEntry[] — 6 entries
  skills.ts               — skill categories

types/
  project.ts              — ProjectData, ProjectSections, PCBLayer, BOMEntry, FabStats
  experience.ts           — ExperienceEntry
  bg-config.ts            — all 6 background config types + defaults + BgId/PageId/AllBgSettings
```

## Data — Projects (data/projects.ts)
14 projects. Key fields per `ProjectData`:
- `slug`, `title`, `tagline`, `category` ('firmware'|'pcb'|'embedded'|'software'|'robotics')
- `featured: boolean` — 3 shown on home (haptic-knob, robomaestro, coin-picking-robot)
- `model3d?: string` — GLB path for 3D viewer. Only `robomaestro` has one (`/assets/models/robomaestro.glb`)
- `images: string[]` — photo gallery
- `sections: ProjectSections` — problem, goals, designDecisions, schematicHighlights, pcbHighlights, validation, challenges, results
- `pcbLayers?: PCBLayer[]` — per-layer PNGs for 2D viewer (add when user exports from Altium)
- `schematic?: string` — path to schematic SVG or PNG
- `bomData?: BOMEntry[]` — component list
- `fabStats?: FabStats` — board dimensions, layer count, trace/via specs

PCB projects: `robomaestro` (has GLB + fabStats), `mini-powerbank` (photos only)

## Data — Experience (data/experience.ts)
6 entries, each: `type` ('work'|'design-team'|'education'), `logoUrl`, `bullets[]`:
- UBC B.ASc EE (+ $400k International Leader Scholarship)
- ELEC 201 Teaching Assistant
- Steamoji maker instructor (May–Sept 2025)
- Open Robotics: Haptic Knob project + Robocup@Home
- BIoT design team (2-layer Altium PCB, ADM3260 isolated I2C, ESP32)
- Tjahya Elektronik (family electronics business, 8 bullets)

Logo images in `public/assets/`: ubc-logo.png, steamoji.png, ubc_open_robotics_logo.jpeg, biot_logo1.jpeg, tjahya.jpeg

## Background System (major feature, built from scratch)

**6 animated HTML5 Canvas backgrounds** — all `'use client'`, accept `config` prop.

| BgId | File | Description |
|------|------|-------------|
| `circuit` | CircuitBackground.tsx | Grid nodes + orthogonal L-bend traces + signal pulses. Mouse drift (spring physics). |
| `bulb` | BulbBackground.tsx | Cursor = energy source. Charges nearby nodes, spreads along wire network. |
| `oscilloscope` | OscilloscopeBackground.tsx | Scrolling sine/square/triangle waveforms on CRT-style grid with phosphor glow. |
| `cpu` | CpuBackground.tsx | Central chip die with many radiating PCB traces and data packets both directions. |
| `emfield` | EMFieldBackground.tsx | Particles following dipole EM field lines. Charges drift slowly and bounce. |
| `signalflow` | SignalFlowBackground.tsx | CPU datapath nodes (ALU/REG/MUX…) with directed wires and propagating pulses. |

**Config types in `types/bg-config.ts`:** `CircuitConfig`, `BulbConfig`, `OscilloscopeConfig`, `CpuConfig`, `EMFieldConfig`, `SignalFlowConfig` + all defaults + `BgId`, `PageId`, `BgPageEntry`, `AllBgSettings`.

**Canvas component pattern (all 6 follow this):**
- `configRef = useRef(config)` updated in `useEffect([config])` — live param updates without restarting rAF
- `needsReseedRef` — structural param changes flag a reseed on next frame
- ResizeObserver (debounced 150ms reseed), Page Visibility API pause, `prefers-reduced-motion` static fallback, DPR-aware canvas sizing
- Canvas element: `position: absolute, inset: 0, pointer-events: none, z-index: 0`

**PageBackground (`components/layout/PageBackground.tsx`):**
- `position: fixed, inset: 0, z-index: 0` — sits in root layout, covers all pages
- Uses `usePathname()` → maps to PageId: `/` → home, `/experience` → experience, `/projects*` → projects, `/contact` → contact
- Reads `AllBgSettings` from `localStorage['bg-all-settings']`
- Per-bg settings: `{ enabled: boolean, pages: PageId[] }` — controls which backgrounds appear on which pages
- Picks randomly from enabled+assigned candidates, caches in `sessionStorage['bg-choice-{pathname}']`
- Mobile (`pointer: coarse`): never picks `bulb` (requires cursor)

**Default page assignments:**
- circuit, bulb, oscilloscope → all pages
- cpu, signalflow → home + projects
- emfield → home + experience + contact

**localStorage keys:**
- `bg-all-settings` — full AllBgSettings JSON (enabled, pages, per-bg configs)
- `hero-bg-override` — LEGACY, unused (old HeroBackground system)

**Editor at `/editbg`** (not in nav, dev tool):
- Left panel: list of all 6 backgrounds, each with enable toggle + page checkboxes (Home/Exp/Proj/Cont)
- Right panel: config sliders for selected background (color, opacities, density, physics params)
- Full-page live preview + fake hero text behind the background
- "Apply All Settings" → saves to `bg-all-settings` in localStorage, clears sessionStorage cache

## PCB Viewer
- `PCBViewerWrapper.tsx` → dynamic imports `PCBViewer.tsx` (ssr:false)
- R3F canvas: `useGLTF`, `OrbitControls`, `Environment` (studio), ambient + directional lights
- Auto-fits camera: `Box3` bounding box → calculates distance from FOV → repositions
- Auto-rotates until user interacts, resumes after 3s idle
- GLB files: `public/assets/models/` — only `robomaestro.glb` (2.28 MB) exists

**PCBTabViewer** (new, wraps the above):
- Tabs: "3D Model" | "2D Layers" | "Schematic" — only shows tabs that have data
- 2D Layers: PNG exports from Altium per layer, stacked with CSS `mix-blend-mode: screen`, each tinted by convention:
  - F.Cu → `#c87533` (copper), B.Cu → `#4169e1` (blue), F.SilkS → `#ffffff`, B.SilkS → `#ffff00`
- Schematic: pan+zoom SVG or PNG (wheel zoom + drag)
- BOM table: sortable/filterable component list
- Fab stats card: dimensions, layers, min trace, via, surface finish

**To add 2D layers for a project:**
1. Export each layer as PNG from Altium (File → Smart PDF or Plot, enable "Monochrome", one file per layer)
2. Place PNGs in `public/assets/projects/{slug}/layers/`
3. Add `pcbLayers: [...]` array to the project entry in `data/projects.ts`

## Styling Conventions
- Dark theme only: `bg-zinc-950` page, `bg-zinc-900` cards, `border-zinc-800` borders
- Text: `text-zinc-50` headings, `text-zinc-400` body, `text-zinc-500` muted
- Accent: `sky-400` (#38bdf8) — links, active states, CTA buttons, badge highlights
- Fonts: Inter (sans `font-sans`) + JetBrains Mono (mono `font-mono`)
- Cards: `rounded-xl border border-zinc-800 bg-zinc-900`
- Hover states: `hover:border-sky-400 hover:text-sky-400 transition-colors`
- Spacing: sections use `py-20 sm:py-24`, max-width `max-w-6xl mx-auto px-4 sm:px-6`

## Contact / Personal Info
- Email: andy.setiawan9910@gmail.com
- LinkedIn: linkedin.com/in/andysetiawan1405/
- GitHub: github.com/Fixables
- CV: `/assets/cv-andy.pdf`
- Photo: `/assets/DSCF4746-rd.png` (hero), `/assets/about-pic.jpg` (about section)

## Known Issues / Orphaned Files
- `components/sections/HeroBackground.tsx` — was replaced by PageBackground; nothing imports it. Safe to delete.
- `BG_LS_KEY = 'hero-bg-override'` in bg-config.ts — legacy constant, unused.

## Planned / In Progress
- PCB project upgrades: PCBTabViewer + LayerViewer + SchematicViewer + BOMTable + FabStatsCard
- Project filtering: `ProjectFilter.tsx` exists but needs wiring to projects page state
- Related projects: 2-3 cards at bottom of project detail based on category/tag overlap
- Animated stat counters on home/about
- Interactive skills graph
