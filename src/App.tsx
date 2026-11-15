import { useEffect, useState, type ReactNode } from 'react'
import { Account, NewPassword } from './app/Account'
import { Home } from './app/Home'
import { Privacy, Terms } from './app/Legal'
import { SettingsScreen } from './app/SettingsScreen'
import { ProgressProvider } from './app/progress'
import { SettingsProvider, useSettings } from './app/settings'
import { Welcome } from './app/Welcome'
import { t } from './i18n'
import { Learn } from './learn/Learn'
import { Practice } from './practice/Practice'
import { SolveMine } from './solve/SolveMine'

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

  if (!settings.welcomed && !hash) return <Welcome lang={lang} onDone={() => update({ welcomed: true })} />
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
      {page()}
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
