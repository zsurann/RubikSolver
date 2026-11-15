// Dai 54 colori campionati (in ordine facelet U R F D L B) allo stato del cubo.
// Riferimenti = i 6 centri della sessione; angoli e spigoli abbinati ai pezzi reali a costo ΔE minimo.
import { CORNERS, EDGES, FACES, SOLVED, verify, type Face, type State, type VerifyResult } from '../cube/cube'
import { deltaE2000, rgbToLab, whiteBalance, type Lab, type RGB } from './color'
import { hungarian } from './hungarian'

export type ScanResult = {
  state: State
  check: VerifyResult
  /** indici degli adesivi poco sicuri, da far lampeggiare nel ritocco */
  uncertain: number[]
  /** quarti di giro applicati a ogni faccia se era stata inquadrata ruotata */
  rotations: Record<Face, number>
  /** colori campionati (ordine facelet), per rifare una sola faccia */
  samples: RGB[]
}

const CORNER_COLORS = CORNERS.map((c) => c.map((i) => SOLVED[i] as Face))
const EDGE_COLORS = EDGES.map((e) => e.map((i) => SOLVED[i] as Face))

/** Ruota di un quarto di giro orario i 9 colori di una faccia (lettura riga per riga). */
export const rotateFace = <T,>(f: T[]): T[] => [6, 3, 0, 7, 4, 1, 8, 5, 2].map((i) => f[i])

function assign(lab: Lab[]) {
  const ref = Object.fromEntries(FACES.map((f, k) => [f, lab[k * 9 + 4]])) as Record<Face, Lab>
  const out: Face[] = [...SOLVED] as Face[]
  let total = 0
  for (const [positions, colors] of [[CORNERS, CORNER_COLORS], [EDGES, EDGE_COLORS]] as const) {
    const best: { cost: number; ori: number }[][] = positions.map((pos) =>
      colors.map((cols) => {
        let b = { cost: Infinity, ori: 0 }
        for (let o = 0; o < pos.length; o++) {
          const cost = cols.reduce((s, c, t) => s + deltaE2000(lab[pos[(o + t) % pos.length]], ref[c]), 0)
          if (cost < b.cost) b = { cost, ori: o }
        }
        return b
      }),
    )
    const pick = hungarian(best.map((row) => row.map((x) => x.cost)))
    pick.forEach((j, p) => {
      const { ori, cost } = best[p][j]
      total += cost
      colors[j].forEach((c, t) => (out[positions[p][(ori + t) % positions[p].length]] = c))
    })
  }
  return { state: out.join(''), total, ref }
}

export function assemble(samples: RGB[]): ScanResult {
  if (samples.length !== 54) throw new Error('Servono 54 colori')
  let faces = FACES.map((_, k) => samples.slice(k * 9, k * 9 + 9))
  const toLab = (fs: RGB[][]) => {
    const flat = fs.flat()
    return whiteBalance(flat, flat[3 * 9 + 4]).map(rgbToLab) // centro bianco (D) come riferimento neutro
  }
  let best = assign(toLab(faces))
  const rotations = Object.fromEntries(FACES.map((f) => [f, 0])) as Record<Face, number>
  // Faccia inquadrata ruotata: prova le 4 rotazioni di ogni faccia, tieni quella con costo nettamente minore.
  for (let pass = 0; pass < 2 && !verify(best.state).ok; pass++) {
    FACES.forEach((f, k) => {
      for (let r = 1; r < 4; r++) {
        const tryFaces = faces.map((fc, i) => (i === k ? Array.from({ length: r }).reduce<RGB[]>((x) => rotateFace(x), fc) : fc))
        const a = assign(toLab(tryFaces))
        if (a.total < best.total - 25) {
          best = a
          faces = tryFaces
          rotations[f] = (rotations[f] + r) % 4
        }
      }
    })
  }
  const lab = toLab(faces)
  const uncertain: number[] = []
  lab.forEach((c, i) => {
    if (i % 9 === 4) return
    const dists = FACES.map((f) => deltaE2000(c, best.ref[f]))
    const assigned = dists[FACES.indexOf(best.state[i] as Face)]
    const [d1, d2] = [...dists].sort((a, b) => a - b)
    // incerto: non è il colore più vicino, è lontano da tutti, o due colori sono quasi alla pari
    if (assigned > d1 + 2 || assigned > 20 || d2 - d1 < 8) uncertain.push(i)
  })
  return { state: best.state, check: verify(best.state), uncertain, rotations, samples }
}
