'use client'

import dynamic from 'next/dynamic'

const PCBViewer = dynamic(() => import('./PCBViewer'), {
  ssr: false,
  loading: () => (
    <div className="aspect-video bg-zinc-950 rounded-xl border border-zinc-800 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-zinc-700 border-t-sky-400 rounded-full animate-spin" />
    </div>
  ),
})

export default PCBViewer
