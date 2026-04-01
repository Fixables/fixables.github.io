import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import PageWrapper from '@/components/layout/PageWrapper'
import TechBadge from '@/components/projects/TechBadge'
import ProjectGallery from '@/components/projects/ProjectGallery'
import PCBViewer from '@/components/projects/PCBViewerWrapper'
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

export default function ProjectPage({ params }: PageProps) {
  const project = getProjectBySlug(params.slug)
  if (!project) notFound()

  const { sections } = project

  return (
    <PageWrapper>
      <div className="bg-zinc-900 border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 pt-28">
          <Link href="/projects" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-sky-400 transition-colors mb-8">
            <ArrowLeft size={14} /> Back to Projects
          </Link>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <TechBadge label={project.category} variant="category" />
            <span className="font-mono text-sm text-zinc-500">{project.date}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-zinc-50 tracking-tight mb-4">{project.title}</h1>
          <p className="text-xl text-zinc-400 mb-6 max-w-2xl">{project.tagline}</p>
          <div className="flex flex-wrap gap-2 mb-8">
            {project.tags.map((tag) => (
              <TechBadge key={tag} label={tag} />
            ))}
          </div>
          {project.links.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {project.links.map((link) => (
                <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-800 border border-zinc-700 text-zinc-300 text-sm rounded-lg hover:border-sky-400 hover:text-sky-400 transition-colors">
                  {link.label} <ExternalLink size={12} />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="lg:grid lg:grid-cols-3 lg:gap-12">
          <div className="lg:col-span-2 space-y-10">
            {sections.problem && (
              <section>
                <h2 className="text-xl font-semibold text-zinc-50 mb-3">Problem Statement</h2>
                <p className="text-zinc-400 leading-relaxed">{sections.problem}</p>
              </section>
            )}
            {sections.goals && sections.goals.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold text-zinc-50 mb-3">Goals & Constraints</h2>
                <ul className="space-y-2">
                  {sections.goals.map((goal, i) => (
                    <li key={i} className="flex items-start gap-2 text-zinc-400">
                      <span className="text-sky-400 mt-1 flex-shrink-0">›</span>
                      {goal}
                    </li>
                  ))}
                </ul>
              </section>
            )}
            {sections.designDecisions && (
              <section>
                <h2 className="text-xl font-semibold text-zinc-50 mb-3">Design Decisions</h2>
                <p className="text-zinc-400 leading-relaxed">{sections.designDecisions}</p>
              </section>
            )}
            {sections.schematicHighlights && (
              <section>
                <h2 className="text-xl font-semibold text-zinc-50 mb-3">Schematic Highlights</h2>
                <p className="text-zinc-400 leading-relaxed">{sections.schematicHighlights}</p>
              </section>
            )}
            {sections.pcbHighlights && (
              <section>
                <h2 className="text-xl font-semibold text-zinc-50 mb-3">PCB Layout</h2>
                <p className="text-zinc-400 leading-relaxed">{sections.pcbHighlights}</p>
              </section>
            )}
            {sections.validation && (
              <section>
                <h2 className="text-xl font-semibold text-zinc-50 mb-3">Validation & Testing</h2>
                <p className="text-zinc-400 leading-relaxed">{sections.validation}</p>
              </section>
            )}
            {sections.challenges && (
              <section>
                <h2 className="text-xl font-semibold text-zinc-50 mb-3">Challenges & Tradeoffs</h2>
                <p className="text-zinc-400 leading-relaxed">{sections.challenges}</p>
              </section>
            )}
            {sections.results && (
              <section>
                <h2 className="text-xl font-semibold text-zinc-50 mb-3">Results</h2>
                <p className="text-zinc-400 leading-relaxed">{sections.results}</p>
              </section>
            )}
            {project.images.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold text-zinc-50 mb-4">Gallery</h2>
                <ProjectGallery images={project.images} title={project.title} />
              </section>
            )}
            {project.model3d && (
              <section>
                <h2 className="text-xl font-semibold text-zinc-50 mb-4">3D PCB Viewer</h2>
                <PCBViewer modelPath={project.model3d} />
              </section>
            )}
          </div>

          <aside className="mt-12 lg:mt-0">
            <div className="sticky top-24 space-y-6">
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                <h3 className="font-mono text-xs text-zinc-500 uppercase tracking-wider mb-4">Project Info</h3>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-xs text-zinc-600 mb-0.5">Category</dt>
                    <dd><TechBadge label={project.category} variant="category" /></dd>
                  </div>
                  <div>
                    <dt className="text-xs text-zinc-600 mb-0.5">Date</dt>
                    <dd className="font-mono text-sm text-zinc-300">{project.date}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-zinc-600 mb-1">Tools & Technologies</dt>
                    <dd className="flex flex-wrap gap-1.5">
                      {project.tags.map((tag) => (
                        <TechBadge key={tag} label={tag} />
                      ))}
                    </dd>
                  </div>
                </dl>
              </div>
              {project.links.length > 0 && (
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                  <h3 className="font-mono text-xs text-zinc-500 uppercase tracking-wider mb-4">Links</h3>
                  <div className="space-y-2">
                    {project.links.map((link) => (
                      <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-zinc-400 hover:text-sky-400 transition-colors">
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
