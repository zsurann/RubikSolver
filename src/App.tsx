import { useEffect, useState, type ReactNode } from 'react'
import { Home } from './app/Home'
import { SettingsScreen } from './app/SettingsScreen'
import { SettingsProvider, useSettings } from './app/settings'
import { Welcome } from './app/Welcome'
import { CubeDemo } from './cube3d/CubeDemo'
import { t } from './i18n'
import { ScanDemo } from './scan/ScanDemo'
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
    '#cubo': () => <CubeDemo />,
    '#scansione': () => <ScanDemo />,
  }
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
      <Router />
    </SettingsProvider>
  )
}
