import { useMemo, useState } from 'react'
import { authClient } from '../app/auth'
import { useProgress } from '../app/progress'
import { useSettings } from '../app/settings'
import { applyAlg, parseAlg, SOLVED, type Move } from '../cube/cube'
import { CubeView } from '../cube3d/CubeView'
import { describeMove } from '../cube3d/describe'
import { useCubePlayer } from '../cube3d/player'
import { t, type Lang } from '../i18n'
import { MovePad } from '../practice/MovePad'
import { PhaseExercise } from '../practice/PhaseExercise'
import { phaseStarts, solveBeginner, type PhaseId } from '../solver/beginner'
import { LESSONS, NOTATION_DRILL, type Demo, type Lesson, type LessonId } from './lessons'

// Cubo di esempio per le demo delle fasi (sempre lo stesso, così le lezioni sono ripetibili).
const EXAMPLE = applyAlg(SOLVED, "R U F' L2 D B' R2 U' F L D2 B")
const EXAMPLE_STARTS = phaseStarts(EXAMPLE)
const EXAMPLE_MOVES = Object.fromEntries(solveBeginner(EXAMPLE).map((p) => [p.id, p.steps.flatMap((s) => s.moves)]))

function demoOf(d: Demo, phase: LessonId): { start: string; moves: Move[] } {
  if (d.from === 'phase' && phase !== 'notation') {
    const all = EXAMPLE_MOVES[phase] ?? []
    return { start: EXAMPLE_STARTS[phase as PhaseId], moves: d.moves === 'phase' ? all.slice(0, 16) : parseAlg(d.moves) }
  }
  return { start: applyAlg(SOLVED, d.setup ?? ''), moves: d.moves === 'phase' ? [] : parseAlg(d.moves) }
}

/** Elenco delle lezioni (#impara) o una lezione (#impara-<id>). */
export function Learn({ lang, id }: { lang: Lang; id?: string }) {
  const { progress } = useProgress()
  const lesson = LESSONS.find((l) => l.id === id)
  const unlocked = (i: number) => i === 0 || progress.lessons.includes(LESSONS[i - 1].id)
  if (lesson && unlocked(LESSONS.indexOf(lesson))) return <LessonView key={lesson.id} lang={lang} lesson={lesson} />
  return (
    <section className="page">
      <h2>{t('lessons', lang)}</h2>
      <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 10 }}>
        {LESSONS.map((l, i) => {
          const done = progress.lessons.includes(l.id)
          const open = unlocked(i)
          return (
            <li key={l.id}>
              <a href={open ? `#impara-${l.id}` : undefined} aria-disabled={!open} className="card"
                style={{ textDecoration: 'none', color: 'inherit', opacity: open ? 1 : 0.55, gridTemplateColumns: 'auto 1fr', alignItems: 'center' }}>
                <span style={{ width: 36, height: 36, borderRadius: 18, display: 'grid', placeItems: 'center', fontWeight: 700, background: done ? 'var(--ok-bg)' : 'var(--bg)' }}>
                  {done ? '✓' : i}
                </span>
                <span>
                  <b>{l.title[lang]}</b>
                  <br />
                  <small className="muted">{done ? t('lessonDone', lang) : open ? '' : t('lessonLocked', lang)}</small>
                </span>
              </a>
            </li>
          )
        })}
      </ol>
    </section>
  )
}

function LessonView({ lang, lesson }: { lang: Lang; lesson: Lesson }) {
  const { settings } = useSettings()
  const { progress, update } = useProgress()
  const [i, setI] = useState(0)
  const [done, setDone] = useState(false)
  const inExercise = i >= lesson.screens.length
  const screen = lesson.screens[i]
  const demo = useMemo(() => (screen?.demo ? demoOf(screen.demo, lesson.id) : null), [screen, lesson.id])
  const player = useCubePlayer(demo?.start ?? SOLVED)
  const next = LESSONS[LESSONS.indexOf(lesson) + 1]
  const { data: session } = authClient.useSession()

  const go = (k: number) => {
    setI(k)
    const d = lesson.screens[k]?.demo
    if (d) player.reset(demoOf(d, lesson.id).start)
  }
  const complete = () => {
    setDone(true)
    if (!progress.lessons.includes(lesson.id)) update((p) => ({ ...p, lessons: [...p.lessons, lesson.id] }))
  }

  return (
    <section className="page">
      <p className="muted">{t('lessons', lang)} · {LESSONS.indexOf(lesson)} / {LESSONS.length - 1}</p>
      <h2>{lesson.title[lang]}</h2>
      <progress max={lesson.screens.length} value={Math.min(i, lesson.screens.length)} style={{ width: '100%' }} aria-label={t('progress', lang)} />
      {!inExercise && (
        <>
          <div className="card" style={screen.warn ? { borderColor: 'var(--accent)' } : undefined}>
            {screen.warn && <b style={{ color: 'var(--accent)' }}>{t('warnLabel', lang)}</b>}
            <p style={{ fontSize: '1.1rem' }}>{screen.text[lang]}</p>
          </div>
          {demo && (
            <>
              <div className="stage">
                <CubeView cube={player.cube} current={player.current} onDone={player.done} arrows={settings.arrows} glow={settings.glow} />
              </div>
              <div className="row">
                <button type="button" className="btn" disabled={!player.idle} onClick={() => { player.reset(demo.start); player.enqueue(demo.moves, settings.speed) }}>
                  ▶ {t('watch', lang)}
                </button>
                <span className="muted">{demo.moves.slice(0, 8).join(' ')}{demo.moves.length > 8 ? ' …' : ''}</span>
              </div>
            </>
          )}
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <button type="button" className="btn" disabled={i === 0} onClick={() => go(i - 1)}>◀ {t('back', lang)}</button>
            <button type="button" className="btn btn-primary" onClick={() => go(i + 1)}>{t('continue', lang)} ▶</button>
          </div>
        </>
      )}
      {inExercise && (
        <>
          <div className="card">
            <b>{t('exercise', lang)}</b>
            <p>{lesson.goal[lang]}</p>
          </div>
          {lesson.id === 'notation' ? <NotationDrill lang={lang} onDone={complete} /> : <PhaseExercise lang={lang} phase={lesson.id} onSolved={complete} />}
          {done && (
            <div className="card" role="status" style={{ borderColor: 'var(--accent)' }}>
              <h3>{lesson.cheer[lang]}</h3>
              <div className="row">
                {next && <a className="btn btn-primary" href={`#impara-${next.id}`}>{t('nextLesson', lang)} ▶</a>}
                <a className="btn" href="#impara">{t('backToLessons', lang)}</a>
              </div>
              {!session && (
                <p className="muted">
                  {t('saveProgressInvite', lang)} <a href="#account">{t('createAccount', lang)}</a>
                </p>
              )}
            </div>
          )}
          <button type="button" className="btn" onClick={() => go(lesson.screens.length - 1)}>◀ {t('back', lang)}</button>
        </>
      )}
    </section>
  )
}

function NotationDrill({ lang, onDone }: { lang: Lang; onDone: () => void }) {
  const { settings } = useSettings()
  const player = useCubePlayer(SOLVED)
  const [k, setK] = useState(0)
  const [wrong, setWrong] = useState<string | null>(null)
  const want = NOTATION_DRILL[k]
  const onMove = (m: Move) => {
    if (k >= NOTATION_DRILL.length || !player.idle) return
    player.enqueue([m], settings.speed)
    if (m !== want) {
      setWrong(t('drillWrong', lang).replace('{got}', m).replace('{want}', want))
      player.enqueue([m.endsWith("'") ? m[0] : `${m}'`], settings.speed) // torna indietro da solo
      return
    }
    setWrong(null)
    if (k + 1 === NOTATION_DRILL.length) onDone()
    setK(k + 1)
  }
  return (
    <div style={{ display: 'grid', gap: 10 }}>
      <div className="stage">
        <CubeView cube={player.cube} current={player.current} onDone={player.done} pending={want ?? null} />
      </div>
      {want ? (
        <p aria-live="polite" style={{ fontSize: '1.1rem' }}>
          {t('drillDo', lang)} <b>{want}</b> · {describeMove(want, lang)} <span className="muted">({k + 1}/{NOTATION_DRILL.length})</span>
        </p>
      ) : (
        <p className="status ok" role="status">{t('exerciseDone', lang)}</p>
      )}
      {wrong && <p className="status">{wrong}</p>}
      <MovePad lang={lang} onMove={onMove} withRotation={false} disabled={!want} />
    </div>
  )
}
