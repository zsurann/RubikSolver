import { describe, expect, it } from 'vitest'
import { applyAlg, applyMove, invertAlg, isSolved, parseAlg, scramble, SOLVED, verify } from './cube'

const face = (s: string, f: number) => s.slice(f * 9, f * 9 + 9)
const swap = (s: string, i: number, j: number) => {
  const a = s.split('')
  ;[a[i], a[j]] = [a[j], a[i]]
  return a.join('')
}
const seeded = (seed: number) => () => ((seed = (seed * 1103515245 + 12345) % 2 ** 31) / 2 ** 31)

describe('mosse', () => {
  it('ogni mossa ripetuta 4 volte torna al punto di partenza', () => {
    for (const m of 'URFDLBxyz') expect(applyAlg(SOLVED, [m, m, m, m])).toBe(SOLVED)
  })

  it('U porta la riga in alto della destra sul davanti', () => {
    const s = applyMove(SOLVED, 'U')
    expect(face(s, 2).slice(0, 3)).toBe('RRR')
    expect(face(s, 1).slice(0, 3)).toBe('BBB')
    expect(face(s, 0)).toBe('UUUUUUUUU')
  })

  it('R porta la colonna destra del davanti in alto', () => {
    const s = applyMove(SOLVED, 'R')
    expect([2, 5, 8].map((i) => face(s, 0)[i]).join('')).toBe('FFF')
    expect([2, 5, 8].map((i) => face(s, 2)[i]).join('')).toBe('DDD')
  })

  it("F, L, D, B girano nel verso giusto (guardando la faccia)", () => {
    // F: la riga in basso di U va sulla colonna sinistra di R
    expect([0, 3, 6].map((i) => face(applyMove(SOLVED, 'F'), 1)[i]).join('')).toBe('UUU')
    // L: la colonna sinistra di U scende sul davanti
    expect([0, 3, 6].map((i) => face(applyMove(SOLVED, 'L'), 2)[i]).join('')).toBe('UUU')
    // D: la riga in basso del davanti va a destra
    expect(face(applyMove(SOLVED, 'D'), 1).slice(6)).toBe('FFF')
    // B: la riga in alto di U va sulla colonna sinistra di L
    expect([0, 3, 6].map((i) => face(applyMove(SOLVED, 'B'), 4)[i]).join('')).toBe('UUU')
  })

  it("R U R' U' ripetuto 6 volte è l'identità", () => {
    expect(applyAlg(SOLVED, Array(6).fill("R U R' U'").join(' '))).toBe(SOLVED)
  })

  it('una sequenza seguita dalla sua inversa torna risolta', () => {
    const s = scramble(30, seeded(7))
    expect(applyAlg(applyAlg(SOLVED, s), invertAlg(s))).toBe(SOLVED)
  })

  it('le rotazioni del cubo intero lasciano il cubo risolto', () => {
    const s = applyAlg(SOLVED, 'x y2 z')
    expect(s).not.toBe(SOLVED)
    expect(isSolved(s)).toBe(true)
  })

  it('rifiuta mosse sconosciute', () => {
    expect(() => parseAlg('R Q')).toThrow('Q')
    expect(parseAlg("  R  U2 F' ")).toEqual(['R', 'U2', "F'"])
  })
})

describe('mescolata', () => {
  it('non ripete la stessa faccia di seguito', () => {
    const s = scramble(200, seeded(3))
    expect(s).toHaveLength(200)
    s.slice(1).forEach((m, i) => expect(m[0]).not.toBe(s[i][0]))
  })
})

describe('verify', () => {
  it('cubo risolto e 500 cubi mescolati sono validi', () => {
    expect(verify(SOLVED)).toMatchObject({ ok: true, cubies: { cp: [0, 1, 2, 3, 4, 5, 6, 7], co: Array(8).fill(0) } })
    const rnd = seeded(42)
    for (let k = 0; k < 500; k++) expect(verify(applyAlg(SOLVED, scramble(25, rnd))).ok).toBe(true)
  })

  it('riconosce gli stati impossibili', () => {
    const s = applyAlg(SOLVED, "R U F' L2 D B'")
    expect(verify(s.slice(1))).toEqual({ ok: false, error: 'length' })
    expect(verify((s[0] === 'U' ? 'D' : 'U') + s.slice(1))).toEqual({ ok: false, error: 'counts' })
    // angolo URF ruotato su se stesso: U9 → R1 → F3
    const twisted = SOLVED.slice(0, 8) + 'R' + 'F' + SOLVED.slice(10, 20) + 'U' + SOLVED.slice(21)
    expect(verify(twisted)).toEqual({ ok: false, error: 'twist' })
    // spigolo UF girato
    expect(verify(swap(SOLVED, 7, 19))).toEqual({ ok: false, error: 'flip' })
    // due spigoli scambiati (UR e UF): parità
    expect(verify(swap(swap(SOLVED, 5, 7), 10, 19))).toEqual({ ok: false, error: 'parity' })
    // adesivi impossibili sullo stesso spigolo (U con D)
    expect(verify(swap(SOLVED, 10, 28))).toEqual({ ok: false, error: 'edges' })
  })
})
