'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import {
  BgId, PageId,
  BG_SETTINGS_KEY, DEFAULT_BG_ENTRIES, AllBgSettings,
  DEFAULT_CIRCUIT, DEFAULT_BULB, DEFAULT_OSCILLOSCOPE,
  DEFAULT_CPU, DEFAULT_EMFIELD, DEFAULT_SIGNALFLOW,
  CircuitConfig, BulbConfig, OscilloscopeConfig,
  CpuConfig, EMFieldConfig, SignalFlowConfig,
} from '@/types/bg-config'
import CircuitBackground from '@/components/sections/CircuitBackground'
import BulbBackground from '@/components/sections/BulbBackground'
import OscilloscopeBackground from '@/components/sections/OscilloscopeBackground'
import CpuBackground from '@/components/sections/CpuBackground'
import EMFieldBackground from '@/components/sections/EMFieldBackground'
import SignalFlowBackground from '@/components/sections/SignalFlowBackground'

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

    // Check session cache first (consistent within a tab session)
    const cacheKey = `bg-choice-${pathname}`
    const cached = sessionStorage.getItem(cacheKey) as BgId | null

    const isMobile = window.matchMedia('(pointer: coarse)').matches

    // Build candidate list
    const candidates = (Object.keys(allSettings.backgrounds) as BgId[]).filter(id => {
      const entry = allSettings.backgrounds[id]
      if (!entry.enabled) return false
      if (!entry.pages.includes(pageId)) return false
      if (isMobile && id === 'bulb') return false  // bulb needs cursor
      return true
    })

    if (candidates.length === 0) { setBgId(null); return }

    // Use cache if it's still a valid candidate
    if (cached && candidates.includes(cached)) {
      setBgId(cached)
      return
    }

    const chosen = candidates[Math.floor(Math.random() * candidates.length)]
    sessionStorage.setItem(cacheKey, chosen)
    setBgId(chosen)
  }, [pathname])

  if (!bgId || !settings) return null

  // Merge saved config with defaults
  const saved = settings.configs

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
      {bgId === 'circuit'      && <CircuitBackground    config={{ ...DEFAULT_CIRCUIT,      ...(saved.circuit      as Partial<CircuitConfig>      ?? {}) }} />}
      {bgId === 'bulb'         && <BulbBackground       config={{ ...DEFAULT_BULB,         ...(saved.bulb         as Partial<BulbConfig>         ?? {}) }} />}
      {bgId === 'oscilloscope' && <OscilloscopeBackground config={{ ...DEFAULT_OSCILLOSCOPE, ...(saved.oscilloscope as Partial<OscilloscopeConfig> ?? {}) }} />}
      {bgId === 'cpu'          && <CpuBackground        config={{ ...DEFAULT_CPU,          ...(saved.cpu          as Partial<CpuConfig>          ?? {}) }} />}
      {bgId === 'emfield'      && <EMFieldBackground    config={{ ...DEFAULT_EMFIELD,      ...(saved.emfield      as Partial<EMFieldConfig>      ?? {}) }} />}
      {bgId === 'signalflow'   && <SignalFlowBackground config={{ ...DEFAULT_SIGNALFLOW,   ...(saved.signalflow   as Partial<SignalFlowConfig>   ?? {}) }} />}
    </div>
  )
}
