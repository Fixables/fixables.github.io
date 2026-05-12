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
            className="aspect-video bg-zinc-800 rounded-lg overflow-hidden hover:opacity-80 transition-opacity"
            aria-label={`View image ${i + 1}`}
          >
            <img
              src={src}
              alt={`${title} — photo ${i + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>

      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            onClick={(e) => { e.stopPropagation(); prev() }}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-sky-400 transition-colors"
            aria-label="Previous"
          >
            <ChevronLeft size={32} />
          </button>
          <div className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="bg-zinc-900 rounded-lg overflow-hidden aspect-video flex items-center justify-center">
              <img
                src={images[lightboxIndex]}
                alt={`${title} — photo ${lightboxIndex + 1}`}
                className="w-full h-full object-contain"
              />
            </div>
            <p className="text-center text-zinc-400 text-sm mt-3">{lightboxIndex + 1} / {images.length}</p>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); next() }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-sky-400 transition-colors"
            aria-label="Next"
          >
            <ChevronRight size={32} />
          </button>
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-4 right-4 text-white hover:text-sky-400 transition-colors"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>
      )}
    </>
  )
}
