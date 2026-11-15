import { en } from './en'
import { it } from './it'

// shortcut: dizionario piatto senza plurali/interpolazione; passare a react-i18next se servono.
export type Lang = 'it' | 'en'
export type Key = keyof typeof it
const dict = { it, en }

export const detectLang = (nav = typeof navigator === 'undefined' ? 'it' : navigator.language): Lang =>
  nav.toLowerCase().startsWith('en') ? 'en' : 'it'

export const t = (key: Key, lang: Lang = detectLang()) => dict[lang][key]
