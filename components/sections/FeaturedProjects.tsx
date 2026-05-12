import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getFeaturedProjects } from '@/data/projects'
import AnimatedReveal from '@/components/ui/AnimatedReveal'
import ProjectCard from '@/components/projects/ProjectCard'

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
            <ProjectCard project={project} />
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
