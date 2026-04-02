'use client'

import { useEffect, useRef } from 'react'
import { SignalFlowConfig, DEFAULT_SIGNALFLOW } from '@/types/bg-config'

const NODE_LABELS = ['ALU', 'REG', 'BUF', 'MUX', 'DEC', 'ACC', 'PC', 'IR', 'CU', 'MDR', 'MAR', 'ROM', 'RAM', 'FPU']

interface SFNode {
  x: number; y: number
  label: string
  glow: number  // 0→1 decay
}

interface Signal {
  t: number     // 0→1 progress
  speed: number
  active: boolean
  nextSpawn: number  // ms until next spawn
}

interface Edge {
  a: number; b: number
  signal: Signal
}

interface FlowGraph {
  nodes: SFNode[]
  edges: Edge[]
}

function buildGraph(w: number, h: number, cfg: SignalFlowConfig): FlowGraph {
  const count = Math.max(4, Math.min(NODE_LABELS.length, Math.round(cfg.nodeCount)))
  const minSpacing = 100

  const nodes: SFNode[] = []
  const pad = 60
  for (let attempt = 0; attempt < count * 30 && nodes.length < count; attempt++) {
    const x = pad + Math.random() * (w - pad * 2)
    const y = pad + Math.random() * (h - pad * 2)
    if (nodes.every(n => Math.hypot(n.x - x, n.y - y) >= minSpacing)) {
      nodes.push({ x, y, label: NODE_LABELS[nodes.length % NODE_LABELS.length], glow: 0 })
    }
  }

  const edges: Edge[] = []
  const edgeSet = new Set<string>()

  const makeSignal = (): Signal => ({
    t: -1,
    speed: 0.0004 + Math.random() * 0.0003,
    active: false,
    nextSpawn: 800 + Math.random() * 2500,
  })

  for (let i = 0; i < nodes.length; i++) {
    const a = nodes[i]
    // Sort by downstream (higher x with some y tolerance)
    const candidates = nodes
      .map((n, j) => ({ j, n, dx: n.x - a.x, dist: Math.hypot(n.x - a.x, n.y - a.y) }))
      .filter(({ j, dx, dist }) => j !== i && dx > -50 && dist < 250)
      .sort((a, b) => a.dist - b.dist)
      .slice(0, 2)

    for (const { j } of candidates) {
      const key = `${i}-${j}`
      if (!edgeSet.has(key)) {
        edgeSet.add(key)
        edges.push({ a: i, b: j, signal: makeSignal() })
      }
    }
  }

  // Add ~15% feedback edges
  const targetFeedback = Math.max(1, Math.round(edges.length * 0.15))
  for (let f = 0; f < targetFeedback; f++) {
    const i = Math.floor(Math.random() * nodes.length)
    const j = Math.floor(Math.random() * nodes.length)
    if (i === j) continue
    const key = `${i}-${j}`
    const rkey = `${j}-${i}`
    if (!edgeSet.has(key) && !edgeSet.has(rkey)) {
      // Check it goes right-to-left (feedback)
      if (nodes[i].x > nodes[j].x + 30) {
        edgeSet.add(key)
        edges.push({ a: i, b: j, signal: makeSignal() })
      }
    }
  }

  return { nodes, edges }
}

const NODE_W = 28
const NODE_H = 14
const NODE_R = 3

function drawRoundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.arcTo(x + w, y, x + w, y + r, r)
  ctx.lineTo(x + w, y + h - r)
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r)
  ctx.lineTo(x + r, y + h)
  ctx.arcTo(x, y + h, x, y + h - r, r)
  ctx.lineTo(x, y + r)
  ctx.arcTo(x, y, x + r, y, r)
  ctx.closePath()
}

function drawArrowhead(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number) {
  const angle = Math.atan2(y2 - y1, x2 - x1)
  const len = 6
  ctx.beginPath()
  ctx.moveTo(x2, y2)
  ctx.lineTo(x2 - len * Math.cos(angle - 0.4), y2 - len * Math.sin(angle - 0.4))
  ctx.lineTo(x2 - len * Math.cos(angle + 0.4), y2 - len * Math.sin(angle + 0.4))
  ctx.closePath()
  ctx.fill()
}

export default function SignalFlowBackground({ config = DEFAULT_SIGNALFLOW }: { config?: SignalFlowConfig }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const configRef = useRef<SignalFlowConfig>(config)
  const needsReseedRef = useRef(false)

  useEffect(() => {
    const p = configRef.current
    if (p.nodeCount !== config.nodeCount) {
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

    let graph: FlowGraph | null = null
    let rafId = 0
    let lastTime = 0

    function resizeCanvas() {
      const parent = canvas!.parentElement
      if (!parent) return
      const w = parent.clientWidth, h = parent.clientHeight
      const dpr = window.devicePixelRatio || 1
      canvas!.width = w * dpr
      canvas!.height = h * dpr
      canvas!.style.width = w + 'px'
      canvas!.style.height = h + 'px'
      ctx!.scale(dpr, dpr)
      return { w, h }
    }

    function drawFrame(w: number, h: number) {
      if (!graph) return
      const cfg = configRef.current
      ctx!.clearRect(0, 0, w, h)

      const { nodes, edges } = graph

      // Draw edges (wires)
      ctx!.strokeStyle = cfg.color
      ctx!.fillStyle = cfg.color
      ctx!.lineWidth = 0.8

      for (const e of edges) {
        const a = nodes[e.a], b = nodes[e.b]
        ctx!.globalAlpha = cfg.wireAlpha
        ctx!.beginPath()
        ctx!.moveTo(a.x, a.y)
        ctx!.lineTo(b.x, b.y)
        ctx!.stroke()

        // Arrowhead at target
        ctx!.globalAlpha = cfg.wireAlpha * 1.5
        drawArrowhead(ctx!, a.x, a.y, b.x, b.y)
      }

      // Draw signals
      for (const e of edges) {
        if (!e.signal.active || e.signal.t < 0) continue
        const a = nodes[e.a], b = nodes[e.b]
        const t = e.signal.t
        const px = a.x + (b.x - a.x) * t
        const py = a.y + (b.y - a.y) * t

        // Halo
        ctx!.globalAlpha = cfg.signalAlpha * 0.2
        ctx!.beginPath()
        ctx!.arc(px, py, 5, 0, Math.PI * 2)
        ctx!.fill()

        // Core
        ctx!.globalAlpha = cfg.signalAlpha
        ctx!.beginPath()
        ctx!.arc(px, py, 2.5, 0, Math.PI * 2)
        ctx!.fill()
      }

      // Draw nodes
      ctx!.font = '7px monospace'
      ctx!.textAlign = 'center'
      ctx!.textBaseline = 'middle'

      for (const n of nodes) {
        const nx = n.x - NODE_W / 2
        const ny = n.y - NODE_H / 2
        const glow = n.glow

        // Fill (glowing when signal arrives)
        ctx!.globalAlpha = cfg.nodeAlpha * glow
        ctx!.fillStyle = cfg.color
        drawRoundRect(ctx!, nx, ny, NODE_W, NODE_H, NODE_R)
        ctx!.fill()

        // Border
        ctx!.globalAlpha = cfg.nodeAlpha
        ctx!.strokeStyle = cfg.color
        ctx!.lineWidth = 0.6
        drawRoundRect(ctx!, nx, ny, NODE_W, NODE_H, NODE_R)
        ctx!.stroke()

        // Label
        ctx!.globalAlpha = cfg.nodeAlpha * 2
        ctx!.fillStyle = cfg.color
        ctx!.fillText(n.label, n.x, n.y)
      }

      ctx!.globalAlpha = 1
      ctx!.textAlign = 'start'
      ctx!.textBaseline = 'alphabetic'
    }

    function tick(ts: number) {
      const parent = canvas!.parentElement
      if (!parent) return
      const w = parent.clientWidth, h = parent.clientHeight

      if (needsReseedRef.current) {
        needsReseedRef.current = false
        graph = buildGraph(w, h, configRef.current)
      }

      if (!graph) return

      const delta = Math.min(ts - lastTime, 50)
      lastTime = ts
      const cfg = configRef.current
      const { nodes, edges } = graph

      // Decay node glows
      for (const n of nodes) {
        if (n.glow > 0) n.glow = Math.max(0, n.glow - delta / 300)
      }

      // Update signals
      for (const e of edges) {
        const sig = e.signal
        if (sig.active) {
          sig.t += sig.speed * cfg.speed * delta
          if (sig.t >= 1) {
            // Arrived — trigger glow on target node
            nodes[e.b].glow = 1
            sig.active = false
            sig.t = -1
            sig.nextSpawn = 800 + Math.random() * 2500
          }
        } else {
          sig.nextSpawn -= delta
          if (sig.nextSpawn <= 0) {
            sig.active = true
            sig.t = 0
            sig.speed = (0.0004 + Math.random() * 0.0003) * cfg.speed
          }
        }
      }

      drawFrame(w, h)
      rafId = requestAnimationFrame(tick)
    }

    function start() { lastTime = performance.now(); rafId = requestAnimationFrame(tick) }
    function stop() { cancelAnimationFrame(rafId) }

    const dims = resizeCanvas()
    if (dims) graph = buildGraph(dims.w, dims.h, configRef.current)

    if (reducedMotion) {
      if (dims) drawFrame(dims.w, dims.h)
      return
    }

    let resizeTimer = 0
    const ro = new ResizeObserver(() => {
      clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(() => {
        stop()
        const d = resizeCanvas()
        if (d) graph = buildGraph(d.w, d.h, configRef.current)
        start()
      }, 150)
    })
    if (canvas.parentElement) ro.observe(canvas.parentElement)

    const onVisibility = () => {
      if (document.hidden) stop()
      else { lastTime = performance.now(); start() }
    }
    document.addEventListener('visibilitychange', onVisibility)

    start()
    return () => {
      stop()
      ro.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      clearTimeout(resizeTimer)
    }
  }, [])

  return <canvas ref={canvasRef} aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }} />
}
