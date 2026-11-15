import type { Move } from '../cube/cube'
import type { AlgId, Phase, PhaseId } from '../solver/beginner'

export type GuidePhase = { id: PhaseId | 'short'; moves: number }
/** Una mossa della guida, con la fase e (se fa parte di una formula) la posizione nella formula. */
export type Item = { move: Move; phase: number; alg?: { id: AlgId; pos: number; len: number } }

export function itemsFromPhases(phases: Phase[]): { items: Item[]; phases: GuidePhase[] } {
  const items: Item[] = []
  const used: GuidePhase[] = []
  for (const p of phases) {
    const moves = p.steps.flatMap((s) => s.moves)
    if (!moves.length) continue // fase già fatta: saltata
    const k = used.length
    used.push({ id: p.id, moves: moves.length })
    for (const s of p.steps)
      s.moves.forEach((move, pos) => items.push({ move, phase: k, alg: s.alg && { id: s.alg, pos, len: s.moves.length } }))
  }
  return { items, phases: used }
}

export const itemsFromMoves = (moves: Move[]) => ({
  items: moves.map((move) => ({ move, phase: 0 })),
  phases: moves.length ? [{ id: 'short' as const, moves: moves.length }] : [],
})
