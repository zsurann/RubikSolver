import { useCallback, useState } from 'react'

/** Stato salvato nel browser (per l'ospite). Se lo spazio non è disponibile si lavora solo in memoria. */
export function useStored<T>(key: string, initial: T): [T, (update: (v: T) => T) => void] {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw ? { ...initial, ...JSON.parse(raw) } : initial
    } catch {
      return initial
    }
  })
  const update = useCallback(
    (fn: (v: T) => T) =>
      setValue((v) => {
        const next = fn(v)
        try { localStorage.setItem(key, JSON.stringify(next)) } catch { /* spazio non disponibile */ }
        return next
      }),
    [key],
  )
  return [value, update]
}
