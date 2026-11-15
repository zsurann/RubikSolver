import { describe, expect, it } from 'vitest'
import { applyAlg, SOLVED } from '../cube/cube'
import { describeMove } from './describe'
import { arrowFor, inLayer, moveInfo } from './moves'
import { playerReducer, type PlayerState } from './player'

describe('moveInfo e frecce', () => {
  it('angoli e strati', () => {
    expect(moveInfo('R')).toMatchObject({ axis: 'x', layers: [1], turns: 1, angle: -Math.PI / 2 })
    expect(moveInfo("L'")).toMatchObject({ axis: 'x', layers: [-1], angle: -Math.PI / 2 })
    expect(moveInfo('U2')).toMatchObject({ axis: 'y', turns: 2, angle: -Math.PI })
    expect(inLayer([1, 0, -1], moveInfo('R'))).toBe(true)
    expect(inLayer([0, 0, -1], moveInfo('R'))).toBe(false)
    expect(inLayer([0, 0, 0], moveInfo('y'))).toBe(true)
  })

  it('le frecce puntano nel verso della mossa', () => {
    const dir = (m: string) => {
      const a = arrowFor(m)
      return a.kind === 'straight' ? a.dir.map((v) => v + 0) : a.sign
    }
    expect(dir('R')).toEqual([0, 1, 0]) // destra su
    expect(dir("R'")).toEqual([0, -1, 0])
    expect(dir('L')).toEqual([0, -1, 0]) // sinistra giù
    expect(dir('U')).toEqual([-1, 0, 0]) // sopra verso sinistra
    expect(dir('D')).toEqual([1, 0, 0]) // sotto verso destra
    expect(dir('B')).toEqual([-1, 0, 0]) // riga in alto dietro verso sinistra
    expect(dir('F')).toBe(-1) // orario guardando il davanti
    expect(dir("F'")).toBe(1)
  })
})

describe('descrizioni', () => {
  it('in italiano e inglese', () => {
    expect(describeMove("R'", 'it')).toBe('Destra giù')
    expect(describeMove('U2', 'it')).toBe('Sopra verso sinistra, due volte')
    expect(describeMove('F', 'en')).toBe('Front clockwise')
  })
})

describe('playerReducer', () => {
  const start: PlayerState = { cube: SOLVED, current: null, queue: [], nextId: 0 }
  it('anima una mossa alla volta e aggiorna lo stato a fine animazione', () => {
    let s = playerReducer(start, { type: 'enqueue', moves: ['R', 'U'], ms: 100 })
    expect(s.current?.move).toBe('R')
    expect(s.cube).toBe(SOLVED)
    s = playerReducer(s, { type: 'done', id: s.current!.id })
    expect(s.current?.move).toBe('U')
    expect(s.cube).toBe(applyAlg(SOLVED, 'R'))
    const again = playerReducer(s, { type: 'done', id: 0 }) // fine doppia della mossa R: ignorata
    expect(again).toBe(s)
    s = playerReducer(s, { type: 'done', id: s.current!.id })
    expect(s).toMatchObject({ cube: applyAlg(SOLVED, 'R U'), current: null, queue: [] })
  })
  it('reset svuota la coda', () => {
    const s = playerReducer(playerReducer(start, { type: 'enqueue', moves: ['R', 'U'], ms: 1 }), { type: 'reset', cube: SOLVED })
    expect(s).toMatchObject({ cube: SOLVED, current: null, queue: [] })
  })
})
