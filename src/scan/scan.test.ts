import { describe, expect, it } from 'vitest'
import { applyAlg, FACES, scramble, SOLVED, type Face } from '../cube/cube'
import { assemble, rotateFace } from './assemble'
import { deltaE2000, rgbToLab, type RGB } from './color'
import { hungarian } from './hungarian'
import { sampleGrid } from './sample'

const seeded = (seed: number) => () => ((seed = (seed * 1103515245 + 12345) % 2 ** 31) / 2 ** 31)

describe('colori', () => {
  it('CIEDE2000 sui valori di riferimento di Sharma', () => {
    expect(deltaE2000([50, 2.6772, -79.7751], [50, 0, -82.7485])).toBeCloseTo(2.0425, 3)
    expect(deltaE2000([50, 0, 0], [50, -1, 2])).toBeCloseTo(2.3669, 3)
    expect(deltaE2000([50, 2.5, 0], [73, 25, -18])).toBeCloseTo(27.1492, 3)
  })
  it('Lab del bianco e del nero', () => {
    expect(rgbToLab([255, 255, 255])[0]).toBeCloseTo(100, 1)
    expect(rgbToLab([0, 0, 0])[0]).toBeCloseTo(0, 5)
  })
})

describe('ungherese', () => {
  it('trova il minimo come la forza bruta', () => {
    const rnd = seeded(5)
    const perms = (n: number): number[][] => (n === 1 ? [[0]] : perms(n - 1).flatMap((p) => Array.from({ length: n }, (_, i) => [...p.slice(0, i), n - 1, ...p.slice(i)])))
    for (let k = 0; k < 30; k++) {
      const c = Array.from({ length: 6 }, () => Array.from({ length: 6 }, () => Math.floor(rnd() * 100)))
      const best = Math.min(...perms(6).map((p) => p.reduce((s, j, i) => s + c[i][j], 0)))
      expect(hungarian(c).reduce((s, j, i) => s + c[i][j], 0)).toBe(best)
    }
  })
})

// Colori "fotografati": luce calda, ombre e rumore.
const PHOTO: Record<Face, RGB> = { U: [225, 205, 45], D: [230, 228, 220], F: [185, 30, 45], B: [235, 105, 35], R: [25, 150, 80], L: [25, 75, 175] }
function photograph(state: string, rnd: () => number, noise = 14): RGB[] {
  return [...state].map((f) => {
    const light = 0.75 + rnd() * 0.35
    return PHOTO[f as Face].map((v, i) => Math.max(0, Math.min(255, v * light * [1.08, 1, 0.85][i] + (rnd() - 0.5) * 2 * noise))) as RGB
  })
}

describe('assemble', () => {
  it('ricostruisce 300 cubi mescolati da colori rumorosi', () => {
    const rnd = seeded(11)
    let wrong = 0
    for (let k = 0; k < 300; k++) {
      const state = applyAlg(SOLVED, scramble(25, rnd))
      const r = assemble(photograph(state, rnd))
      if (r.state !== state) wrong++
      else expect(r.check.ok).toBe(true)
    }
    expect(wrong).toBe(0)
  })

  it('raddrizza una faccia inquadrata ruotata', () => {
    const rnd = seeded(21)
    const state = applyAlg(SOLVED, scramble(25, rnd))
    const rgb = photograph(state, rnd, 6)
    const k = FACES.indexOf('R')
    const rotated = [...rgb.slice(0, k * 9), ...rotateFace(rgb.slice(k * 9, k * 9 + 9)), ...rgb.slice(k * 9 + 9)]
    const r = assemble(rotated)
    expect(r.state).toBe(state)
    expect(r.rotations.R).toBe(3)
  })

  it('segnala come incerto un adesivo dal colore ambiguo', () => {
    const rnd = seeded(3)
    const state = applyAlg(SOLVED, "R U F' L2 D B'")
    const rgb = photograph(state, rnd, 4)
    const i = [...state].findIndex((c, j) => c === 'F' && j % 9 !== 4)
    rgb[i] = [215, 70, 40] // a metà tra rosso e arancione
    expect(assemble(rgb).uncertain).toContain(i)
  })
})

describe('sampleGrid', () => {
  it('mediana per cella, ignorando bordi e riflessi', () => {
    const w = 90, data = new Uint8ClampedArray(w * w * 4)
    for (let y = 0; y < w; y++) for (let x = 0; x < w; x++) {
      const cell = Math.floor(y / 30) * 3 + Math.floor(x / 30)
      const border = x % 30 < 3 || y % 30 < 3
      const glare = cell === 4 && x % 30 > 13 && x % 30 < 16
      const v = border ? [0, 0, 0] : glare ? [255, 255, 255] : [cell * 20, 100, 200 - cell * 10]
      data.set([...v, 255], (y * w + x) * 4)
    }
    const cells = sampleGrid(data, w, 0, 0, 90)
    cells.forEach((c, k) => expect(c.rgb).toEqual([k * 20, 100, 200 - k * 10]))
    expect(cells[0].spread).toBe(0)
  })
})
