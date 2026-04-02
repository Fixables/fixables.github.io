'use client'

import { useEffect, useRef } from 'react'
import { CpuConfig, DEFAULT_CPU } from '@/types/bg-config'

interface TracePacket {
  t: number       // 0→1
  speed: number
  dir: 1 | -1    // 1 = chip→edge, -1 = edge→chip
}

interface Trace {
  // start point (on chip edge), end point (on canvas edge)
  sx: number; sy: number
  ex: number; ey: number
  // bend point
  bx: number; by: number
  isBus: boolean
  packets: TracePacket[]
  side: 'top' | 'bottom' | 'left' | 'right'
}

interface ChipLayout {
  chipX: number; chipY: number
  chipW: number; chipH: number
  traces: Trace[]
}

const CORE_LABELS = ['ALU', 'FPU', 'L1', 'L2', 'LLC', 'Ctrl', 'I/O', 'Reg', 'Bus']

function buildLayout(w: number, h: number, cfg: CpuConfig): ChipLayout {
  const chipW = Math.min(w * 0.32, 260)
  const chipH = chipW * 0.62
  const chipX = (w - chipW) / 2
  const chipY = (h - chipH) / 2

  const traces: Trace[] = []
  const count = Math.max(2, Math.round(cfg.traceCount))

  const makePackets = (): TracePacket[] => {
    const pkts: TracePacket[] = []
    const n = Math.random() < 0.5 ? 1 : 2
    for (let i = 0; i < n; i++) {
      pkts.push({
        t: Math.random(),
        speed: (0.0003 + Math.random() * 0.0004),
        dir: Math.random() < 0.5 ? 1 : -1,
      })
    }
    return pkts
  }

  // Top side traces
  for (let i = 0; i < count; i++) {
    const t = (i + 0.5) / count
    const sx = chipX + t * chipW
    const sy = chipY
    const ex = 40 + Math.random() * (w - 80)
    const ey = 0
    const bx = sx
    const by = chipY - 20 - Math.random() * (chipY - 20)
    traces.push({ sx, sy, ex, ey, bx, by, isBus: i % 3 === 0, packets: makePackets(), side: 'top' })
  }

  // Bottom side traces
  for (let i = 0; i < count; i++) {
    const t = (i + 0.5) / count
    const sx = chipX + t * chipW
    const sy = chipY + chipH
    const ex = 40 + Math.random() * (w - 80)
    const ey = h
    const bx = sx
    const by = chipY + chipH + 20 + Math.random() * (h - chipY - chipH - 20)
    traces.push({ sx, sy, ex, ey, bx, by, isBus: i % 3 === 0, packets: makePackets(), side: 'bottom' })
  }

  // Left side traces
  for (let i = 0; i < count; i++) {
    const t = (i + 0.5) / count
    const sx = chipX
    const sy = chipY + t * chipH
    const ex = 0
    const ey = 40 + Math.random() * (h - 80)
    const bx = chipX - 20 - Math.random() * (chipX - 20)
    const by = sy
    traces.push({ sx, sy, ex, ey, bx, by, isBus: i % 3 === 0, packets: makePackets(), side: 'left' })
  }

  // Right side traces
  for (let i = 0; i < count; i++) {
    const t = (i + 0.5) / count
    const sx = chipX + chipW
    const sy = chipY + t * chipH
    const ex = w
    const ey = 40 + Math.random() * (h - 80)
    const bx = chipX + chipW + 20 + Math.random() * (w - chipX - chipW - 20)
    const by = sy
    traces.push({ sx, sy, ex, ey, bx, by, isBus: i % 3 === 0, packets: makePackets(), side: 'right' })
  }

  return { chipX, chipY, chipW, chipH, traces }
}

function getTracePos(tr: Trace, t: number): [number, number] {
  // Path: start → bend → end (two segments)
  const s1 = Math.hypot(tr.bx - tr.sx, tr.by - tr.sy)
  const s2 = Math.hypot(tr.ex - tr.bx, tr.ey - tr.by)
  const total = s1 + s2
  if (total === 0) return [tr.sx, tr.sy]
  const d = t * total
  if (d <= s1) {
    const r = s1 === 0 ? 0 : d / s1
    return [tr.sx + (tr.bx - tr.sx) * r, tr.sy + (tr.by - tr.sy) * r]
  }
  const r = s2 === 0 ? 0 : (d - s1) / s2
  return [tr.bx + (tr.ex - tr.bx) * r, tr.by + (tr.ey - tr.by) * r]
}

export default function CpuBackground({ config = DEFAULT_CPU }: { config?: CpuConfig }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const configRef = useRef<CpuConfig>(config)
  const needsReseedRef = useRef(false)

  useEffect(() => {
    const p = configRef.current
    if (p.traceCount !== config.traceCount) {
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

    let layout: ChipLayout | null = null
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

    function drawTracePath(tr: Trace, offsetX = 0, offsetY = 0) {
      ctx!.moveTo(tr.sx + offsetX, tr.sy + offsetY)
      ctx!.lineTo(tr.bx + offsetX, tr.by + offsetY)
      ctx!.lineTo(tr.ex + offsetX, tr.ey + offsetY)
    }

    function drawFrame(w: number, h: number) {
      if (!layout) return
      const cfg = configRef.current
      ctx!.clearRect(0, 0, w, h)

      const { chipX, chipY, chipW, chipH, traces } = layout

      // Draw traces
      ctx!.strokeStyle = cfg.color
      ctx!.globalAlpha = cfg.traceAlpha

      for (const tr of traces) {
        if (tr.isBus) {
          // Two parallel lines, offset perpendicular to direction by 1.5px
          // For top/bottom: offset horizontally; for left/right: offset vertically
          const isVert = tr.side === 'left' || tr.side === 'right'
          const dx = isVert ? 0 : 1.5
          const dy = isVert ? 1.5 : 0

          ctx!.lineWidth = 0.5
          ctx!.beginPath()
          drawTracePath(tr, -dx, -dy)
          ctx!.stroke()

          ctx!.beginPath()
          drawTracePath(tr, dx, dy)
          ctx!.stroke()
        } else {
          ctx!.lineWidth = 0.8
          ctx!.beginPath()
          drawTracePath(tr, 0, 0)
          ctx!.stroke()
        }
      }

      // Draw chip border
      ctx!.strokeStyle = cfg.color
      ctx!.globalAlpha = cfg.traceAlpha * 0.6
      ctx!.lineWidth = 0.8
      ctx!.strokeRect(chipX, chipY, chipW, chipH)

      // Draw internal core blocks (3x3 grid)
      const pad = 8
      const innerW = chipW - pad * 2
      const innerH = chipH - pad * 2
      const cols = 3, rows = 3
      const blockW = innerW / cols
      const blockH = innerH / rows
      ctx!.fillStyle = cfg.color
      ctx!.strokeStyle = cfg.color
      ctx!.font = `${Math.max(6, Math.min(9, blockW * 0.28))}px monospace`
      ctx!.textAlign = 'center'
      ctx!.textBaseline = 'middle'

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const bx = chipX + pad + c * blockW + 2
          const by = chipY + pad + r * blockH + 2
          const bw = blockW - 4
          const bh = blockH - 4

          ctx!.globalAlpha = cfg.coreAlpha
          ctx!.fillRect(bx, by, bw, bh)
          ctx!.globalAlpha = cfg.coreAlpha * 0.6
          ctx!.lineWidth = 0.5
          ctx!.strokeRect(bx, by, bw, bh)

          ctx!.globalAlpha = cfg.coreAlpha * 1.5
          ctx!.fillText(CORE_LABELS[r * cols + c], bx + bw / 2, by + bh / 2)
        }
      }

      // Draw packets
      ctx!.fillStyle = cfg.color
      for (const tr of traces) {
        for (const pkt of tr.packets) {
          const t = pkt.dir === 1 ? pkt.t : 1 - pkt.t
          const [px, py] = getTracePos(tr, t)

          // Outer glow
          ctx!.beginPath()
          ctx!.globalAlpha = cfg.packetAlpha * 0.2
          ctx!.arc(px, py, 5, 0, Math.PI * 2)
          ctx!.fill()

          // Inner dot
          ctx!.beginPath()
          ctx!.globalAlpha = cfg.packetAlpha
          ctx!.arc(px, py, 2, 0, Math.PI * 2)
          ctx!.fill()
        }
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
        layout = buildLayout(w, h, configRef.current)
      }

      if (!layout) return

      const delta = Math.min(ts - lastTime, 50)
      lastTime = ts
      const cfg = configRef.current

      for (const tr of layout.traces) {
        for (const pkt of tr.packets) {
          pkt.t += pkt.speed * cfg.speed * delta
          if (pkt.t > 1) pkt.t = 0
        }
      }

      drawFrame(w, h)
      rafId = requestAnimationFrame(tick)
    }

    function start() { lastTime = performance.now(); rafId = requestAnimationFrame(tick) }
    function stop() { cancelAnimationFrame(rafId) }

    const dims = resizeCanvas()
    if (dims) layout = buildLayout(dims.w, dims.h, configRef.current)

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
        if (d) layout = buildLayout(d.w, d.h, configRef.current)
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
