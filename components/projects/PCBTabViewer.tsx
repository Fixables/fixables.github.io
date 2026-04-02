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

export default function PCBTabViewer({ project }: Props) {
  const has3D        = !!project.model3d
  const hasLayers    = !!project.pcbLayers?.length
  const hasSchematic = !!project.schematic
  const hasBOM       = !!project.bomData?.length

  // Build available tabs in display order
  const tabs: { id: Tab; label: string }[] = [
    ...(has3D        ? [{ id: '3d'        as Tab, label: '3D Model'  }] : []),
    ...(hasLayers    ? [{ id: 'layers'    as Tab, label: '2D Layers' }] : []),
    ...(hasSchematic ? [{ id: 'schematic' as Tab, label: 'Schematic' }] : []),
    ...(hasBOM       ? [{ id: 'bom'       as Tab, label: 'BOM'       }] : []),
  ]

  const [active, setActive] = useState<Tab>(tabs[0]?.id ?? '3d')

  if (tabs.length === 0) return null

  // Single tab — skip tab bar
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
        <PCBViewer3D modelPath={project.model3d!} />
      )}

      {active === 'layers' && hasLayers && (
        <LayerViewer layers={project.pcbLayers!} />
      )}

      {active === 'schematic' && hasSchematic && (
        <SchematicViewer
          src={project.schematic!}
          title={project.title}
          downloadUrl={project.schematic!.endsWith('.pdf') ? project.schematic : undefined}
        />
      )}

      {active === 'bom' && hasBOM && (
        <div className="space-y-2">
          <BOMTable bom={project.bomData!} />
        </div>
      )}
    </div>
  )
}
