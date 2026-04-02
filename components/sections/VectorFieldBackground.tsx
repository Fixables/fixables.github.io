'use client'

import { useEffect, useRef } from 'react'
import { VectorFieldConfig, DEFAULT_VECTORFIELD } from '@/types/bg-config'

export default function VectorFieldBackground({ config = DEFAULT_VECTORFIELD }: { config?: VectorFieldConfig }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const configRef = useRef<VectorFieldConfig>(config)

  useEffect(() => {
    configRef.current = config
  }, [config])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let rafId = 0
    let lastTime = 0
    let time = 0
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

      const cell = Math.max(30, Math.round(cfg.cellSize))
      const arrowLen = 9
      const hasMouse = mouse.x > -100

      ctx!.strokeStyle = cfg.color
      ctx!.fillStyle = cfg.color

      for (let gx = cell * 0.5; gx < w; gx += cell) {
        for (let gy = cell * 0.5; gy < h; gy += cell) {
          // Base field: slow counter-clockwise vortex
          const dx = gx - w * 0.5
          const dy = gy - h * 0.5
          const baseAngle = Math.atan2(dy, dx) + Math.PI * 0.5 + time * 0.00012 * cfg.speed

          let angle = baseAngle
          let alpha = cfg.alpha * 0.65

          // Mouse influence: arrows within radius point toward cursor
          if (hasMouse) {
            const mdx = mouse.x - gx
            const mdy = mouse.y - gy
            const mdist = Math.hypot(mdx, mdy)
            if (mdist < cfg.mouseInfluence) {
              const blend = 1 - mdist / cfg.mouseInfluence
              const mouseAngle = Math.atan2(mdy, mdx)
              // Smooth angular interpolation via vector lerp
              const lx = Math.cos(baseAngle) * (1 - blend * 0.85) + Math.cos(mouseAngle) * blend * 0.85
              const ly = Math.sin(baseAngle) * (1 - blend * 0.85) + Math.sin(mouseAngle) * blend * 0.85
              angle = Math.atan2(ly, lx)
              alpha = cfg.alpha * (0.65 + blend * 0.35)
            }
          }

          const ex = Math.cos(angle) * arrowLen
          const ey = Math.sin(angle) * arrowLen

          // Arrow shaft (tail to near-head)
          ctx!.beginPath()
          ctx!.globalAlpha = alpha * 0.55
          ctx!.lineWidth = 0.6
          ctx!.moveTo(gx - ex * 0.42, gy - ey * 0.42)
          ctx!.lineTo(gx + ex * 0.52, gy + ey * 0.52)
          ctx!.stroke()

          // Arrowhead: two short wings
          const headX = gx + ex * 0.52
          const headY = gy + ey * 0.52
          const wingLen = 3.5
          const wingAngle = Math.PI * 0.75
          ctx!.beginPath()
          ctx!.globalAlpha = alpha
          ctx!.lineWidth = 0.8
          ctx!.moveTo(headX + Math.cos(angle + wingAngle) * wingLen, headY + Math.sin(angle + wingAngle) * wingLen)
          ctx!.lineTo(headX, headY)
          ctx!.lineTo(headX + Math.cos(angle - wingAngle) * wingLen, headY + Math.sin(angle - wingAngle) * wingLen)
          ctx!.stroke()
        }
      }

      ctx!.globalAlpha = 1
    }

    function tick(ts: number) {
      const parent = canvas!.parentElement
      if (!parent) return
      const w = parent.clientWidth, h = parent.clientHeight

      const delta = Math.min(ts - lastTime, 50)
      lastTime = ts
      time += delta

      drawFrame(w, h)
      rafId = requestAnimationFrame(tick)
    }

    function start() { lastTime = performance.now(); rafId = requestAnimationFrame(tick) }
    function stop() { cancelAnimationFrame(rafId) }

    const dims = resizeCanvas()

    if (reducedMotion) {
      if (dims) drawFrame(dims.w, dims.h)
      return
    }

    let resizeTimer = 0
    const ro = new ResizeObserver(() => {
      clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(() => {
        stop(); resizeCanvas(); start()
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
