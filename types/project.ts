export type ProjectCategory = 'firmware' | 'pcb' | 'embedded' | 'software' | 'robotics'

export interface ProjectLink {
  label: string
  url: string
}

export interface ProjectSections {
  problem?: string
  goals?: string[]
  designDecisions?: string
  schematicHighlights?: string
  pcbHighlights?: string
  validation?: string
  challenges?: string
  results?: string
}

export interface PCBLayer {
  name: string           // e.g. 'F.Cu'
  label: string          // e.g. 'Top Copper'
  url: string            // path to PNG in /public
  color: string          // hex tint — applied via CSS filter + mix-blend-mode
  defaultVisible: boolean
}

export interface BOMEntry {
  ref: string            // e.g. 'R1', 'U2'
  value: string          // e.g. '10kΩ', 'STM32F4'
  footprint: string      // e.g. '0402', 'SOIC-8'
  qty: number
  note?: string
}

export interface FabStats {
  layers: number
  dimensions: string     // e.g. '65 × 45 mm'
  minTrace?: string      // e.g. '0.2 mm'
  minVia?: string        // e.g. '0.3 mm drill'
  surface?: string       // e.g. 'HASL', 'ENIG'
  manufacturer?: string  // e.g. 'JLCPCB'
}

export interface Subsystem {
  label: string           // e.g. 'Hardware', 'Firmware', 'Mechanical', 'Testing'
  icon: string            // lucide icon name: 'CircuitBoard' | 'Cpu' | 'Wrench' | 'FlaskConical' | 'Layers'
  summary: string         // one-line description shown in collapsed state
  body: string            // full text shown when expanded
  tags?: string[]         // tech tags for this discipline
  defaultOpen?: boolean   // first item defaults to true
}

export interface ProjectData {
  slug: string
  title: string
  tagline: string
  category: ProjectCategory
  tags: string[]
  date: string
  featured: boolean
  coverImage: string
  images: string[]
  model3d?: string
  logo?: string
  logoUrl?: string
  summary: string
  sections: ProjectSections
  links: ProjectLink[]
  // Multi-discipline breakdown (optional — only for complex projects)
  subsystems?: Subsystem[]
  // PCB viewer extras
  pcbLayers?: PCBLayer[]
  schematic?: string     // path to SVG or PNG schematic
  bomData?: BOMEntry[]
  fabStats?: FabStats
}
