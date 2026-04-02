'use client'

import { useState } from 'react'
import Image from 'next/image'
import { PCBLayer } from '@/types/project'

interface Props {
  layers: PCBLayer[]
}

// Each layer PNG is rendered in its tint color using CSS filter tricks.
// The PNG should be a monochrome export (white traces on black background).
// We use mix-blend-mode: screen so overlapping layers composite naturally.

export default function LayerViewer({ layers }: Props) {
  const [visible, setVisible] = useState<Record<string, boolean>>(
    Object.fromEntries(layers.map(l => [l.name, l.defaultVisible]))
  )
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  function toggleLayer(name: string) {
    setVisible(v => ({ ...v, [name]: !v[name] }))
  }

  function handleWheel(e: React.WheelEvent) {
    e.preventDefault()
    setZoom(z => Math.min(8, Math.max(0.3, z - e.deltaY * 0.001)))
  }

  function handleMouseDown(e: React.MouseEvent) {
    setDragging(true)
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
  }

  function handleMouseMove(e: React.MouseEvent) {
    if (!dragging) return
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y })
  }

  function handleMouseUp() { setDragging(false) }

  function resetView() { setZoom(1); setPan({ x: 0, y: 0 }) }

  return (
    <div className="rounded-xl border border-zinc-800 overflow-hidden bg-zinc-950">
      {/* Layer toggles */}
      <div className="flex flex-wrap gap-2 p-3 border-b border-zinc-800 bg-zinc-900/50">
        {layers.map(layer => (
          <button
            key={layer.name}
            onClick={() => toggleLayer(layer.name)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono transition-all ${
              visible[layer.name]
                ? 'bg-zinc-800 text-zinc-100 border border-zinc-600'
                : 'bg-zinc-900 text-zinc-600 border border-zinc-800 opacity-50'
            }`}
          >
            <span
              className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
              style={{ backgroundColor: layer.color }}
            />
            {layer.label}
          </button>
        ))}
        <button
          onClick={resetView}
          className="ml-auto px-2.5 py-1 rounded text-xs text-zinc-500 hover:text-zinc-300 border border-zinc-800 hover:border-zinc-600 transition-colors"
        >
          Reset view
        </button>
      </div>

      {/* Canvas area */}
      <div
        className="relative aspect-video overflow-hidden cursor-grab active:cursor-grabbing select-none"
        style={{ background: '#000' }}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Stacked layer images */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'center center',
          }}
        >
          {layers.map(layer => (
            <div
              key={layer.name}
              style={{
                position: 'absolute',
                inset: 0,
                display: visible[layer.name] ? 'block' : 'none',
                mixBlendMode: 'screen',
              }}
            >
              <Image
                src={layer.url}
                alt={layer.label}
                fill
                className="object-contain"
                style={{ filter: `brightness(0) saturate(100%) invert(1) sepia(1) hue-rotate(0deg)` }}
                unoptimized
              />
              {/* Color tint overlay */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: layer.color,
                  mixBlendMode: 'multiply',
                  opacity: 0.9,
                  pointerEvents: 'none',
                }}
              />
            </div>
          ))}
        </div>

        {/* Zoom indicator */}
        <div className="absolute bottom-3 right-3 font-mono text-xs text-zinc-600 bg-zinc-950/70 px-2 py-1 rounded">
          {Math.round(zoom * 100)}%
        </div>

        {/* Hint */}
        <div className="absolute bottom-3 left-3 text-xs text-zinc-600">
          Scroll to zoom · Drag to pan
        </div>
      </div>
    </div>
  )
}
