'use client'

import { useState } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

interface ProjectGalleryProps {
  images: string[]
  title: string
}

export default function ProjectGallery({ images, title }: ProjectGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  if (!images || images.length === 0) return null

  const prev = () => setLightboxIndex((i) => (i !== null ? (i - 1 + images.length) % images.length : null))
  const next = () => setLightboxIndex((i) => (i !== null ? (i + 1) % images.length : null))

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {images.map((src, i) => (
          <button
            key={i}
            onClick={() => setLightboxIndex(i)}
            className="aspect-video bg-zinc-800 rounded-lg overflow-hidden hover:opacity-80 transition-opacity flex items-center justify-center"
            aria-label={`View image ${i + 1}`}
          >
            <span className="text-zinc-600 text-xs font-mono">img {i + 1}</span>
          </button>
        ))}
      </div>

      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxIndex(null)}
        >
          <button onClick={(e) => { e.stopPropagation(); prev() }} className="absolute left-4 text-white hover:text-sky-400 transition-colors" aria-label="Previous">
            <ChevronLeft size={32} />
          </button>
          <div className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="bg-zinc-900 rounded-lg aspect-video flex items-center justify-center">
              <span className="text-zinc-500 font-mono text-sm">{images[lightboxIndex]}</span>
            </div>
            <p className="text-center text-zinc-400 text-sm mt-3">{lightboxIndex + 1} / {images.length}</p>
          </div>
          <button onClick={(e) => { e.stopPropagation(); next() }} className="absolute right-4 text-white hover:text-sky-400 transition-colors" aria-label="Next">
            <ChevronRight size={32} />
          </button>
          <button onClick={() => setLightboxIndex(null)} className="absolute top-4 right-4 text-white hover:text-sky-400 transition-colors" aria-label="Close">
            <X size={24} />
          </button>
        </div>
      )}
    </>
  )
}
