'use client'

import { useEffect } from 'react'

// Injects a custom cursor shaped like an op-amp triangle symbol.
// Hotspot is at the output tip (right point of triangle).
export default function OpAmpCursor() {
  useEffect(() => {
    // Build SVG at runtime so we can use btoa() without manual base64 encoding
    const svg =
      '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="24">' +
      '<polygon points="2,1 2,23 27,12" fill="none" stroke="#38bdf8" stroke-width="1.5" opacity="0.88"/>' +
      '<text x="6.5" y="10.5" fill="#38bdf8" font-size="6.5" font-family="monospace" opacity="0.82">+</text>' +
      '<text x="6" y="18.5" fill="#38bdf8" font-size="8" font-family="monospace" opacity="0.82">-</text>' +
      '</svg>'

    const b64 = typeof btoa !== 'undefined' ? btoa(svg) : null
    if (!b64) return

    const styleId = 'opamp-cursor-style'
    let el = document.getElementById(styleId) as HTMLStyleElement | null
    if (!el) {
      el = document.createElement('style')
      el.id = styleId
      document.head.appendChild(el)
    }

    const dataUrl = `data:image/svg+xml;base64,${b64}`
    el.textContent = [
      // Apply to everything by default
      `*, *::before, *::after { cursor: url("${dataUrl}") 27 12, crosshair; }`,
      // Restore pointer for interactive elements
      'a, button, [role="button"], label[for], summary, [tabindex]:not([tabindex="-1"]) { cursor: pointer; }',
      // Restore text for inputs
      'input[type="text"], input[type="email"], input[type="search"], input[type="password"], input[type="url"], textarea { cursor: text; }',
      // Range sliders
      'input[type="range"] { cursor: ew-resize; }',
      // Color picker
      'input[type="color"] { cursor: pointer; }',
    ].join('\n')

    return () => {
      document.getElementById(styleId)?.remove()
    }
  }, [])

  return null
}
