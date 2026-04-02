'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronDown,
  CircuitBoard, Cpu, Wrench, FlaskConical, Layers,
  type LucideIcon,
} from 'lucide-react'
import TechBadge from './TechBadge'
import type { Subsystem } from '@/types/project'

const ICONS: Record<string, LucideIcon> = {
  CircuitBoard, Cpu, Wrench, FlaskConical, Layers,
}

export default function SubsystemsAccordion({ items }: { items: Subsystem[] }) {
  const [open, setOpen] = useState<Record<number, boolean>>(() =>
    Object.fromEntries(items.map((item, i) => [i, item.defaultOpen ?? i === 0]))
  )

  const toggle = (i: number) => setOpen(prev => ({ ...prev, [i]: !prev[i] }))

  return (
    <div className="space-y-2">
      {items.map((item, i) => {
        const Icon = ICONS[item.icon] ?? CircuitBoard
        const isOpen = !!open[i]
        return (
          <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
            <button
              onClick={() => toggle(i)}
              className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-zinc-800/40 transition-colors"
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                <Icon size={14} className="text-sky-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-zinc-100">{item.label}</p>
                <p className="text-xs text-zinc-500 mt-0.5 truncate">{item.summary}</p>
              </div>
              <ChevronDown
                size={15}
                className={`flex-shrink-0 text-zinc-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
              />
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22, ease: [0.21, 0.47, 0.32, 0.98] }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5 border-t border-zinc-800">
                    <p className="text-zinc-400 text-sm leading-relaxed mt-4">{item.body}</p>
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {item.tags.map(tag => <TechBadge key={tag} label={tag} />)}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
