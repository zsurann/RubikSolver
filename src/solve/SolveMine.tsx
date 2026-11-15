import { useState } from 'react'
import { useProgress } from '../app/progress'
import type { Face, State } from '../cube/cube'
import { EditScreen } from '../edit/EditScreen'
import { EMPTY } from '../edit/diagnose'
import { t, type Lang } from '../i18n'
import type { ScanResult } from '../scan/assemble'
import { ScanScreen } from '../scan/ScanScreen'
import { solveBeginner } from '../solver/beginner'
import { solveMinimal } from '../solver/minimal'
import { Guide } from './Guide'
import { itemsFromMoves, itemsFromPhases, type GuidePhase, type Item } from './items'

type Step =
  | { kind: 'scan'; only?: Face; base?: ScanResult }
  | { kind: 'edit'; scan?: ScanResult; key: number }
  | { kind: 'choose'; state: State }
  | { kind: 'thinking' }
  | { kind: 'guide'; state: State; items: Item[]; phases: GuidePhase[]; key: number }

/** Modalità "Risolvi il mio": scansione → ritocco → scelta del metodo → guida mossa per mossa. */
export function SolveMine({ lang }: { lang: Lang }) {
  const [step, setStep] = useState<Step>({ kind: 'scan' })
  const rescan = () => setStep({ kind: 'scan' })
  const { update } = useProgress()

  switch (step.kind) {
    case 'scan':
      return (
        <ScanScreen
          lang={lang}
          only={step.only}
          base={step.base?.samples}
          onDone={(scan) => setStep({ kind: 'edit', scan, key: Date.now() })}
          onManual={() => setStep({ kind: 'edit', key: Date.now() })}
        />
      )
    case 'edit': {
      const scan = step.scan
      return (
        <EditScreen
          key={step.key}
          lang={lang}
          initial={scan?.state ?? EMPTY}
          uncertain={scan?.uncertain}
          onConfirm={(state) => {
            update((p) => ({ ...p, scans: [...p.scans, { state, at: new Date().toISOString() }].slice(-50) }))
            setStep({ kind: 'choose', state })
          }}
          onRescanFace={scan && ((only) => setStep({ kind: 'scan', only, base: scan }))}
        />
      )
    }
    case 'choose': {
      const state = step.state
      return (
        <section className="page">
          <h2 style={{ margin: 0 }}>{t('chooseTitle', lang)}</h2>
          <button type="button" className="btn" style={option} onClick={() => setStep({ kind: 'guide', state, ...itemsFromPhases(solveBeginner(state)), key: Date.now() })}>
            <b>{t('methodBeginner', lang)}</b>
            <span>{t('methodBeginnerText', lang)}</span>
          </button>
          <button
            type="button"
            style={option}
            onClick={() => {
              setStep({ kind: 'thinking' })
              solveMinimal(state).then((moves) => setStep({ kind: 'guide', state, ...itemsFromMoves(moves), key: Date.now() }))
            }}
          >
            <b>{t('methodShort', lang)}</b>
            <span>{t('methodShortText', lang)}</span>
          </button>
        </section>
      )
    }
    case 'thinking':
      return <p className="page" style={{ textAlign: 'center' }}>{t('thinking', lang)}</p>
    case 'guide':
      return <Guide key={step.key} lang={lang} start={step.state} items={step.items} phases={step.phases} onLost={rescan} onRestart={rescan} />
  }
}

const option = { display: 'grid', gap: 4, textAlign: 'left', padding: 16, borderRadius: 14, border: '1px solid var(--line)', background: 'var(--surface)', color: 'inherit', font: 'inherit', cursor: 'pointer' } as const
