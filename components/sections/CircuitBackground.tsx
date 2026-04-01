'use client'

import { useEffect, useRef } from 'react'

const COLOR = '#38bdf8' // sky-400
const CORNER_R = 10    // px — rounded corner radius on L-bends

interface Node {
  x: number
  y: number
  ox: number
  oy: number
  vx: number
  vy: number
}

interface Pulse {
  t: number
  speed: number
  nextSpawn: number
}

interface Edge {
  a: number
  b: number
  variant: 0 | 1  // 0 = H-first, 1 = V-first
  pulses: Pulse[]
}

function reseedGraph(w: number, h: number): { nodes: Node[]; edges: Edge[]; cols: number; rows: number } {
  const COLS = Math.max(4, Math.floor(w / 130))
  const ROWS = Math.max(3, Math.floor(h / 110))
  const cellW = w / COLS
  const cellH = h / ROWS

  // Place nodes on grid with small jitter (15% of cell)
  const nodes: Node[] = []
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cx = (c + 0.5) * cellW
      const cy = (r + 0.5) * cellH
      const jx = (Math.random() - 0.5) * cellW * 0.15
      const jy = (Math.random() - 0.5) * cellH * 0.15
      nodes.push({ x: cx + jx, y: cy + jy, ox: cx + jx, oy: cy + jy, vx: 0, vy: 0 })
    }
  }

  const idx = (r: number, c: number) => r * COLS + c

  const edges: Edge[] = []

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      // Connect right — skip ~20% randomly for natural gaps
      if (c + 1 < COLS && Math.random() > 0.2) {
        edges.push({
          a: idx(r, c),
          b: idx(r, c + 1),
          variant: 0, // H-first (degenerate — same row, so it's a straight line)
          pulses: [{ t: -1, speed: 0.0003 + Math.random() * 0.0004, nextSpawn: Math.random() * 2000 }],
        })
      }
      // Connect down — skip ~20% randomly
      if (r + 1 < ROWS && Math.random() > 0.2) {
        edges.push({
          a: idx(r, c),
          b: idx(r + 1, c),
          variant: 1, // V-first (degenerate — same column, so it's a straight line)
          pulses: [{ t: -1, speed: 0.0003 + Math.random() * 0.0004, nextSpawn: Math.random() * 2000 }],
        })
      }
      // Occasional diagonal-grid cross connection (bottom-right or bottom-left) — ~12% of nodes
      if (r + 1 < ROWS && c + 1 < COLS && Math.random() < 0.12) {
        edges.push({
          a: idx(r, c),
          b: idx(r + 1, c + 1),
          variant: Math.random() < 0.5 ? 0 : 1,
          pulses: [{ t: -1, speed: 0.0003 + Math.random() * 0.0004, nextSpawn: Math.random() * 2000 }],
        })
      }
      if (r + 1 < ROWS && c - 1 >= 0 && Math.random() < 0.08) {
        edges.push({
          a: idx(r, c),
          b: idx(r + 1, c - 1),
          variant: Math.random() < 0.5 ? 0 : 1,
          pulses: [{ t: -1, speed: 0.0003 + Math.random() * 0.0004, nextSpawn: Math.random() * 2000 }],
        })
      }
    }
  }

  return { nodes, edges, cols: COLS, rows: ROWS }
}

function getLBendPoints(a: Node, b: Node, variant: 0 | 1): [number, number, number, number, number, number] {
  if (variant === 0) {
    const midX = (a.x + b.x) / 2
    return [a.x, a.y, midX, a.y, midX, b.y]
  } else {
    const midY = (a.y + b.y) / 2
    return [a.x, a.y, a.x, midY, b.x, midY]
  }
}

// Draw a single L-bend trace with rounded corners using arcTo
function strokeLBend(
  ctx: CanvasRenderingContext2D,
  a: Node,
  b: Node,
  variant: 0 | 1,
) {
  const [x0, y0, x1, y1, x2, y2] = getLBendPoints(a, b, variant)
  const bx = b.x
  const by = b.y

  const seg1 = Math.hypot(x1 - x0, y1 - y0)
  const seg2 = Math.hypot(x2 - x1, y2 - y1)
  const seg3 = Math.hypot(bx - x2, by - y2)

  const r1 = Math.min(CORNER_R, seg1 / 2, seg2 / 2)
  const r2 = Math.min(CORNER_R, seg2 / 2, seg3 / 2)

  ctx.moveTo(x0, y0)
  if (r1 > 0.5) {
    ctx.arcTo(x1, y1, x2, y2, r1)
  } else {
    ctx.lineTo(x1, y1)
  }
  if (r2 > 0.5) {
    ctx.arcTo(x2, y2, bx, by, r2)
  } else {
    ctx.lineTo(x2, y2)
  }
  ctx.lineTo(bx, by)
}

function getPulsePosition(a: Node, b: Node, variant: 0 | 1, t: number): [number, number] {
  const [x0, y0, x1, y1, x2, y2] = getLBendPoints(a, b, variant)
  const bx = b.x
  const by = b.y

  const seg1 = Math.hypot(x1 - x0, y1 - y0)
  const seg2 = Math.hypot(x2 - x1, y2 - y1)
  const seg3 = Math.hypot(bx - x2, by - y2)
  const total = seg1 + seg2 + seg3

  const dist = t * total

  if (dist <= seg1) {
    const r = seg1 === 0 ? 0 : dist / seg1
    return [x0 + (x1 - x0) * r, y0 + (y1 - y0) * r]
  } else if (dist <= seg1 + seg2) {
    const r = seg2 === 0 ? 0 : (dist - seg1) / seg2
    return [x1 + (x2 - x1) * r, y1 + (y2 - y1) * r]
  } else {
    const r = seg3 === 0 ? 0 : (dist - seg1 - seg2) / seg3
    return [x2 + (bx - x2) * r, y2 + (by - y2) * r]
  }
}

export default function CircuitBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

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

    function drawFrame(w: number, h: number) {
      ctx!.clearRect(0, 0, w, h)

      // All edges in one batched path
      ctx!.beginPath()
      ctx!.strokeStyle = COLOR
      ctx!.globalAlpha = 0.09
      ctx!.lineWidth = 1
      ctx!.lineJoin = 'round'
      for (const e of edges) {
        strokeLBend(ctx!, nodes[e.a], nodes[e.b], e.variant)
      }
      ctx!.stroke()

      // All nodes batched
      ctx!.beginPath()
      ctx!.fillStyle = COLOR
      ctx!.globalAlpha = 0.18
      for (const n of nodes) {
        ctx!.moveTo(n.x + 2, n.y)
        ctx!.arc(n.x, n.y, 2, 0, Math.PI * 2)
      }
      ctx!.fill()

      // Pulses
      ctx!.fillStyle = COLOR
      for (const e of edges) {
        const a = nodes[e.a]
        const b = nodes[e.b]
        for (const p of e.pulses) {
          if (p.t < 0 || p.t > 1) continue
          const [px, py] = getPulsePosition(a, b, e.variant, p.t)
          ctx!.beginPath()
          ctx!.globalAlpha = 0.12
          ctx!.arc(px, py, 6, 0, Math.PI * 2)
          ctx!.fill()
          ctx!.beginPath()
          ctx!.globalAlpha = 0.5
          ctx!.arc(px, py, 2, 0, Math.PI * 2)
          ctx!.fill()
        }
      }

      ctx!.globalAlpha = 1
    }

    function tick(ts: number) {
      const parent = canvas!.parentElement
      if (!parent) return
      const w = parent.clientWidth
      const h = parent.clientHeight

      const delta = Math.min(ts - lastTime, 50)
      lastTime = ts

      const INFLUENCE = 140
      const PUSH = 0.035
      const SPRING = 0.01
      const DAMPING = 0.86

      for (const n of nodes) {
        const dx = n.x - mouse.x
        const dy = n.y - mouse.y
        const dist = Math.hypot(dx, dy)
        if (dist < INFLUENCE && dist > 0) {
          const force = (INFLUENCE - dist) / INFLUENCE
          n.vx += (dx / dist) * force * PUSH * delta
          n.vy += (dy / dist) * force * PUSH * delta
        }
        n.vx += (n.ox - n.x) * SPRING
        n.vy += (n.oy - n.y) * SPRING
        n.vx *= DAMPING
        n.vy *= DAMPING
        n.x += n.vx
        n.y += n.vy
      }

      for (const e of edges) {
        for (const p of e.pulses) {
          if (p.t >= 0) {
            p.t += p.speed * delta
            if (p.t > 1) {
              p.t = -1
              p.nextSpawn = 1400 + Math.random() * 2000
            }
          } else {
            p.nextSpawn -= delta
            if (p.nextSpawn <= 0) {
              p.t = 0
              p.speed = 0.0003 + Math.random() * 0.0004
            }
          }
        }
      }

      drawFrame(w, h)
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
      const g = reseedGraph(dims.w, dims.h)
      nodes = g.nodes
      edges = g.edges
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
        if (d) {
          const g = reseedGraph(d.w, d.h)
          nodes = g.nodes
          edges = g.edges
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
