import type { Face } from './cube'

/** Colori dell'app: giallo in alto, rosso davanti (stile Classico). '?' = non ancora colorato. */
export const STICKER_HEX: Record<Face | '?', string> = {
  U: '#ffd500', D: '#ffffff', F: '#c41e3a', B: '#ff5800', R: '#009e60', L: '#0051ba', '?': '#7c8494',
}
/** Chiave i18n del nome del colore di ogni faccia. */
export const COLOR_KEY = { U: 'yellow', D: 'white', F: 'red', B: 'orange', R: 'green', L: 'blue' } as const satisfies Record<Face, string>
