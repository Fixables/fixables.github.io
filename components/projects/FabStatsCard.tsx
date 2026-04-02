import { Layers, Ruler, Zap, Circle, Factory } from 'lucide-react'
import { FabStats } from '@/types/project'

interface Props {
  stats: FabStats
}

export default function FabStatsCard({ stats }: Props) {
  const rows = [
    { icon: <Layers size={13} />, label: 'Layers', value: `${stats.layers}-layer` },
    { icon: <Ruler size={13} />, label: 'Dimensions', value: stats.dimensions },
    ...(stats.minTrace ? [{ icon: <Zap size={13} />, label: 'Min trace', value: stats.minTrace }] : []),
    ...(stats.minVia   ? [{ icon: <Circle size={13} />, label: 'Min via', value: stats.minVia }] : []),
    ...(stats.surface  ? [{ icon: <Layers size={13} />, label: 'Surface', value: stats.surface }] : []),
    ...(stats.manufacturer ? [{ icon: <Factory size={13} />, label: 'Fab', value: stats.manufacturer }] : []),
  ]

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
      <h3 className="font-mono text-xs text-zinc-500 uppercase tracking-wider mb-4">Fabrication Specs</h3>
      <dl className="space-y-2.5">
        {rows.map(row => (
          <div key={row.label} className="flex items-center justify-between gap-3">
            <dt className="flex items-center gap-2 text-xs text-zinc-500">
              <span className="text-zinc-600">{row.icon}</span>
              {row.label}
            </dt>
            <dd className="font-mono text-xs text-zinc-300 text-right">{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
