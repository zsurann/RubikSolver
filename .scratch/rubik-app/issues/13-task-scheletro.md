---
labels: [wayfinder:task]
status: closed
assignee: claude
blocked_by: []
---
## Question

Scheletro del progetto: React + TypeScript + Vite, Vitest, lint, struttura cartelle, i18n già predisposto (IT ora, chiavi pronte per EN), CI su GitHub che fa build e test, deploy di anteprima su Cloudflare Pages (*.pages.dev).

## Resolution

Fatto. React 19 + TypeScript + Vite 8, Vitest, oxlint, mini i18n IT/EN (`src/i18n`, con test sulle chiavi), home provvisoria con le tre modalità, CI GitHub Actions (lint, test, build). Nome dell'app: Cubo Facile (EN Easy Cube). Creato `main` (commit iniziale vuoto); PR in bozza: https://github.com/zsurann/RubikSolver/pull/1.
Da fare a mano dall'utente: collegare il repo a Cloudflare Pages (passi nel README) per le anteprime *.pages.dev.
