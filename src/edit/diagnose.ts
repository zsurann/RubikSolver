// Cosa non torna in un cubo inserito o scansionato, in termini utili per il ritocco.
import { CORNERS, EDGES, FACES, SOLVED, verify, type Face, type State } from '../cube/cube'

export type Diagnosis =
  | { kind: 'ok' }
  | { kind: 'missing'; count: number }
  | { kind: 'counts'; wrong: { face: Face; count: number }[] }
  /** pezzi con colori che non stanno insieme o pezzi doppi: adesivi da controllare */
  | { kind: 'pieces'; suspects: number[] }
  /** tutti i pezzi esistono ma il cubo non si può risolvere: smontato o un adesivo scambiato */
  | { kind: 'twist' | 'flip' | 'parity' }

const sameSet = (a: string, b: string) => [...a].sort().join('') === [...b].sort().join('')
const CORNER_SETS = CORNERS.map((c) => c.map((i) => SOLVED[i]).join(''))
const EDGE_SETS = EDGES.map((e) => e.map((i) => SOLVED[i]).join(''))

export function diagnose(state: State): Diagnosis {
  const missing = [...state].filter((c) => c === '?').length
  if (missing) return { kind: 'missing', count: missing }
  const wrong = FACES.map((face) => ({ face, count: [...state].filter((c) => c === face).length })).filter((x) => x.count !== 9)
  if (wrong.length) return { kind: 'counts', wrong }
  const v = verify(state)
  if (v.ok) return { kind: 'ok' }
  if (v.error === 'twist' || v.error === 'flip' || v.error === 'parity') return { kind: v.error }
  // angoli/spigoli impossibili o ripetuti
  const suspects: number[] = []
  for (const [pieces, sets] of [[CORNERS, CORNER_SETS], [EDGES, EDGE_SETS]] as const) {
    const seen = new Map<number, number[][]>()
    for (const p of pieces) {
      const colors = p.map((i) => state[i]).join('')
      const k = sets.findIndex((s) => sameSet(s, colors))
      if (k < 0) suspects.push(...p)
      else seen.set(k, [...(seen.get(k) ?? []), p])
    }
    for (const ps of seen.values()) if (ps.length > 1) ps.forEach((p) => suspects.push(...p))
  }
  return { kind: 'pieces', suspects }
}

/** Stato vuoto per l'inserimento a mano: solo i centri. */
export const EMPTY: State = [...SOLVED].map((c, i) => (i % 9 === 4 ? c : '?')).join('')
