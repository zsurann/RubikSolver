import { describe, expect, it } from 'vitest'
import { averageOf, formatTime } from './stats'

describe('statistiche', () => {
  it('media di 5 senza migliore e peggiore', () => {
    expect(averageOf([10, 20, 30, 40, 50, 1000], 5)).toBe(40)
    expect(averageOf([10, 20], 5)).toBeNull()
  })
  it('formato del tempo', () => {
    expect(formatTime(12345)).toBe('12.35')
    expect(formatTime(83456)).toBe('1:23.46')
  })
})
