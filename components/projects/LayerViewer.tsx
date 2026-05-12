'use client'

import { useState } from 'react'
import { PCBLayer } from '@/types/project'

interface Props {
  layers: PCBLayer[]
}

export default function LayerViewer({ layers }: Props) {
  const isSvgMode = layers.some(l => l.url.endsWith('.svg'))

  // SVG layers: show one at a time (they're already colored composites from tracespace)
  // PNG layers: multi-toggle with blend-mode compositing (monochrome white-on-black exports)
  const defaultActive = layers.find(l => l.defaultVisible)?.name ?? layers[0]?.name
  const [active, setActive] = useState<string>(defaultActive)

  // PNG multi-toggle state
  const [visible, setVisible] = useState<Record<string, boolean>>(
    Object.fromEntries(layers.map(l => [l.name, l.defaultVisible]))
  )

  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

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

  const activeLayer = layers.find(l => l.name === active)

  return (
    <div className="rounded-xl border border-zinc-800 overflow-hidden bg-zinc-950">
      {/* Layer controls */}
      <div className="flex flex-wrap gap-2 p-3 border-b border-zinc-800 bg-zinc-900/50">
        {layers.map(layer => {
          const isOn = isSvgMode ? active === layer.name : visible[layer.name]
          return (
            <button
              key={layer.name}
              onClick={() => {
                if (isSvgMode) {
                  setActive(layer.name)
                  resetView()
                } else {
                  setVisible(v => ({ ...v, [layer.name]: !v[layer.name] }))
                }
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono transition-all ${
                isOn
                  ? 'bg-zinc-800 text-zinc-100 border border-zinc-600'
                  : 'bg-zinc-900 text-zinc-600 border border-zinc-800 opacity-50'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: layer.color }} />
              {layer.label}
            </button>
          )
        })}
        <button
          onClick={resetView}
          className="ml-auto px-2.5 py-1 rounded text-xs text-zinc-500 hover:text-zinc-300 border border-zinc-800 hover:border-zinc-600 transition-colors"
        >
          Reset view
        </button>
      </div>

      {/* Canvas */}
      <div
        className="relative aspect-video overflow-hidden cursor-grab active:cursor-grabbing select-none"
        style={{ background: '#111' }}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'center center',
          }}
        >
          {isSvgMode ? (
            // SVG mode: show the selected layer directly — tracespace SVGs are already colored composites
            activeLayer && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={activeLayer.url}
                alt={activeLayer.label}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain' }}
                draggable={false}
              />
            )
          ) : (
            // PNG mode: monochrome white-on-black — tint with color overlay + multiply, screen-composite layers
            layers.map(layer => (
              <div
                key={layer.name}
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: visible[layer.name] ? 'block' : 'none',
                  mixBlendMode: 'screen',
                }}
              >
                <div style={{ position: 'absolute', inset: 0, backgroundColor: layer.color }} />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={layer.url}
                  alt={layer.label}
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', mixBlendMode: 'multiply' }}
                  draggable={false}
                />
              </div>
            ))
          )}
        </div>

        <div className="absolute bottom-3 right-3 font-mono text-xs text-zinc-600 bg-zinc-950/70 px-2 py-1 rounded">
          {Math.round(zoom * 100)}%
        </div>
        <div className="absolute bottom-3 left-3 text-xs text-zinc-600">
          Scroll to zoom · Drag to pan
        </div>
      </div>
    </div>
  )
}
