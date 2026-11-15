import { useCallback, useEffect, useRef, useState } from 'react'
import { applyAlg, FACES, SOLVED, type Face } from '../cube/cube'
import { CubeView } from '../cube3d/CubeView'
import { useCubePlayer } from '../cube3d/player'
import { t, type Lang } from '../i18n'
import { assemble, type ScanResult } from './assemble'
import { deltaE2000, rgbToLab, type RGB } from './color'
import { SCAN_ORDER, TYPICAL } from './faces'
import { sampleGrid, type Cell } from './sample'

const STABLE_MS = 500
const STABLE_DE = 6 // variazione massima tra un frame e l'altro per dirlo "fermo"
const MAX_SPREAD = 28 // adesivi uniformi, non sfondo o mano

const nearest = (rgb: RGB): Face => {
  const lab = rgbToLab(rgb)
  return FACES.reduce((b, f) => (deltaE2000(lab, rgbToLab(TYPICAL[f])) < deltaE2000(lab, rgbToLab(TYPICAL[b])) ? f : b))
}
const COLOR_NAME: Record<Face, 'yellow' | 'white' | 'red' | 'orange' | 'green' | 'blue'> = {
  U: 'yellow', D: 'white', F: 'red', B: 'orange', R: 'green', L: 'blue',
}

type Props = { lang: Lang; onDone: (r: ScanResult) => void; onManual: () => void }
type Phase = { kind: 'starting' } | { kind: 'denied' } | { kind: 'turn'; step: number } | { kind: 'scan'; step: number } | { kind: 'wrongCenter'; step: number; seen: Face; cells: RGB[] }

export function ScanScreen({ lang, onDone, onManual }: Props) {
  const video = useRef<HTMLVideoElement>(null)
  const canvas = useRef<HTMLCanvasElement | null>(null)
  const [phase, setPhase] = useState<Phase>({ kind: 'starting' })
  const [live, setLive] = useState<Cell[]>([])
  const [faces, setFaces] = useState<Partial<Record<Face, RGB[]>>>({})
  const stable = useRef<{ since: number; labs: ReturnType<typeof rgbToLab>[] } | null>(null)

  // fotocamera
  useEffect(() => {
    let stream: MediaStream | null = null
    let cancelled = false
    navigator.mediaDevices?.getUserMedia({ video: { facingMode: 'environment', width: { ideal: 1280 } }, audio: false })
      .then((s) => {
        if (cancelled) return s.getTracks().forEach((tr) => tr.stop())
        stream = s
        video.current!.srcObject = s
        return video.current!.play().then(() => setPhase({ kind: 'scan', step: 0 }))
      })
      .catch(() => !cancelled && setPhase({ kind: 'denied' }))
    if (!navigator.mediaDevices) setTimeout(() => setPhase({ kind: 'denied' }))
    return () => { cancelled = true; stream?.getTracks().forEach((tr) => tr.stop()) }
  }, [])

  const capture = useCallback((step: number, cells: RGB[], force = false) => {
    const expected = SCAN_ORDER[step].face
    const seen = nearest(cells[4])
    if (!force && seen !== expected) return setPhase({ kind: 'wrongCenter', step, seen, cells })
    navigator.vibrate?.(40)
    const next = { ...faces, [expected]: cells }
    setFaces(next)
    stable.current = null
    if (step + 1 < SCAN_ORDER.length) setPhase({ kind: 'turn', step: step + 1 })
    else onDone(assemble(FACES.flatMap((f) => next[f]!)))
  }, [faces, onDone])

  // campionamento ~10 volte al secondo
  useEffect(() => {
    if (phase.kind !== 'scan') return
    const id = setInterval(() => {
      const v = video.current
      if (!v || !v.videoWidth) return
      const scale = 320 / Math.min(v.videoWidth, v.videoHeight)
      const w = Math.round(v.videoWidth * scale), h = Math.round(v.videoHeight * scale)
      const c = (canvas.current ??= document.createElement('canvas'))
      c.width = w; c.height = h
      const g = c.getContext('2d', { willReadFrequently: true })!
      g.drawImage(v, 0, 0, w, h)
      const side = Math.min(w, h), size = side * 0.7
      const cells = sampleGrid(g.getImageData(0, 0, w, h).data, w, (w - size) / 2, (h - size) / 2, size)
      setLive(cells)
      const labs = cells.map((x) => rgbToLab(x.rgb))
      const now = performance.now()
      const still = stable.current && labs.every((l, i) => deltaE2000(l, stable.current!.labs[i]) < STABLE_DE)
      const clean = cells.every((x) => x.spread < MAX_SPREAD)
      if (!still || !clean) stable.current = { since: now, labs }
      else if (now - stable.current!.since > STABLE_MS) capture(phase.step, cells.map((x) => x.rgb))
    }, 100)
    return () => clearInterval(id)
  }, [phase, capture])

  const step = 'step' in phase ? phase.step : 0
  const face = SCAN_ORDER[step].face

  if (phase.kind === 'denied')
    return (
      <section style={box}>
        <h2>{t('scanNoCameraTitle', lang)}</h2>
        <p>{t('scanNoCamera', lang)}</p>
        <button type="button" onClick={onManual}>{t('scanManual', lang)}</button>
      </section>
    )

  return (
    <section style={box}>
      <p style={{ fontWeight: 700, margin: 0 }}>
        {t('scanFace', lang)} {step + 1} {t('stepOf', lang)} 6 · {t('scanCenter', lang)} {t(COLOR_NAME[face], lang)}
      </p>
      <div style={{ position: 'relative', aspectRatio: '1', width: '100%', maxWidth: 480, margin: '0 auto', borderRadius: 18, overflow: 'hidden', background: '#111' }}>
        <video ref={video} playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: '15%', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }} aria-hidden>
          {Array.from({ length: 9 }, (_, i) => (
            <div key={i} style={{ border: '3px solid rgba(255,255,255,.85)', borderRadius: 10, boxShadow: live[i] ? `inset 0 0 0 6px rgb(${live[i].rgb.join(',')})` : undefined }} />
          ))}
        </div>
        {phase.kind === 'turn' && <TurnGuide step={phase.step} lang={lang} onReady={() => setPhase({ kind: 'scan', step: phase.step })} />}
        {phase.kind === 'wrongCenter' && (
          <div style={overlay}>
            <p>{t('scanWrongCenter', lang).replace('{expected}', t(COLOR_NAME[face], lang)).replace('{seen}', t(COLOR_NAME[phase.seen], lang))}</p>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
              <button type="button" onClick={() => { stable.current = null; setPhase({ kind: 'scan', step }) }}>{t('scanRetry', lang)}</button>
              <button type="button" onClick={() => capture(step, phase.cells, true)}>{t('scanKeep', lang)}</button>
            </div>
          </div>
        )}
      </div>
      <p style={{ color: 'var(--muted)', margin: 0 }}>{t('scanHint', lang)}</p>
      <button type="button" disabled={phase.kind !== 'scan' || live.length < 9} onClick={() => capture(step, live.map((x) => x.rgb))}>
        {t('scanCapture', lang)}
      </button>
    </section>
  )
}

/** Animazione 3D: come girare il cubo vero prima della prossima faccia. */
function TurnGuide({ step, lang, onReady }: { step: number; lang: Lang; onReady: () => void }) {
  const before = SCAN_ORDER.slice(0, step).flatMap((s) => s.turn)
  const player = useCubePlayer(applyAlg(SOLVED, before))
  const { enqueue, reset } = player
  const turn = SCAN_ORDER[step].turn
  useEffect(() => {
    const id = setInterval(() => { reset(applyAlg(SOLVED, before)); enqueue(turn, 900) }, 2600)
    enqueue(turn, 900)
    return () => clearInterval(id)
  }, [step]) // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div style={{ ...overlay, background: 'rgba(238,240,244,.96)', color: '#1b2230' }}>
      <p style={{ fontWeight: 700 }}>{t(step === 4 ? 'scanTurnUp' : step === 5 ? 'scanTurnDown' : 'scanTurnSide', lang)}</p>
      <div style={{ height: 'min(240px, 50vw)' }}>
        <CubeView cube={player.cube} current={player.current} onDone={player.done} arrows={false} glow={false} />
      </div>
      <button type="button" onClick={onReady}>{t('scanReady', lang)}</button>
    </div>
  )
}

const box = { display: 'grid', gap: 12, padding: 16, maxWidth: 520, margin: '0 auto' } as const
const overlay = { position: 'absolute', inset: 0, display: 'grid', alignContent: 'center', gap: 12, padding: 16, textAlign: 'center', background: 'rgba(10,14,22,.8)', color: '#fff' } as const
