// Motore del cubo 3x3: stato a 54 adesivi (stringa facelet di Kociemba, ordine U R F D L B,
// ogni lettera = faccia a cui appartiene il colore nel cubo risolto), mosse e verifica.
// Orientamento dell'app: U = giallo, F = rosso (la mappa colori sta nella UI, non qui).

export type Face = 'U' | 'R' | 'F' | 'D' | 'L' | 'B'
export type State = string
export type Move = string // es. "R", "U'", "F2", "x"

export const FACES: Face[] = ['U', 'R', 'F', 'D', 'L', 'B']
export const SOLVED: State = FACES.map((f) => f.repeat(9)).join('')

type Vec = [number, number, number]
const AXIS = { x: 0, y: 1, z: 2 } as const

// Posizione (centro del pezzo) e normale di ogni adesivo, x destra, y su, z verso chi guarda.
const NORMAL: Record<Face, Vec> = { U: [0, 1, 0], R: [1, 0, 0], F: [0, 0, 1], D: [0, -1, 0], L: [-1, 0, 0], B: [0, 0, -1] }
function stickerPos(face: Face, i: number): Vec {
  const r = Math.floor(i / 3), c = i % 3
  switch (face) {
    case 'U': return [c - 1, 1, r - 1]
    case 'R': return [1, 1 - r, 1 - c]
    case 'F': return [c - 1, 1 - r, 1]
    case 'D': return [c - 1, -1, 1 - r]
    case 'L': return [-1, 1 - r, c - 1]
    case 'B': return [1 - c, 1 - r, -1]
  }
}
const STICKERS = FACES.flatMap((f) => Array.from({ length: 9 }, (_, i) => ({ pos: stickerPos(f, i), n: NORMAL[f] })))
const key = (p: Vec, n: Vec) => `${p}|${n}`
const INDEX = new Map(STICKERS.map((s, i) => [key(s.pos, s.n), i]))

// Rotazione di un quarto di giro attorno all'asse a, verso s (+1 antiorario guardando da +a).
function rot(v: Vec, a: Vec, s: number): Vec {
  const cross: Vec = [a[1] * v[2] - a[2] * v[1], a[2] * v[0] - a[0] * v[2], a[0] * v[1] - a[1] * v[0]]
  const dot = a[0] * v[0] + a[1] * v[1] + a[2] * v[2]
  return [0, 1, 2].map((k) => cross[k] * s + a[k] * dot) as Vec
}

// [asse, strati coinvolti, verso] per la mossa base (senza ' o 2).
const BASE: Record<string, [keyof typeof AXIS, number[], number]> = {
  R: ['x', [1], -1], L: ['x', [-1], 1], U: ['y', [1], -1], D: ['y', [-1], 1], F: ['z', [1], -1], B: ['z', [-1], 1],
  x: ['x', [-1, 0, 1], -1], y: ['y', [-1, 0, 1], -1], z: ['z', [-1, 0, 1], -1],
}

// src[j] = indice dell'adesivo che finisce in j.
function quarterPerm(name: string): number[] {
  const [ax, layers, s] = BASE[name]
  const a: Vec = [0, 0, 0]
  a[AXIS[ax]] = 1
  const src = Array.from({ length: 54 }, (_, i) => i)
  STICKERS.forEach((st, i) => {
    if (!layers.includes(st.pos[AXIS[ax]])) return
    src[INDEX.get(key(rot(st.pos, a, s), rot(st.n, a, s)))!] = i
  })
  return src
}
const QUARTER = Object.fromEntries(Object.keys(BASE).map((m) => [m, quarterPerm(m)]))

const MOVE_RE = /^([URFDLBxyz])(2|'|2')?$/

export function parseAlg(alg: string): Move[] {
  const moves = alg.trim().split(/\s+/).filter(Boolean)
  for (const m of moves) if (!MOVE_RE.test(m)) throw new Error(`Mossa non valida: ${m}`)
  return moves
}

export function applyMove(state: State, move: Move): State {
  const m = MOVE_RE.exec(move)
  if (!m) throw new Error(`Mossa non valida: ${move}`)
  const turns = m[2] === "'" ? 3 : m[2] ? 2 : 1
  let s = state
  for (let t = 0; t < turns; t++) s = QUARTER[m[1]].map((i) => s[i]).join('')
  return s
}

export const applyAlg = (state: State, alg: string | Move[]): State =>
  (typeof alg === 'string' ? parseAlg(alg) : alg).reduce(applyMove, state)

export const invertMove = (m: Move): Move => (m.includes('2') ? m[0] + '2' : m.endsWith("'") ? m[0] : m + "'")
export const invertAlg = (moves: Move[]): Move[] => [...moves].reverse().map(invertMove)

/** Risolto anche se il cubo intero è ruotato: ogni faccia di un solo colore. */
export const isSolved = (state: State) => FACES.every((_, f) => new Set(state.slice(f * 9, f * 9 + 9)).size === 1)

export function scramble(length = 25, random = Math.random): Move[] {
  const out: Move[] = []
  const opposite: Record<string, string> = { U: 'D', D: 'U', R: 'L', L: 'R', F: 'B', B: 'F' }
  while (out.length < length) {
    const f = 'URFDLB'[Math.floor(random() * 6)]
    const prev = out.at(-1)?.[0], prev2 = out.at(-2)?.[0]
    // niente stessa faccia di seguito, né U D U (ridondante)
    if (f === prev || (f === prev2 && opposite[f] === prev)) continue
    out.push(f + ['', "'", '2'][Math.floor(random() * 3)])
  }
  return out
}

// Tabelle dei pezzi (Kociemba): indici degli adesivi di angoli ed spigoli.
export const CORNERS = [[8, 9, 20], [6, 18, 38], [0, 36, 47], [2, 45, 11], [29, 26, 15], [27, 44, 24], [33, 53, 42], [35, 17, 51]]
export const EDGES = [[5, 10], [7, 19], [3, 37], [1, 46], [32, 16], [28, 25], [30, 43], [34, 52], [23, 12], [21, 41], [50, 39], [48, 14]]
const CORNER_COLORS = CORNERS.map((c) => c.map((i) => SOLVED[i]).join(''))
const EDGE_COLORS = EDGES.map((e) => e.map((i) => SOLVED[i]).join(''))

export type CubieState = { cp: number[]; co: number[]; ep: number[]; eo: number[] }
export type VerifyError = 'length' | 'counts' | 'centers' | 'corners' | 'edges' | 'twist' | 'flip' | 'parity'
export type VerifyResult = { ok: true; cubies: CubieState } | { ok: false; error: VerifyError }

const parity = (p: number[]) => {
  let swaps = 0
  for (let i = 0; i < p.length; i++) for (let j = i + 1; j < p.length; j++) if (p[i] > p[j]) swaps++
  return swaps % 2
}

/** Controlla che lo stato sia un cubo risolvibile (stesso schema di Kociemba). */
export function verify(state: State): VerifyResult {
  if (state.length !== 54) return { ok: false, error: 'length' }
  for (const f of FACES) if (state.split(f).length - 1 !== 9) return { ok: false, error: 'counts' }
  if (FACES.some((f, k) => state[k * 9 + 4] !== f)) return { ok: false, error: 'centers' }

  const cp: number[] = [], co: number[] = []
  for (const c of CORNERS) {
    const ori = c.findIndex((i) => state[i] === 'U' || state[i] === 'D')
    const piece = ori < 0 ? -1 : CORNER_COLORS.findIndex((cc) => cc[0] === state[c[ori]] && cc[1] === state[c[(ori + 1) % 3]] && cc[2] === state[c[(ori + 2) % 3]])
    if (piece < 0) return { ok: false, error: 'corners' }
    cp.push(piece); co.push(ori)
  }
  if (new Set(cp).size !== 8) return { ok: false, error: 'corners' }

  const ep: number[] = [], eo: number[] = []
  for (const e of EDGES) {
    const s = state[e[0]] + state[e[1]]
    const fwd = EDGE_COLORS.indexOf(s), back = EDGE_COLORS.indexOf(s[1] + s[0])
    if (fwd < 0 && back < 0) return { ok: false, error: 'edges' }
    ep.push(fwd >= 0 ? fwd : back); eo.push(fwd >= 0 ? 0 : 1)
  }
  if (new Set(ep).size !== 12) return { ok: false, error: 'edges' }

  if (co.reduce((a, b) => a + b, 0) % 3) return { ok: false, error: 'twist' }
  if (eo.reduce((a, b) => a + b, 0) % 2) return { ok: false, error: 'flip' }
  if (parity(cp) !== parity(ep)) return { ok: false, error: 'parity' }
  return { ok: true, cubies: { cp, co, ep, eo } }
}
