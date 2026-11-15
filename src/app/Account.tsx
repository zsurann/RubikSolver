import { useState, type FormEvent } from 'react'
import { t, type Key, type Lang } from '../i18n'
import { authClient } from './auth'
import { EMPTY_PROGRESS, useProgress } from './progress'

const ERRORS: Record<string, Key> = {
  INVALID_EMAIL_OR_PASSWORD: 'errInvalidLogin',
  USER_ALREADY_EXISTS: 'errUserExists',
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: 'errUserExists',
  PASSWORD_TOO_SHORT: 'errPasswordShort',
  INVALID_EMAIL: 'errInvalidEmail',
  INVALID_TOKEN: 'errInvalidToken',
}
const errorText = (code: string | undefined, lang: Lang) => t(ERRORS[code ?? ''] ?? 'accountError', lang)

/** Account facoltativo: accesso, sincronizzazione, esportazione e cancellazione dei dati. */
export function Account({ lang }: { lang: Lang }) {
  const { data: session, isPending } = authClient.useSession()
  if (isPending) return <p className="page muted">…</p>
  return session ? <LoggedIn lang={lang} email={session.user.email} /> : <SignIn lang={lang} />
}

function SignIn({ lang }: { lang: Lang }) {
  const [adult, setAdult] = useState(false)
  const [mode, setMode] = useState<'login' | 'signup' | 'link' | 'reset'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)
  const [busy, setBusy] = useState(false)

  const run = async (fn: () => Promise<{ error?: { message?: string; code?: string } | null }>, okText?: string) => {
    setBusy(true); setMsg(null)
    try {
      const r = await fn()
      if (r.error) setMsg({ ok: false, text: errorText(r.error.code, lang) })
      else if (okText) setMsg({ ok: true, text: okText })
    } catch {
      setMsg({ ok: false, text: t('accountOffline', lang) })
    } finally {
      setBusy(false)
    }
  }
  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (mode === 'login') run(() => authClient.signIn.email({ email, password }))
    if (mode === 'signup') run(() => authClient.signUp.email({ email, password, name: email.split('@')[0] }))
    if (mode === 'link') run(() => authClient.signIn.magicLink({ email, callbackURL: '/#account' }), t('accountLinkSent', lang))
    if (mode === 'reset') run(() => authClient.requestPasswordReset({ email, redirectTo: '/#nuova-password' }), t('accountResetSent', lang))
  }
  const locked = !adult && mode !== 'login' && mode !== 'reset'

  return (
    <section className="page">
      <h2>{t('account', lang)}</h2>
      <p className="muted">{t('accountWhy', lang)}</p>
      <label className="card" style={{ gridTemplateColumns: 'auto 1fr', alignItems: 'center' }}>
        <input type="checkbox" checked={adult} onChange={(e) => setAdult(e.target.checked)} style={{ width: 22, height: 22, accentColor: 'var(--accent)' }} />
        <span>{t('accountAge', lang)}</span>
      </label>
      <button type="button" className="btn btn-big" disabled={!adult || busy} onClick={() => run(() => authClient.signIn.social({ provider: 'google', callbackURL: '/#account' }))}>
        {t('accountGoogle', lang)}
      </button>
      <div role="tablist" className="row">
        {(['login', 'signup', 'link'] as const).map((m) => (
          <button key={m} type="button" role="tab" aria-selected={mode === m} className={`btn${mode === m ? ' btn-primary' : ''}`} onClick={() => { setMode(m); setMsg(null) }}>
            {t(m === 'login' ? 'accountLogin' : m === 'signup' ? 'accountSignup' : 'accountMagic', lang)}
          </button>
        ))}
      </div>
      <form className="card" onSubmit={submit}>
        <label style={{ display: 'grid', gap: 4 }}>
          {t('accountEmail', lang)}
          <input id="account-email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="btn" style={{ fontWeight: 400, justifyContent: 'start' }} />
        </label>
        {(mode === 'login' || mode === 'signup') && (
          <label style={{ display: 'grid', gap: 4 }}>
            {t('accountPassword', lang)}
            <input id="account-password" type="password" required minLength={8} autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} value={password} onChange={(e) => setPassword(e.target.value)} className="btn" style={{ fontWeight: 400 }} />
          </label>
        )}
        <button type="submit" className="btn btn-primary" disabled={busy || locked}>
          {t(mode === 'login' ? 'accountLogin' : mode === 'signup' ? 'accountSignup' : mode === 'link' ? 'accountSendLink' : 'accountSendReset', lang)}
        </button>
        {locked && <small className="muted">{t('accountAgeNeeded', lang)}</small>}
        {mode === 'login' && <button type="button" className="btn" onClick={() => setMode('reset')}>{t('accountForgot', lang)}</button>}
      </form>
      {msg && <p role="status" className={`status${msg.ok ? ' ok' : ''}`}>{msg.text}</p>}
      <p className="muted"><small>{t('accountUnder14', lang)}</small></p>
      <a href="#privacy" className="muted">{t('privacy', lang)}</a>
    </section>
  )
}

function LoggedIn({ lang, email }: { lang: Lang; email: string }) {
  const { sync, replace } = useProgress()
  const [confirm, setConfirm] = useState<'reset' | 'delete' | null>(null)
  const [msg, setMsg] = useState<string | null>(null)
  const call = (method: string, path: string) => fetch(path, { method, credentials: 'include' }).then((r) => { if (!r.ok) throw new Error(String(r.status)) })
  const syncText = { guest: '', syncing: t('syncing', lang), synced: t('synced', lang), offline: t('syncOffline', lang) }[sync]
  return (
    <section className="page">
      <h2>{t('account', lang)}</h2>
      <div className="card">
        <p>{t('accountSignedInAs', lang)} <b>{email}</b></p>
        <p className="muted" role="status">{syncText}</p>
      </div>
      <a className="btn" href="/api/export" download>{t('accountExport', lang)}</a>
      {confirm === null && (
        <>
          <button type="button" className="btn" onClick={() => setConfirm('reset')}>{t('accountReset', lang)}</button>
          <button type="button" className="btn" onClick={() => setConfirm('delete')}>{t('accountDelete', lang)}</button>
          <button type="button" className="btn" onClick={() => authClient.signOut()}>{t('accountLogout', lang)}</button>
        </>
      )}
      {confirm && (
        <div className="card" style={{ borderColor: 'var(--accent)' }}>
          <p>{t(confirm === 'reset' ? 'accountResetConfirm' : 'accountDeleteConfirm', lang)}</p>
          <div className="row">
            <button type="button" className="btn" onClick={() => setConfirm(null)}>{t('cancel', lang)}</button>
            <button type="button" className="btn btn-primary" onClick={async () => {
              try {
                if (confirm === 'reset') {
                  replace({ ...EMPTY_PROGRESS, updatedAt: new Date().toISOString() })
                  setMsg(t('accountResetDone', lang))
                } else {
                  await call('DELETE', '/api/account')
                  replace(EMPTY_PROGRESS)
                  await authClient.signOut().catch(() => {})
                  location.hash = '#'
                  location.reload()
                }
              } catch {
                setMsg(t('accountOffline', lang))
              }
              setConfirm(null)
            }}>
              {t(confirm === 'reset' ? 'accountReset' : 'accountDelete', lang)}
            </button>
          </div>
        </div>
      )}
      {msg && <p role="status" className="status ok">{msg}</p>}
    </section>
  )
}

/** Pagina del link "nuova password" (token nell'indirizzo). */
export function NewPassword({ lang }: { lang: Lang }) {
  const token = new URLSearchParams(location.search).get('token') ?? ''
  const [pw, setPw] = useState('')
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)
  return (
    <form className="page" onSubmit={async (e) => {
      e.preventDefault()
      const r = await authClient.resetPassword({ newPassword: pw, token }).catch(() => ({ error: { message: t('accountOffline', lang) } }))
      setMsg(r.error ? { ok: false, text: errorText((r.error as { code?: string }).code, lang) } : { ok: true, text: t('accountPasswordChanged', lang) })
    }}>
      <h2>{t('accountNewPassword', lang)}</h2>
      <input id="new-password" type="password" required minLength={8} autoComplete="new-password" value={pw} onChange={(e) => setPw(e.target.value)} className="btn" />
      <button type="submit" className="btn btn-primary" disabled={!token}>{t('accountSave', lang)}</button>
      {msg && <p role="status" className={`status${msg.ok ? ' ok' : ''}`}>{msg.text}{msg.ok && <> · <a href="/#account">{t('accountLogin', lang)}</a></>}</p>}
    </form>
  )
}
