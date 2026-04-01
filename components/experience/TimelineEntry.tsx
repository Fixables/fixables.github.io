import { ExperienceEntry } from '@/types/experience'
import AnimatedReveal from '@/components/ui/AnimatedReveal'

interface TimelineEntryProps {
  entry: ExperienceEntry
}

const typeColors: Record<string, string> = {
  work: 'bg-green-400',
  education: 'bg-sky-400',
  'design-team': 'bg-violet-400',
  volunteer: 'bg-amber-400',
}

const typeLabels: Record<string, string> = {
  work: 'Work',
  education: 'Education',
  'design-team': 'Design Team',
  volunteer: 'Volunteer',
}

export default function TimelineEntry({ entry }: TimelineEntryProps) {
  return (
    <AnimatedReveal>
      <div className="relative pl-12 sm:pl-16">
        {/* Dot */}
        <div className={`absolute left-2.5 sm:left-4 top-1.5 w-3 h-3 rounded-full ${typeColors[entry.type]} ring-4 ring-zinc-950`} />

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          {/* Header */}
          <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
            <div>
              <span className={`inline-block font-mono text-xs px-2 py-0.5 rounded mb-2 ${typeColors[entry.type]} text-zinc-950`}>
                {typeLabels[entry.type]}
              </span>
              <h3 className="text-lg font-semibold text-zinc-50">{entry.role}</h3>
              <p className="text-sky-400 font-medium">{entry.organization}</p>
              <p className="text-sm text-zinc-500">{entry.location}</p>
            </div>
            <div className="text-right">
              <p className="font-mono text-sm text-zinc-400">
                {entry.startDate} — {entry.endDate}
              </p>
            </div>
          </div>

          {/* Scholarship callout */}
          {entry.scholarship && (
            <div className="mb-4 bg-sky-400/10 border border-sky-400/20 rounded-lg p-4">
              <p className="font-mono text-xs text-sky-400 uppercase tracking-wider mb-1">Merit Scholarship</p>
              <p className="text-sky-300 font-semibold text-lg">{entry.scholarship.amount}</p>
              <p className="text-sm text-zinc-400 mt-1">{entry.scholarship.description}</p>
            </div>
          )}

          {/* Highlights */}
          <ul className="space-y-2">
            {entry.highlights.map((highlight, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-zinc-400">
                <span className="text-sky-400 mt-1 flex-shrink-0">›</span>
                {highlight}
              </li>
            ))}
          </ul>

          {/* Tags */}
          {entry.tags && entry.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-zinc-800">
              {entry.tags.map((tag) => (
                <span key={tag} className="text-xs text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </AnimatedReveal>
  )
}
