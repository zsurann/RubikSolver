import { t } from '../i18n'
import { useSettings } from './settings'

export function SettingsScreen() {
  const { settings: s, update } = useSettings()
  const lang = s.lang
  const toggle = (k: 'arrows' | 'glow' | 'colorblind' | 'lightGraphics', label: string) => (
    <label className="row" style={{ justifyContent: 'space-between' }}>
      {label}
      <input type="checkbox" checked={s[k]} onChange={(e) => update({ [k]: e.target.checked })} style={{ width: 22, height: 22, accentColor: 'var(--accent)' }} />
    </label>
  )
  return (
    <section className="page">
      <h2>{t('settings', lang)}</h2>
      <div className="card">
        <label className="row" style={{ justifyContent: 'space-between' }}>
          {t('language', lang)}
          <select value={s.lang} onChange={(e) => update({ lang: e.target.value as 'it' | 'en' })} className="btn">
            <option value="it">Italiano</option>
            <option value="en">English</option>
          </select>
        </label>
        <label style={{ display: 'grid', gap: 4 }}>
          {t('animationSpeed', lang)}: {s.speed} ms
          <input type="range" min={300} max={1200} step={50} value={s.speed} onChange={(e) => update({ speed: +e.target.value })} style={{ accentColor: 'var(--accent)' }} />
        </label>
      </div>
      <div className="card">
        {toggle('arrows', t('optArrows', lang))}
        {toggle('glow', t('optGlow', lang))}
        {toggle('colorblind', t('optColorblind', lang))}
        {toggle('lightGraphics', t('optLightGraphics', lang))}
      </div>
      <button type="button" className="btn" onClick={() => update({ welcomed: false })}>{t('showWelcome', lang)}</button>
    </section>
  )
}
