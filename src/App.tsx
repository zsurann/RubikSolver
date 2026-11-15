import { useEffect, useState } from 'react'
import { CubeDemo } from './cube3d/CubeDemo'
import { detectLang, t } from './i18n'
import { ScanDemo } from './scan/ScanDemo'
import { SolveMine } from './solve/SolveMine'

const lang = detectLang()

export default function App() {
  const [hash, setHash] = useState(location.hash)
  useEffect(() => {
    const on = () => setHash(location.hash)
    addEventListener('hashchange', on)
    return () => removeEventListener('hashchange', on)
  }, [])
  if (hash === '#cubo') return <CubeDemo />
  if (hash === '#scansione') return <ScanDemo />
  if (hash === '#risolvi') return <SolveMine lang={lang} />
  return (
    <main style={{ padding: 'max(24px, env(safe-area-inset-top)) 16px', maxWidth: 560, margin: '0 auto' }}>
      <h1>{t('appName', lang)}</h1>
      <p style={{ color: 'var(--muted)' }}>{t('tagline', lang)}</p>
      <nav style={{ display: 'grid', gap: 12 }}>
        <button type="button" disabled style={{ padding: 16, fontSize: 18, borderRadius: 14 }}>{t('learn', lang)}</button>
        <a href="#risolvi" style={{ padding: 16, fontSize: 18, borderRadius: 14, textAlign: 'center', background: 'var(--accent)', color: '#fff', textDecoration: 'none' }}>{t('solveMine', lang)}</a>
        <button type="button" disabled style={{ padding: 16, fontSize: 18, borderRadius: 14 }}>{t('practice', lang)}</button>
      </nav>
    </main>
  )
}
