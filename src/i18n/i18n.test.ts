import { describe, expect, it as test } from 'vitest'
import { en } from './en'
import { detectLang, t } from './index'
import { it } from './it'

describe('i18n', () => {
  test('stesse chiavi in IT ed EN, nessun testo vuoto', () => {
    expect(Object.keys(en).sort()).toEqual(Object.keys(it).sort())
    for (const v of [...Object.values(it), ...Object.values(en)]) expect(v.trim()).not.toBe('')
  })
  test('lingua: inglese solo se il browser è in inglese', () => {
    expect(detectLang('en-US')).toBe('en')
    expect(detectLang('it-IT')).toBe('it')
    expect(detectLang('fr-FR')).toBe('it')
    expect(t('learn', 'en')).toBe('Learn')
  })
})
