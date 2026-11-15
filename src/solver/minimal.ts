// Soluzione breve (~20 mosse) con min2phase (algoritmo a due fasi di Kociemba, Chen Shuang, licenza MIT scelta tra MIT/GPL).
// La stringa facelet del nostro motore è già nel formato di min2phase.
import min2phase from 'min2phase.js'
import { parseAlg, verify, type Move, type State } from '../cube/cube'

/** Versione sincrona (test, worker). La prima chiamata prepara le tabelle (~200 ms). */
export function solveMinimalSync(state: State): Move[] {
  const v = verify(state)
  if (!v.ok) throw new Error(`Stato del cubo non valido: ${v.error}`)
  const out: string = min2phase.solve(state)
  if (/error/i.test(out)) throw new Error(`min2phase: ${out}`)
  return parseAlg(out)
}

let worker: Worker | null = null
let nextId = 0
const waiting = new Map<number, { resolve: (m: Move[]) => void; reject: (e: Error) => void }>()

/** Nel browser: risolve in un Web Worker per non bloccare le animazioni. */
export function solveMinimal(state: State): Promise<Move[]> {
  if (!worker) {
    worker = new Worker(new URL('./minimal.worker.ts', import.meta.url), { type: 'module' })
    worker.onmessage = (e: MessageEvent<{ id: number; moves?: Move[]; error?: string }>) => {
      const w = waiting.get(e.data.id)
      waiting.delete(e.data.id)
      if (e.data.error) w?.reject(new Error(e.data.error))
      else w?.resolve(e.data.moves!)
    }
  }
  const id = nextId++
  return new Promise((resolve, reject) => {
    waiting.set(id, { resolve, reject })
    worker!.postMessage({ id, state })
  })
}
