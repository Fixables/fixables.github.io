'use client'

import { useEffect, useRef } from 'react'
import { OscilloscopeConfig, DEFAULT_OSCILLOSCOPE } from '@/types/bg-config'

export default function OscilloscopeBackground({ config = DEFAULT_OSCILLOSCOPE }: { config?: OscilloscopeConfig }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const configRef = useRef<OscilloscopeConfig>(config)
  const needsReseedRef = useRef(false)

  useEffect(() => {
    const p = configRef.current
    if (p.waveCount !== config.waveCount) {
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

    let rafId = 0
    let lastTime = 0
    let phase = 0

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

    function drawFrame(w: number, h: number, ph: number) {
      const cfg = configRef.current
      ctx!.clearRect(0, 0, w, h)

      // Draw grid
      ctx!.strokeStyle = cfg.color
      ctx!.lineWidth = 0.5

      // Horizontal grid lines every h/8
      const hStep = h / 8
      for (let i = 0; i <= 8; i++) {
        const y = i * hStep
        const isMajor = i % 2 === 0
        ctx!.globalAlpha = cfg.gridAlpha * (isMajor ? 1.5 : 1)
        ctx!.beginPath()
        ctx!.moveTo(0, y)
        ctx!.lineTo(w, y)
        ctx!.stroke()
      }

      // Vertical grid lines every w/10
      const vStep = w / 10
      for (let i = 0; i <= 10; i++) {
        const x = i * vStep
        const isMajor = i % 2 === 0
        ctx!.globalAlpha = cfg.gridAlpha * (isMajor ? 1.5 : 1)
        ctx!.beginPath()
        ctx!.moveTo(x, 0)
        ctx!.lineTo(x, h)
        ctx!.stroke()
      }

      // Draw waveform channels
      const waveCount = Math.max(1, Math.min(3, Math.round(cfg.waveCount)))
      const bandH = h / waveCount

      for (let ch = 0; ch < waveCount; ch++) {
        const bandTop = ch * bandH
        const bandMid = bandTop + bandH / 2
        const amplitude = bandH * 0.35
        const freq = 3 // 3 cycles visible across width

        // Build path
        ctx!.beginPath()
        const steps = Math.ceil(w)
        for (let px = 0; px <= steps; px++) {
          const t = px / w
          const angle = t * freq * Math.PI * 2 + ph

          let y: number
          if (ch === 0) {
            // Sine wave
            y = bandMid + Math.sin(angle) * amplitude
          } else if (ch === 1) {
            // Square wave
            y = bandMid + (Math.sin(angle) >= 0 ? 1 : -1) * amplitude
          } else {
            // Triangle wave
            const norm = ((angle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)
            const tri = norm < Math.PI ? (norm / Math.PI) * 2 - 1 : (1 - (norm - Math.PI) / Math.PI) * 2 - 1
            y = bandMid + tri * amplitude
          }

          if (px === 0) ctx!.moveTo(px, y)
          else ctx!.lineTo(px, y)
        }

        // Glow pass — wide soft halo
        ctx!.strokeStyle = cfg.color
        ctx!.lineWidth = 5
        ctx!.globalAlpha = cfg.waveAlpha * 0.15 * cfg.glowMult
        ctx!.stroke()

        // Sharp line pass
        ctx!.lineWidth = 1.5
        ctx!.globalAlpha = cfg.waveAlpha
        ctx!.stroke()
      }

      ctx!.globalAlpha = 1
    }

    function tick(ts: number) {
      const parent = canvas!.parentElement
      if (!parent) return
      const w = parent.clientWidth, h = parent.clientHeight

      if (needsReseedRef.current) {
        needsReseedRef.current = false
      }

      const delta = Math.min(ts - lastTime, 50)
      lastTime = ts
      const cfg = configRef.current

      phase += 0.0015 * cfg.speed * delta

      drawFrame(w, h, phase)
      rafId = requestAnimationFrame(tick)
    }

    function start() { lastTime = performance.now(); rafId = requestAnimationFrame(tick) }
    function stop() { cancelAnimationFrame(rafId) }

    const dims = resizeCanvas()

    if (reducedMotion) {
      if (dims) drawFrame(dims.w, dims.h, 0)
      return
    }

    let resizeTimer = 0
    const ro = new ResizeObserver(() => {
      clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(() => {
        stop()
        resizeCanvas()
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
