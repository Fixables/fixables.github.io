'use client'

import type { ProjectCategory } from '@/types/project'

const categories: { value: 'all' | ProjectCategory; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'firmware', label: 'Firmware' },
  { value: 'pcb', label: 'PCB Design' },
  { value: 'embedded', label: 'Embedded' },
  { value: 'robotics', label: 'Robotics' },
  { value: 'software', label: 'Software' },
]

interface ProjectFilterProps {
  active: 'all' | ProjectCategory
  onChange: (cat: 'all' | ProjectCategory) => void
  counts: Record<string, number>
}

export default function ProjectFilter({ active, onChange, counts }: ProjectFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((cat) => {
        const isActive = active === cat.value
        const count = counts[cat.value] ?? 0
        return (
          <button
            key={cat.value}
            onClick={() => onChange(cat.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              isActive
                ? 'bg-sky-400 text-zinc-950'
                : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200'
            }`}
          >
            {cat.label}
            {cat.value !== 'all' && (
              <span className={`ml-1.5 font-mono text-xs ${isActive ? 'text-zinc-800' : 'text-zinc-600'}`}>
                {count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
