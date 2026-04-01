'use client'

import { useEffect, useRef } from 'react'

const COLOR = '#38bdf8' // sky-400

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
  // L-bend variant: 0 = horizontal-first, 1 = vertical-first
  variant: 0 | 1
  pulses: Pulse[]
}

function reseedGraph(w: number, h: number): { nodes: Node[]; edges: Edge[] } {
  const COLS = Math.max(3, Math.floor(w / 120))
  const ROWS = Math.max(3, Math.floor(h / 100))
  const cellW = w / COLS
  const cellH = h / ROWS

  const nodes: Node[] = []
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cx = (c + 0.5) * cellW
      const cy = (r + 0.5) * cellH
      const jx = (Math.random() - 0.5) * cellW * 0.4
      const jy = (Math.random() - 0.5) * cellH * 0.4
      nodes.push({ x: cx + jx, y: cy + jy, ox: cx + jx, oy: cy + jy, vx: 0, vy: 0 })
    }
  }

  const maxDist = 1.8 * cellW
  const seen = new Set<string>()
  const edges: Edge[] = []

  for (let i = 0; i < nodes.length; i++) {
    // Sort all others by distance, connect to nearest 2 within range
    const neighbors = nodes
      .map((n, j) => ({ j, d: Math.hypot(n.x - nodes[i].x, n.y - nodes[i].y) }))
      .filter(({ j, d }) => j !== i && d < maxDist)
      .sort((a, b) => a.d - b.d)
      .slice(0, 2)

    for (const { j } of neighbors) {
      const key = `${Math.min(i, j)}_${Math.max(i, j)}`
      if (seen.has(key)) continue
      seen.add(key)
      edges.push({
        a: i,
        b: j,
        variant: Math.random() < 0.5 ? 0 : 1,
        pulses: [{ t: Math.random(), speed: 0.0003 + Math.random() * 0.0004, nextSpawn: 1200 + Math.random() * 1800 }],
      })
    }
  }

  return { nodes, edges }
}

function getLBendPoints(a: Node, b: Node, variant: 0 | 1): [number, number, number, number, number, number] {
  if (variant === 0) {
    // horizontal first: A → (midX, a.y) → (midX, b.y) → B
    const midX = (a.x + b.x) / 2
    return [a.x, a.y, midX, a.y, midX, b.y]
  } else {
    // vertical first: A → (a.x, midY) → (b.x, midY) → B
    const midY = (a.y + b.y) / 2
    return [a.x, a.y, a.x, midY, b.x, midY]
  }
}

function getPulsePosition(
  a: Node,
  b: Node,
  variant: 0 | 1,
  t: number,
): [number, number] {
  const [x0, y0, x1, y1, x2, y2] = getLBendPoints(a, b, variant)
  const bx = b.x
  const by = b.y

  // Total path length (approximation via segment lengths)
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

      // Batch draw all edges
      ctx!.beginPath()
      ctx!.strokeStyle = COLOR
      ctx!.globalAlpha = 0.08
      ctx!.lineWidth = 1
      for (const e of edges) {
        const a = nodes[e.a]
        const b = nodes[e.b]
        const [x0, y0, x1, y1, x2, y2] = getLBendPoints(a, b, e.variant)
        ctx!.moveTo(x0, y0)
        ctx!.lineTo(x1, y1)
        ctx!.lineTo(x2, y2)
        ctx!.lineTo(b.x, b.y)
      }
      ctx!.stroke()

      // Batch draw all nodes
      ctx!.beginPath()
      ctx!.fillStyle = COLOR
      ctx!.globalAlpha = 0.15
      for (const n of nodes) {
        ctx!.moveTo(n.x + 2.5, n.y)
        ctx!.arc(n.x, n.y, 2.5, 0, Math.PI * 2)
      }
      ctx!.fill()

      // Draw pulses individually (small count)
      for (const e of edges) {
        const a = nodes[e.a]
        const b = nodes[e.b]
        for (const p of e.pulses) {
          if (p.t < 0 || p.t > 1) continue
          const [px, py] = getPulsePosition(a, b, e.variant, p.t)
          // glow
          ctx!.beginPath()
          ctx!.fillStyle = COLOR
          ctx!.globalAlpha = 0.15
          ctx!.arc(px, py, 5, 0, Math.PI * 2)
          ctx!.fill()
          // core
          ctx!.beginPath()
          ctx!.globalAlpha = 0.45
          ctx!.arc(px, py, 2.5, 0, Math.PI * 2)
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

      const rawDelta = ts - lastTime
      const delta = Math.min(rawDelta, 50) // cap burst on tab restore
      lastTime = ts

      // Spring physics for nodes
      const INFLUENCE = 150
      const PUSH = 0.04
      const SPRING = 0.012
      const DAMPING = 0.88

      for (const n of nodes) {
        const dx = n.x - mouse.x
        const dy = n.y - mouse.y
        const dist = Math.hypot(dx, dy)
        if (dist < INFLUENCE && dist > 0) {
          const force = (INFLUENCE - dist) / INFLUENCE
          n.vx += (dx / dist) * force * PUSH * delta
          n.vy += (dy / dist) * force * PUSH * delta
        }
        // spring-back
        n.vx += (n.ox - n.x) * SPRING
        n.vy += (n.oy - n.y) * SPRING
        // damping
        n.vx *= DAMPING
        n.vy *= DAMPING
        n.x += n.vx
        n.y += n.vy
      }

      // Update pulses
      for (const e of edges) {
        for (const p of e.pulses) {
          if (p.t >= 0) {
            p.t += p.speed * delta
            if (p.t > 1) {
              p.t = -1 // mark dead, schedule respawn
              p.nextSpawn = 1200 + Math.random() * 1800
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

    // Initial setup
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

    // Resize observer (debounced)
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

    // Mouse tracking
    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
    }
    window.addEventListener('mousemove', onMouseMove)

    // Visibility pause/resume
    const onVisibility = () => {
      if (document.hidden) {
        stop()
      } else {
        lastTime = performance.now()
        start()
      }
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
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  )
}
