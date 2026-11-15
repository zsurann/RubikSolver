---
labels: [wayfinder:task]
status: open
assignee: utente
blocked_by: [26-task-inglese-accessibilita-privacy]
---
## Question

Rilascio pubblico: prova completa su telefono e desktop, correzioni, deploy di produzione su *.pages.dev, annuncio del link.

## Stato (2026-11-15)

Pronto da pubblicare; manca solo la parte che richiede l'account dell'utente.
Fatto: verifica completa sul Worker (`wrangler dev`, app + API insieme) a 390×844: `scripts/api-smoke.sh` ok; scansione con fotocamera finta → ritocco → metodo principianti → 143 mosse → "Cubo risolto!", scansione salvata nei progressi; 42 test, lint, typecheck, build e CI verdi. Pagine caricate a pezzi (home ~92 KB gzip, il 3D ~250 KB solo quando serve), favicon, README con la checklist.
Da fare dall'utente (checklist nel README, "Pubblicazione su Cloudflare"): `wrangler login`, D1 in UE, migrazione, segreti (`BETTER_AUTH_SECRET`, Resend, Google facoltativo), `BETTER_AUTH_URL`/`EMAIL_FROM` in `wrangler.jsonc`, titolare e contatto in `src/app/legal.ts`, `npm run deploy`; poi prova su un telefono vero (soprattutto la scansione con luce reale).
