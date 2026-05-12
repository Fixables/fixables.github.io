import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import PageWrapper from '@/components/layout/PageWrapper'
import TechBadge from '@/components/projects/TechBadge'
import FabStatsCard from '@/components/projects/FabStatsCard'
import ProjectDetailTabs from '@/components/projects/ProjectDetailTabs'
import { projects, getProjectBySlug } from '@/data/projects'

interface PageProps {
  params: { slug: string }
}

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }))
}

export function generateMetadata({ params }: PageProps) {
  const project = getProjectBySlug(params.slug)
  if (!project) return {}
  return {
    title: `${project.title} — Andy Setiawan`,
    description: project.tagline,
  }
}

function StatusBadge({ status }: { status: string }) {
  const color =
    status === 'Complete' ? 'text-green-400 bg-green-400/10 border-green-400/20' :
    status === 'Ongoing'  ? 'text-sky-400 bg-sky-400/10 border-sky-400/20' :
    status === 'On Hold'  ? 'text-amber-400 bg-amber-400/10 border-amber-400/20' :
                            'text-zinc-400 bg-zinc-800 border-zinc-700'
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${color}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {status}
    </span>
  )
}

export default function ProjectPage({ params }: PageProps) {
  const project = getProjectBySlug(params.slug)
  if (!project) notFound()

  const { sections } = project

  return (
    <PageWrapper>

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <div className="bg-zinc-900 border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 pt-28">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-sky-400 transition-colors mb-10"
          >
            <ArrowLeft size={14} /> Back to Projects
          </Link>

          <div className={project.coverImage ? 'lg:grid lg:grid-cols-5 lg:gap-14 items-start' : ''}>
            {/* Left: text */}
            <div className={project.coverImage ? 'lg:col-span-3' : ''}>
              <div className="flex flex-wrap items-center gap-3 mb-5">
                <TechBadge label={project.category} variant="category" />
                <span className="font-mono text-sm text-zinc-500">{project.date}</span>
                {project.status && <StatusBadge status={project.status} />}
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-zinc-50 tracking-tight mb-4 leading-tight">
                {project.title}
              </h1>
              <p className="text-xl text-zinc-400 mb-6 leading-relaxed max-w-2xl">{project.tagline}</p>
              <div className="flex flex-wrap gap-2 mb-8">
                {project.tags.map((tag) => (
                  <TechBadge key={tag} label={tag} />
                ))}
              </div>
              {project.links.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {project.links.map((link) => (
                    <a
                      key={link.label}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-800 border border-zinc-700 text-zinc-300 text-sm rounded-lg hover:border-sky-400 hover:text-sky-400 transition-colors"
                    >
                      {link.label} <ExternalLink size={12} />
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Right: cover image */}
            {project.coverImage && (
              <div className="lg:col-span-2 mt-10 lg:mt-0">
                <div className="rounded-xl overflow-hidden aspect-video bg-zinc-800 border border-zinc-700">
                  <img
                    src={project.coverImage}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Main content ───────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="lg:grid lg:grid-cols-3 lg:gap-12">

          {/* Tabbed content */}
          <div className="lg:col-span-2">
            <ProjectDetailTabs project={project} />
          </div>

          {/* Sticky sidebar */}
          <aside className="mt-12 lg:mt-0">
            <div className="sticky top-24 space-y-5">

              {/* Project info */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                <h3 className="font-mono text-xs text-zinc-500 uppercase tracking-wider mb-4">Project Info</h3>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-xs text-zinc-600 mb-1">Category</dt>
                    <dd><TechBadge label={project.category} variant="category" /></dd>
                  </div>
                  <div>
                    <dt className="text-xs text-zinc-600 mb-1">Year</dt>
                    <dd className="font-mono text-sm text-zinc-300">{project.date}</dd>
                  </div>
                  {project.status && (
                    <div>
                      <dt className="text-xs text-zinc-600 mb-1">Status</dt>
                      <dd><StatusBadge status={project.status} /></dd>
                    </div>
                  )}
                  {project.role && (
                    <div>
                      <dt className="text-xs text-zinc-600 mb-1">My Role</dt>
                      <dd className="text-sm text-zinc-300 leading-relaxed">{project.role}</dd>
                    </div>
                  )}
                  <div>
                    <dt className="text-xs text-zinc-600 mb-2">Tools & Technologies</dt>
                    <dd className="flex flex-wrap gap-1.5">
                      {project.tags.map((tag) => (
                        <TechBadge key={tag} label={tag} />
                      ))}
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Fab stats (PCB projects) */}
              {project.fabStats && <FabStatsCard stats={project.fabStats} />}

              {/* Links */}
              {project.links.length > 0 && (
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                  <h3 className="font-mono text-xs text-zinc-500 uppercase tracking-wider mb-4">Links</h3>
                  <div className="space-y-2">
                    {project.links.map((link) => (
                      <a
                        key={link.label}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-zinc-400 hover:text-sky-400 transition-colors"
                      >
                        <ExternalLink size={12} />
                        {link.label}
                      </a>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </aside>
        </div>
      </div>
    </PageWrapper>
  )
}
