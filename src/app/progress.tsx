import { createContext, useContext, type ReactNode } from 'react'
import { useStored } from './store'

export type Progress = {
  /** id delle lezioni completate */
  lessons: string[]
  /** tempi di risoluzione del cubo vero (ms) */
  times: { ms: number; at: string }[]
  /** cubi scansionati (stato a 54 lettere) */
  scans: { state: string; at: string }[]
  /** ultima modifica, per l'unione con l'account */
  updatedAt: string
}
export const EMPTY_PROGRESS: Progress = { lessons: [], times: [], scans: [], updatedAt: new Date(0).toISOString() }

type Ctx = { progress: Progress; update: (fn: (p: Progress) => Progress) => void }
const ProgressContext = createContext<Ctx | null>(null)

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, set] = useStored('cubo-facile:progress', EMPTY_PROGRESS)
  const update = (fn: (p: Progress) => Progress) => set((p) => ({ ...fn(p), updatedAt: new Date().toISOString() }))
  return <ProgressContext.Provider value={{ progress, update }}>{children}</ProgressContext.Provider>
}

export function useProgress() {
  const c = useContext(ProgressContext)
  if (!c) throw new Error('useProgress fuori da ProgressProvider')
  return c
}
