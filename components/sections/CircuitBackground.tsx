'use client'

import { useEffect, useRef } from 'react'
import { CircuitConfig, DEFAULT_CIRCUIT } from '@/types/bg-config'

interface Node {
  x: number; y: number
  ox: number; oy: number
  vx: number; vy: number
}

interface Pulse { t: number; speed: number; nextSpawn: number }

interface Edge {
  a: number; b: number
  variant: 0 | 1
  pulses: Pulse[]
}

function reseedGraph(w: number, h: number, cfg: CircuitConfig) {
  const COLS = Math.max(4, Math.floor(w / cfg.cellSize))
  const ROWS = Math.max(3, Math.floor(h / (cfg.cellSize * 0.85)))
  const cellW = w / COLS
  const cellH = h / ROWS

  const nodes: Node[] = []
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cx = (c + 0.5) * cellW
      const cy = (r + 0.5) * cellH
      const jx = (Math.random() - 0.5) * cellW * cfg.jitter
      const jy = (Math.random() - 0.5) * cellH * cfg.jitter
      nodes.push({ x: cx + jx, y: cy + jy, ox: cx + jx, oy: cy + jy, vx: 0, vy: 0 })
    }
  }

  const idx = (r: number, c: number) => r * COLS + c
  const edges: Edge[] = []
  const BASE_SPEED = 0.0003
  const SPEED_RANGE = 0.0004

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (c + 1 < COLS && Math.random() > cfg.skipProb) {
        edges.push({ a: idx(r, c), b: idx(r, c + 1), variant: 0,
          pulses: [{ t: -1, speed: (BASE_SPEED + Math.random() * SPEED_RANGE) * cfg.pulseSpeedMult, nextSpawn: Math.random() * 2000 }] })
      }
      if (r + 1 < ROWS && Math.random() > cfg.skipProb) {
        edges.push({ a: idx(r, c), b: idx(r + 1, c), variant: 1,
          pulses: [{ t: -1, speed: (BASE_SPEED + Math.random() * SPEED_RANGE) * cfg.pulseSpeedMult, nextSpawn: Math.random() * 2000 }] })
      }
      if (r + 1 < ROWS && c + 1 < COLS && Math.random() < cfg.crossProb) {
        edges.push({ a: idx(r, c), b: idx(r + 1, c + 1), variant: Math.random() < 0.5 ? 0 : 1,
          pulses: [{ t: -1, speed: (BASE_SPEED + Math.random() * SPEED_RANGE) * cfg.pulseSpeedMult, nextSpawn: Math.random() * 2000 }] })
      }
      if (r + 1 < ROWS && c - 1 >= 0 && Math.random() < cfg.crossProb * 0.65) {
        edges.push({ a: idx(r, c), b: idx(r + 1, c - 1), variant: Math.random() < 0.5 ? 0 : 1,
          pulses: [{ t: -1, speed: (BASE_SPEED + Math.random() * SPEED_RANGE) * cfg.pulseSpeedMult, nextSpawn: Math.random() * 2000 }] })
      }
    }
  }

  return { nodes, edges }
}

function getLBendPoints(a: Node, b: Node, variant: 0 | 1): [number, number, number, number, number, number] {
  if (variant === 0) { const midX = (a.x + b.x) / 2; return [a.x, a.y, midX, a.y, midX, b.y] }
  const midY = (a.y + b.y) / 2; return [a.x, a.y, a.x, midY, b.x, midY]
}

function strokeLBend(ctx: CanvasRenderingContext2D, a: Node, b: Node, variant: 0 | 1, R: number) {
  const [x0, y0, x1, y1, x2, y2] = getLBendPoints(a, b, variant)
  const bx = b.x, by = b.y
  const seg1 = Math.hypot(x1 - x0, y1 - y0)
  const seg2 = Math.hypot(x2 - x1, y2 - y1)
  const seg3 = Math.hypot(bx - x2, by - y2)
  const r1 = Math.min(R, seg1 / 2, seg2 / 2)
  const r2 = Math.min(R, seg2 / 2, seg3 / 2)
  ctx.moveTo(x0, y0)
  r1 > 0.5 ? ctx.arcTo(x1, y1, x2, y2, r1) : ctx.lineTo(x1, y1)
  r2 > 0.5 ? ctx.arcTo(x2, y2, bx, by, r2) : ctx.lineTo(x2, y2)
  ctx.lineTo(bx, by)
}

function getPulsePos(a: Node, b: Node, variant: 0 | 1, t: number): [number, number] {
  const [x0, y0, x1, y1, x2, y2] = getLBendPoints(a, b, variant)
  const bx = b.x, by = b.y
  const s1 = Math.hypot(x1 - x0, y1 - y0)
  const s2 = Math.hypot(x2 - x1, y2 - y1)
  const s3 = Math.hypot(bx - x2, by - y2)
  const d = t * (s1 + s2 + s3)
  if (d <= s1) { const r = s1 === 0 ? 0 : d / s1; return [x0 + (x1 - x0) * r, y0 + (y1 - y0) * r] }
  if (d <= s1 + s2) { const r = s2 === 0 ? 0 : (d - s1) / s2; return [x1 + (x2 - x1) * r, y1 + (y2 - y1) * r] }
  const r = s3 === 0 ? 0 : (d - s1 - s2) / s3; return [x2 + (bx - x2) * r, y2 + (by - y2) * r]
}

export default function CircuitBackground({ config = DEFAULT_CIRCUIT }: { config?: CircuitConfig }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const configRef = useRef<CircuitConfig>(config)
  const needsReseedRef = useRef(false)

  // Keep configRef current; flag structural reseed when layout params change
  useEffect(() => {
    const p = configRef.current
    if (p.cellSize !== config.cellSize || p.jitter !== config.jitter ||
        p.skipProb !== config.skipProb || p.crossProb !== config.crossProb) {
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

    let nodes: Node[] = []
    let edges: Edge[] = []
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

    function drawFrame(w: number, h: number) {
      const cfg = configRef.current
      ctx!.clearRect(0, 0, w, h)

      ctx!.beginPath()
      ctx!.strokeStyle = cfg.color
      ctx!.globalAlpha = cfg.traceAlpha
      ctx!.lineWidth = 1
      ctx!.lineJoin = 'round'
      for (const e of edges) strokeLBend(ctx!, nodes[e.a], nodes[e.b], e.variant, cfg.cornerR)
      ctx!.stroke()

      ctx!.beginPath()
      ctx!.fillStyle = cfg.color
      ctx!.globalAlpha = cfg.nodeAlpha
      for (const n of nodes) { ctx!.moveTo(n.x + 2, n.y); ctx!.arc(n.x, n.y, 2, 0, Math.PI * 2) }
      ctx!.fill()

      ctx!.fillStyle = cfg.color
      for (const e of edges) {
        const a = nodes[e.a], b = nodes[e.b]
        for (const p of e.pulses) {
          if (p.t < 0 || p.t > 1) continue
          const [px, py] = getPulsePos(a, b, e.variant, p.t)
          ctx!.beginPath(); ctx!.globalAlpha = cfg.pulseAlpha * 0.25
          ctx!.arc(px, py, 6, 0, Math.PI * 2); ctx!.fill()
          ctx!.beginPath(); ctx!.globalAlpha = cfg.pulseAlpha
          ctx!.arc(px, py, 2, 0, Math.PI * 2); ctx!.fill()
        }
      }
      ctx!.globalAlpha = 1
    }

    function tick(ts: number) {
      const parent = canvas!.parentElement
      if (!parent) return
      const w = parent.clientWidth, h = parent.clientHeight

      if (needsReseedRef.current) {
        needsReseedRef.current = false
        const g = reseedGraph(w, h, configRef.current)
        nodes = g.nodes; edges = g.edges
      }

      const delta = Math.min(ts - lastTime, 50)
      lastTime = ts
      const cfg = configRef.current

      for (const n of nodes) {
        const dx = n.x - mouse.x, dy = n.y - mouse.y
        const dist = Math.hypot(dx, dy)
        if (dist < cfg.mouseInfluence && dist > 0) {
          const force = (cfg.mouseInfluence - dist) / cfg.mouseInfluence
          n.vx += (dx / dist) * force * 0.035 * delta
          n.vy += (dy / dist) * force * 0.035 * delta
        }
        n.vx += (n.ox - n.x) * cfg.springK
        n.vy += (n.oy - n.y) * cfg.springK
        n.vx *= cfg.damping; n.vy *= cfg.damping
        n.x += n.vx; n.y += n.vy
      }

      for (const e of edges) {
        for (const p of e.pulses) {
          if (p.t >= 0) {
            p.t += p.speed * delta
            if (p.t > 1) { p.t = -1; p.nextSpawn = 1400 + Math.random() * 2000 }
          } else {
            p.nextSpawn -= delta
            if (p.nextSpawn <= 0) {
              p.t = 0
              p.speed = (0.0003 + Math.random() * 0.0004) * configRef.current.pulseSpeedMult
            }
          }
        }
      }

      drawFrame(w, h)
      rafId = requestAnimationFrame(tick)
    }

    function start() { lastTime = performance.now(); rafId = requestAnimationFrame(tick) }
    function stop() { cancelAnimationFrame(rafId) }

    const dims = resizeCanvas()
    if (dims) {
      const g = reseedGraph(dims.w, dims.h, configRef.current)
      nodes = g.nodes; edges = g.edges
    }

    if (reducedMotion) {
      const parent = canvas.parentElement
      if (parent) drawFrame(parent.clientWidth, parent.clientHeight)
      return
    }

    let resizeTimer = 0
    const ro = new ResizeObserver(() => {
      clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(() => {
        stop()
        const d = resizeCanvas()
        if (d) { const g = reseedGraph(d.w, d.h, configRef.current); nodes = g.nodes; edges = g.edges }
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
