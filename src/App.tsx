import { detectLang, t } from './i18n'

const lang = detectLang()

export default function App() {
  return (
    <main style={{ padding: 'max(24px, env(safe-area-inset-top)) 16px', maxWidth: 560, margin: '0 auto' }}>
      <h1>{t('appName', lang)}</h1>
      <p style={{ color: 'var(--muted)' }}>{t('tagline', lang)}</p>
      <nav style={{ display: 'grid', gap: 12 }}>
        {(['learn', 'solveMine', 'practice'] as const).map((k) => (
          <button key={k} type="button" disabled style={{ padding: 16, fontSize: 18, borderRadius: 14 }}>
            {t(k, lang)}
          </button>
        ))}
      </nav>
    </main>
  )
}
