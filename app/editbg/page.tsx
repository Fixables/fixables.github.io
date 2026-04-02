'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { ArrowLeft, Check } from 'lucide-react'
import CircuitBackground from '@/components/sections/CircuitBackground'
import BulbBackground from '@/components/sections/BulbBackground'
import OscilloscopeBackground from '@/components/sections/OscilloscopeBackground'
import CpuBackground from '@/components/sections/CpuBackground'
import EMFieldBackground from '@/components/sections/EMFieldBackground'
import SignalFlowBackground from '@/components/sections/SignalFlowBackground'
import {
  BgId, PageId,
  BG_SETTINGS_KEY, DEFAULT_BG_ENTRIES, AllBgSettings,
  CircuitConfig, BulbConfig, OscilloscopeConfig, CpuConfig, EMFieldConfig, SignalFlowConfig,
  DEFAULT_CIRCUIT, DEFAULT_BULB, DEFAULT_OSCILLOSCOPE, DEFAULT_CPU, DEFAULT_EMFIELD, DEFAULT_SIGNALFLOW,
} from '@/types/bg-config'

// ── helpers ──────────────────────────────────────────────────────

function Slider({
  label, min, max, step, value, onChange, fmt,
}: {
  label: string; min: number; max: number; step: number; value: number
  onChange: (v: number) => void; fmt?: (v: number) => string
}) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between">
        <span className="text-[11px] text-zinc-400">{label}</span>
        <span className="text-[11px] text-zinc-500 font-mono">{fmt ? fmt(value) : value}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        className="w-full h-1 rounded appearance-none cursor-pointer accent-sky-400 bg-zinc-700" />
    </div>
  )
}

function SectionLabel({ label }: { label: string }) {
  return <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-600 pt-3 pb-0.5 border-t border-zinc-800/60 mt-2">{label}</p>
}

const PAGE_IDS: PageId[] = ['home', 'experience', 'projects', 'contact']
const PAGE_LABELS: Record<PageId, string> = { home: 'Home', experience: 'Exp', projects: 'Proj', contact: 'Cont' }

const BG_META: Record<BgId, { name: string; desc: string }> = {
  circuit:      { name: 'Circuit Traces',  desc: 'Grid nodes + orthogonal traces + pulses' },
  bulb:         { name: 'Bulb Network',    desc: 'Cursor charges nearby bulb nodes' },
  oscilloscope: { name: 'Oscilloscope',    desc: 'Scrolling waveforms on a CRT grid' },
  cpu:          { name: 'CPU Die',         desc: 'Chip with radiating traces + data packets' },
  emfield:      { name: 'EM Field',        desc: 'Particles following dipole field lines' },
  signalflow:   { name: 'Signal Flow',     desc: 'Datapath nodes with propagating signals' },
}

// ── main ─────────────────────────────────────────────────────────

type Configs = {
  circuit: CircuitConfig; bulb: BulbConfig; oscilloscope: OscilloscopeConfig
  cpu: CpuConfig; emfield: EMFieldConfig; signalflow: SignalFlowConfig
}

const DEFAULTS: Configs = {
  circuit: DEFAULT_CIRCUIT, bulb: DEFAULT_BULB, oscilloscope: DEFAULT_OSCILLOSCOPE,
  cpu: DEFAULT_CPU, emfield: DEFAULT_EMFIELD, signalflow: DEFAULT_SIGNALFLOW,
}

export default function EditBgPage() {
  const [selected, setSelected] = useState<BgId>('circuit')
  const [entries, setEntries] = useState<AllBgSettings['backgrounds']>({ ...DEFAULT_BG_ENTRIES })
  const [configs, setConfigs] = useState<Configs>({ ...DEFAULTS })
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(BG_SETTINGS_KEY)
      if (!raw) return
      const parsed: Partial<AllBgSettings> = JSON.parse(raw)
      if (parsed.backgrounds) setEntries({ ...DEFAULT_BG_ENTRIES, ...parsed.backgrounds })
      if (parsed.configs) {
        setConfigs({
          circuit:      { ...DEFAULT_CIRCUIT,      ...(parsed.configs.circuit      ?? {}) } as CircuitConfig,
          bulb:         { ...DEFAULT_BULB,         ...(parsed.configs.bulb         ?? {}) } as BulbConfig,
          oscilloscope: { ...DEFAULT_OSCILLOSCOPE, ...(parsed.configs.oscilloscope ?? {}) } as OscilloscopeConfig,
          cpu:          { ...DEFAULT_CPU,          ...(parsed.configs.cpu          ?? {}) } as CpuConfig,
          emfield:      { ...DEFAULT_EMFIELD,      ...(parsed.configs.emfield      ?? {}) } as EMFieldConfig,
          signalflow:   { ...DEFAULT_SIGNALFLOW,   ...(parsed.configs.signalflow   ?? {}) } as SignalFlowConfig,
        })
      }
    } catch { /* ignore */ }
  }, [])

  function setC<K extends keyof Configs, F extends keyof Configs[K]>(bgId: K, key: F, val: Configs[K][F]) {
    setConfigs(prev => ({ ...prev, [bgId]: { ...prev[bgId], [key]: val } }))
  }

  function toggleEnabled(id: BgId) {
    setEntries(prev => ({ ...prev, [id]: { ...prev[id], enabled: !prev[id].enabled } }))
  }

  function togglePage(id: BgId, page: PageId) {
    setEntries(prev => {
      const pages = prev[id].pages.includes(page)
        ? prev[id].pages.filter(p => p !== page)
        : [...prev[id].pages, page]
      return { ...prev, [id]: { ...prev[id], pages } }
    })
  }

  function applyAll() {
    const settings: AllBgSettings = { backgrounds: entries, configs: configs as unknown as AllBgSettings['configs'] }
    localStorage.setItem(BG_SETTINGS_KEY, JSON.stringify(settings))
    // Clear session cache so next page load picks fresh
    Object.keys(sessionStorage).filter(k => k.startsWith('bg-choice-')).forEach(k => sessionStorage.removeItem(k))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function resetSelected() {
    setConfigs(prev => ({ ...prev, [selected]: DEFAULTS[selected] }))
  }

  const cfg = configs[selected]

  return (
    <div className="fixed inset-0 bg-zinc-950 overflow-hidden">

      {/* ── Live preview (full viewport, behind panels) ──── */}
      <div className="absolute inset-0 z-0">
        {selected === 'circuit'      && <CircuitBackground      config={configs.circuit} />}
        {selected === 'bulb'         && <BulbBackground         config={configs.bulb} />}
        {selected === 'oscilloscope' && <OscilloscopeBackground config={configs.oscilloscope} />}
        {selected === 'cpu'          && <CpuBackground          config={configs.cpu} />}
        {selected === 'emfield'      && <EMFieldBackground      config={configs.emfield} />}
        {selected === 'signalflow'   && <SignalFlowBackground   config={configs.signalflow} />}
      </div>

      {/* ── Demo hero text (center, pointer-events-none) ── */}
      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none select-none px-[280px]">
        <div>
          <p className="text-zinc-400 text-sm mb-2">Hey there! 👋</p>
          <h1 className="text-4xl font-bold text-zinc-50 tracking-tight leading-tight mb-3">I'm Andy Setiawan</h1>
          <p className="text-zinc-400 text-sm max-w-xs leading-relaxed">
            EE student at UBC — I build firmware, PCBs, and robots.
          </p>
          <div className="flex gap-3 mt-5">
            <span className="px-4 py-2 bg-sky-400 text-zinc-950 text-xs font-semibold rounded-lg">See my work</span>
            <span className="px-4 py-2 border border-zinc-700 text-zinc-400 text-xs rounded-lg">Download CV</span>
          </div>
        </div>
      </div>

      {/* ── LEFT PANEL — background list ─────────────────── */}
      <aside className="absolute top-0 left-0 h-full w-[250px] z-20 bg-zinc-950/90 backdrop-blur-md border-r border-zinc-800 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-4 pt-4 pb-3 border-b border-zinc-800 flex-shrink-0">
          <Link href="/" className="inline-flex items-center gap-1.5 text-[11px] text-zinc-500 hover:text-sky-400 transition-colors mb-2">
            <ArrowLeft size={10} /> Home
          </Link>
          <p className="text-xs font-semibold text-zinc-100">Background Editor</p>
          <p className="text-[10px] text-zinc-500 mt-0.5">Click a background to preview & configure</p>
        </div>

        {/* Background list */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1.5">
          {(Object.keys(BG_META) as BgId[]).map(id => {
            const meta = BG_META[id]
            const entry = entries[id]
            const isSelected = selected === id
            return (
              <div
                key={id}
                onClick={() => setSelected(id)}
                className={`rounded-lg p-3 cursor-pointer border transition-all ${
                  isSelected
                    ? 'border-sky-400/50 bg-sky-400/5'
                    : 'border-zinc-800 hover:border-zinc-700 bg-zinc-900/50'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="min-w-0">
                    <p className="text-[11px] font-medium text-zinc-200 truncate">{meta.name}</p>
                    <p className="text-[10px] text-zinc-600 leading-tight mt-0.5">{meta.desc}</p>
                  </div>
                  {/* Enable toggle */}
                  <button
                    onClick={e => { e.stopPropagation(); toggleEnabled(id) }}
                    className={`flex-shrink-0 w-8 h-4 rounded-full transition-colors relative ${
                      entry.enabled ? 'bg-sky-400' : 'bg-zinc-700'
                    }`}
                  >
                    <span className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${
                      entry.enabled ? 'left-4' : 'left-0.5'
                    }`} />
                  </button>
                </div>

                {/* Page toggles */}
                <div className="flex gap-1 flex-wrap">
                  {PAGE_IDS.map(page => (
                    <button
                      key={page}
                      onClick={e => { e.stopPropagation(); togglePage(id, page) }}
                      className={`text-[9px] px-1.5 py-0.5 rounded font-mono transition-colors ${
                        entry.pages.includes(page)
                          ? 'bg-sky-400/20 text-sky-400 border border-sky-400/30'
                          : 'bg-zinc-800 text-zinc-600 border border-transparent'
                      }`}
                    >
                      {PAGE_LABELS[page]}
                    </button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* Apply all button */}
        <div className="px-3 py-3 border-t border-zinc-800 flex-shrink-0">
          <button
            onClick={applyAll}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-sky-400 text-zinc-950 text-xs font-semibold hover:bg-sky-300 transition-colors"
          >
            {saved ? <><Check size={12} /> Saved!</> : 'Apply All Settings'}
          </button>
          <p className="text-[9px] text-zinc-600 text-center mt-1.5 leading-relaxed">
            Saves to localStorage. Clears session cache so next navigation picks fresh.
          </p>
        </div>
      </aside>

      {/* ── RIGHT PANEL — config sliders ─────────────────── */}
      <aside className="absolute top-0 right-0 h-full w-[300px] z-20 bg-zinc-950/90 backdrop-blur-md border-l border-zinc-800 flex flex-col overflow-hidden">
        <div className="px-4 pt-4 pb-3 border-b border-zinc-800 flex-shrink-0">
          <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Configure</p>
          <p className="text-xs font-semibold text-zinc-100 mt-0.5">{BG_META[selected].name}</p>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">

          {/* Color picker — shared by all */}
          <div className="space-y-1">
            <span className="text-[11px] text-zinc-400">Color</span>
            <div className="flex items-center gap-3">
              <input type="color" value={(cfg as { color: string }).color}
                onChange={e => setC(selected, 'color' as never, e.target.value as never)}
                className="w-8 h-7 rounded cursor-pointer bg-transparent border-0 p-0" />
              <span className="text-[11px] text-zinc-500 font-mono">{(cfg as { color: string }).color}</span>
            </div>
          </div>

          {/* ── Per-background sliders ── */}

          {selected === 'circuit' && (() => {
            const c = configs.circuit
            const s = <K extends keyof CircuitConfig>(k: K, v: CircuitConfig[K]) => setC('circuit', k, v)
            return (<>
              <SectionLabel label="Visual" />
              <Slider label="Trace opacity"   min={0.01} max={0.4}  step={0.005} value={c.traceAlpha}     onChange={v => s('traceAlpha', v)}     fmt={v => v.toFixed(3)} />
              <Slider label="Node opacity"    min={0.01} max={0.6}  step={0.01}  value={c.nodeAlpha}      onChange={v => s('nodeAlpha', v)}      fmt={v => v.toFixed(2)} />
              <Slider label="Pulse opacity"   min={0.05} max={1}    step={0.05}  value={c.pulseAlpha}     onChange={v => s('pulseAlpha', v)}     fmt={v => v.toFixed(2)} />
              <Slider label="Pulse speed"     min={0.3}  max={4}    step={0.1}   value={c.pulseSpeedMult} onChange={v => s('pulseSpeedMult', v)} fmt={v => v.toFixed(1) + '×'} />
              <Slider label="Corner radius"   min={0}    max={30}   step={1}     value={c.cornerR}        onChange={v => s('cornerR', v)}        fmt={v => v + 'px'} />
              <SectionLabel label="Structure" />
              <Slider label="Cell size"       min={60}   max={260}  step={5}     value={c.cellSize}       onChange={v => s('cellSize', v)}       fmt={v => v + 'px'} />
              <Slider label="Node jitter"     min={0}    max={0.45} step={0.01}  value={c.jitter}         onChange={v => s('jitter', v)}         fmt={v => Math.round(v * 100) + '%'} />
              <Slider label="Skip edge prob"  min={0}    max={0.75} step={0.05}  value={c.skipProb}       onChange={v => s('skipProb', v)}       fmt={v => Math.round(v * 100) + '%'} />
              <Slider label="Cross-link prob" min={0}    max={0.5}  step={0.02}  value={c.crossProb}      onChange={v => s('crossProb', v)}      fmt={v => Math.round(v * 100) + '%'} />
              <SectionLabel label="Mouse physics" />
              <Slider label="Influence radius" min={0}   max={300}  step={10}    value={c.mouseInfluence} onChange={v => s('mouseInfluence', v)} fmt={v => v + 'px'} />
              <Slider label="Spring strength" min={0}    max={0.04} step={0.001} value={c.springK}        onChange={v => s('springK', v)}        fmt={v => v.toFixed(3)} />
              <Slider label="Damping"         min={0.6}  max={0.99} step={0.01}  value={c.damping}        onChange={v => s('damping', v)}        fmt={v => v.toFixed(2)} />
            </>)
          })()}

          {selected === 'bulb' && (() => {
            const c = configs.bulb
            const s = <K extends keyof BulbConfig>(k: K, v: BulbConfig[K]) => setC('bulb', k, v)
            return (<>
              <SectionLabel label="Visual" />
              <Slider label="Glow intensity"  min={0.1}    max={3}    step={0.1}    value={c.glowMult}     onChange={v => s('glowMult', v)}     fmt={v => v.toFixed(1) + '×'} />
              <Slider label="Wire opacity"    min={0}      max={0.3}  step={0.01}   value={c.wireAlpha}    onChange={v => s('wireAlpha', v)}    fmt={v => v.toFixed(2)} />
              <SectionLabel label="Structure" />
              <Slider label="Bulb density"    min={70}     max={300}  step={5}      value={c.cellSize}     onChange={v => s('cellSize', v)}     fmt={v => v + 'px'} />
              <Slider label="Wire distance"   min={60}     max={300}  step={5}      value={c.maxWireDist}  onChange={v => s('maxWireDist', v)}  fmt={v => v + 'px'} />
              <SectionLabel label="Energy" />
              <Slider label="Cursor radius"   min={50}     max={400}  step={10}     value={c.cursorRadius} onChange={v => s('cursorRadius', v)} fmt={v => v + 'px'} />
              <Slider label="Decay rate"      min={0.0003} max={0.005} step={0.0001} value={c.decay}       onChange={v => s('decay', v)}        fmt={v => v.toFixed(4) + '/ms'} />
              <Slider label="Spread factor"   min={0}      max={0.9}  step={0.02}   value={c.spreadFactor} onChange={v => s('spreadFactor', v)} fmt={v => Math.round(v * 100) + '%'} />
            </>)
          })()}

          {selected === 'oscilloscope' && (() => {
            const c = configs.oscilloscope
            const s = <K extends keyof OscilloscopeConfig>(k: K, v: OscilloscopeConfig[K]) => setC('oscilloscope', k, v)
            return (<>
              <SectionLabel label="Visual" />
              <Slider label="Grid opacity"   min={0.01} max={0.15} step={0.005} value={c.gridAlpha} onChange={v => s('gridAlpha', v)} fmt={v => v.toFixed(3)} />
              <Slider label="Wave opacity"   min={0.05} max={0.6}  step={0.01}  value={c.waveAlpha} onChange={v => s('waveAlpha', v)} fmt={v => v.toFixed(2)} />
              <Slider label="Glow intensity" min={0.1}  max={4}    step={0.1}   value={c.glowMult}  onChange={v => s('glowMult', v)}  fmt={v => v.toFixed(1) + '×'} />
              <SectionLabel label="Channels" />
              <Slider label="Wave count"     min={1}    max={3}    step={1}     value={c.waveCount} onChange={v => s('waveCount', Math.round(v))} fmt={v => Math.round(v).toString()} />
              <Slider label="Scroll speed"   min={0.2}  max={4}    step={0.1}   value={c.speed}     onChange={v => s('speed', v)}     fmt={v => v.toFixed(1) + '×'} />
            </>)
          })()}

          {selected === 'cpu' && (() => {
            const c = configs.cpu
            const s = <K extends keyof CpuConfig>(k: K, v: CpuConfig[K]) => setC('cpu', k, v)
            return (<>
              <SectionLabel label="Visual" />
              <Slider label="Trace opacity"  min={0.02} max={0.3}  step={0.01} value={c.traceAlpha}  onChange={v => s('traceAlpha', v)}  fmt={v => v.toFixed(2)} />
              <Slider label="Packet opacity" min={0.1}  max={1}    step={0.05} value={c.packetAlpha} onChange={v => s('packetAlpha', v)} fmt={v => v.toFixed(2)} />
              <Slider label="Core opacity"   min={0.02} max={0.3}  step={0.01} value={c.coreAlpha}   onChange={v => s('coreAlpha', v)}   fmt={v => v.toFixed(2)} />
              <SectionLabel label="Structure" />
              <Slider label="Traces per side" min={4}   max={24}   step={1}    value={c.traceCount}  onChange={v => s('traceCount', Math.round(v))} fmt={v => Math.round(v).toString()} />
              <SectionLabel label="Animation" />
              <Slider label="Packet speed"   min={0.2}  max={4}    step={0.1}  value={c.speed}       onChange={v => s('speed', v)}       fmt={v => v.toFixed(1) + '×'} />
            </>)
          })()}

          {selected === 'emfield' && (() => {
            const c = configs.emfield
            const s = <K extends keyof EMFieldConfig>(k: K, v: EMFieldConfig[K]) => setC('emfield', k, v)
            return (<>
              <SectionLabel label="Visual" />
              <Slider label="Opacity"         min={0.05} max={0.6}  step={0.01} value={c.alpha}         onChange={v => s('alpha', v)}         fmt={v => v.toFixed(2)} />
              <Slider label="Trail length"    min={3}    max={25}   step={1}    value={c.trailLength}   onChange={v => s('trailLength', Math.round(v))} fmt={v => Math.round(v).toString()} />
              <SectionLabel label="Structure" />
              <Slider label="Particle count"  min={20}   max={150}  step={5}    value={c.particleCount} onChange={v => s('particleCount', Math.round(v))} fmt={v => Math.round(v).toString()} />
              <Slider label="Charge pairs"    min={1}    max={4}    step={1}    value={c.chargeCount}   onChange={v => s('chargeCount', Math.round(v))} fmt={v => Math.round(v).toString()} />
              <SectionLabel label="Animation" />
              <Slider label="Flow speed"      min={0.2}  max={4}    step={0.1}  value={c.speed}         onChange={v => s('speed', v)}         fmt={v => v.toFixed(1) + '×'} />
            </>)
          })()}

          {selected === 'signalflow' && (() => {
            const c = configs.signalflow
            const s = <K extends keyof SignalFlowConfig>(k: K, v: SignalFlowConfig[K]) => setC('signalflow', k, v)
            return (<>
              <SectionLabel label="Visual" />
              <Slider label="Wire opacity"   min={0.01} max={0.3}  step={0.01} value={c.wireAlpha}   onChange={v => s('wireAlpha', v)}   fmt={v => v.toFixed(2)} />
              <Slider label="Signal opacity" min={0.1}  max={1}    step={0.05} value={c.signalAlpha} onChange={v => s('signalAlpha', v)} fmt={v => v.toFixed(2)} />
              <Slider label="Node opacity"   min={0.02} max={0.4}  step={0.01} value={c.nodeAlpha}   onChange={v => s('nodeAlpha', v)}   fmt={v => v.toFixed(2)} />
              <SectionLabel label="Structure" />
              <Slider label="Node count"     min={6}    max={24}   step={1}    value={c.nodeCount}   onChange={v => s('nodeCount', Math.round(v))} fmt={v => Math.round(v).toString()} />
              <SectionLabel label="Animation" />
              <Slider label="Signal speed"   min={0.2}  max={4}    step={0.1}  value={c.speed}       onChange={v => s('speed', v)}       fmt={v => v.toFixed(1) + '×'} />
            </>)
          })()}

          <div className="h-3" />
        </div>

        {/* Reset button */}
        <div className="px-4 py-3 border-t border-zinc-800 flex-shrink-0">
          <button
            onClick={resetSelected}
            className="w-full py-1.5 rounded-lg bg-zinc-800 text-zinc-400 text-xs hover:text-zinc-200 transition-colors"
          >
            Reset {BG_META[selected].name} defaults
          </button>
        </div>
      </aside>
    </div>
  )
}
