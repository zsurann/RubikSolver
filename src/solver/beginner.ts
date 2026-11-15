// Solver del metodo a strati per principianti: 8 fasi, giallo sempre in alto, solo le 7 formule insegnate.
// Ogni passo è una piccola ricerca in ampiezza su "macro" (giri di U, rotazioni y del cubo intero,
// le formule della fase), così la soluzione usa esattamente ciò che la lezione insegna.
// Lettere = colori del cubo risolto: 'U' giallo (sopra), 'D' bianco (sotto).
import { applyAlg, CORNERS, EDGES, isSolved, parseAlg, verify, type Move, type State } from '../cube/cube'

export type PhaseId =
  | 'daisy' | 'whiteCross' | 'whiteCorners' | 'middleLayer'
  | 'yellowCross' | 'yellowEdges' | 'yellowCornersPosition' | 'yellowCornersOrientation'
export type AlgId =
  | 'whiteCorner' | 'middleRight' | 'middleLeft' | 'yellowCross' | 'yellowEdges' | 'yellowCornersPosition' | 'yellowCornersOrientation'
/** Un passo: mosse singole, una rotazione del cubo, o una formula con nome. */
export type Step = { moves: Move[]; alg?: AlgId }
export type Phase = { id: PhaseId; steps: Step[] }

export const ALGS: Record<AlgId, string> = {
  whiteCorner: "R U R' U'",
  middleRight: "U R U' R' U' F' U F",
  middleLeft: "U' L' U L U F U' F'",
  yellowCross: "F R U R' U' F'",
  yellowEdges: "R U R' U R U2 R' U",
  yellowCornersPosition: "U R U' L' U R' U' L",
  yellowCornersOrientation: "R' D' R D",
}

// --- predicati, tutti relativi ai centri (valgono anche dopo rotazioni y) ---
const center = (s: State, i: number) => s[Math.floor(i / 9) * 9 + 4]
const ok = (s: State, i: number) => s[i] === center(s, i)
const pieceOk = (s: State, p: number[]) => p.every((i) => ok(s, i))
const U_EDGE_TOP = [1, 3, 5, 7]
const count = (xs: boolean[]) => xs.filter(Boolean).length

const daisy = (s: State) => U_EDGE_TOP.map((i) => s[i] === 'D')
const crossEdges = (s: State) => EDGES.slice(4, 8).map((e) => pieceOk(s, e))
const firstCorners = (s: State) => CORNERS.slice(4, 8).map((c) => pieceOk(s, c))
const middleEdges = (s: State) => EDGES.slice(8, 12).map((e) => pieceOk(s, e))
const firstTwoLayers = (s: State) => [...crossEdges(s), ...firstCorners(s), ...middleEdges(s)].every(Boolean)
const yellowCross = (s: State) => U_EDGE_TOP.every((i) => s[i] === 'U')
const yellowEdges = (s: State) => EDGES.slice(0, 4).every((e) => pieceOk(s, e))
const cornerPlaced = (s: State, c: number[]) =>
  [...c.map((i) => s[i])].sort().join('') === [...c.map((i) => center(s, i))].sort().join('')
const yellowCornersPlaced = (s: State) => CORNERS.slice(0, 4).every((c) => cornerPlaced(s, c))

/** Ancora tutti veri quelli che erano veri prima. */
const keeps = (before: boolean[], after: boolean[]) => before.every((b, i) => !b || after[i])

// --- ricerca in ampiezza su macro ---
type Macro = { step: Step; group: string; perm: number[] }
const ID = Array.from({ length: 54 }, (_, i) => String.fromCharCode(48 + i)).join('')
function macro(moves: string, alg?: AlgId): Macro {
  const ms = parseAlg(moves)
  const out = applyAlg(ID, ms)
  return { step: { moves: ms, alg }, group: alg ?? ms[0][0], perm: [...out].map((ch) => ch.charCodeAt(0) - 48) }
}
const apply = (s: State, m: Macro) => m.perm.map((i) => s[i]).join('')
const turns = (f: string) => [f, f + "'", f + '2'].map((m) => macro(m))

const U_TURNS = turns('U'), Y_TURNS = turns('y')
const ALL_TURNS = 'URFDLB'.split('').flatMap(turns)
const HALF_TURNS = ['R2', 'L2', 'F2', 'B2'].map((m) => macro(m))
const A = Object.fromEntries(Object.entries(ALGS).map(([k, v]) => [k, macro(v, k as AlgId)])) as Record<AlgId, Macro>

function search(start: State, macros: Macro[], goal: (s: State) => boolean, maxDepth: number): { steps: Step[]; end: State } {
  if (goal(start)) return { steps: [], end: start }
  type Node = { s: State; parent: Node | null; m: Macro | null; depth: number }
  const seen = new Set([start])
  let frontier: Node[] = [{ s: start, parent: null, m: null, depth: 0 }]
  while (frontier.length) {
    const next: Node[] = []
    for (const node of frontier) {
      if (node.depth >= maxDepth) continue
      for (const m of macros) {
        if (node.m && m.group === node.m.group && !m.step.alg) continue // niente U U di seguito
        const s = apply(node.s, m)
        if (seen.has(s)) continue
        seen.add(s)
        const child = { s, parent: node, m, depth: node.depth + 1 }
        if (goal(s)) {
          const steps: Step[] = []
          for (let n: Node | null = child; n?.m; n = n.parent) steps.unshift(n.m.step)
          return { steps, end: s }
        }
        next.push(child)
      }
    }
    frontier = next
  }
  throw new Error('Passo non trovato: stato non previsto dal metodo')
}

/** Ripete la ricerca finché ogni pezzo della fase è a posto, uno alla volta. */
function pieceByPiece(s: State, macros: Macro[], pieces: (s: State) => boolean[], guard: (before: State, after: State) => boolean, depth: number) {
  const steps: Step[] = []
  while (count(pieces(s)) < 4) {
    const before = s, n = count(pieces(s))
    const r = search(s, macros, (t) => count(pieces(t)) > n && keeps(pieces(before), pieces(t)) && guard(before, t), depth)
    steps.push(...r.steps)
    s = r.end
  }
  return { steps, end: s }
}

const sameMoves = (a: Step, b: Step) => !a.alg && !b.alg && a.moves.length === 1 && b.moves.length === 1 && a.moves[0][0] === b.moves[0][0]
const amount = (m: Move) => (m.endsWith("'") ? 3 : m.endsWith('2') ? 2 : 1)
/** Unisce giri consecutivi della stessa faccia (U U → U2, U U' → niente), mai dentro una formula. */
function tidy(steps: Step[]): Step[] {
  const out: Step[] = []
  for (const st of steps) {
    const last = out.at(-1)
    if (last && sameMoves(last, st)) {
      const k = (amount(last.moves[0]) + amount(st.moves[0])) % 4
      out.pop()
      if (k) out.push({ moves: [last.moves[0][0] + ['', '', '2', "'"][k]] })
    } else out.push(st)
  }
  return out
}

export function solveBeginner(start: State): Phase[] {
  const v = verify(start)
  if (!v.ok) throw new Error(`Stato del cubo non valido: ${v.error}`)
  const phases: Phase[] = []
  let s = start
  const push = (id: PhaseId, r: { steps: Step[]; end: State }) => {
    phases.push({ id, steps: tidy(r.steps) })
    s = r.end
  }
  const always = () => true

  // 1. Margherita: 4 spigoli bianchi intorno al centro giallo (saltata se la croce bianca c'è già).
  const crossDone = crossEdges(s).every(Boolean)
  push('daisy', crossDone ? { steps: [], end: s } : pieceByPiece(s, ALL_TURNS, daisy, always, 5))
  // 2. Croce bianca: U finché il colore di lato combacia col centro, poi mezzo giro di quella faccia.
  push('whiteCross', pieceByPiece(s, [...U_TURNS, ...HALF_TURNS], crossEdges, always, 4))
  // 3. Angoli bianchi: angolo sopra il suo posto (davanti a destra), poi R U R' U' finché va a posto.
  push('whiteCorners', pieceByPiece(s, [...U_TURNS, ...Y_TURNS, A.whiteCorner], firstCorners,
    (_, t) => crossEdges(t).every(Boolean), 12))
  // 4. Secondo strato.
  push('middleLayer', pieceByPiece(s, [...U_TURNS, ...Y_TURNS, A.middleRight, A.middleLeft], middleEdges,
    (_, t) => crossEdges(t).every(Boolean) && firstCorners(t).every(Boolean), 7))
  // 5. Croce gialla: punto → L → linea → croce.
  push('yellowCross', search(s, [...U_TURNS, A.yellowCross], (t) => yellowCross(t) && firstTwoLayers(t), 7))
  // 6. Spigoli gialli al loro posto.
  push('yellowEdges', search(s, [...U_TURNS, ...Y_TURNS, A.yellowEdges], (t) => yellowCross(t) && yellowEdges(t) && firstTwoLayers(t), 8))
  // 7. Angoli gialli al loro posto (anche se girati).
  push('yellowCornersPosition', search(s, [...U_TURNS, ...Y_TURNS, A.yellowCornersPosition],
    (t) => yellowCornersPlaced(t) && yellowEdges(t) && yellowCross(t) && firstTwoLayers(t), 8))
  // 8. Orientamento: R' D' R D sull'angolo davanti a destra finché il giallo è in alto, poi U al prossimo.
  const steps: Step[] = []
  for (let k = 0; k < 4; k++) {
    for (let rep = 0; s[8] !== 'U'; rep++) {
      if (rep > 6) throw new Error('Orientamento angoli: non converge')
      steps.push(A.yellowCornersOrientation.step)
      s = apply(s, A.yellowCornersOrientation)
    }
    if (k < 3) { steps.push(U_TURNS[0].step); s = apply(s, U_TURNS[0]) }
  }
  const last = search(s, U_TURNS, isSolved, 1)
  push('yellowCornersOrientation', { steps: [...steps, ...last.steps], end: last.end })
  if (!isSolved(s)) throw new Error('Il solver non ha risolto il cubo')
  return phases
}

/** La fase è completa (con tutte quelle prima)? Per gli esercizi. */
export function phaseDone(id: PhaseId, s: State): boolean {
  const f2l = firstTwoLayers(s)
  switch (id) {
    case 'daisy': return daisy(s).every(Boolean) || crossEdges(s).every(Boolean)
    case 'whiteCross': return crossEdges(s).every(Boolean)
    case 'whiteCorners': return crossEdges(s).every(Boolean) && firstCorners(s).every(Boolean)
    case 'middleLayer': return f2l
    case 'yellowCross': return f2l && yellowCross(s)
    case 'yellowEdges': return f2l && yellowCross(s) && yellowEdges(s)
    case 'yellowCornersPosition': return f2l && yellowCross(s) && yellowEdges(s) && yellowCornersPlaced(s)
    case 'yellowCornersOrientation': return isSolved(s)
  }
}

/** Stato del cubo all'inizio di ogni fase (per demo ed esercizi mirati). */
export function phaseStarts(start: State): Record<PhaseId, State> {
  const out = {} as Record<PhaseId, State>
  let s = start
  for (const p of solveBeginner(start)) {
    out[p.id] = s
    s = applyAlg(s, p.steps.flatMap((st) => st.moves))
  }
  return out
}

/** Tutte le mosse in fila (per riprodurle sul cubo 3D). */
export const flatten = (phases: Phase[]): Move[] => phases.flatMap((p) => p.steps.flatMap((st) => st.moves))
