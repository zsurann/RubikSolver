import { t, type Lang } from '../i18n'
import { PRIVACY, TERMS, UPDATED } from './legal'

export function Privacy({ lang }: { lang: Lang }) {
  return (
    <article className="page">
      <h2>{t('privacy', lang)}</h2>
      {PRIVACY[lang].map((s) => (
        <section key={s.h} style={{ display: 'grid', gap: 6 }}>
          <h3>{s.h}</h3>
          {s.p.map((p) => <p key={p}>{p}</p>)}
        </section>
      ))}
      <p className="muted"><small>{t('updatedOn', lang)} {UPDATED}</small></p>
    </article>
  )
}

export function Terms({ lang }: { lang: Lang }) {
  return (
    <article className="page">
      <h2>{t('terms', lang)}</h2>
      {TERMS[lang].map((p) => <p key={p}>{p}</p>)}
      <p className="muted"><small>{t('updatedOn', lang)} {UPDATED}</small></p>
    </article>
  )
}
