import { ExperienceEntry } from '@/types/experience'
import TimelineEntry from './TimelineEntry'

interface TimelineProps {
  entries: ExperienceEntry[]
}

export default function Timeline({ entries }: TimelineProps) {
  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-4 sm:left-6 top-0 bottom-0 w-px bg-zinc-800" />

      <div className="space-y-12">
        {entries.map((entry) => (
          <TimelineEntry key={entry.id} entry={entry} />
        ))}
      </div>
    </div>
  )
}
