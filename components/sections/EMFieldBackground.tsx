'use client'

import { useEffect, useRef } from 'react'
import { EMFieldConfig, DEFAULT_EMFIELD } from '@/types/bg-config'

interface Charge {
  x: number; y: number
  vx: number; vy: number
  sign: 1 | -1
}

interface Particle {
  x: number; y: number
  trail: [number, number][]
}

function buildCharges(w: number, h: number, chargeCount: number): Charge[] {
  const charges: Charge[] = []
  const n = Math.max(1, Math.round(chargeCount))
  for (let i = 0; i < n; i++) {
    charges.push({
      x: 0.2 * w + Math.random() * 0.6 * w,
      y: 0.2 * h + Math.random() * 0.6 * h,
      vx: (Math.random() - 0.5) * 0.04,
      vy: (Math.random() - 0.5) * 0.04,
      sign: 1,
    })
    charges.push({
      x: 0.2 * w + Math.random() * 0.6 * w,
      y: 0.2 * h + Math.random() * 0.6 * h,
      vx: (Math.random() - 0.5) * 0.04,
      vy: (Math.random() - 0.5) * 0.04,
      sign: -1,
    })
  }
  return charges
}

function spawnParticle(w: number, h: number, charges: Charge[]): Particle {
  // Spawn near a positive (source) charge for immediate visual interest
  const sources = charges.filter(c => c.sign === 1)
  if (sources.length > 0) {
    const src = sources[Math.floor(Math.random() * sources.length)]
    const angle = Math.random() * Math.PI * 2
    const dist = 15 + Math.random() * 40
    return { x: src.x + Math.cos(angle) * dist, y: src.y + Math.sin(angle) * dist, trail: [] }
  }
  return { x: Math.random() * w, y: Math.random() * h, trail: [] }
}

function buildParticles(w: number, h: number, count: number, charges: Charge[]): Particle[] {
  const ps: Particle[] = []
  for (let i = 0; i < count; i++) {
    ps.push(spawnParticle(w, h, charges))
  }
  return ps
}

function fieldAt(charges: Charge[], px: number, py: number): [number, number] {
  let ex = 0, ey = 0
  for (const c of charges) {
    const dx = px - c.x
    const dy = py - c.y
    const r2 = dx * dx + dy * dy + 200
    const scale = c.sign / r2
    ex += dx * scale
    ey += dy * scale
  }
  return [ex, ey]
}

export default function EMFieldBackground({ config = DEFAULT_EMFIELD }: { config?: EMFieldConfig }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const configRef = useRef<EMFieldConfig>(config)
  const needsReseedRef = useRef(false)

  useEffect(() => {
    const p = configRef.current
    if (p.particleCount !== config.particleCount || p.chargeCount !== config.chargeCount) {
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

    let charges: Charge[] = []
    let particles: Particle[] = []
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
      const cfg = configRef.current
      ctx!.clearRect(0, 0, w, h)

      ctx!.strokeStyle = cfg.color
      ctx!.fillStyle = cfg.color

      // Trails + particles
      const trailLen = Math.max(2, Math.round(cfg.trailLength))
      for (const p of particles) {
        if (p.trail.length < 2) continue
        for (let i = 1; i < p.trail.length; i++) {
          const tAlpha = (i / p.trail.length) * cfg.alpha
          ctx!.globalAlpha = tAlpha
          ctx!.lineWidth = 0.8
          ctx!.beginPath()
          ctx!.moveTo(p.trail[i - 1][0], p.trail[i - 1][1])
          ctx!.lineTo(p.trail[i][0], p.trail[i][1])
          ctx!.stroke()
        }
        ctx!.globalAlpha = cfg.alpha
        ctx!.beginPath()
        ctx!.arc(p.x, p.y, 1.5, 0, Math.PI * 2)
        ctx!.fill()
      }

      // Charge markers
      for (const c of charges) {
        ctx!.globalAlpha = 0.2
        ctx!.beginPath()
        ctx!.arc(c.x, c.y, 4, 0, Math.PI * 2)
        if (c.sign > 0) ctx!.fill()
        else { ctx!.lineWidth = 1; ctx!.stroke() }

        ctx!.globalAlpha = 0.05
        ctx!.beginPath()
        ctx!.arc(c.x, c.y, 8, 0, Math.PI * 2)
        if (c.sign > 0) ctx!.fill()
        else { ctx!.lineWidth = 1; ctx!.stroke() }
      }

      ctx!.globalAlpha = 1
    }

    function tick(ts: number) {
      const parent = canvas!.parentElement
      if (!parent) return
      const w = parent.clientWidth, h = parent.clientHeight

      if (needsReseedRef.current) {
        needsReseedRef.current = false
        const cfg = configRef.current
        charges = buildCharges(w, h, cfg.chargeCount)
        particles = buildParticles(w, h, cfg.particleCount, charges)
      }

      const delta = Math.min(ts - lastTime, 50)
      lastTime = ts
      const cfg = configRef.current
      const trailLen = Math.max(2, Math.round(cfg.trailLength))

      // Move charges — drift slowly, bounce off edges
      for (const c of charges) {
        c.x += c.vx * delta
        c.y += c.vy * delta
        if (c.x < 0 || c.x > w) { c.vx = -c.vx * 0.8; c.x = Math.max(0, Math.min(w, c.x)) }
        if (c.y < 0 || c.y > h) { c.vy = -c.vy * 0.8; c.y = Math.max(0, Math.min(h, c.y)) }
      }

      const sinks   = charges.filter(c => c.sign === -1)
      const sources  = charges.filter(c => c.sign === 1)

      // Move particles along field lines
      for (const p of particles) {
        p.trail.push([p.x, p.y])
        if (p.trail.length > trailLen) p.trail.shift()

        const [ex, ey] = fieldAt(charges, p.x, p.y)
        const mag = Math.hypot(ex, ey)
        if (mag > 0) {
          const step = Math.min(2, delta * 0.08 * cfg.speed)
          p.x += (ex / mag) * step
          p.y += (ey / mag) * step
        }

        // Check absorption by a negative charge (sink)
        let needsRespawn = false
        for (const s of sinks) {
          if (Math.hypot(p.x - s.x, p.y - s.y) < 10) { needsRespawn = true; break }
        }

        // Check off-canvas
        if (!needsRespawn && (p.x < -12 || p.x > w + 12 || p.y < -12 || p.y > h + 12)) {
          needsRespawn = true
        }

        if (needsRespawn) {
          // Respawn near a positive (source) charge
          const src = sources.length > 0
            ? sources[Math.floor(Math.random() * sources.length)]
            : null
          if (src) {
            const angle = Math.random() * Math.PI * 2
            const dist = 15 + Math.random() * 35
            p.x = src.x + Math.cos(angle) * dist
            p.y = src.y + Math.sin(angle) * dist
          } else {
            p.x = Math.random() * w
            p.y = Math.random() * h
          }
          p.trail = []
        }
      }

      drawFrame(w, h)
      rafId = requestAnimationFrame(tick)
    }

    function start() { lastTime = performance.now(); rafId = requestAnimationFrame(tick) }
    function stop() { cancelAnimationFrame(rafId) }

    const dims = resizeCanvas()
    if (dims) {
      const cfg = configRef.current
      charges = buildCharges(dims.w, dims.h, cfg.chargeCount)
      particles = buildParticles(dims.w, dims.h, cfg.particleCount, charges)
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
          const cfg = configRef.current
          charges = buildCharges(d.w, d.h, cfg.chargeCount)
          particles = buildParticles(d.w, d.h, cfg.particleCount, charges)
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
      stop()
      ro.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      clearTimeout(resizeTimer)
    }
  }, [])

  return <canvas ref={canvasRef} aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }} />
}
