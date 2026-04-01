interface TechBadgeProps {
  label: string
  variant?: 'default' | 'category'
}

const categoryColors: Record<string, string> = {
  firmware: 'text-sky-400 bg-sky-400/10 border-sky-400/20',
  pcb: 'text-green-400 bg-green-400/10 border-green-400/20',
  embedded: 'text-violet-400 bg-violet-400/10 border-violet-400/20',
  software: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  robotics: 'text-rose-400 bg-rose-400/10 border-rose-400/20',
}

export default function TechBadge({ label, variant = 'default' }: TechBadgeProps) {
  if (variant === 'category') {
    const colorClass = categoryColors[label] ?? 'text-zinc-400 bg-zinc-800 border-zinc-700'
    return (
      <span className={`inline-block font-mono text-xs px-2 py-0.5 rounded border ${colorClass}`}>
        {label}
      </span>
    )
  }
  return (
    <span className="inline-block text-xs text-zinc-500 bg-zinc-800 border border-zinc-700/50 px-2 py-0.5 rounded">
      {label}
    </span>
  )
}
