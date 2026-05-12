'use client'

import { useState } from 'react'
import type { ProjectData } from '@/types/project'
import PCBTabViewer from './PCBTabViewer'
import ProjectGallery from './ProjectGallery'
import SubsystemsAccordion from './SubsystemsAccordion'

type TabId = 'overview' | 'pcb' | 'gallery' | 'specs' | 'process' | 'lessons'

interface Tab {
  id: TabId
  label: string
}

export default function ProjectDetailTabs({ project }: { project: ProjectData }) {
  const { sections } = project

  const hasPCB = !!(project.model3d || project.pcbLayers?.length || project.schematic || project.bomData?.length)
  const hasGallery = project.images.length > 0
  const hasSpecs = !!(project.specs?.length)
  const hasLessons = !!(project.lessons?.length)
  const hasProcess = !!(
    sections.designDecisions || project.process?.length ||
    sections.pcbHighlights || sections.schematicHighlights ||
    sections.validation || sections.challenges || sections.results
  )

  const tabs: Tab[] = [
    { id: 'overview', label: 'Overview' },
    ...(hasPCB     ? [{ id: 'pcb'     as TabId, label: 'PCB Views'        }] : []),
    ...(hasGallery ? [{ id: 'gallery' as TabId, label: 'Gallery'           }] : []),
    ...(hasSpecs   ? [{ id: 'specs'   as TabId, label: 'Tech Specs'        }] : []),
    ...(hasProcess ? [{ id: 'process' as TabId, label: 'Process & Outcome' }] : []),
    ...(hasLessons ? [{ id: 'lessons' as TabId, label: 'What I Learned'    }] : []),
  ]

  const [active, setActive] = useState<TabId>('overview')

  return (
    <div>
      {/* Tab bar */}
      <div className="flex gap-1 mb-8 bg-zinc-900 border border-zinc-800 rounded-lg p-1 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={`px-4 py-2 rounded text-sm font-medium whitespace-nowrap transition-all ${
              active === tab.id
                ? 'bg-sky-400 text-zinc-950'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview */}
      {active === 'overview' && (
        <div className="space-y-8">
          {sections.problem && (
            <section>
              <h3 className="text-lg font-semibold text-zinc-50 mb-3">Problem Statement</h3>
              <p className="text-zinc-400 leading-relaxed">{sections.problem}</p>
            </section>
          )}
          {sections.goals && sections.goals.length > 0 && (
            <section>
              <h3 className="text-lg font-semibold text-zinc-50 mb-3">Goals & Constraints</h3>
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
          {project.subsystems && project.subsystems.length > 0 && (
            <section>
              <h3 className="text-lg font-semibold text-zinc-50 mb-4">How It's Built</h3>
              <SubsystemsAccordion items={project.subsystems} />
            </section>
          )}
        </div>
      )}

      {/* PCB Views */}
      {active === 'pcb' && hasPCB && (
        <PCBTabViewer project={project} />
      )}

      {/* Gallery */}
      {active === 'gallery' && hasGallery && (
        <ProjectGallery images={project.images} title={project.title} />
      )}

      {/* Tech Specs */}
      {active === 'specs' && hasSpecs && (
        <dl className="grid sm:grid-cols-2 gap-3">
          {project.specs!.map((spec, i) => (
            <div key={i} className="bg-zinc-950 border border-zinc-800 rounded-lg p-4">
              <dt className="text-xs text-zinc-500 font-mono uppercase tracking-wider mb-1">{spec.label}</dt>
              <dd className="text-zinc-200 font-medium">{spec.value}</dd>
            </div>
          ))}
        </dl>
      )}

      {/* Process & Outcome */}
      {active === 'process' && (
        <div className="space-y-8">
          {sections.designDecisions && (
            <section>
              <h3 className="text-lg font-semibold text-zinc-50 mb-3">Design Decisions</h3>
              <p className="text-zinc-400 leading-relaxed">{sections.designDecisions}</p>
            </section>
          )}
          {project.process && project.process.length > 0 && (
            <section>
              <h3 className="text-lg font-semibold text-zinc-50 mb-5">Design Process</h3>
              <ol className="space-y-5">
                {project.process.map((step, i) => (
                  <li key={i} className="flex gap-4">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-sky-400/10 border border-sky-400/30 flex items-center justify-center">
                      <span className="text-sky-400 text-xs font-bold">{i + 1}</span>
                    </div>
                    <div className="pt-0.5">
                      <h4 className="text-zinc-200 font-medium mb-1">{step.title}</h4>
                      <p className="text-zinc-400 text-sm leading-relaxed">{step.description}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          )}
          {sections.schematicHighlights && (
            <section>
              <h3 className="text-lg font-semibold text-zinc-50 mb-3">Schematic Highlights</h3>
              <p className="text-zinc-400 leading-relaxed">{sections.schematicHighlights}</p>
            </section>
          )}
          {sections.pcbHighlights && (
            <section>
              <h3 className="text-lg font-semibold text-zinc-50 mb-3">PCB Layout</h3>
              <p className="text-zinc-400 leading-relaxed">{sections.pcbHighlights}</p>
            </section>
          )}
          {sections.validation && (
            <section>
              <h3 className="text-lg font-semibold text-zinc-50 mb-3">Validation & Testing</h3>
              <p className="text-zinc-400 leading-relaxed">{sections.validation}</p>
            </section>
          )}
          {sections.challenges && (
            <section>
              <h3 className="text-lg font-semibold text-zinc-50 mb-3">Challenges & Tradeoffs</h3>
              <p className="text-zinc-400 leading-relaxed">{sections.challenges}</p>
            </section>
          )}
          {sections.results && (
            <section>
              <h3 className="text-lg font-semibold text-zinc-50 mb-3">Results</h3>
              <p className="text-zinc-400 leading-relaxed">{sections.results}</p>
            </section>
          )}
        </div>
      )}

      {/* What I Learned */}
      {active === 'lessons' && hasLessons && (
        <ul className="space-y-3">
          {project.lessons!.map((lesson, i) => (
            <li key={i} className="flex items-start gap-3 p-4 bg-zinc-900 border border-zinc-800 rounded-lg">
              <span className="text-sky-400 flex-shrink-0 font-bold mt-0.5">›</span>
              <p className="text-zinc-300 text-sm leading-relaxed">{lesson}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
