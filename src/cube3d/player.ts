import { useCallback, useEffect, useMemo, useReducer, useState } from 'react'
import { applyMove, invertMove, parseAlg, type Move, type State } from '../cube/cube'

export type Job = { move: Move; ms: number; id: number }
export type PlayerState = { cube: State; current: Job | null; queue: Job[]; nextId: number }
export type PlayerAction =
  | { type: 'enqueue'; moves: Move[]; ms: number }
  | { type: 'done'; id: number }
  | { type: 'reset'; cube: State }

/** Coda di mosse da animare: una alla volta, lo stato si aggiorna a fine animazione. */
export function playerReducer(s: PlayerState, a: PlayerAction): PlayerState {
  switch (a.type) {
    case 'enqueue': {
      const jobs = a.moves.map((move, i) => ({ move, ms: a.ms, id: s.nextId + i }))
      const queue = [...s.queue, ...jobs]
      return { ...s, nextId: s.nextId + jobs.length, current: s.current ?? queue.shift() ?? null, queue }
    }
    case 'done': {
      if (s.current?.id !== a.id) return s // fine animazione già gestita
      const [next = null, ...queue] = s.queue
      return { ...s, cube: applyMove(s.cube, s.current.move), current: next, queue }
    }
    case 'reset':
      return { cube: a.cube, current: null, queue: [], nextId: s.nextId }
  }
}

export function useCubePlayer(initial: State) {
  const [s, dispatch] = useReducer(playerReducer, { cube: initial, current: null, queue: [], nextId: 0 })
  const enqueue = useCallback((moves: Move[], ms: number) => dispatch({ type: 'enqueue', moves, ms }), [])
  const done = useCallback((id: number) => dispatch({ type: 'done', id }), [])
  const reset = useCallback((cube: State) => dispatch({ type: 'reset', cube }), [])
  return { cube: s.cube, current: s.current, idle: !s.current && !s.queue.length, enqueue, done, reset }
}

/** Formula da eseguire passo per passo (avanti / indietro / riproduci). */
export function useSequence(alg: string, enqueue: (m: Move[], ms: number) => void, idle: boolean, ms: number) {
  const moves = useMemo(() => parseAlg(alg), [alg])
  const [seq, setSeq] = useState({ alg, idx: 0, playing: false })
  if (seq.alg !== alg) setSeq({ alg, idx: 0, playing: false })
  const { idx } = seq
  const playing = seq.playing && idx < moves.length // si ferma da sola a fine formula

  const next = useCallback(() => {
    if (idx >= moves.length) return
    enqueue([moves[idx]], ms)
    setSeq((q) => ({ ...q, idx: idx + 1 }))
  }, [idx, moves, enqueue, ms])
  const back = useCallback(() => {
    if (idx <= 0) return
    enqueue([invertMove(moves[idx - 1])], ms)
    setSeq((q) => ({ ...q, idx: idx - 1, playing: false }))
  }, [idx, moves, enqueue, ms])
  const setPlaying = useCallback((p: boolean) => setSeq((q) => ({ ...q, playing: p })), [])
  const restart = useCallback(() => setSeq((q) => ({ ...q, idx: 0, playing: false })), [])

  useEffect(() => {
    if (!playing || !idle) return
    const t = setTimeout(next, ms * 0.9) // pausa per far vedere la freccia prima della mossa
    return () => clearTimeout(t)
  }, [playing, idle, next, ms])

  return { moves, idx, pending: moves[idx] ?? null, playing, next, back, setPlaying, restart }
}
