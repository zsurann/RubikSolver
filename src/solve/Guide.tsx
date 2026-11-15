import { useState } from 'react'
import { COLOR_KEY } from '../cube/colors'
import { invertMove, type Face, type State } from '../cube/cube'
import { CubeView } from '../cube3d/CubeView'
import { describeMove } from '../cube3d/describe'
import { useCubePlayer } from '../cube3d/player'
import { t, type Key, type Lang } from '../i18n'
import { useSettings } from '../app/settings'
import type { GuidePhase, Item } from './items'

type Props = { lang: Lang; start: State; items: Item[]; phases: GuidePhase[]; onLost: () => void; onRestart: () => void }


/** Guida una mossa alla volta: freccia sul cubo 3D, tu la fai sul cubo vero e tocchi "Fatto". */
export function Guide({ lang, start, items, phases, onLost, onRestart }: Props) {
  const { settings } = useSettings()
  const MS = settings.speed
  const player = useCubePlayer(start)
  const [idx, setIdx] = useState(0)
  const [introFor, setIntroFor] = useState<number | null>(items.length ? 0 : null)
  const [viewKey, setViewKey] = useState(0)
  const item = items[idx]
  const phaseIdx = item?.phase ?? phases.length
  const done = idx >= items.length

  const next = () => {
    if (!item || !player.idle) return
    player.enqueue([item.move], MS)
    setIdx(idx + 1)
    // all'inizio di ogni fase: scheda con titolo, traguardo e presa
    const after = items[idx + 1]
    if (after && after.phase !== item.phase) setIntroFor(after.phase)
  }
  const startPhase = () => {
    setIntroFor(null)
    setViewKey((k) => k + 1) // cubo alla vista standard, come lo tieni in mano
  }
  const back = () => {
    if (idx === 0 || !player.idle) return
    player.enqueue([invertMove(items[idx - 1].move)], MS)
    setIdx(idx - 1)
  }

  const phaseName = (p: GuidePhase) => t(`phase_${p.id}` as Key, lang)
  // colore della faccia davanti adesso (le rotazioni del cubo intero la cambiano)
  const front = t(COLOR_KEY[player.cube[22] as Face], lang)

  if (done && player.idle)
    return (
      <section className="page">
        <h2 style={{ margin: 0 }}>{t('solvedTitle', lang)}</h2>
        <p>{t('solvedText', lang).replace('{n}', String(items.length))}</p>
        <Stage cube={player.cube} />
        <button type="button" className="btn btn-primary" onClick={onRestart}>{t('solveAnother', lang)}</button>
      </section>
    )

  return (
    <section className="page">
      <div>
        <p style={{ margin: 0, color: 'var(--muted)' }}>
          {t('phaseLabel', lang)} {phaseIdx + 1} {t('stepOf', lang)} {phases.length} · {t('moveLabel', lang)} {Math.min(idx + 1, items.length)} {t('stepOf', lang)} {items.length}
        </p>
        <h2 style={{ margin: '2px 0 0' }}>{phases[phaseIdx] && phaseName(phases[phaseIdx])}</h2>
        <progress max={items.length} value={idx} style={{ width: '100%' }} aria-label={t('progress', lang)} />
      </div>
      <div style={{ position: 'relative' }}>
        <Stage cube={player.cube} current={player.current} onDone={player.done} pending={introFor === null ? item?.move : null} viewKey={viewKey} arrows={settings.arrows} glow={settings.glow} />
        {introFor !== null && player.idle && (
          <div style={card}>
            <h3 style={{ margin: 0 }}>{phaseName(phases[introFor])}</h3>
            <p style={{ margin: 0 }}>{t(`goal_${phases[introFor].id}` as Key, lang)}</p>
            <p style={{ margin: 0, fontWeight: 700 }}>{t('holdCube', lang).replace('{front}', front)}</p>
            {phases[introFor].id === 'yellowCornersOrientation' && <p style={{ margin: 0 }}>{t('looksBroken', lang)}</p>}
            <button type="button" className="btn btn-primary" onClick={startPhase}>{t('startPhase', lang)}</button>
          </div>
        )}
      </div>
      {introFor === null && item && (
        <div aria-live="polite" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <b style={{ fontSize: 30, minWidth: 56, textAlign: 'center', background: '#fff', color: '#10141c', borderRadius: 12, padding: '4px 8px', border: '1px solid #0002' }}>{item.move}</b>
          <div>
            <div style={{ fontWeight: 700, fontSize: 18 }}>{describeMove(item.move, lang)}</div>
            {item.alg && (
              <div style={{ color: 'var(--muted)' }}>
                {t(`alg_${item.alg.id}` as Key, lang)} · {item.alg.pos + 1}/{item.alg.len}
              </div>
            )}
          </div>
        </div>
      )}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button type="button" className="btn" onClick={back} disabled={idx === 0 || introFor !== null}>◀ {t('back', lang)}</button>
        <button type="button" className="btn btn-primary" onClick={next} disabled={introFor !== null || !player.idle}>{t('next', lang)} ▶</button>
        <button type="button" className="btn" onClick={() => setViewKey((k) => k + 1)}>{t('standardView', lang)}</button>
        <button type="button" className="btn" onClick={onLost}>{t('imLost', lang)}</button>
      </div>
    </section>
  )
}

function Stage(props: Omit<Parameters<typeof CubeView>[0], 'current' | 'onDone'> & Partial<Pick<Parameters<typeof CubeView>[0], 'current' | 'onDone'>>) {
  return (
    <div className="stage">
      <CubeView current={null} onDone={() => {}} {...props} />
    </div>
  )
}

const card = { position: 'absolute', inset: 12, display: 'grid', alignContent: 'center', gap: 10, padding: 20, borderRadius: 16, background: 'rgba(255,255,255,.94)', color: '#1b2230', textAlign: 'center' } as const
