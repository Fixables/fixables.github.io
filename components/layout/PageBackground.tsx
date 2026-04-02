'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import {
  BgId, PageId,
  BG_SETTINGS_KEY, DEFAULT_BG_ENTRIES, AllBgSettings,
  DEFAULT_CIRCUIT, DEFAULT_BULB, DEFAULT_OSCILLOSCOPE,
  DEFAULT_CPU, DEFAULT_EMFIELD, DEFAULT_SIGNALFLOW,
  DEFAULT_MAGNETIC, DEFAULT_VECTORFIELD,
  CircuitConfig, BulbConfig, OscilloscopeConfig,
  CpuConfig, EMFieldConfig, SignalFlowConfig,
  MagneticConfig, VectorFieldConfig,
} from '@/types/bg-config'
import CircuitBackground from '@/components/sections/CircuitBackground'
import BulbBackground from '@/components/sections/BulbBackground'
import OscilloscopeBackground from '@/components/sections/OscilloscopeBackground'
import CpuBackground from '@/components/sections/CpuBackground'
import EMFieldBackground from '@/components/sections/EMFieldBackground'
import SignalFlowBackground from '@/components/sections/SignalFlowBackground'
import MagneticBackground from '@/components/sections/MagneticBackground'
import VectorFieldBackground from '@/components/sections/VectorFieldBackground'

function pathnameToPageId(pathname: string): PageId | null {
  if (pathname === '/') return 'home'
  if (pathname.startsWith('/experience')) return 'experience'
  if (pathname.startsWith('/projects')) return 'projects'
  if (pathname.startsWith('/contact')) return 'contact'
  return null
}

export default function PageBackground() {
  const pathname = usePathname()
  const [bgId, setBgId] = useState<BgId | null>(null)
  const [settings, setSettings] = useState<AllBgSettings | null>(null)

  useEffect(() => {
    const pageId = pathnameToPageId(pathname)
    if (!pageId) { setBgId(null); return }

    // Load settings
    let allSettings: AllBgSettings = { backgrounds: { ...DEFAULT_BG_ENTRIES }, configs: {} }
    try {
      const raw = localStorage.getItem(BG_SETTINGS_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<AllBgSettings>
        allSettings = {
          backgrounds: { ...DEFAULT_BG_ENTRIES, ...parsed.backgrounds },
          configs: parsed.configs ?? {},
        }
      }
    } catch { /* ignore */ }
    setSettings(allSettings)

    const isMobile = window.matchMedia('(pointer: coarse)').matches

    // Build candidate list
    const candidates = (Object.keys(allSettings.backgrounds) as BgId[]).filter(id => {
      const entry = allSettings.backgrounds[id]
      if (!entry.enabled) return false
      if (!entry.pages.includes(pageId)) return false
      if (isMobile && id === 'bulb') return false  // bulb needs cursor
      if (isMobile && id === 'vectorfield') return false  // vectorfield is cursor-driven
      return true
    })

    if (candidates.length === 0) { setBgId(null); return }

    // Always pick fresh on mount — no session cache so refresh truly randomizes
    const chosen = candidates[Math.floor(Math.random() * candidates.length)]
    setBgId(chosen)
  }, [pathname])

  if (!bgId || !settings) return null

  const saved = settings.configs

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
      {bgId === 'circuit'      && <CircuitBackground      config={{ ...DEFAULT_CIRCUIT,      ...(saved.circuit      as Partial<CircuitConfig>      ?? {}) }} />}
      {bgId === 'bulb'         && <BulbBackground         config={{ ...DEFAULT_BULB,         ...(saved.bulb         as Partial<BulbConfig>         ?? {}) }} />}
      {bgId === 'oscilloscope' && <OscilloscopeBackground config={{ ...DEFAULT_OSCILLOSCOPE, ...(saved.oscilloscope as Partial<OscilloscopeConfig> ?? {}) }} />}
      {bgId === 'cpu'          && <CpuBackground          config={{ ...DEFAULT_CPU,          ...(saved.cpu          as Partial<CpuConfig>          ?? {}) }} />}
      {bgId === 'emfield'      && <EMFieldBackground      config={{ ...DEFAULT_EMFIELD,      ...(saved.emfield      as Partial<EMFieldConfig>      ?? {}) }} />}
      {bgId === 'signalflow'   && <SignalFlowBackground   config={{ ...DEFAULT_SIGNALFLOW,   ...(saved.signalflow   as Partial<SignalFlowConfig>   ?? {}) }} />}
      {bgId === 'magnetic'     && <MagneticBackground     config={{ ...DEFAULT_MAGNETIC,     ...(saved.magnetic     as Partial<MagneticConfig>     ?? {}) }} />}
      {bgId === 'vectorfield'  && <VectorFieldBackground  config={{ ...DEFAULT_VECTORFIELD,  ...(saved.vectorfield  as Partial<VectorFieldConfig>  ?? {}) }} />}
    </div>
  )
}
