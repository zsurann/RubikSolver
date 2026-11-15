import { solveMinimalSync } from './minimal'

self.onmessage = (e: MessageEvent<{ id: number; state: string }>) => {
  try {
    self.postMessage({ id: e.data.id, moves: solveMinimalSync(e.data.state) })
  } catch (err) {
    self.postMessage({ id: e.data.id, error: (err as Error).message })
  }
}
