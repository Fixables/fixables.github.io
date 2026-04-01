import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getFeaturedProjects } from '@/data/projects'
import AnimatedReveal from '@/components/ui/AnimatedReveal'

export default function FeaturedProjects() {
  const featured = getFeaturedProjects()

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20 border-t border-zinc-800/60">
      <AnimatedReveal>
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="font-mono text-xs text-sky-400 tracking-widest uppercase mb-3">Projects</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-zinc-50 tracking-tight">Some of my work</h2>
          </div>
          <Link
            href="/projects"
            className="hidden sm:flex items-center gap-2 text-sm text-zinc-400 hover:text-sky-400 transition-colors"
          >
            All projects <ArrowRight size={14} />
          </Link>
        </div>
      </AnimatedReveal>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {featured.map((project, i) => (
          <AnimatedReveal key={project.slug} delay={i * 0.08}>
            <Link href={`/projects/${project.slug}`} className="group block">
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-sky-400/5 h-full">
                <div className="aspect-video bg-zinc-800 relative overflow-hidden flex items-center justify-center">
                  <span className="font-mono text-zinc-600 text-xs">{project.category}</span>
                </div>
                <div className="p-5">
                  <span className="inline-block font-mono text-xs text-sky-400 bg-sky-400/10 px-2 py-0.5 rounded mb-3">
                    {project.category}
                  </span>
                  <h3 className="text-base font-semibold text-zinc-50 mb-1.5 group-hover:text-sky-400 transition-colors leading-snug">
                    {project.title}
                  </h3>
                  <p className="text-sm text-zinc-400 line-clamp-2 mb-4 leading-relaxed">{project.tagline}</p>
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

      <div className="mt-6 sm:hidden text-center">
        <Link href="/projects" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-sky-400 transition-colors">
          All projects <ArrowRight size={14} />
        </Link>
      </div>
    </section>
  )
}
