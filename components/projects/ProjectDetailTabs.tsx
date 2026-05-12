'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import type { ProjectData } from '@/types/project'
import PCBTabViewer from './PCBTabViewer'
import ProjectGallery from './ProjectGallery'
import SubsystemsAccordion from './SubsystemsAccordion'

type TabId = 'overview' | 'pcb' | 'gallery' | 'details' | 'lessons'

interface Tab {
  id: TabId
  label: string
}

function AccordionSection({ title, defaultOpen = false, children }: {
  title: string
  defaultOpen?: boolean
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border border-zinc-800 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left bg-zinc-900 hover:bg-zinc-800/60 transition-colors"
      >
        <span className="font-medium text-zinc-200 text-sm">{title}</span>
        <ChevronDown
          size={16}
          className={`text-zinc-500 transition-transform duration-200 flex-shrink-0 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className="px-5 py-4 bg-zinc-950 border-t border-zinc-800">
          {children}
        </div>
      )}
    </div>
  )
}

export default function ProjectDetailTabs({ project }: { project: ProjectData }) {
  const { sections } = project

  const hasPCB = !!(project.model3d || project.pcbLayers?.length || project.schematic || project.bomData?.length)
  const hasGallery = project.images.length > 0
  const hasDetails = !!(
    project.specs?.length ||
    project.process?.length ||
    sections.designDecisions ||
    sections.pcbHighlights || sections.schematicHighlights ||
    sections.validation || sections.challenges || sections.results
  )
  const hasLessons = !!(project.lessons?.length)

  const tabs: Tab[] = [
    { id: 'overview', label: 'Overview' },
    ...(hasPCB      ? [{ id: 'pcb'     as TabId, label: 'PCB Views' }] : []),
    ...(hasGallery  ? [{ id: 'gallery' as TabId, label: 'Gallery'   }] : []),
    ...(hasDetails  ? [{ id: 'details' as TabId, label: 'Details'   }] : []),
    ...(hasLessons  ? [{ id: 'lessons' as TabId, label: 'Lessons'   }] : []),
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

      {/* Details — merged Tech Specs + Process & Outcome with accordions */}
      {active === 'details' && (
        <div className="space-y-3">
          {project.specs && project.specs.length > 0 && (
            <AccordionSection title="Tech Specs" defaultOpen>
              <dl className="grid sm:grid-cols-2 gap-3">
                {project.specs.map((spec, i) => (
                  <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
                    <dt className="text-xs text-zinc-500 font-mono uppercase tracking-wider mb-1">{spec.label}</dt>
                    <dd className="text-zinc-200 font-medium text-sm">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </AccordionSection>
          )}

          {project.process && project.process.length > 0 && (
            <AccordionSection title="Design Process" defaultOpen={!project.specs?.length}>
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
            </AccordionSection>
          )}

          {sections.designDecisions && (
            <AccordionSection title="Design Decisions">
              <p className="text-zinc-400 text-sm leading-relaxed">{sections.designDecisions}</p>
            </AccordionSection>
          )}

          {sections.schematicHighlights && (
            <AccordionSection title="Schematic Highlights">
              <p className="text-zinc-400 text-sm leading-relaxed">{sections.schematicHighlights}</p>
            </AccordionSection>
          )}

          {sections.pcbHighlights && (
            <AccordionSection title="PCB Layout">
              <p className="text-zinc-400 text-sm leading-relaxed">{sections.pcbHighlights}</p>
            </AccordionSection>
          )}

          {sections.validation && (
            <AccordionSection title="Validation & Testing">
              <p className="text-zinc-400 text-sm leading-relaxed">{sections.validation}</p>
            </AccordionSection>
          )}

          {sections.challenges && (
            <AccordionSection title="Challenges & Tradeoffs">
              <p className="text-zinc-400 text-sm leading-relaxed">{sections.challenges}</p>
            </AccordionSection>
          )}

          {sections.results && (
            <AccordionSection title="Results">
              <p className="text-zinc-400 text-sm leading-relaxed">{sections.results}</p>
            </AccordionSection>
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
