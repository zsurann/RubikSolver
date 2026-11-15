import { describe, expect, it } from 'vitest'
import { mergeProgress } from './merge'

describe('mergeProgress', () => {
  it('unisce lezioni e tempi senza duplicati, tiene la data più recente', () => {
    const a = { lessons: ['notation', 'daisy'], times: [{ ms: 1, at: '2026-01-02' }, { ms: 2, at: '2026-01-01' }], scans: [], updatedAt: '2026-01-02' }
    const b = { lessons: ['daisy', 'whiteCross'], times: [{ ms: 2, at: '2026-01-01' }], scans: [{ state: 'x', at: '2026-01-03' }], updatedAt: '2026-01-03' }
    expect(mergeProgress(a, b)).toEqual({
      lessons: ['notation', 'daisy', 'whiteCross'],
      times: [{ ms: 2, at: '2026-01-01' }, { ms: 1, at: '2026-01-02' }],
      scans: [{ state: 'x', at: '2026-01-03' }],
      updatedAt: '2026-01-03',
    })
  })
})
