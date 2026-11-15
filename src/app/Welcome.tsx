import { useState } from 'react'
import { SOLVED } from '../cube/cube'
import { CubeView } from '../cube3d/CubeView'
import { useCubePlayer } from '../cube3d/player'
import { t, type Key, type Lang } from '../i18n'

const SLIDES: { title: Key; text: Key; demo: string }[] = [
  { title: 'welcome1Title', text: 'welcome1Text', demo: "R U R' U'" },
  { title: 'welcome2Title', text: 'welcome2Text', demo: 'R L U D F B' },
  { title: 'welcome3Title', text: 'welcome3Text', demo: "F R U R' U' F'" },
]

/** Benvenuto breve, mostrato solo la prima volta (saltabile). */
export function Welcome({ lang, onDone }: { lang: Lang; onDone: () => void }) {
  const [i, setI] = useState(0)
  const player = useCubePlayer(SOLVED)
  const s = SLIDES[i]
  return (
    <main className="page" style={{ minHeight: '100dvh', alignContent: 'center' }}>
      <div className="stage" style={{ aspectRatio: '1' }}>
        <CubeView cube={player.cube} current={player.current} onDone={player.done} arrows={false} glow={false} />
      </div>
      <h1>{t(s.title, lang)}</h1>
      <p className="muted" style={{ fontSize: '1.1rem' }}>{t(s.text, lang)}</p>
      <div className="row">
        <button type="button" className="btn" onClick={() => player.enqueue(s.demo.split(' '), 500)} disabled={!player.idle}>
          {t('welcomeTry', lang)}
        </button>
      </div>
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <button type="button" className="btn" onClick={onDone}>{t('skip', lang)}</button>
        <span className="muted" aria-label={`${i + 1} / 3`}>{['●○○', '○●○', '○○●'][i]}</span>
        <button type="button" className="btn btn-primary" onClick={() => {
          player.reset(SOLVED)
          if (i < 2) setI(i + 1)
          else onDone()
        }}>
          {i < 2 ? t('continue', lang) : t('letsStart', lang)}
        </button>
      </div>
    </main>
  )
}
