import { lazy, Suspense, useEffect, useState, type ReactNode } from 'react'
import { Home } from './app/Home'
import { Privacy, Terms } from './app/Legal'
import { SettingsScreen } from './app/SettingsScreen'
import { ProgressProvider } from './app/progress'
import { SettingsProvider, useSettings } from './app/settings'
import { t } from './i18n'

// Le pagine con il cubo 3D e l'account si caricano solo quando servono (home leggera).
const SolveMine = lazy(() => import('./solve/SolveMine').then((m) => ({ default: m.SolveMine })))
const Learn = lazy(() => import('./learn/Learn').then((m) => ({ default: m.Learn })))
const Practice = lazy(() => import('./practice/Practice').then((m) => ({ default: m.Practice })))
const Account = lazy(() => import('./app/Account').then((m) => ({ default: m.Account })))
const NewPassword = lazy(() => import('./app/Account').then((m) => ({ default: m.NewPassword })))
const Welcome = lazy(() => import('./app/Welcome').then((m) => ({ default: m.Welcome })))

function useHash() {
  const [hash, setHash] = useState(location.hash)
  useEffect(() => {
    const on = () => {
      setHash(location.hash)
      scrollTo(0, 0)
    }
    addEventListener('hashchange', on)
    return () => removeEventListener('hashchange', on)
  }, [])
  return hash
}

function Router() {
  const hash = useHash()
  const { settings, update } = useSettings()
  const lang = settings.lang
  useEffect(() => { document.documentElement.lang = lang }, [lang])

  if (!settings.welcomed && !hash) return <Suspense fallback={null}><Welcome lang={lang} onDone={() => update({ welcomed: true })} /></Suspense>
  const pages: Record<string, () => ReactNode> = {
    '#risolvi': () => <SolveMine lang={lang} />,
    '#impostazioni': () => <SettingsScreen />,
    '#pratica': () => <Practice lang={lang} />,
    '#account': () => <Account lang={lang} />,
    '#nuova-password': () => <NewPassword lang={lang} />,
    '#privacy': () => <Privacy lang={lang} />,
    '#termini': () => <Terms lang={lang} />,
  }
  if (hash.startsWith('#impara')) pages[hash] = () => <Learn lang={lang} id={hash.slice('#impara-'.length) || undefined} />
  const page = pages[hash]
  if (!page) return <Home lang={lang} />
  return (
    <>
      <div className="page" style={{ paddingBottom: 0 }}>
        <div className="topbar">
          <a href="#">← {t('home', lang)}</a>
          <span className="muted">{t('appName', lang)}</span>
        </div>
      </div>
      <Suspense fallback={<p className="page muted">…</p>}>{page()}</Suspense>
    </>
  )
}

export default function App() {
  return (
    <SettingsProvider>
      <ProgressProvider>
        <Router />
      </ProgressProvider>
    </SettingsProvider>
  )
}
