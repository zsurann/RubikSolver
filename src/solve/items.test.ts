import { describe, expect, it } from 'vitest'
import { applyAlg, applyMove, isSolved, SOLVED } from '../cube/cube'
import { solveBeginner } from '../solver/beginner'
import { itemsFromMoves, itemsFromPhases } from './items'

describe('passi della guida', () => {
  it('fasi vuote saltate, formule marcate, mosse che risolvono il cubo', () => {
    const start = applyAlg(SOLVED, "R U F' L2 D B' R2 U' F")
    const { items, phases } = itemsFromPhases(solveBeginner(start))
    expect(phases.every((p) => p.moves > 0)).toBe(true)
    expect(phases.reduce((s, p) => s + p.moves, 0)).toBe(items.length)
    expect(isSolved(items.map((i) => i.move).reduce(applyMove, start))).toBe(true)
    const inAlg = items.filter((i) => i.alg?.id === 'whiteCorner')
    expect(inAlg.length % 4).toBe(0)
    expect(inAlg.slice(0, 4).map((i) => i.alg!.pos)).toEqual([0, 1, 2, 3])
    // le fasi sono in ordine e contigue
    items.forEach((it, k) => k && expect(it.phase).toBeGreaterThanOrEqual(items[k - 1].phase))
  })
  it('soluzione breve: una sola fase', () => {
    expect(itemsFromMoves(['R', 'U'])).toEqual({ items: [{ move: 'R', phase: 0 }, { move: 'U', phase: 0 }], phases: [{ id: 'short', moves: 2 }] })
    expect(itemsFromMoves([]).phases).toEqual([])
  })
})
