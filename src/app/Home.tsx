import { t, type Key, type Lang } from '../i18n'

const MODES: { href: string; title: Key; text: Key; primary?: boolean }[] = [
  { href: '#risolvi', title: 'solveMine', text: 'solveMineText', primary: true },
  { href: '#impara', title: 'learn', text: 'learnText' },
  { href: '#pratica', title: 'practice', text: 'practiceText' },
]

export function Home({ lang }: { lang: Lang }) {
  return (
    <main className="page">
      <div className="topbar">
        <h1>{t('appName', lang)}</h1>
        <span className="row">
          <a href="#account" className="btn">{t('account', lang)}</a>
          <a href="#impostazioni" className="btn" aria-label={t('settings', lang)}>⚙</a>
        </span>
      </div>
      <p className="muted" style={{ fontSize: '1.1rem' }}>{t('tagline', lang)}</p>
      <nav style={{ display: 'grid', gap: 12 }}>
        {MODES.map((m) => (
          <a key={m.href} href={m.href} className={`card${m.primary ? ' home-primary' : ''}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <h2>{t(m.title, lang)}</h2>
            <p className="muted">{t(m.text, lang)}</p>
          </a>
        ))}
      </nav>
    </main>
  )
}
