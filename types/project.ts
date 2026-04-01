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
  summary: string
  sections: ProjectSections
  links: ProjectLink[]
}
