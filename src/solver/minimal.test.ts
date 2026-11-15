import { describe, expect, it } from 'vitest'
import { applyAlg, scramble, SOLVED } from '../cube/cube'
import { solveMinimalSync } from './minimal'

const seeded = (seed: number) => () => ((seed = (seed * 1103515245 + 12345) % 2 ** 31) / 2 ** 31)

describe('solver mosse minime (min2phase)', () => {
  it('risolve 1000 cubi mescolati in al massimo 21 mosse', () => {
    const rnd = seeded(99)
    for (let k = 0; k < 1000; k++) {
      const start = applyAlg(SOLVED, scramble(25, rnd))
      const moves = solveMinimalSync(start)
      expect(moves.length).toBeLessThanOrEqual(21)
      expect(applyAlg(start, moves)).toBe(SOLVED)
    }
  }, 60_000)

  it('cubo risolto: nessuna mossa; cubo impossibile: errore chiaro', () => {
    expect(solveMinimalSync(SOLVED)).toEqual([])
    expect(() => solveMinimalSync(SOLVED.slice(0, 7) + 'F' + SOLVED.slice(8, 19) + 'U' + SOLVED.slice(20))).toThrow('flip')
  })
})
