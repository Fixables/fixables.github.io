import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getFeaturedProjects } from '@/data/projects'
import SectionHeading from '@/components/ui/SectionHeading'
import AnimatedReveal from '@/components/ui/AnimatedReveal'

export default function FeaturedProjects() {
  const featured = getFeaturedProjects()

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-24">
      <AnimatedReveal>
        <div className="flex items-end justify-between mb-12">
          <SectionHeading
            label="01 — PROJECTS"
            heading="Featured Work"
            subheading="Selected projects in firmware, PCB design, and embedded systems."
          />
          <Link
            href="/projects"
            className="hidden sm:flex items-center gap-2 text-sm text-zinc-400 hover:text-sky-400 transition-colors"
          >
            All projects <ArrowRight size={14} />
          </Link>
        </div>
      </AnimatedReveal>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {featured.map((project, i) => (
          <AnimatedReveal key={project.slug} delay={i * 0.1}>
            <Link href={`/projects/${project.slug}`} className="group block">
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-sky-400/5 h-full">
                {/* Cover image */}
                <div className="aspect-video bg-zinc-800 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center">
                    <span className="font-mono text-zinc-600 text-xs">{project.category.toUpperCase()}</span>
                  </div>
                </div>

                <div className="p-6">
                  {/* Category badge */}
                  <span className="inline-block font-mono text-xs text-sky-400 bg-sky-400/10 px-2 py-1 rounded mb-3">
                    {project.category}
                  </span>

                  <h3 className="text-lg font-semibold text-zinc-50 mb-2 group-hover:text-sky-400 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm text-zinc-400 line-clamp-2 mb-4">{project.tagline}</p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.slice(0, 4).map((tag) => (
                      <span key={tag} className="text-xs text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          </AnimatedReveal>
        ))}
      </div>

      <div className="mt-8 sm:hidden text-center">
        <Link href="/projects" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-sky-400 transition-colors">
          All projects <ArrowRight size={14} />
        </Link>
      </div>
    </section>
  )
}
