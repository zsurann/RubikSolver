---
labels: [wayfinder:research]
status: closed
assignee: claude
blocked_by: []
---
## Question

Quale backend per account cloud e progressi utente in una web app piccola? Confronta Supabase, Firebase, Cloudflare (D1 + Workers + auth) e simili: login (email, Google), costo a zero/basso traffico, facilità, obblighi GDPR per utenti UE. Raccomanda un'opzione.

## Resolution

Supabase Free, regione eu-central-1 (Frankfurt), frontend statico ospitato a parte. Limiti: pausa dopo 7 giorni di inattività, SMTP integrato a 2 email/ora (in produzione serve Resend/Brevo). Alternativa: Cloudflare Workers + D1 (EU) + better-auth. Scartato Firebase (residenza UE dei dati auth non documentata).

Dettaglio: branch `research/backend-account`, file `.scratch/rubik-app/research/04-backend-account.md`.
