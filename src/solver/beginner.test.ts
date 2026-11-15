import { describe, expect, it } from 'vitest'
import { applyAlg, applyMove, isSolved, scramble, SOLVED } from '../cube/cube'
import { ALGS, flatten, solveBeginner } from './beginner'

const seeded = (seed: number) => () => ((seed = (seed * 1103515245 + 12345) % 2 ** 31) / 2 ** 31)

describe('solver metodo principianti', () => {
  it('risolve 1000 cubi mescolati con 8 fasi e solo le formule del metodo', () => {
    const rnd = seeded(2024)
    const allowedLoose = /^[URFDLBy](2|')?$/
    let total = 0
    for (let k = 0; k < 1000; k++) {
      const start = applyAlg(SOLVED, scramble(25, rnd))
      const phases = solveBeginner(start)
      expect(phases.map((p) => p.id)).toEqual([
        'daisy', 'whiteCross', 'whiteCorners', 'middleLayer', 'yellowCross', 'yellowEdges', 'yellowCornersPosition', 'yellowCornersOrientation',
      ])
      const end = flatten(phases).reduce(applyMove, start)
      expect(isSolved(end)).toBe(true)
      for (const p of phases) for (const st of p.steps) {
        if (st.alg) expect(st.moves.join(' ')).toBe(ALGS[st.alg])
        else {
          expect(st.moves).toHaveLength(1)
          expect(st.moves[0]).toMatch(allowedLoose)
        }
      }
      // dalla croce in poi solo giri di U, mezzi giri, rotazioni y e formule
      for (const p of phases.slice(1)) for (const st of p.steps) if (!st.alg) expect(st.moves[0]).toMatch(/^([Uy](2|')?|[RLFB]2)$/)
      total += flatten(phases).length
    }
    expect(total / 1000).toBeLessThan(200)
  }, 120_000)

  it('cubo già risolto: nessuna mossa', () => {
    expect(flatten(solveBeginner(SOLVED))).toEqual([])
  })

  it('i 7 algoritmi sono quelli della ricerca e tornano all’inizio ripetuti', () => {
    expect(applyAlg(SOLVED, Array(6).fill(ALGS.whiteCorner).join(' '))).toBe(SOLVED)
    expect(applyAlg(SOLVED, Array(6).fill(ALGS.yellowCornersOrientation).join(' '))).toBe(SOLVED)
    for (const a of Object.values(ALGS)) {
      let s = applyAlg(SOLVED, a), n = 1
      while (s !== SOLVED && n < 1300) { s = applyAlg(s, a); n++ }
      expect(s).toBe(SOLVED)
    }
  })

  it('rifiuta un cubo impossibile', () => {
    expect(() => solveBeginner(SOLVED.slice(0, 7) + SOLVED[19] + SOLVED.slice(8, 19) + SOLVED[7] + SOLVED.slice(20))).toThrow('flip')
  })
})

describe('phaseDone e phaseStarts', () => {
  it('ogni fase parte non completata e finisce completata', async () => {
    const { phaseDone, phaseStarts, solveBeginner } = await import('./beginner')
    const rnd = seeded(77)
    for (let k = 0; k < 50; k++) {
      const start = applyAlg(SOLVED, scramble(25, rnd))
      const starts = phaseStarts(start)
      const phases = solveBeginner(start)
      phases.forEach((p, i) => {
        const end = applyAlg(starts[p.id], p.steps.flatMap((s) => s.moves))
        expect(phaseDone(p.id, end)).toBe(true)
        if (p.steps.length) expect(phaseDone(p.id, starts[p.id])).toBe(false)
        if (i + 1 < phases.length) expect(end).toBe(starts[phases[i + 1].id])
      })
    }
  })
})
