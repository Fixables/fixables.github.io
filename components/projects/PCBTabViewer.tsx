'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { ProjectData } from '@/types/project'
import LayerViewer from './LayerViewer'
import SchematicViewer from './SchematicViewer'
import BOMTable from './BOMTable'

const PCBViewer3D = dynamic(() => import('./PCBViewer'), {
  ssr: false,
  loading: () => (
    <div className="aspect-video bg-zinc-950 rounded-xl border border-zinc-800 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-zinc-700 border-t-sky-400 rounded-full animate-spin" />
    </div>
  ),
})

type Tab = '3d' | 'layers' | 'schematic' | 'bom'

interface Props {
  project: ProjectData
}

function SubSelector({ items, active, onSelect }: {
  items: string[]
  active: number
  onSelect: (i: number) => void
}) {
  if (items.length <= 1) return null
  return (
    <div className="flex gap-1 mb-3 flex-wrap">
      {items.map((label, i) => (
        <button
          key={i}
          onClick={() => onSelect(i)}
          className={`px-3 py-1 rounded text-xs font-mono transition-all border ${
            active === i
              ? 'bg-zinc-800 text-zinc-100 border-zinc-600'
              : 'bg-zinc-900 text-zinc-500 border-zinc-800 hover:text-zinc-300 hover:border-zinc-700'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

export default function PCBTabViewer({ project }: Props) {
  // Resolve 3D models — models3d takes priority over model3d
  const allModels = project.models3d?.length
    ? project.models3d
    : project.model3d
      ? [{ label: '3D Model', url: project.model3d }]
      : []
  const has3D = allModels.length > 0

  // Resolve layer groups — pcbLayerGroups takes priority over pcbLayers
  const allLayerGroups = project.pcbLayerGroups?.length
    ? project.pcbLayerGroups
    : project.pcbLayers?.length
      ? [{ label: 'PCB', layers: project.pcbLayers }]
      : []
  const hasLayers = allLayerGroups.length > 0

  const hasBOM = !!project.bomData?.length

  // Merge schematic + schematics; PDFs are download-only, not rendered
  const rawSchematics = [
    ...(project.schematic ? [project.schematic] : []),
    ...(project.schematics ?? []),
  ]
  const displaySchematics = rawSchematics.filter(s => !s.endsWith('.pdf'))
  const schematicPdf = rawSchematics.find(s => s.endsWith('.pdf'))
  const hasSchematic = displaySchematics.length > 0 || !!schematicPdf

  // Build tab list
  const tabs: { id: Tab; label: string }[] = [
    ...(has3D        ? [{ id: '3d'        as Tab, label: '3D Model'  }] : []),
    ...(hasLayers    ? [{ id: 'layers'    as Tab, label: '2D Layers' }] : []),
    ...(hasSchematic ? [{ id: 'schematic' as Tab, label: 'Schematic' }] : []),
    ...(hasBOM       ? [{ id: 'bom'       as Tab, label: 'BOM'       }] : []),
  ]

  const [active, setActive] = useState<Tab>(tabs[0]?.id ?? '3d')
  const [activeModel, setActiveModel] = useState(0)
  const [activeGroup, setActiveGroup] = useState(0)

  if (tabs.length === 0) return null

  const showTabs = tabs.length > 1

  return (
    <div>
      {showTabs && (
        <div className="flex gap-1 mb-4 bg-zinc-900 border border-zinc-800 rounded-lg p-1 w-fit">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={`px-3.5 py-1.5 rounded text-sm font-medium transition-all ${
                active === tab.id
                  ? 'bg-sky-400 text-zinc-950'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {active === '3d' && has3D && (
        <div>
          <SubSelector
            items={allModels.map(m => m.label)}
            active={activeModel}
            onSelect={setActiveModel}
          />
          <PCBViewer3D modelPath={allModels[activeModel]?.url} />
        </div>
      )}

      {active === 'layers' && hasLayers && (
        <div>
          <SubSelector
            items={allLayerGroups.map(g => g.label)}
            active={activeGroup}
            onSelect={setActiveGroup}
          />
          <LayerViewer layers={allLayerGroups[activeGroup]?.layers ?? []} />
        </div>
      )}

      {active === 'schematic' && hasSchematic && (
        displaySchematics.length > 0 ? (
          <SchematicViewer
            srcs={displaySchematics}
            title={project.title}
            downloadUrl={schematicPdf}
          />
        ) : (
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-8 flex flex-col items-center gap-4">
            <p className="text-zinc-500 text-sm">Schematic available as PDF download</p>
            {schematicPdf && (
              <a
                href={schematicPdf}
                download
                className="flex items-center gap-2 px-4 py-2 rounded border border-zinc-700 text-zinc-300 hover:border-sky-400 hover:text-sky-400 text-sm transition-colors"
              >
                Download PDF
              </a>
            )}
          </div>
        )
      )}

      {active === 'bom' && hasBOM && (
        <div className="space-y-2">
          <BOMTable bom={project.bomData!} />
        </div>
      )}
    </div>
  )
}
