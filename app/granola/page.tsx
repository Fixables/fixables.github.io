import type { Metadata } from 'next'
import { Mountain } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Granola — Andy Setiawan',
  description: 'Hiking, outdoors, and other adventures.',
}

export default function GranolaPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
            <Mountain size={28} className="text-sky-400" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-zinc-50 mb-2">Granola</h1>
        <p className="text-zinc-500 text-sm mb-6 leading-relaxed">
          Hiking logs, trail notes, and other non-engineering adventures.<br />
          Still under construction — check back later.
        </p>
        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-zinc-500">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          coming soon
        </span>
      </div>
    </div>
  )
}
