import Link from 'next/link'
import type { ProjectData } from '@/types/project'
import TechBadge from './TechBadge'

interface ProjectCardProps {
  project: ProjectData
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={`/projects/${project.slug}`} className="group block h-full">
      <article className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden h-full hover:border-zinc-700 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-sky-400/5">
        <div className="aspect-video bg-zinc-800 relative overflow-hidden flex items-center justify-center">
          <TechBadge label={project.category} variant="category" />
        </div>
        <div className="p-5">
          <div className="flex items-start justify-between gap-3 mb-3">
            <TechBadge label={project.category} variant="category" />
            <span className="font-mono text-xs text-zinc-500">{project.date}</span>
          </div>
          <h3 className="text-base font-semibold text-zinc-50 mb-2 group-hover:text-sky-400 transition-colors leading-snug">
            {project.title}
          </h3>
          <p className="text-sm text-zinc-400 line-clamp-2 mb-4 leading-relaxed">{project.tagline}</p>
          <div className="flex flex-wrap gap-1.5">
            {project.tags.slice(0, 5).map((tag) => (
              <TechBadge key={tag} label={tag} />
            ))}
          </div>
        </div>
      </article>
    </Link>
  )
}
