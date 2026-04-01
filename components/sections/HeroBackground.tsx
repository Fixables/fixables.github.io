'use client'

import { useEffect, useState } from 'react'
import CircuitBackground from './CircuitBackground'
import BulbBackground from './BulbBackground'

type Mode = 'circuit' | 'bulb'

export default function HeroBackground() {
  const [mode, setMode] = useState<Mode | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Coarse pointer = touch device (phone/tablet) — no cursor, bulb effect is pointless
    const mobile = window.matchMedia('(pointer: coarse)').matches
    setIsMobile(mobile)
    // Randomize on each page load so returning visitors see something different
    setMode(Math.random() < 0.5 ? 'circuit' : 'bulb')
  }, [])

  if (!mode) return null

  // Mobile: always use circuit traces (passive signal pulses look great without a cursor)
  if (isMobile) return <CircuitBackground />

  return mode === 'circuit' ? <CircuitBackground /> : <BulbBackground />
}
