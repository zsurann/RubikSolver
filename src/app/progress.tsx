import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { authClient } from './auth'
import { mergeProgress } from './merge'
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

export type SyncState = 'guest' | 'syncing' | 'synced' | 'offline'
type Ctx = { progress: Progress; update: (fn: (p: Progress) => Progress) => void; sync: SyncState; replace: (p: Progress) => void }
const ProgressContext = createContext<Ctx | null>(null)

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, set] = useStored('cubo-facile:progress', EMPTY_PROGRESS)
  const update = (fn: (p: Progress) => Progress) => set((p) => ({ ...fn(p), updatedAt: new Date().toISOString() }))
  const replace = (p: Progress) => set(() => p)
  const { data: session } = authClient.useSession()
  const userId = session?.user.id
  const [sync, setSync] = useState<SyncState>('guest')
  const merged = useRef<string | null>(null)

  // al login: unisci i progressi dell'ospite con quelli dell'account
  useEffect(() => {
    if (!userId) { merged.current = null; return }
    if (merged.current === userId) return
    merged.current = userId
    setSync('syncing')
    fetch('/api/progress', { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then(({ progress: remote }: { progress: Progress | null }) => set((local) => (remote ? mergeProgress(local, { ...EMPTY_PROGRESS, ...remote }) : { ...local })))
      .catch(() => setSync('offline'))
  }, [userId, set])

  // a ogni modifica: salva sull'account (con un piccolo ritardo)
  useEffect(() => {
    if (!userId || merged.current !== userId) return
    const id = setTimeout(() => {
      fetch('/api/progress', { method: 'PUT', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(progress) })
        .then((r) => setSync(r.ok ? 'synced' : 'offline'))
        .catch(() => setSync('offline'))
    }, 800)
    return () => clearTimeout(id)
  }, [progress, userId])

  return <ProgressContext.Provider value={{ progress, update, sync: userId ? sync : 'guest', replace }}>{children}</ProgressContext.Provider>
}

export function useProgress() {
  const c = useContext(ProgressContext)
  if (!c) throw new Error('useProgress fuori da ProgressProvider')
  return c
}
