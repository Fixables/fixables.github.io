import Link from 'next/link'
import Image from 'next/image'
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

          {/* Title + logo */}
          <div className="flex items-start gap-2.5 mb-2">
            {project.logo && (
              <a
                href={project.logoUrl ?? '#'}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex-shrink-0 mt-0.5"
              >
                <div className="w-6 h-6 rounded-full overflow-hidden border border-zinc-700 bg-zinc-800">
                  <Image
                    src={project.logo}
                    alt=""
                    width={24}
                    height={24}
                    className="object-cover w-full h-full"
                  />
                </div>
              </a>
            )}
            <h3 className="text-base font-semibold text-zinc-50 group-hover:text-sky-400 transition-colors leading-snug">
              {project.title}
            </h3>
          </div>

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
