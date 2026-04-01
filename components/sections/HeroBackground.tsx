'use client'

import { useEffect, useState } from 'react'
import CircuitBackground from './CircuitBackground'
import BulbBackground from './BulbBackground'
import { BG_LS_KEY, BgOverride, DEFAULT_CIRCUIT, DEFAULT_BULB } from '@/types/bg-config'

type Mode = 'circuit' | 'bulb'

export default function HeroBackground() {
  const [mode, setMode] = useState<Mode | null>(null)
  const [override, setOverride] = useState<BgOverride>({})

  useEffect(() => {
    const mobile = window.matchMedia('(pointer: coarse)').matches

    // Load any saved override from the editor
    try {
      const stored = localStorage.getItem(BG_LS_KEY)
      if (stored) {
        const parsed: BgOverride = JSON.parse(stored)
        setOverride(parsed)
        setMode(mobile ? 'circuit' : (parsed.mode ?? (Math.random() < 0.5 ? 'circuit' : 'bulb')))
        return
      }
    } catch { /* ignore */ }

    // No override — mobile always gets circuit (passive pulses look great); desktop randomizes
    setMode(mobile ? 'circuit' : (Math.random() < 0.5 ? 'circuit' : 'bulb'))
  }, [])

  if (!mode) return null

  if (mode === 'circuit') {
    const cfg = override.circuit ? { ...DEFAULT_CIRCUIT, ...override.circuit } : DEFAULT_CIRCUIT
    return <CircuitBackground config={cfg} />
  }

  const cfg = override.bulb ? { ...DEFAULT_BULB, ...override.bulb } : DEFAULT_BULB
  return <BulbBackground config={cfg} />
}
