# Cubo Facile

Web app che insegna a risolvere il cubo di Rubik 3x3 a chi parte da zero. Mappa del progetto: `.scratch/rubik-app/map.md`.

## Sviluppo

```sh
npm install
npm run dev      # server locale
npm test         # test (Vitest)
npm run lint     # oxlint
npm run build    # build in dist/
```

## Backend (account e progressi)

Un unico Worker Cloudflare serve l'app (`dist/`) e l'API `/api/*` (better-auth + D1). In locale:

```sh
cp .dev.vars.example .dev.vars     # e metti un BETTER_AUTH_SECRET casuale
npm run db:migrate:local
npm run dev:worker                 # http://localhost:8787 (le email finiscono nel log)
scripts/api-smoke.sh               # prova veloce dell'API
```

## Pubblicazione su Cloudflare (una volta)

1. `npx wrangler login`
2. `npx wrangler d1 create cubo-facile --jurisdiction eu` e copia il `database_id` in `wrangler.jsonc`.
3. `npm run db:migrate`
4. Segreti: `npx wrangler secret put BETTER_AUTH_SECRET` (32+ caratteri casuali), e se li usi `RESEND_API_KEY`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`.
5. In `wrangler.jsonc` imposta `BETTER_AUTH_URL` all'indirizzo pubblico (es. `https://cubo-facile.<tuo-account>.workers.dev`) ed `EMAIL_FROM` a un mittente verificato su Resend.
6. `npm run deploy`. Per i deploy automatici a ogni push: Cloudflare → Workers → cubo-facile → Settings → Builds → collega il repo (comando `npm run build`, deploy `npx wrangler deploy`).
7. Login con Google (facoltativo): crea un client OAuth su Google Cloud con redirect `https://<indirizzo>/api/auth/callback/google`.

## Licenze di terze parti

- [min2phase.js](https://github.com/cs0x7f/min2phase.js) di Chen Shuang: doppia licenza MIT o GPL-3.0; usato con licenza **MIT** (Copyright (c) 2023 Chen Shuang).
