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

export const BG_LS_KEY = 'hero-bg-override'

export interface BgOverride {
  mode?: 'circuit' | 'bulb'
  circuit?: CircuitConfig
  bulb?: BulbConfig
}
