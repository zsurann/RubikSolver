// Worker: API di account e progressi (/api/*) + file statici dell'app.
import { createAuth, type Env } from './auth'

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } })

const MAX_PROGRESS_BYTES = 200_000

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)
    if (!url.pathname.startsWith('/api/')) return env.ASSETS.fetch(request)

    const auth = createAuth(env)
    if (url.pathname.startsWith('/api/auth/')) return auth.handler(request)

    const session = await auth.api.getSession({ headers: request.headers })
    if (!session) return json({ error: 'not_logged_in' }, 401)
    const userId = session.user.id

    if (url.pathname === '/api/progress') {
      if (request.method === 'GET') {
        const row = await env.DB.prepare('SELECT data, updated_at FROM progress WHERE user_id = ?').bind(userId).first<{ data: string; updated_at: string }>()
        return json(row ? { progress: JSON.parse(row.data), updatedAt: row.updated_at } : { progress: null })
      }
      if (request.method === 'PUT') {
        const body = await request.text()
        if (body.length > MAX_PROGRESS_BYTES) return json({ error: 'too_large' }, 413)
        let data: { updatedAt?: unknown }
        try { data = JSON.parse(body) } catch { return json({ error: 'bad_json' }, 400) }
        if (typeof data !== 'object' || data === null || Array.isArray(data)) return json({ error: 'bad_json' }, 400)
        const updatedAt = typeof data.updatedAt === 'string' ? data.updatedAt : new Date().toISOString()
        await env.DB.prepare(
          'INSERT INTO progress (user_id, data, updated_at) VALUES (?, ?, ?) ON CONFLICT(user_id) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at',
        ).bind(userId, body, updatedAt).run()
        return json({ ok: true })
      }
      if (request.method === 'DELETE') {
        await env.DB.prepare('DELETE FROM progress WHERE user_id = ?').bind(userId).run()
        return json({ ok: true })
      }
    }

    if (url.pathname === '/api/export' && request.method === 'GET') {
      const row = await env.DB.prepare('SELECT data FROM progress WHERE user_id = ?').bind(userId).first<{ data: string }>()
      const { id, name, email, createdAt } = session.user
      return new Response(JSON.stringify({ user: { id, name, email, createdAt }, progress: row ? JSON.parse(row.data) : null }, null, 2), {
        headers: { 'Content-Type': 'application/json', 'Content-Disposition': 'attachment; filename="cubo-facile-dati.json"' },
      })
    }

    if (url.pathname === '/api/account' && request.method === 'DELETE') {
      // prima i progressi, poi utente, sessioni e account collegati (cancellazione completa)
      await env.DB.batch([
        env.DB.prepare('DELETE FROM progress WHERE user_id = ?').bind(userId),
        env.DB.prepare('DELETE FROM session WHERE userId = ?').bind(userId),
        env.DB.prepare('DELETE FROM account WHERE userId = ?').bind(userId),
        env.DB.prepare('DELETE FROM verification WHERE identifier = ?').bind(session.user.email),
        env.DB.prepare('DELETE FROM user WHERE id = ?').bind(userId),
      ])
      return json({ ok: true }, 200)
    }

    return json({ error: 'not_found' }, 404)
  },
} satisfies ExportedHandler<Env>
