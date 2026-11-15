import type { Progress } from './progress'

/** Unisce i progressi dell'ospite con quelli dell'account: niente si perde, niente si duplica. */
export function mergeProgress(a: Progress, b: Progress): Progress {
  const byAt = <T extends { at: string }>(xs: T[]) => [...new Map(xs.map((x) => [x.at, x])).values()].sort((x, y) => x.at.localeCompare(y.at))
  return {
    lessons: [...new Set([...a.lessons, ...b.lessons])],
    times: byAt([...a.times, ...b.times]),
    scans: byAt([...a.scans, ...b.scans]).slice(-50),
    updatedAt: a.updatedAt > b.updatedAt ? a.updatedAt : b.updatedAt,
  }
}
