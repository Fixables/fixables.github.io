'use client'

import { useEffect, useRef } from 'react'
import { MagneticConfig, DEFAULT_MAGNETIC } from '@/types/bg-config'

interface Pole { x: number; y: number; sign: 1 | -1 }
interface FieldLine { points: [number, number][] }
interface FluxDot { lineIdx: number; t: number; speed: number }

function fieldAt(poles: Pole[], x: number, y: number): [number, number] {
  let fx = 0, fy = 0
  for (const p of poles) {
    const dx = x - p.x
    const dy = y - p.y
    const r2 = dx * dx + dy * dy + 150
    const scale = p.sign / (r2 * Math.sqrt(r2))
    fx += dx * scale
    fy += dy * scale
  }
  return [fx, fy]
}

function traceFieldLine(
  startX: number, startY: number,
  poles: Pole[],
  w: number, h: number,
): FieldLine {
  const points: [number, number][] = [[startX, startY]]
  let x = startX, y = startY
  const step = 6
  const maxSteps = 400
  const sinkR = 16
  const sPoles = poles.filter(p => p.sign === -1)

  for (let i = 0; i < maxSteps; i++) {
    const [fx, fy] = fieldAt(poles, x, y)
    const mag = Math.hypot(fx, fy)
    if (mag < 1e-10) break

    x += (fx / mag) * step
    y += (fy / mag) * step
    points.push([x, y])

    if (x < -40 || x > w + 40 || y < -40 || y > h + 40) break

    let absorbed = false
    for (const sp of sPoles) {
      if (Math.hypot(x - sp.x, y - sp.y) < sinkR) { absorbed = true; break }
    }
    if (absorbed) break
  }

  return { points }
}

function getLinePos(line: FieldLine, t: number): [number, number] {
  const pts = line.points
  if (pts.length < 2) return pts[0] ?? [0, 0]
  const rawIdx = t * (pts.length - 1)
  const idx = Math.max(0, Math.min(pts.length - 2, Math.floor(rawIdx)))
  const frac = rawIdx - idx
  const [x0, y0] = pts[idx]
  const [x1, y1] = pts[idx + 1] ?? pts[idx]
  return [x0 + (x1 - x0) * frac, y0 + (y1 - y0) * frac]
}

function buildLayout(w: number, h: number, cfg: MagneticConfig): {
  poles: Pole[]
  fieldLines: FieldLine[]
  fluxDots: FluxDot[]
} {
  const n = Math.max(1, Math.min(3, Math.round(cfg.dipoleCount)))
  const poles: Pole[] = []

  // Dipole arrangements — each is a list of {cx, cy, angle} where angle = direction N→S
  if (n === 1) {
    // Horizontal dipole near center
    const cx = w * 0.5, cy = h * 0.5, half = Math.min(w, h) * 0.1
    poles.push({ x: cx - half, y: cy, sign: 1 })
    poles.push({ x: cx + half, y: cy, sign: -1 })
  } else if (n === 2) {
    // Two vertical dipoles, mirror symmetric, moments opposing
    const half = Math.min(w, h) * 0.09
    poles.push({ x: w * 0.3, y: h * 0.5 - half, sign: 1 })
    poles.push({ x: w * 0.3, y: h * 0.5 + half, sign: -1 })
    poles.push({ x: w * 0.7, y: h * 0.5 + half, sign: 1 })
    poles.push({ x: w * 0.7, y: h * 0.5 - half, sign: -1 })
  } else {
    // Three dipoles: triangle, each angled differently for visual variety
    const half = Math.min(w, h) * 0.075
    // Left dipole — horizontal
    poles.push({ x: w * 0.28 - half, y: h * 0.55, sign: 1 })
    poles.push({ x: w * 0.28 + half, y: h * 0.55, sign: -1 })
    // Right dipole — horizontal reversed
    poles.push({ x: w * 0.72 + half, y: h * 0.55, sign: 1 })
    poles.push({ x: w * 0.72 - half, y: h * 0.55, sign: -1 })
    // Top dipole — vertical
    poles.push({ x: w * 0.5, y: h * 0.28 - half, sign: 1 })
    poles.push({ x: w * 0.5, y: h * 0.28 + half, sign: -1 })
  }

  // Trace field lines from each N pole
  const nPoles = poles.filter(p => p.sign === 1)
  const numSeeds = Math.max(6, Math.min(18, Math.round(cfg.fieldLineCount)))
  const fieldLines: FieldLine[] = []

  for (const nPole of nPoles) {
    for (let i = 0; i < numSeeds; i++) {
      const angle = (i / numSeeds) * Math.PI * 2
      const seedR = 20
      const line = traceFieldLine(
        nPole.x + Math.cos(angle) * seedR,
        nPole.y + Math.sin(angle) * seedR,
        poles, w, h,
      )
      if (line.points.length > 6) fieldLines.push(line)
    }
  }

  // Flux dots — two per line, offset in phase
  const fluxDots: FluxDot[] = []
  for (let li = 0; li < fieldLines.length; li++) {
    for (let d = 0; d < 2; d++) {
      fluxDots.push({
        lineIdx: li,
        t: d * 0.5,
        speed: 0.00025 + Math.random() * 0.00015,
      })
    }
  }

  return { poles, fieldLines, fluxDots }
}

export default function MagneticBackground({ config = DEFAULT_MAGNETIC }: { config?: MagneticConfig }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const configRef = useRef<MagneticConfig>(config)
  const needsReseedRef = useRef(false)

  useEffect(() => {
    const p = configRef.current
    if (p.dipoleCount !== config.dipoleCount || p.fieldLineCount !== config.fieldLineCount) {
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

    let poles: Pole[] = []
    let fieldLines: FieldLine[] = []
    let fluxDots: FluxDot[] = []
    let rafId = 0
    let lastTime = 0

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
      ctx!.strokeStyle = cfg.color
      ctx!.fillStyle = cfg.color

      // Field lines
      ctx!.lineWidth = 0.7
      for (const line of fieldLines) {
        if (line.points.length < 2) continue
        ctx!.beginPath()
        ctx!.globalAlpha = cfg.alpha
        ctx!.moveTo(line.points[0][0], line.points[0][1])
        for (let i = 1; i < line.points.length; i++) {
          ctx!.lineTo(line.points[i][0], line.points[i][1])
        }
        ctx!.stroke()
      }

      // Flux dots flowing along field lines
      for (const dot of fluxDots) {
        const line = fieldLines[dot.lineIdx]
        if (!line || line.points.length < 2) continue
        const [px, py] = getLinePos(line, dot.t)
        // Soft glow
        ctx!.beginPath()
        ctx!.globalAlpha = cfg.alpha * 0.45
        ctx!.arc(px, py, 4, 0, Math.PI * 2)
        ctx!.fill()
        // Bright core
        ctx!.beginPath()
        ctx!.globalAlpha = Math.min(1, cfg.alpha * 2.2)
        ctx!.arc(px, py, 1.5, 0, Math.PI * 2)
        ctx!.fill()
      }

      // Pole markers — N filled dot, S open circle
      for (const p of poles) {
        ctx!.globalAlpha = cfg.alpha * 0.6
        ctx!.beginPath()
        if (p.sign === 1) {
          ctx!.arc(p.x, p.y, 4, 0, Math.PI * 2)
          ctx!.fill()
        } else {
          ctx!.lineWidth = 1
          ctx!.arc(p.x, p.y, 3.5, 0, Math.PI * 2)
          ctx!.stroke()
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
        const layout = buildLayout(w, h, configRef.current)
        poles = layout.poles; fieldLines = layout.fieldLines; fluxDots = layout.fluxDots
      }

      const delta = Math.min(ts - lastTime, 50)
      lastTime = ts
      const cfg = configRef.current

      for (const dot of fluxDots) {
        dot.t += dot.speed * cfg.speed * delta
        if (dot.t > 1) dot.t -= 1
      }

      drawFrame(w, h)
      rafId = requestAnimationFrame(tick)
    }

    function start() { lastTime = performance.now(); rafId = requestAnimationFrame(tick) }
    function stop() { cancelAnimationFrame(rafId) }

    const dims = resizeCanvas()
    if (dims) {
      const layout = buildLayout(dims.w, dims.h, configRef.current)
      poles = layout.poles; fieldLines = layout.fieldLines; fluxDots = layout.fluxDots
    }

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
        if (d) {
          const layout = buildLayout(d.w, d.h, configRef.current)
          poles = layout.poles; fieldLines = layout.fieldLines; fluxDots = layout.fluxDots
        }
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
      stop(); ro.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      clearTimeout(resizeTimer)
    }
  }, [])

  return <canvas ref={canvasRef} aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }} />
}
