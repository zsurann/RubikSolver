import { useEffect } from 'react'
import type { Move } from '../cube/cube'
import { describeMove } from '../cube3d/describe'
import type { Lang } from '../i18n'

const FACES = ['U', 'R', 'F', 'L', 'D', 'B']

/** Pulsanti per girare il cubo virtuale (+ tastiera: lettera = mossa, Maiusc = al contrario). */
export function MovePad({ lang, onMove, disabled, withRotation = true }: { lang: Lang; onMove: (m: Move) => void; disabled?: boolean; withRotation?: boolean }) {
  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      if (disabled || e.metaKey || e.ctrlKey || e.altKey || (e.target as HTMLElement).closest('input, select, textarea')) return
      const k = e.key.toUpperCase()
      if (FACES.includes(k)) onMove(e.shiftKey ? `${k}'` : k)
      else if (withRotation && k === 'Y') onMove(e.shiftKey ? "y'" : 'y')
    }
    addEventListener('keydown', on)
    return () => removeEventListener('keydown', on)
  }, [onMove, disabled, withRotation])
  const moves = [...FACES.flatMap((f) => [f, `${f}'`]), ...(withRotation ? ['y', "y'"] : [])]
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(56px, 1fr))', gap: 6 }}>
      {moves.map((m) => (
        <button key={m} type="button" className="btn" style={{ fontFamily: 'var(--display)', fontSize: '1.1rem', padding: '8px 0' }}
          disabled={disabled} onClick={() => onMove(m)} aria-label={`${m}: ${describeMove(m, lang)}`} title={describeMove(m, lang)}>
          {m}
        </button>
      ))}
    </div>
  )
}
