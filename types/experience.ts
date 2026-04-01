export type ExperienceType = 'work' | 'education' | 'design-team' | 'volunteer'

export interface ExperienceEntry {
  id: string
  type: ExperienceType
  organization: string
  role: string
  location: string
  startDate: string
  endDate: string | 'Present'
  highlights: string[]
  tags?: string[]
  logo?: string
  logoUrl?: string
  scholarship?: {
    amount: string
    description: string
  }
}
