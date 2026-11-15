import { useState } from 'react'
import { scramble, SOLVED } from '../cube/cube'
import { detectLang, t } from '../i18n'
import { CubeView } from './CubeView'
import { describeMove } from './describe'
import { useCubePlayer, useSequence } from './player'

// Pagina di prova del cubo 3D (#cubo): formule passo per passo, mosse libere, mescolata.
const ALGS = ["R U R' U'", "F R U R' U' F'", "R U R' U R U2 R' U", "U R U' R' U' F' U F"]
const lang = detectLang()

export function CubeDemo() {
  const [alg, setAlg] = useState(ALGS[0])
  const [ms, setMs] = useState(550)
  const [viewKey, setViewKey] = useState(0)
  const player = useCubePlayer(SOLVED)
  const seq = useSequence(alg, player.enqueue, player.idle, ms)

  return (
    <main style={{ display: 'grid', gap: 12, padding: 16, maxWidth: 900, margin: '0 auto' }}>
      <div style={{ position: 'relative', aspectRatio: '4 / 3.4', borderRadius: 18, overflow: 'hidden', background: 'radial-gradient(120% 90% at 50% 35%, #ffffff 0%, #cfd4dc 80%)' }}>
        <CubeView cube={player.cube} current={player.current} onDone={player.done} pending={seq.pending} viewKey={viewKey} label={t('dragHint', lang)} />
        <div style={{ position: 'absolute', left: 14, bottom: 12, background: 'rgba(10,14,22,.62)', color: '#fff', padding: '8px 14px', borderRadius: 14 }}>
          <b style={{ fontSize: 26, marginRight: 10 }}>{seq.pending ?? '✓'}</b>
          {seq.pending ? `${describeMove(seq.pending, lang)} · ${seq.idx + 1} ${t('stepOf', lang)} ${seq.moves.length}` : t('formulaDone', lang)}
        </div>
      </div>
      <select value={alg} onChange={(e) => setAlg(e.target.value)} aria-label="Formula">
        {ALGS.map((a) => <option key={a}>{a}</option>)}
      </select>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button type="button" onClick={seq.back}>◀ {t('back', lang)}</button>
        <button type="button" onClick={seq.next}>{t('next', lang)} ▶</button>
        <button type="button" onClick={() => seq.setPlaying(!seq.playing)}>{seq.playing ? t('pause', lang) : t('play', lang)}</button>
        <button type="button" onClick={() => player.enqueue(scramble(18), 160)}>{t('scramble', lang)}</button>
        <button type="button" onClick={() => { player.reset(SOLVED); seq.restart() }}>{t('resetCube', lang)}</button>
        <button type="button" onClick={() => setViewKey((k) => k + 1)}>{t('standardView', lang)}</button>
        <label>
          {ms} ms <input type="range" min={150} max={1400} step={50} value={ms} onChange={(e) => setMs(+e.target.value)} />
        </label>
      </div>
    </main>
  )
}
