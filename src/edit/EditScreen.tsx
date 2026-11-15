import { useMemo, useState } from 'react'
import { COLOR_KEY, STICKER_HEX } from '../cube/colors'
import { FACES, type Face, type State } from '../cube/cube'
import { CubeView } from '../cube3d/CubeView'
import { t, type Lang } from '../i18n'
import { diagnose } from './diagnose'

type Props = {
  lang: Lang
  initial: State
  /** adesivi incerti dalla scansione: lampeggiano finché non li tocchi */
  uncertain?: number[]
  onConfirm: (state: State) => void
  /** rifai la scansione di una faccia (assente nell'inserimento a mano senza fotocamera) */
  onRescanFace?: (face: Face) => void
}

/** Ritocco dei colori sul cubo 3D: scegli un colore dalla tavolozza e tocca i quadratini da cambiare. */
export function EditScreen({ lang, initial, uncertain = [], onConfirm, onRescanFace }: Props) {
  const [state, setState] = useState(initial)
  const [color, setColor] = useState<Face>('U')
  const [touched, setTouched] = useState<Set<number>>(new Set())
  const d = useMemo(() => diagnose(state), [state])

  const blink = useMemo(() => {
    const pending = uncertain.filter((i) => !touched.has(i))
    return d.kind === 'pieces' ? [...new Set([...pending, ...d.suspects])] : pending
  }, [uncertain, touched, d])

  // faccia con più adesivi sospetti: quella da riscansionare
  const worstFace = useMemo(() => {
    if (!blink.length) return null
    const n = FACES.map((_, k) => blink.filter((i) => Math.floor(i / 9) === k).length)
    return FACES[n.indexOf(Math.max(...n))]
  }, [blink])

  const paint = (i: number) => {
    if (i % 9 === 4) return // i centri non si cambiano
    setState((s) => s.slice(0, i) + color + s.slice(i + 1))
    setTouched((s) => new Set(s).add(i))
  }

  const name = (f: Face) => t(COLOR_KEY[f], lang)
  const message = (() => {
    switch (d.kind) {
      case 'ok': return t('editOk', lang)
      case 'missing': return t('editMissing', lang).replace('{n}', String(d.count))
      case 'counts': return t('editCounts', lang) + ' ' + d.wrong.map((w) => `${name(w.face)}: ${w.count}`).join(', ')
      case 'pieces': return t('editPieces', lang)
      default: return t('editImpossible', lang)
    }
  })()

  return (
    <section className="page">
      <h2 style={{ margin: 0 }}>{t('editTitle', lang)}</h2>
      <p style={{ margin: 0, color: 'var(--muted)' }}>{t('editHint', lang)}</p>
      <div className="stage" style={{ aspectRatio: '1' }}>
        <CubeView cube={state} current={null} onDone={() => {}} arrows={false} glow={false} blink={blink} onStickerClick={paint} label={t('editTitle', lang)} />
      </div>
      <div role="radiogroup" aria-label={t('editPalette', lang)} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 8 }}>
        {FACES.map((f) => (
          <button
            key={f}
            type="button"
            role="radio"
            aria-checked={color === f}
            onClick={() => setColor(f)}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 10, borderRadius: 12, border: color === f ? '3px solid var(--accent)' : '1px solid var(--line)', background: 'var(--surface)', color: 'inherit', font: 'inherit' }}
          >
            <span style={{ width: 26, height: 26, borderRadius: 6, background: STICKER_HEX[f], border: '1px solid #0003' }} />
            {name(f)}
          </button>
        ))}
      </div>
      <p role="status" className={`status${d.kind === 'ok' ? ' ok' : ''}`}>{message}</p>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button type="button" className="btn btn-primary" disabled={d.kind !== 'ok'} onClick={() => onConfirm(state)}>{t('editConfirm', lang)}</button>
        {onRescanFace && worstFace && (
          <button type="button" className="btn" onClick={() => onRescanFace(worstFace)}>
            {t('editRescan', lang).replace('{color}', name(worstFace))}
          </button>
        )}
      </div>
    </section>
  )
}
