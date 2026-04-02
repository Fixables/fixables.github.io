export interface CircuitConfig {
  color: string
  traceAlpha: number      // trace line opacity
  nodeAlpha: number       // junction dot opacity
  pulseAlpha: number      // moving pulse opacity
  pulseSpeedMult: number  // speed multiplier (0.5 – 3)
  cellSize: number        // target cell size px — controls density
  jitter: number          // 0–0.45, how far nodes stray from grid
  skipProb: number        // 0–0.7, probability of omitting an edge
  crossProb: number       // 0–0.4, probability of diagonal cross-link
  cornerR: number         // L-bend corner radius px
  mouseInfluence: number  // px radius of cursor push
  springK: number         // spring-back strength
  damping: number         // velocity damping per frame
}

export interface BulbConfig {
  color: string
  cursorRadius: number    // px — cursor charges bulbs within this range
  decay: number           // charge lost per ms
  spreadFactor: number    // fraction of charge passed to wire neighbors
  glowMult: number        // multiplier on all glow alpha values
  wireAlpha: number       // base wire opacity (when uncharged)
  cellSize: number        // controls bulb density (area = cellSize²)
  maxWireDist: number     // max px distance for a wire connection
}

export interface OscilloscopeConfig {
  color: string
  gridAlpha: number       // 0.04 — grid line opacity
  waveAlpha: number       // 0.22 — waveform opacity
  waveCount: number       // 2 — number of channels (1-3)
  speed: number           // 1 — scroll speed multiplier
  glowMult: number        // 1 — glow intensity multiplier
}

export interface CpuConfig {
  color: string
  traceAlpha: number      // 0.09 — trace line opacity
  packetAlpha: number     // 0.55 — data packet glow opacity
  coreAlpha: number       // 0.12 — internal chip block opacity
  traceCount: number      // 14 — traces per side of chip (total 4 sides)
  speed: number           // 1 — packet speed multiplier
}

export interface EMFieldConfig {
  color: string
  particleCount: number   // 80
  chargeCount: number     // 2 — number of ± charge pairs (so 2 = 4 actual charges)
  trailLength: number     // 12 — particle trail steps
  alpha: number           // 0.28 — overall particle/trail opacity
  speed: number           // 1 — particle movement speed multiplier
}

export interface SignalFlowConfig {
  color: string
  wireAlpha: number       // 0.07
  signalAlpha: number     // 0.5
  nodeAlpha: number       // 0.1
  nodeCount: number       // 14 — number of nodes
  speed: number           // 1 — signal speed multiplier
}

export const DEFAULT_CIRCUIT: CircuitConfig = {
  color: '#38bdf8',
  traceAlpha: 0.09,
  nodeAlpha: 0.18,
  pulseAlpha: 0.5,
  pulseSpeedMult: 1,
  cellSize: 120,
  jitter: 0.15,
  skipProb: 0.2,
  crossProb: 0.12,
  cornerR: 10,
  mouseInfluence: 140,
  springK: 0.01,
  damping: 0.86,
}

export const DEFAULT_BULB: BulbConfig = {
  color: '#38bdf8',
  cursorRadius: 200,
  decay: 0.0016,
  spreadFactor: 0.58,
  glowMult: 1,
  wireAlpha: 0.05,
  cellSize: 145,
  maxWireDist: 155,
}

export const DEFAULT_OSCILLOSCOPE: OscilloscopeConfig = {
  color: '#38bdf8',
  gridAlpha: 0.04,
  waveAlpha: 0.22,
  waveCount: 2,
  speed: 1,
  glowMult: 1,
}

export const DEFAULT_CPU: CpuConfig = {
  color: '#38bdf8',
  traceAlpha: 0.09,
  packetAlpha: 0.55,
  coreAlpha: 0.12,
  traceCount: 14,
  speed: 1,
}

export const DEFAULT_EMFIELD: EMFieldConfig = {
  color: '#38bdf8',
  particleCount: 80,
  chargeCount: 2,
  trailLength: 12,
  alpha: 0.28,
  speed: 1,
}

export const DEFAULT_SIGNALFLOW: SignalFlowConfig = {
  color: '#38bdf8',
  wireAlpha: 0.07,
  signalAlpha: 0.5,
  nodeAlpha: 0.1,
  nodeCount: 14,
  speed: 1,
}

export const BG_LS_KEY = 'hero-bg-override'
export const BG_SETTINGS_KEY = 'bg-all-settings'

export interface BgOverride {
  mode?: 'circuit' | 'bulb'
  circuit?: CircuitConfig
  bulb?: BulbConfig
}

export type BgId = 'circuit' | 'bulb' | 'oscilloscope' | 'cpu' | 'emfield' | 'signalflow'
export type PageId = 'home' | 'experience' | 'projects' | 'contact'

export interface BgPageEntry {
  enabled: boolean
  pages: PageId[]
}

export interface AllBgSettings {
  backgrounds: Record<BgId, BgPageEntry>
  configs: Partial<Record<BgId, object>>
}

export const DEFAULT_BG_ENTRIES: Record<BgId, BgPageEntry> = {
  circuit:      { enabled: true, pages: ['home', 'experience', 'projects', 'contact'] },
  bulb:         { enabled: true, pages: ['home', 'experience', 'projects', 'contact'] },
  oscilloscope: { enabled: true, pages: ['home', 'experience', 'projects', 'contact'] },
  cpu:          { enabled: true, pages: ['home', 'projects'] },
  emfield:      { enabled: true, pages: ['home', 'experience', 'contact'] },
  signalflow:   { enabled: true, pages: ['home', 'projects'] },
}
