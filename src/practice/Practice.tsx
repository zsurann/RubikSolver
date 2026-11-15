import { useCallback, useEffect, useRef, useState } from 'react'
import { useProgress } from '../app/progress'
import { useSettings } from '../app/settings'
import { isSolved, scramble, SOLVED, type Move } from '../cube/cube'
import { CubeView } from '../cube3d/CubeView'
import { describeMove } from '../cube3d/describe'
import { useCubePlayer } from '../cube3d/player'
import { t, type Key, type Lang } from '../i18n'
import { solveBeginner, type PhaseId } from '../solver/beginner'
import { MovePad } from './MovePad'
import { PhaseExercise } from './PhaseExercise'
import { averageOf, formatTime } from './stats'

type Tab = 'free' | 'timer' | 'phase'
const PHASES: PhaseId[] = ['daisy', 'whiteCross', 'whiteCorners', 'middleLayer', 'yellowCross', 'yellowEdges', 'yellowCornersPosition', 'yellowCornersOrientation']

export function Practice({ lang }: { lang: Lang }) {
  const [tab, setTab] = useState<Tab>('free')
  const tabs: [Tab, Key][] = [['free', 'practiceFree'], ['timer', 'practiceTimer'], ['phase', 'practicePhase']]
  return (
    <section className="page">
      <h2>{t('practice', lang)}</h2>
      <div role="tablist" className="row">
        {tabs.map(([id, label]) => (
          <button key={id} type="button" role="tab" aria-selected={tab === id} className={`btn${tab === id ? ' btn-primary' : ''}`} onClick={() => setTab(id)}>
            {t(label, lang)}
          </button>
        ))}
      </div>
      {tab === 'free' && <FreeCube lang={lang} />}
      {tab === 'timer' && <Timer lang={lang} />}
      {tab === 'phase' && <PhaseTraining lang={lang} />}
    </section>
  )
}

function FreeCube({ lang }: { lang: Lang }) {
  const { settings } = useSettings()
  const player = useCubePlayer(SOLVED)
  const [hint, setHint] = useState<Move | null>(null)
  const [viewKey, setViewKey] = useState(0)
  const move = useCallback((m: Move) => { setHint(null); player.enqueue([m], Math.max(200, settings.speed * 0.6)) }, [player, settings.speed])
  const help = () => setHint(solveBeginner(player.cube).flatMap((p) => p.steps.flatMap((s) => s.moves))[0] ?? null)
  const solved = player.idle && isSolved(player.cube)
  return (
    <div style={{ display: 'grid', gap: 10 }}>
      <div className="stage">
        <CubeView cube={player.cube} current={player.current} onDone={player.done} pending={hint} viewKey={viewKey} arrows={settings.arrows} glow={settings.glow} />
      </div>
      <p className="muted" aria-live="polite">
        {hint ? `${t('tryThis', lang)} ${hint} · ${describeMove(hint, lang)}` : solved ? t('cubeIsSolved', lang) : t('freeHint', lang)}
      </p>
      <MovePad lang={lang} onMove={move} />
      <div className="row">
        <button type="button" className="btn btn-primary" disabled={!player.idle} onClick={() => { setHint(null); player.enqueue(scramble(20), 120) }}>{t('scramble', lang)}</button>
        <button type="button" className="btn" disabled={!player.idle || solved} onClick={help}>{t('nextMoveHelp', lang)}</button>
        <button type="button" className="btn" onClick={() => { setHint(null); player.reset(SOLVED) }}>{t('resetCube', lang)}</button>
        <button type="button" className="btn" onClick={() => setViewKey((k) => k + 1)}>{t('standardView', lang)}</button>
      </div>
    </div>
  )
}

function Timer({ lang }: { lang: Lang }) {
  const { progress, update } = useProgress()
  const [scr, setScr] = useState(() => scramble(20))
  const [running, setRunning] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const startAt = useRef(0)

  const toggle = useCallback(() => {
    if (!running) {
      startAt.current = performance.now()
      setElapsed(0)
      setRunning(true)
      return
    }
    const ms = Math.round(performance.now() - startAt.current)
    setRunning(false)
    setElapsed(ms)
    update((p) => ({ ...p, times: [...p.times, { ms, at: new Date().toISOString() }] }))
    setScr(scramble(20))
  }, [running, update])

  useEffect(() => {
    if (!running) return
    const id = setInterval(() => setElapsed(performance.now() - startAt.current), 47)
    return () => clearInterval(id)
  }, [running])
  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      if (e.code !== 'Space' || (e.target as HTMLElement).closest('button, input, select')) return
      e.preventDefault()
      toggle()
    }
    addEventListener('keydown', on)
    return () => removeEventListener('keydown', on)
  }, [toggle])

  const ms = progress.times.map((x) => x.ms)
  const best = ms.length ? Math.min(...ms) : null
  const ao5 = averageOf(ms, 5), ao12 = averageOf(ms, 12)
  const stat = (label: Key, v: number | null) => (
    <div className="card" style={{ padding: 10, gap: 2 }}>
      <small className="muted">{t(label, lang)}</small>
      <b style={{ fontVariantNumeric: 'tabular-nums', fontSize: '1.2rem' }}>{v === null ? '—' : formatTime(v)}</b>
    </div>
  )
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <div className="card">
        <small className="muted">{t('timerScramble', lang)}</small>
        <p style={{ fontFamily: 'var(--display)', fontSize: '1.15rem', wordSpacing: 4 }}>{scr.join(' ')}</p>
      </div>
      <button type="button" className={`btn btn-big${running ? '' : ' btn-primary'}`} onClick={toggle} aria-live="polite"
        style={{ fontSize: '3rem', fontVariantNumeric: 'tabular-nums', minHeight: 140, fontFamily: 'var(--display)' }}>
        {formatTime(elapsed)}
      </button>
      <p className="muted">{running ? t('timerStop', lang) : t('timerStart', lang)}</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: 8 }}>
        {stat('timerBest', best)}
        {stat('timerAo5', ao5)}
        {stat('timerAo12', ao12)}
        <div className="card" style={{ padding: 10, gap: 2 }}>
          <small className="muted">{t('timerCount', lang)}</small>
          <b style={{ fontSize: '1.2rem' }}>{ms.length}</b>
        </div>
      </div>
      {ms.length > 0 && (
        <details>
          <summary>{t('timerHistory', lang)}</summary>
          <ol reversed style={{ fontVariantNumeric: 'tabular-nums' }}>
            {[...progress.times].reverse().slice(0, 50).map((x) => <li key={x.at}>{formatTime(x.ms)} · {new Date(x.at).toLocaleDateString(lang)}</li>)}
          </ol>
          <button type="button" className="btn" onClick={() => update((p) => ({ ...p, times: p.times.slice(0, -1) }))}>{t('timerDeleteLast', lang)}</button>
        </details>
      )}
    </div>
  )
}

function PhaseTraining({ lang }: { lang: Lang }) {
  const [phase, setPhase] = useState<PhaseId>('whiteCorners')
  return (
    <div style={{ display: 'grid', gap: 10 }}>
      <label className="row">
        {t('chooseLessonPhase', lang)}
        <select className="btn" value={phase} onChange={(e) => setPhase(e.target.value as PhaseId)}>
          {PHASES.map((p) => <option key={p} value={p}>{t(`phase_${p}` as Key, lang)}</option>)}
        </select>
      </label>
      <PhaseExercise key={phase} lang={lang} phase={phase} />
    </div>
  )
}
