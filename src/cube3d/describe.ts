import type { Move } from '../cube/cube'
import { t, type Key, type Lang } from '../i18n'

/** Frase semplice per una mossa, es. "R'" → "Destra giù". */
export function describeMove(m: Move, lang: Lang): string {
  const key = `move${m[0]}${m.endsWith("'") ? 'p' : ''}` as Key
  return m.includes('2') ? `${t(key, lang)}, ${t('twice', lang)}` : t(key, lang)
}
