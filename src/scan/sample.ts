import type { RGB } from './color'

export type Cell = { rgb: RGB; spread: number }

/**
 * Campiona una griglia 3x3 dentro il quadrato (x, y, size) di un'immagine RGBA:
 * per ogni cella la mediana dei pixel del 50% interno e quanto sono uniformi (spread basso = adesivo pulito).
 */
export function sampleGrid(data: Uint8ClampedArray, width: number, x: number, y: number, size: number): Cell[] {
  const cell = size / 3
  const out: Cell[] = []
  for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) {
    const x0 = Math.round(x + c * cell + cell / 4), y0 = Math.round(y + r * cell + cell / 4)
    const s = Math.max(1, Math.round(cell / 2))
    const ch: number[][] = [[], [], []]
    const step = Math.max(1, Math.floor(s / 12))
    for (let yy = y0; yy < y0 + s; yy += step) for (let xx = x0; xx < x0 + s; xx += step) {
      const i = (yy * width + xx) * 4
      ch[0].push(data[i]); ch[1].push(data[i + 1]); ch[2].push(data[i + 2])
    }
    const med = ch.map((v) => v.sort((a, b) => a - b)[v.length >> 1]) as RGB
    const spread = ch.reduce((s2, v, k) => s2 + v.reduce((a, b) => a + Math.abs(b - med[k]), 0) / v.length, 0) / 3
    out.push({ rgb: med, spread })
  }
  return out
}
