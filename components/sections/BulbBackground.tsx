'use client'

import { useEffect, useRef } from 'react'
import { BulbConfig, DEFAULT_BULB } from '@/types/bg-config'

interface Bulb { x: number; y: number; charge: number }
interface Wire { i: number; j: number }

function buildGraph(w: number, h: number, cfg: BulbConfig): { bulbs: Bulb[]; wires: Wire[] } {
  const count = Math.max(18, Math.min(60, Math.round((w * h) / (cfg.cellSize * cfg.cellSize))))
  const minSpacing = cfg.cellSize * 0.48

  const bulbs: Bulb[] = []
  for (let attempt = 0; attempt < count * 10 && bulbs.length < count; attempt++) {
    const x = 40 + Math.random() * (w - 80)
    const y = 40 + Math.random() * (h - 80)
    if (bulbs.every(b => Math.hypot(b.x - x, b.y - y) >= minSpacing)) {
      bulbs.push({ x, y, charge: 0 })
    }
  }

  const seen = new Set<string>()
  const wires: Wire[] = []
  for (let i = 0; i < bulbs.length; i++) {
    const nearby = bulbs
      .map((b, j) => ({ j, d: Math.hypot(b.x - bulbs[i].x, b.y - bulbs[i].y) }))
      .filter(({ j, d }) => j !== i && d < cfg.maxWireDist)
      .sort((a, b) => a.d - b.d).slice(0, 3)
    for (const { j } of nearby) {
      const key = `${Math.min(i, j)}_${Math.max(i, j)}`
      if (!seen.has(key)) { seen.add(key); wires.push({ i, j }) }
    }
  }

  return { bulbs, wires }
}

export default function BulbBackground({ config = DEFAULT_BULB }: { config?: BulbConfig }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const configRef = useRef<BulbConfig>(config)
  const needsReseedRef = useRef(false)

  useEffect(() => {
    const p = configRef.current
    if (p.cellSize !== config.cellSize || p.maxWireDist !== config.maxWireDist) {
      needsReseedRef.current = true
    }
    configRef.current = config
  }, [config])

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
      const w = parent.clientWidth, h = parent.clientHeight
      const dpr = window.devicePixelRatio || 1
      canvas!.width = w * dpr; canvas!.height = h * dpr
      canvas!.style.width = w + 'px'; canvas!.style.height = h + 'px'
      ctx!.scale(dpr, dpr)
      return { w, h }
    }

    function drawFrame() {
      const parent = canvas!.parentElement
      if (!parent) return
      const cfg = configRef.current
      const gm = cfg.glowMult
      ctx!.clearRect(0, 0, parent.clientWidth, parent.clientHeight)
      ctx!.fillStyle = cfg.color

      // Wires
      for (const { i, j } of wires) {
        const a = bulbs[i], b = bulbs[j]
        const charge = Math.max(a.charge, b.charge)
        ctx!.beginPath()
        ctx!.strokeStyle = cfg.color
        ctx!.lineWidth = 0.5 + charge * 1.5
        ctx!.globalAlpha = cfg.wireAlpha + charge * 0.28
        ctx!.moveTo(a.x, a.y); ctx!.lineTo(b.x, b.y)
        ctx!.stroke()
      }

      // Bulbs
      for (const b of bulbs) {
        const c = b.charge
        if (c > 0.04) {
          ctx!.beginPath(); ctx!.globalAlpha = 0.035 * c * gm
          ctx!.arc(b.x, b.y, 24, 0, Math.PI * 2); ctx!.fill()
          ctx!.beginPath(); ctx!.globalAlpha = 0.08 * c * gm
          ctx!.arc(b.x, b.y, 13, 0, Math.PI * 2); ctx!.fill()
          ctx!.beginPath(); ctx!.globalAlpha = 0.18 * c * gm
          ctx!.arc(b.x, b.y, 6, 0, Math.PI * 2); ctx!.fill()
        }
        ctx!.beginPath()
        ctx!.globalAlpha = Math.min(0.95, 0.1 + 0.72 * c * gm)
        ctx!.arc(b.x, b.y, 2, 0, Math.PI * 2); ctx!.fill()
      }

      ctx!.globalAlpha = 1
    }

    function tick(ts: number) {
      const delta = Math.min(ts - lastTime, 50)
      lastTime = ts
      const cfg = configRef.current

      if (needsReseedRef.current) {
        needsReseedRef.current = false
        const parent = canvas!.parentElement!
        const g = buildGraph(parent.clientWidth, parent.clientHeight, cfg)
        bulbs = g.bulbs; wires = g.wires
      }

      for (const b of bulbs) {
        const d = Math.hypot(b.x - mouse.x, b.y - mouse.y)
        if (d < cfg.cursorRadius) {
          const target = (1 - d / cfg.cursorRadius) * 0.95
          if (target > b.charge) b.charge += (target - b.charge) * 0.12
        }
      }

      for (let pass = 0; pass < 2; pass++) {
        for (const { i, j } of wires) {
          const a = bulbs[i], b = bulbs[j]
          const max = Math.max(a.charge, b.charge) * cfg.spreadFactor
          if (a.charge < max) a.charge += (max - a.charge) * 0.07
          if (b.charge < max) b.charge += (max - b.charge) * 0.07
        }
      }

      for (const b of bulbs) b.charge = Math.max(0, b.charge - cfg.decay * delta)

      drawFrame()
      rafId = requestAnimationFrame(tick)
    }

    function start() { lastTime = performance.now(); rafId = requestAnimationFrame(tick) }
    function stop() { cancelAnimationFrame(rafId) }

    const dims = resizeCanvas()
    if (dims) { const g = buildGraph(dims.w, dims.h, configRef.current); bulbs = g.bulbs; wires = g.wires }

    if (reducedMotion) { drawFrame(); return }

    let resizeTimer = 0
    const ro = new ResizeObserver(() => {
      clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(() => {
        stop()
        const d = resizeCanvas()
        if (d) { const g = buildGraph(d.w, d.h, configRef.current); bulbs = g.bulbs; wires = g.wires }
        start()
      }, 150)
    })
    if (canvas.parentElement) ro.observe(canvas.parentElement)

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = e.clientX - rect.left; mouse.y = e.clientY - rect.top
    }
    window.addEventListener('mousemove', onMouseMove)

    const onVisibility = () => {
      if (document.hidden) stop()
      else { lastTime = performance.now(); start() }
    }
    document.addEventListener('visibilitychange', onVisibility)

    start()
    return () => {
      stop(); ro.disconnect()
      window.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('visibilitychange', onVisibility)
      clearTimeout(resizeTimer)
    }
  }, [])

  return <canvas ref={canvasRef} aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }} />
}
