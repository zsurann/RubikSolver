---
labels: [wayfinder:task]
status: closed
assignee: claude
blocked_by: [13-task-scheletro]
---
## Question

Backend su Cloudflare Workers + D1 (UE) + better-auth: login Google, email + password, link magico; scegliere e collegare il servizio email (Resend o Brevo); schema dati da [Cosa salva l'account](08-grilling-account.md); conferma 14+; API elimina/esporta/azzera.

## Resolution

Fatto. Un unico Worker Cloudflare (`wrangler.jsonc`) serve l'app statica `dist/` e l'API `/api/*` (al posto di Pages + Worker separati: stesso dominio, cookie semplici).
- `worker/auth.ts`: better-auth 1.7 con D1 nativo; email + password (min 8, recupero via email), link magico via email, Google se ci sono le credenziali; email con Resend (`RESEND_API_KEY`), senza chiave finiscono nel log (sviluppo).
- `worker/index.ts`: `GET/PUT/DELETE /api/progress` (JSON dei progressi, max 200 KB), `GET /api/export` (download JSON), `DELETE /api/account` (cancella progressi, sessioni, account collegati, utente).
- `migrations/0001_init.sql`: schema better-auth generato con `getMigrations` + tabella `progress`. D1 da creare con `--jurisdiction eu`.
- 14+: la conferma è nell'interfaccia di registrazione (ticket Sync progressi).
- Script: `dev:worker`, `db:migrate(:local)`, `deploy`, `typecheck:worker` (anche in CI); `scripts/api-smoke.sh`. README con la checklist di pubblicazione.
Verificato in locale con `wrangler dev` + D1 locale: registrazione, salvataggio e lettura progressi, export, link magico (email nel log), cancellazione account (dopo: 401 e login rifiutato).
Da fare dall'utente: account Cloudflare, `wrangler login`, D1, segreti, Resend e (facoltativo) Google OAuth.
