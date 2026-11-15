import { useState } from 'react'
import type { Face, State } from '../cube/cube'
import { CubeView } from '../cube3d/CubeView'
import { EditScreen } from '../edit/EditScreen'
import { EMPTY } from '../edit/diagnose'
import { detectLang } from '../i18n'
import type { ScanResult } from './assemble'
import { ScanScreen } from './ScanScreen'

// Pagina di prova (#scansione): scansione → ritocco → stato confermato. Il flusso vero è in "Risolvi il mio".
const lang = detectLang()
type Step =
  | { kind: 'scan'; only?: Face; base?: ScanResult }
  | { kind: 'edit'; scan?: ScanResult; key: number }
  | { kind: 'done'; state: State }

export function ScanDemo() {
  const [step, setStep] = useState<Step>({ kind: 'scan' })
  if (step.kind === 'scan')
    return (
      <ScanScreen
        lang={lang}
        only={step.only}
        base={step.base?.samples}
        onDone={(scan) => setStep({ kind: 'edit', scan, key: Date.now() })}
        onManual={() => setStep({ kind: 'edit', key: Date.now() })}
      />
    )
  if (step.kind === 'edit') {
    const scan = step.scan
    return (
      <EditScreen
        key={step.key}
        lang={lang}
        initial={scan?.state ?? EMPTY}
        uncertain={scan?.uncertain}
        onConfirm={(state) => setStep({ kind: 'done', state })}
        onRescanFace={scan && ((only) => setStep({ kind: 'scan', only, base: scan }))}
      />
    )
  }
  return (
    <main style={{ padding: 16, display: 'grid', gap: 8, maxWidth: 520, margin: '0 auto' }}>
      <div style={{ aspectRatio: '1', borderRadius: 18, background: 'radial-gradient(120% 90% at 50% 35%, #fff 0%, #cfd4dc 80%)' }}>
        <CubeView cube={step.state} current={null} onDone={() => {}} />
      </div>
      <code style={{ wordBreak: 'break-all' }}>{step.state}</code>
      <button type="button" onClick={() => setStep({ kind: 'scan' })}>Rifai</button>
    </main>
  )
}
