/** Media di N senza il migliore e il peggiore (come nelle gare), null se non ci sono abbastanza tempi. */
export function averageOf(times: number[], n: number): number | null {
  if (times.length < n) return null
  const last = times.slice(-n).sort((a, b) => a - b).slice(1, -1)
  return last.reduce((s, x) => s + x, 0) / last.length
}

export function formatTime(ms: number): string {
  const s = ms / 1000
  if (s < 60) return s.toFixed(2)
  const m = Math.floor(s / 60)
  return `${m}:${(s - m * 60).toFixed(2).padStart(5, '0')}`
}
