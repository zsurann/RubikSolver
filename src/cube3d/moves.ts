import { BASE, type Move } from '../cube/cube'

export type Axis = 'x' | 'y' | 'z'
export type Vec3 = [number, number, number]
export type MoveInfo = { axis: Axis; layers: number[]; turns: 1 | 2; angle: number; sign: number }

/** Asse, strati e angolo (radianti, attorno all'asse positivo) di una mossa. */
export function moveInfo(m: Move): MoveInfo {
  const [axis, layers, s] = BASE[m[0]]
  const turns = m.includes('2') ? 2 : 1
  const sign = m.endsWith("'") ? -s : s
  return { axis, layers, turns, sign, angle: (sign * turns * Math.PI) / 2 }
}

export const inLayer = (pos: Vec3, info: MoveInfo) => info.layers.includes(pos['xyz'.indexOf(info.axis)])

export type ArrowPlacement =
  | { kind: 'arc'; pos: Vec3; sign: number; twice: boolean }
  | { kind: 'straight'; pos: Vec3; dir: Vec3; normal: Vec3; twice: boolean }

const cross = (a: Vec3, b: Vec3): Vec3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]

/**
 * Dove disegnare la freccia, sempre su una faccia visibile dalla vista standard (davanti o sopra):
 * F/z = arco sul davanti; R L x = freccia verticale sul davanti; U D y = orizzontale sul davanti; B = sopra.
 */
export function arrowFor(m: Move, offset = 1.56): ArrowPlacement {
  const info = moveInfo(m)
  const twice = info.turns === 2
  const layer = info.layers.length === 1 ? info.layers[0] : 0
  const sign = Math.sign(info.angle)
  if (info.axis === 'z' && layer >= 0) return { kind: 'arc', pos: [0, 0, offset], sign, twice }
  const axis: Vec3 = [info.axis === 'x' ? 1 : 0, info.axis === 'y' ? 1 : 0, info.axis === 'z' ? 1 : 0]
  const normal: Vec3 = info.axis === 'z' ? [0, 1, 0] : [0, 0, 1]
  const pos: Vec3 =
    info.axis === 'x' ? [layer, 0, offset] : info.axis === 'y' ? [0, layer, offset] : [0, offset, layer]
  // velocità di un punto della faccia: (asse × normale) · verso
  const dir = cross(axis, normal).map((v) => v * sign) as Vec3
  return { kind: 'straight', pos, dir, normal, twice }
}
