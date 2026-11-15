import { useState } from 'react'
import { CubeView } from '../cube3d/CubeView'
import { detectLang } from '../i18n'
import type { ScanResult } from './assemble'
import { ScanScreen } from './ScanScreen'

// Pagina di prova della scansione (#scansione). Il ritocco vero arriva con il ticket "Ritocco".
const lang = detectLang()

export function ScanDemo() {
  const [result, setResult] = useState<ScanResult | null>(null)
  const [manual, setManual] = useState(false)
  if (manual) return <p style={{ padding: 16 }}>Inserimento a mano: arriva con il ticket Ritocco.</p>
  if (!result) return <ScanScreen lang={lang} onDone={setResult} onManual={() => setManual(true)} />
  return (
    <main style={{ padding: 16, display: 'grid', gap: 8, maxWidth: 520, margin: '0 auto' }}>
      <div style={{ aspectRatio: '1', background: 'radial-gradient(120% 90% at 50% 35%, #fff 0%, #cfd4dc 80%)', borderRadius: 18 }}>
        <CubeView cube={result.state} current={null} onDone={() => {}} />
      </div>
      <code style={{ wordBreak: 'break-all' }}>{result.state}</code>
      <p>Verifica: {result.check.ok ? 'ok' : result.check.error} · incerti: {result.uncertain.length} · rotazioni: {JSON.stringify(result.rotations)}</p>
      <button type="button" onClick={() => setResult(null)}>Rifai</button>
    </main>
  )
}
