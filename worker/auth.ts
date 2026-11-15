import { betterAuth } from 'better-auth'
import { magicLink } from 'better-auth/plugins'

export type Env = {
  DB: D1Database
  ASSETS: Fetcher
  BETTER_AUTH_SECRET: string
  BETTER_AUTH_URL: string
  GOOGLE_CLIENT_ID?: string
  GOOGLE_CLIENT_SECRET?: string
  RESEND_API_KEY?: string
  EMAIL_FROM: string
}

/** Invia un'email con Resend; senza chiave (sviluppo locale) la scrive nel log. */
export async function sendEmail(env: Env, to: string, subject: string, text: string) {
  if (!env.RESEND_API_KEY) {
    console.log(`[email a ${to}] ${subject}\n${text}`)
    return
  }
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: env.EMAIL_FROM, to, subject, text }),
  })
  if (!res.ok) throw new Error(`Invio email fallito: ${res.status}`)
}

export function createAuth(env: Env) {
  return betterAuth({
    database: env.DB,
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL,
    basePath: '/api/auth',
    emailAndPassword: {
      enabled: true,
      minPasswordLength: 8,
      sendResetPassword: async ({ user, url }) =>
        sendEmail(env, user.email, 'Cubo Facile: nuova password', `Per scegliere una nuova password apri questo link:\n${url}\n\nSe non l'hai chiesto tu, ignora questa email.`),
    },
    socialProviders:
      env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET
        ? { google: { clientId: env.GOOGLE_CLIENT_ID, clientSecret: env.GOOGLE_CLIENT_SECRET } }
        : {},
    user: { deleteUser: { enabled: true } },
    plugins: [
      magicLink({
        sendMagicLink: async ({ email, url }) =>
          sendEmail(env, email, 'Cubo Facile: il tuo link di accesso', `Per entrare in Cubo Facile apri questo link (vale 5 minuti):\n${url}\n\nSe non l'hai chiesto tu, ignora questa email.`),
      }),
    ],
  })
}
