import { describe, expect, it } from 'vitest'
import { applyAlg, SOLVED } from '../cube/cube'
import { diagnose, EMPTY } from './diagnose'

const set = (s: string, i: number, c: string) => s.slice(0, i) + c + s.slice(i + 1)
const swap = (s: string, i: number, j: number) => set(set(s, i, s[j]), j, s[i])

describe('diagnose', () => {
  const s = applyAlg(SOLVED, "R U F' L2 D B'")
  it('cubo valido', () => expect(diagnose(s)).toEqual({ kind: 'ok' }))
  it('quadratini da colorare', () => {
    expect(diagnose(EMPTY)).toEqual({ kind: 'missing', count: 48 })
    expect(EMPTY.slice(0, 9)).toBe('????U????')
  })
  it('conteggi sbagliati', () => {
    const i = [...s].findIndex((c, k) => c === 'F' && k % 9 !== 4)
    expect(diagnose(set(s, i, 'B'))).toEqual({ kind: 'counts', wrong: [{ face: 'F', count: 8 }, { face: 'B', count: 10 }] })
  })
  it('pezzi impossibili: indica gli adesivi da controllare', () => {
    // scambio di adesivi tra due pezzi diversi con colori che poi non stanno insieme
    const bad = swap(SOLVED, 8, 10) // U9 (angolo URF) con R2 (spigolo UR): angolo R-R-F, spigolo U-U
    const d = diagnose(bad)
    expect(d.kind).toBe('pieces')
    if (d.kind === 'pieces') expect(d.suspects).toEqual(expect.arrayContaining([8, 9, 20, 5, 10]))
  })
  it('torsione, flip, parità', () => {
    expect(diagnose(swap(SOLVED, 7, 19)).kind).toBe('flip')
    expect(diagnose(swap(SOLVED, 10, 19)).kind).toBe('parity')
  })
})
