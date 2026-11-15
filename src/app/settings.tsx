import { createContext, useContext, type ReactNode } from 'react'
import { detectLang, type Lang } from '../i18n'
import { useStored } from './store'

export type Settings = {
  lang: Lang
  /** durata di una mossa animata, in ms */
  speed: number
  arrows: boolean
  glow: boolean
  colorblind: boolean
  lightGraphics: boolean
  welcomed: boolean
}
export const DEFAULT_SETTINGS: Settings = {
  lang: detectLang(), speed: 650, arrows: true, glow: true, colorblind: false, lightGraphics: false, welcomed: false,
}

type Ctx = { settings: Settings; update: (patch: Partial<Settings>) => void }
const SettingsContext = createContext<Ctx | null>(null)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, set] = useStored('cubo-facile:settings', DEFAULT_SETTINGS)
  return <SettingsContext.Provider value={{ settings, update: (patch) => set((s) => ({ ...s, ...patch })) }}>{children}</SettingsContext.Provider>
}

/** Come useSettings, ma senza errore fuori dal provider (componenti riusabili come il cubo 3D). */
export const useSettingsOptional = () => useContext(SettingsContext)?.settings ?? DEFAULT_SETTINGS

export function useSettings() {
  const c = useContext(SettingsContext)
  if (!c) throw new Error('useSettings fuori da SettingsProvider')
  return c
}
