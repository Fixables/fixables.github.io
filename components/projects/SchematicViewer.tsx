'use client'

import { useState, useRef, useCallback } from 'react'
import Image from 'next/image'
import { ZoomIn, ZoomOut, Maximize2, Download, ChevronLeft, ChevronRight } from 'lucide-react'

interface Props {
  srcs: string[]
  title: string
  downloadUrl?: string
}

export default function SchematicViewer({ srcs, title, downloadUrl }: Props) {
  const [page, setPage] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const dragStart = useRef({ x: 0, y: 0 })
  const panAtDrag = useRef({ x: 0, y: 0 })

  const src = srcs[page]
  const isSvg = src.endsWith('.svg')
  const pageLabel = srcs.length > 1 ? `${page + 1} / ${srcs.length}` : ''

  function goTo(i: number) {
    setPage(i)
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }

  function handleWheel(e: React.WheelEvent) {
    e.preventDefault()
    const delta = e.deltaY * -0.0012
    setZoom(z => Math.min(10, Math.max(0.2, z + z * delta)))
  }

  function onMouseDown(e: React.MouseEvent) {
    setDragging(true)
    dragStart.current = { x: e.clientX, y: e.clientY }
    panAtDrag.current = { ...pan }
  }

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging) return
    setPan({
      x: panAtDrag.current.x + (e.clientX - dragStart.current.x),
      y: panAtDrag.current.y + (e.clientY - dragStart.current.y),
    })
  }, [dragging])

  function onMouseUp() { setDragging(false) }
  function resetView() { setZoom(1); setPan({ x: 0, y: 0 }) }
  function zoomIn() { setZoom(z => Math.min(10, z * 1.3)) }
  function zoomOut() { setZoom(z => Math.max(0.2, z / 1.3)) }

  // Derive a short label from the filename for the page indicator
  function pageTitle(src: string) {
    const name = src.split('/').pop()?.replace(/\.[^.]+$/, '') ?? ''
    return name.replace(/_/g, ' ')
  }

  return (
    <div className="rounded-xl border border-zinc-800 overflow-hidden bg-zinc-950">
      {/* Toolbar */}
      <div className="flex items-center gap-2 p-3 border-b border-zinc-800 bg-zinc-900/50 flex-wrap">
        <span className="text-xs text-zinc-500 font-mono flex-1 truncate">
          {title} — {pageTitle(src)}
        </span>

        {/* Page navigation */}
        {srcs.length > 1 && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => goTo(Math.max(0, page - 1))}
              disabled={page === 0}
              className="p-1.5 rounded hover:bg-zinc-800 text-zinc-500 hover:text-zinc-200 transition-colors disabled:opacity-30"
            >
              <ChevronLeft size={14} />
            </button>
            <span className="text-xs text-zinc-600 font-mono w-12 text-center tabular-nums">{pageLabel}</span>
            <button
              onClick={() => goTo(Math.min(srcs.length - 1, page + 1))}
              disabled={page === srcs.length - 1}
              className="p-1.5 rounded hover:bg-zinc-800 text-zinc-500 hover:text-zinc-200 transition-colors disabled:opacity-30"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        )}

        <button onClick={zoomOut} className="p-1.5 rounded hover:bg-zinc-800 text-zinc-500 hover:text-zinc-200 transition-colors">
          <ZoomOut size={14} />
        </button>
        <span className="text-xs text-zinc-600 font-mono w-10 text-center tabular-nums">
          {Math.round(zoom * 100)}%
        </span>
        <button onClick={zoomIn} className="p-1.5 rounded hover:bg-zinc-800 text-zinc-500 hover:text-zinc-200 transition-colors">
          <ZoomIn size={14} />
        </button>
        <button onClick={resetView} className="p-1.5 rounded hover:bg-zinc-800 text-zinc-500 hover:text-zinc-200 transition-colors" title="Reset view">
          <Maximize2 size={14} />
        </button>
        {downloadUrl && (
          <a
            href={downloadUrl}
            download
            className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs text-zinc-400 hover:text-sky-400 border border-zinc-700 hover:border-sky-400 transition-colors ml-1"
          >
            <Download size={12} /> PDF
          </a>
        )}
      </div>

      {/* Page dots */}
      {srcs.length > 1 && (
        <div className="flex justify-center gap-1.5 py-2 bg-zinc-900/30 border-b border-zinc-800">
          {srcs.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                i === page ? 'bg-sky-400' : 'bg-zinc-700 hover:bg-zinc-500'
              }`}
            />
          ))}
        </div>
      )}

      {/* Viewer area */}
      <div
        className="relative overflow-hidden cursor-grab active:cursor-grabbing select-none"
        style={{ height: '480px', background: '#fff' }}
        onWheel={handleWheel}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: 'center center',
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {isSvg ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={src}
                alt={`${title} schematic`}
                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                draggable={false}
              />
            ) : (
              <Image
                src={src}
                alt={`${title} schematic`}
                fill
                className="object-contain"
                unoptimized
                draggable={false}
              />
            )}
          </div>
        </div>

        <div className="absolute bottom-3 left-3 text-xs text-zinc-400 bg-black/30 px-2 py-1 rounded pointer-events-none">
          Scroll to zoom · Drag to pan
        </div>
      </div>
    </div>
  )
}
