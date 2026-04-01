'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { ArrowLeft, Check, RotateCcw, Trash2 } from 'lucide-react'
import CircuitBackground from '@/components/sections/CircuitBackground'
import BulbBackground from '@/components/sections/BulbBackground'
import {
  CircuitConfig, BulbConfig,
  DEFAULT_CIRCUIT, DEFAULT_BULB,
  BG_LS_KEY, BgOverride,
} from '@/types/bg-config'

// ── Param slider ─────────────────────────────────────────────
function Param({
  label, min, max, step, value, onChange, fmt,
}: {
  label: string
  min: number; max: number; step: number; value: number
  onChange: (v: number) => void
  fmt?: (v: number) => string
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-baseline">
        <span className="text-xs text-zinc-400">{label}</span>
        <span className="text-xs text-zinc-500 font-mono tabular-nums">
          {fmt ? fmt(value) : value}
        </span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        className="w-full h-1 rounded appearance-none cursor-pointer accent-sky-400 bg-zinc-700"
      />
    </div>
  )
}

// ── Section header ────────────────────────────────────────────
function Section({ label }: { label: string }) {
  return (
    <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-600 pt-2 pb-0.5">
      {label}
    </p>
  )
}

// ── Main page ─────────────────────────────────────────────────
export default function EditBgPage() {
  const [mode, setMode] = useState<'circuit' | 'bulb'>('circuit')
  const [circuit, setCircuit] = useState<CircuitConfig>(DEFAULT_CIRCUIT)
  const [bulb, setBulb] = useState<BulbConfig>(DEFAULT_BULB)
  const [saved, setSaved] = useState(false)
  const [cleared, setCleared] = useState(false)

  // Load any existing override on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(BG_LS_KEY)
      if (!raw) return
      const o: BgOverride = JSON.parse(raw)
      if (o.mode) setMode(o.mode)
      if (o.circuit) setCircuit({ ...DEFAULT_CIRCUIT, ...o.circuit })
      if (o.bulb) setBulb({ ...DEFAULT_BULB, ...o.bulb })
    } catch { /* ignore */ }
  }, [])

  const setC = useCallback(<K extends keyof CircuitConfig>(k: K, v: CircuitConfig[K]) => {
    setCircuit(prev => ({ ...prev, [k]: v }))
  }, [])

  const setB = useCallback(<K extends keyof BulbConfig>(k: K, v: BulbConfig[K]) => {
    setBulb(prev => ({ ...prev, [k]: v }))
  }, [])

  function applyToHero() {
    const override: BgOverride = { mode, circuit, bulb }
    localStorage.setItem(BG_LS_KEY, JSON.stringify(override))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function resetDefaults() {
    if (mode === 'circuit') setCircuit(DEFAULT_CIRCUIT)
    else setBulb(DEFAULT_BULB)
  }

  function clearOverride() {
    localStorage.removeItem(BG_LS_KEY)
    setCleared(true)
    setTimeout(() => setCleared(false), 2000)
  }

  return (
    <div className="relative min-h-screen bg-zinc-950 overflow-hidden">

      {/* ── Live background preview ───────────────────────── */}
      <div className="absolute inset-0">
        {mode === 'circuit'
          ? <CircuitBackground config={circuit} />
          : <BulbBackground config={bulb} />
        }
      </div>

      {/* ── Demo hero content (so you see it behind the bg) ── */}
      <div className="relative z-10 pointer-events-none select-none
                      flex flex-col justify-center min-h-screen
                      pl-10 sm:pl-16 pr-[340px] sm:pr-[360px]">
        <p className="text-zinc-400 text-sm mb-2">Hey there! 👋</p>
        <h1 className="text-4xl sm:text-5xl font-bold text-zinc-50 tracking-tight leading-tight mb-3">
          I'm Andy Setiawan
        </h1>
        <p className="text-zinc-400 leading-relaxed max-w-md text-sm">
          Electrical Engineering student at UBC — I love building things,
          breaking things, and figuring out why they broke.
        </p>
        <div className="flex gap-3 mt-6">
          <span className="px-4 py-2 bg-sky-400 text-zinc-950 text-sm font-semibold rounded-lg">
            See my work
          </span>
          <span className="px-4 py-2 border border-zinc-700 text-zinc-400 text-sm rounded-lg">
            Download CV
          </span>
        </div>
      </div>

      {/* ── Top-left back link ────────────────────────────── */}
      <div className="absolute top-4 left-4 z-30">
        <Link href="/"
          className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-sky-400 transition-colors">
          <ArrowLeft size={12} /> Home
        </Link>
      </div>

      {/* ── Control panel ────────────────────────────────── */}
      <aside className="
        fixed top-0 right-0 h-full w-[320px] sm:w-[340px] z-20
        bg-zinc-950/85 backdrop-blur-md border-l border-zinc-800
        flex flex-col overflow-hidden
      ">
        {/* Header */}
        <div className="px-5 pt-5 pb-3 border-b border-zinc-800 flex-shrink-0">
          <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-1">
            Background Editor
          </p>
          <h2 className="text-sm font-semibold text-zinc-100">Live preview — changes apply instantly</h2>
        </div>

        {/* Mode tabs */}
        <div className="px-5 py-3 border-b border-zinc-800 flex-shrink-0">
          <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-600 mb-2">Mode</p>
          <div className="flex gap-2">
            {(['circuit', 'bulb'] as const).map(m => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 py-1.5 text-xs rounded font-medium transition-colors ${
                  mode === m
                    ? 'bg-sky-400 text-zinc-950'
                    : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {m === 'circuit' ? 'Circuit Traces' : 'Bulb Network'}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable params */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 scrollbar-thin">

          {mode === 'circuit' ? (
            <>
              <Section label="Visual" />

              <div className="space-y-1.5">
                <span className="text-xs text-zinc-400">Color</span>
                <div className="flex items-center gap-3">
                  <input type="color" value={circuit.color}
                    onChange={e => setC('color', e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer bg-transparent border-0 p-0" />
                  <span className="text-xs text-zinc-500 font-mono">{circuit.color}</span>
                </div>
              </div>

              <Param label="Trace opacity" min={0.01} max={0.4} step={0.005}
                value={circuit.traceAlpha} onChange={v => setC('traceAlpha', v)}
                fmt={v => v.toFixed(3)} />
              <Param label="Node opacity" min={0.01} max={0.6} step={0.01}
                value={circuit.nodeAlpha} onChange={v => setC('nodeAlpha', v)}
                fmt={v => v.toFixed(2)} />
              <Param label="Pulse opacity" min={0.05} max={1} step={0.05}
                value={circuit.pulseAlpha} onChange={v => setC('pulseAlpha', v)}
                fmt={v => v.toFixed(2)} />
              <Param label="Pulse speed" min={0.3} max={4} step={0.1}
                value={circuit.pulseSpeedMult} onChange={v => setC('pulseSpeedMult', v)}
                fmt={v => v.toFixed(1) + '×'} />
              <Param label="Corner radius" min={0} max={30} step={1}
                value={circuit.cornerR} onChange={v => setC('cornerR', v)}
                fmt={v => v + 'px'} />

              <Section label="Structure" />

              <Param label="Cell size (density)" min={60} max={260} step={5}
                value={circuit.cellSize} onChange={v => setC('cellSize', v)}
                fmt={v => v + 'px'} />
              <Param label="Node jitter" min={0} max={0.45} step={0.01}
                value={circuit.jitter} onChange={v => setC('jitter', v)}
                fmt={v => Math.round(v * 100) + '%'} />
              <Param label="Skip edge probability" min={0} max={0.75} step={0.05}
                value={circuit.skipProb} onChange={v => setC('skipProb', v)}
                fmt={v => Math.round(v * 100) + '%'} />
              <Param label="Cross-link probability" min={0} max={0.5} step={0.02}
                value={circuit.crossProb} onChange={v => setC('crossProb', v)}
                fmt={v => Math.round(v * 100) + '%'} />

              <Section label="Mouse interaction" />

              <Param label="Influence radius" min={0} max={300} step={10}
                value={circuit.mouseInfluence} onChange={v => setC('mouseInfluence', v)}
                fmt={v => v + 'px'} />
              <Param label="Spring strength" min={0} max={0.04} step={0.001}
                value={circuit.springK} onChange={v => setC('springK', v)}
                fmt={v => v.toFixed(3)} />
              <Param label="Damping" min={0.6} max={0.99} step={0.01}
                value={circuit.damping} onChange={v => setC('damping', v)}
                fmt={v => v.toFixed(2)} />
            </>
          ) : (
            <>
              <Section label="Visual" />

              <div className="space-y-1.5">
                <span className="text-xs text-zinc-400">Color</span>
                <div className="flex items-center gap-3">
                  <input type="color" value={bulb.color}
                    onChange={e => setB('color', e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer bg-transparent border-0 p-0" />
                  <span className="text-xs text-zinc-500 font-mono">{bulb.color}</span>
                </div>
              </div>

              <Param label="Glow intensity" min={0.1} max={3} step={0.1}
                value={bulb.glowMult} onChange={v => setB('glowMult', v)}
                fmt={v => v.toFixed(1) + '×'} />
              <Param label="Wire base opacity" min={0} max={0.3} step={0.01}
                value={bulb.wireAlpha} onChange={v => setB('wireAlpha', v)}
                fmt={v => v.toFixed(2)} />

              <Section label="Structure" />

              <Param label="Bulb density (cell size)" min={70} max={300} step={5}
                value={bulb.cellSize} onChange={v => setB('cellSize', v)}
                fmt={v => v + 'px'} />
              <Param label="Max wire distance" min={60} max={300} step={5}
                value={bulb.maxWireDist} onChange={v => setB('maxWireDist', v)}
                fmt={v => v + 'px'} />

              <Section label="Energy behaviour" />

              <Param label="Cursor radius" min={50} max={400} step={10}
                value={bulb.cursorRadius} onChange={v => setB('cursorRadius', v)}
                fmt={v => v + 'px'} />
              <Param label="Decay rate" min={0.0003} max={0.005} step={0.0001}
                value={bulb.decay} onChange={v => setB('decay', v)}
                fmt={v => v.toFixed(4) + '/ms'} />
              <Param label="Spread factor" min={0} max={0.9} step={0.02}
                value={bulb.spreadFactor} onChange={v => setB('spreadFactor', v)}
                fmt={v => Math.round(v * 100) + '%'} />
            </>
          )}

          {/* Spacer so last param doesn't hide behind footer */}
          <div className="h-4" />
        </div>

        {/* Footer actions */}
        <div className="px-5 py-4 border-t border-zinc-800 flex-shrink-0 space-y-2">
          <button
            onClick={applyToHero}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg
                       bg-sky-400 text-zinc-950 text-sm font-semibold
                       hover:bg-sky-300 transition-colors"
          >
            {saved ? <><Check size={14} /> Applied!</> : 'Apply to Hero'}
          </button>
          <div className="flex gap-2">
            <button
              onClick={resetDefaults}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg
                         bg-zinc-800 text-zinc-400 text-xs hover:text-zinc-200 transition-colors"
            >
              <RotateCcw size={11} /> Reset defaults
            </button>
            <button
              onClick={clearOverride}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg
                         bg-zinc-800 text-zinc-400 text-xs hover:text-red-400 transition-colors"
            >
              <Trash2 size={11} />
              {cleared ? 'Cleared!' : 'Clear override'}
            </button>
          </div>
          <p className="text-[10px] text-zinc-600 text-center leading-relaxed">
            "Apply to Hero" saves to localStorage and persists across refreshes.
            "Clear override" restores random selection.
          </p>
        </div>
      </aside>
    </div>
  )
}
