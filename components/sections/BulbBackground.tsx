'use client'

import { useEffect, useRef } from 'react'

const COLOR = '#38bdf8'
const CURSOR_RADIUS = 200   // px — cursor charges bulbs within this range
const MAX_WIRE_DIST = 155   // px — max distance for wire connections
const MIN_SPACING = 70      // px — minimum distance between bulbs
const DECAY = 0.0016        // charge lost per ms (fades ~600ms after cursor leaves)

interface Bulb {
  x: number
  y: number
  charge: number
}

interface Wire { i: number; j: number }

function buildGraph(w: number, h: number): { bulbs: Bulb[]; wires: Wire[] } {
  const count = Math.max(18, Math.min(55, Math.round((w * h) / 21000)))

  // Scatter bulbs with rejection sampling to maintain min spacing
  const bulbs: Bulb[] = []
  for (let attempt = 0; attempt < count * 10 && bulbs.length < count; attempt++) {
    const x = 40 + Math.random() * (w - 80)
    const y = 40 + Math.random() * (h - 80)
    if (bulbs.every(b => Math.hypot(b.x - x, b.y - y) >= MIN_SPACING)) {
      bulbs.push({ x, y, charge: 0 })
    }
  }

  // Connect each bulb to its nearest 1–3 neighbors within range
  const seen = new Set<string>()
  const wires: Wire[] = []
  for (let i = 0; i < bulbs.length; i++) {
    const nearby = bulbs
      .map((b, j) => ({ j, d: Math.hypot(b.x - bulbs[i].x, b.y - bulbs[i].y) }))
      .filter(({ j, d }) => j !== i && d < MAX_WIRE_DIST)
      .sort((a, b) => a.d - b.d)
      .slice(0, 3)
    for (const { j } of nearby) {
      const key = `${Math.min(i, j)}_${Math.max(i, j)}`
      if (!seen.has(key)) { seen.add(key); wires.push({ i, j }) }
    }
  }

  return { bulbs, wires }
}

export default function BulbBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let bulbs: Bulb[] = []
    let wires: Wire[] = []
    let rafId = 0
    let lastTime = 0
    const mouse = { x: -9999, y: -9999 }

    function resizeCanvas() {
      const parent = canvas!.parentElement
      if (!parent) return
      const w = parent.clientWidth
      const h = parent.clientHeight
      const dpr = window.devicePixelRatio || 1
      canvas!.width = w * dpr
      canvas!.height = h * dpr
      canvas!.style.width = w + 'px'
      canvas!.style.height = h + 'px'
      ctx!.scale(dpr, dpr)
      return { w, h }
    }

    function drawFrame() {
      const parent = canvas!.parentElement
      if (!parent) return
      const w = parent.clientWidth
      const h = parent.clientHeight
      ctx!.clearRect(0, 0, w, h)
      ctx!.fillStyle = COLOR

      // Wires — faint always, bright when endpoints are charged
      for (const { i, j } of wires) {
        const a = bulbs[i], b = bulbs[j]
        const charge = Math.max(a.charge, b.charge)
        ctx!.beginPath()
        ctx!.strokeStyle = COLOR
        ctx!.lineWidth = 0.5 + charge * 1.5
        ctx!.globalAlpha = 0.05 + charge * 0.28
        ctx!.moveTo(a.x, a.y)
        ctx!.lineTo(b.x, b.y)
        ctx!.stroke()
      }

      // Bulbs — layered glow proportional to charge
      for (const b of bulbs) {
        const c = b.charge

        if (c > 0.04) {
          // Outer halo
          ctx!.beginPath()
          ctx!.globalAlpha = 0.035 * c
          ctx!.arc(b.x, b.y, 24, 0, Math.PI * 2)
          ctx!.fill()
          // Mid glow
          ctx!.beginPath()
          ctx!.globalAlpha = 0.08 * c
          ctx!.arc(b.x, b.y, 13, 0, Math.PI * 2)
          ctx!.fill()
          // Inner glow
          ctx!.beginPath()
          ctx!.globalAlpha = 0.18 * c
          ctx!.arc(b.x, b.y, 6, 0, Math.PI * 2)
          ctx!.fill()
        }

        // Core — always slightly visible, bright when charged
        ctx!.beginPath()
        ctx!.globalAlpha = 0.1 + 0.72 * c
        ctx!.arc(b.x, b.y, 2, 0, Math.PI * 2)
        ctx!.fill()
      }

      ctx!.globalAlpha = 1
    }

    function tick(ts: number) {
      const delta = Math.min(ts - lastTime, 50)
      lastTime = ts

      // 1. Cursor directly charges nearby bulbs
      for (const b of bulbs) {
        const d = Math.hypot(b.x - mouse.x, b.y - mouse.y)
        if (d < CURSOR_RADIUS) {
          const target = (1 - d / CURSOR_RADIUS) * 0.95
          if (target > b.charge) b.charge = b.charge + (target - b.charge) * 0.12
        }
      }

      // 2. Charge spreads along wires (2 passes = 2 hops of propagation per frame)
      for (let pass = 0; pass < 2; pass++) {
        for (const { i, j } of wires) {
          const a = bulbs[i], b = bulbs[j]
          const maxNeighbor = Math.max(a.charge, b.charge) * 0.58
          if (a.charge < maxNeighbor) a.charge += (maxNeighbor - a.charge) * 0.07
          if (b.charge < maxNeighbor) b.charge += (maxNeighbor - b.charge) * 0.07
        }
      }

      // 3. Decay all charges
      for (const b of bulbs) {
        b.charge = Math.max(0, b.charge - DECAY * delta)
      }

      drawFrame()
      rafId = requestAnimationFrame(tick)
    }

    function start() {
      lastTime = performance.now()
      rafId = requestAnimationFrame(tick)
    }

    function stop() {
      cancelAnimationFrame(rafId)
    }

    const dims = resizeCanvas()
    if (dims) {
      const g = buildGraph(dims.w, dims.h)
      bulbs = g.bulbs
      wires = g.wires
    }

    if (reducedMotion) {
      drawFrame()
      return
    }

    let resizeTimer = 0
    const ro = new ResizeObserver(() => {
      clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(() => {
        stop()
        const d = resizeCanvas()
        if (d) {
          const g = buildGraph(d.w, d.h)
          bulbs = g.bulbs
          wires = g.wires
        }
        start()
      }, 150)
    })
    if (canvas.parentElement) ro.observe(canvas.parentElement)

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
    }
    window.addEventListener('mousemove', onMouseMove)

    const onVisibility = () => {
      if (document.hidden) stop()
      else { lastTime = performance.now(); start() }
    }
    document.addEventListener('visibilitychange', onVisibility)

    start()

    return () => {
      stop()
      ro.disconnect()
      window.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('visibilitychange', onVisibility)
      clearTimeout(resizeTimer)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}
    />
  )
}
