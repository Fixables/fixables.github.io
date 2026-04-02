'use client'

import { useState, useMemo } from 'react'
import { ChevronUp, ChevronDown, Search } from 'lucide-react'
import { BOMEntry } from '@/types/project'

type SortKey = keyof BOMEntry
type SortDir = 'asc' | 'desc'

interface Props {
  bom: BOMEntry[]
}

export default function BOMTable({ bom }: Props) {
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('ref')
  const [sortDir, setSortDir] = useState<SortDir>('asc')

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return bom
      .filter(e =>
        e.ref.toLowerCase().includes(q) ||
        e.value.toLowerCase().includes(q) ||
        e.footprint.toLowerCase().includes(q) ||
        (e.note ?? '').toLowerCase().includes(q)
      )
      .sort((a, b) => {
        const av = a[sortKey] ?? ''
        const bv = b[sortKey] ?? ''
        const cmp = String(av).localeCompare(String(bv), undefined, { numeric: true })
        return sortDir === 'asc' ? cmp : -cmp
      })
  }, [bom, search, sortKey, sortDir])

  const totalQty = useMemo(() => filtered.reduce((s, e) => s + e.qty, 0), [filtered])

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
  }

  function SortIcon({ k }: { k: SortKey }) {
    if (sortKey !== k) return <ChevronUp size={10} className="text-zinc-700" />
    return sortDir === 'asc'
      ? <ChevronUp size={10} className="text-sky-400" />
      : <ChevronDown size={10} className="text-sky-400" />
  }

  const cols: { key: SortKey; label: string; className: string }[] = [
    { key: 'ref', label: 'Ref', className: 'w-20' },
    { key: 'value', label: 'Value', className: 'min-w-[120px]' },
    { key: 'footprint', label: 'Footprint', className: 'min-w-[100px]' },
    { key: 'qty', label: 'Qty', className: 'w-14 text-right' },
    { key: 'note', label: 'Note', className: 'min-w-[140px] text-zinc-500' },
  ]

  return (
    <div className="rounded-xl border border-zinc-800 overflow-hidden">
      {/* Search + stats bar */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800 bg-zinc-900/50">
        <div className="relative flex-1 max-w-xs">
          <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-600" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Filter components…"
            className="w-full pl-7 pr-3 py-1.5 text-xs bg-zinc-900 border border-zinc-700 rounded text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-sky-400"
          />
        </div>
        <span className="text-xs text-zinc-600 font-mono ml-auto">
          {filtered.length} lines · {totalQty} parts
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/30">
              {cols.map(col => (
                <th
                  key={col.key}
                  onClick={() => toggleSort(col.key)}
                  className={`px-4 py-2.5 text-left font-mono text-zinc-500 uppercase tracking-wider cursor-pointer hover:text-zinc-300 select-none ${col.className}`}
                >
                  <span className="flex items-center gap-1">
                    {col.label} <SortIcon k={col.key} />
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-zinc-600 font-mono text-xs">
                  No components match "{search}"
                </td>
              </tr>
            ) : (
              filtered.map((entry, i) => (
                <tr
                  key={`${entry.ref}-${i}`}
                  className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors"
                >
                  <td className="px-4 py-2 font-mono text-sky-400 font-medium">{entry.ref}</td>
                  <td className="px-4 py-2 text-zinc-300">{entry.value}</td>
                  <td className="px-4 py-2 text-zinc-500 font-mono">{entry.footprint}</td>
                  <td className="px-4 py-2 text-right text-zinc-300 font-mono">{entry.qty}</td>
                  <td className="px-4 py-2 text-zinc-600">{entry.note ?? '—'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
