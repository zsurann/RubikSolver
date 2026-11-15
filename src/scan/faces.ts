import type { Face, Move } from '../cube/cube'
import type { RGB } from './color'

/**
 * Ordine fisso di scansione, partendo dal cubo tenuto con giallo in alto e rosso verso di te.
 * `turn` = rotazione del cubo intero da fare PRIMA di inquadrare quella faccia (mostrata in 3D).
 * Con questo orientamento ogni faccia si legge riga per riga nell'ordine facelet del motore.
 */
export const SCAN_ORDER: { face: Face; turn: Move[] }[] = [
  { face: 'F', turn: [] },
  { face: 'R', turn: ['y'] },
  { face: 'B', turn: ['y'] },
  { face: 'L', turn: ['y'] },
  { face: 'U', turn: ['y', "x'"] },
  { face: 'D', turn: ['x2'] },
]

/** Colori tipici in foto, solo per controllare che il centro inquadrato sia quello atteso. */
export const TYPICAL: Record<Face, RGB> = {
  U: [225, 205, 45], D: [230, 230, 225], F: [185, 30, 45], B: [235, 105, 35], R: [25, 150, 80], L: [25, 75, 175],
}

/** Rotazione per passare da "giallo in alto, rosso davanti" alla faccia indicata (per rifare una faccia sola). */
export const FROM_FRONT: Record<Face, Move[]> = { F: [], R: ['y'], B: ['y2'], L: ["y'"], U: ["x'"], D: ['x'] }
