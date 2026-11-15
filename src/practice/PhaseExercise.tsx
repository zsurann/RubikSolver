import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSettings } from '../app/settings'
import { applyAlg, scramble, SOLVED, type Move } from '../cube/cube'
import { CubeView } from '../cube3d/CubeView'
import { describeMove } from '../cube3d/describe'
import { useCubePlayer } from '../cube3d/player'
import { t, type Lang } from '../i18n'
import { phaseDone, phaseStarts, solveBeginner, type PhaseId } from '../solver/beginner'
import { MovePad } from './MovePad'

/** Esercizio mirato: il cubo virtuale parte dall'inizio della fase; finisci la fase per completarlo. */
export function PhaseExercise({ lang, phase, onSolved }: { lang: Lang; phase: PhaseId; onSolved?: () => void }) {
  const { settings } = useSettings()
  const [round, setRound] = useState(0)
  const start = useMemo(() => {
    for (;;) {
      const s = phaseStarts(applyAlg(SOLVED, scramble(25)))[phase]
      if (!phaseDone(phase, s)) return s
    }
  }, [phase, round]) // eslint-disable-line react-hooks/exhaustive-deps
  return <Exercise key={`${phase}-${round}`} {...{ lang, phase, start, onSolved }} speed={settings.speed} onAgain={() => setRound((r) => r + 1)} />
}

function Exercise({ lang, phase, start, speed, onSolved, onAgain }: { lang: Lang; phase: PhaseId; start: string; speed: number; onSolved?: () => void; onAgain: () => void }) {
  const player = useCubePlayer(start)
  const [hint, setHint] = useState<Move | null>(null)
  const [viewKey, setViewKey] = useState(0)
  const solved = player.idle && phaseDone(phase, player.cube)
  useEffect(() => { if (solved) onSolved?.() }, [solved]) // eslint-disable-line react-hooks/exhaustive-deps

  const move = useCallback((m: Move) => {
    setHint(null)
    player.enqueue([m], Math.max(200, speed * 0.6))
  }, [player, speed])
  const help = () => {
    const first = solveBeginner(player.cube).flatMap((p) => p.steps.flatMap((s) => s.moves))[0]
    setHint(first ?? null)
  }
  return (
    <div style={{ display: 'grid', gap: 10 }}>
      <div className="stage">
        <CubeView cube={player.cube} current={player.current} onDone={player.done} pending={hint} viewKey={viewKey} />
      </div>
      {solved ? (
        <p className="status ok" role="status">{t('exerciseDone', lang)}</p>
      ) : (
        <p className="muted" aria-live="polite">{hint ? `${t('tryThis', lang)} ${hint} · ${describeMove(hint, lang)}` : t('exerciseHint', lang)}</p>
      )}
      <MovePad lang={lang} onMove={move} disabled={solved} />
      <div className="row">
        <button type="button" className="btn" onClick={help} disabled={solved || !player.idle}>{t('help', lang)}</button>
        <button type="button" className="btn" onClick={() => setViewKey((k) => k + 1)}>{t('standardView', lang)}</button>
        <button type="button" className="btn" onClick={onAgain}>{t('newExercise', lang)}</button>
      </div>
    </div>
  )
}
