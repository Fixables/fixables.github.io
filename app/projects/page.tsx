'use client'

import { useState, useMemo } from 'react'
import PageWrapper from '@/components/layout/PageWrapper'
import SectionHeading from '@/components/ui/SectionHeading'
import ProjectCard from '@/components/projects/ProjectCard'
import ProjectFilter from '@/components/projects/ProjectFilter'
import { projects } from '@/data/projects'
import type { ProjectCategory } from '@/types/project'

export default function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState<'all' | ProjectCategory>('all')

  const filtered = useMemo(() => {
    if (activeCategory === 'all') return projects
    return projects.filter((p) => p.category === activeCategory)
  }, [activeCategory])

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: projects.length }
    for (const p of projects) {
      c[p.category] = (c[p.category] ?? 0) + 1
    }
    return c
  }, [])

  return (
    <PageWrapper>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-24">
        <div className="mb-12">
          <SectionHeading
            label="PROJECTS"
            heading="All Projects"
            subheading="Firmware, PCB design, embedded systems, and robotics."
          />
        </div>
        <div className="mb-8">
          <ProjectFilter active={activeCategory} onChange={setActiveCategory} counts={counts} />
        </div>
        {filtered.length === 0 ? (
          <p className="text-zinc-500 font-mono text-sm">No projects in this category.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  )
}
