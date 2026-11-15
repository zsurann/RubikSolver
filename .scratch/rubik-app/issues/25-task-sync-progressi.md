---
labels: [wayfinder:task]
status: closed
assignee: claude
blocked_by: [20-task-risolvi-il-mio, 21-task-impara, 22-task-pratica, 23-task-backend-account, 24-task-home-navigazione]
---
## Question

Progressi: salvataggio locale da ospite, unione nell'account al primo login, sincronizzazione di lezioni, tempi, preferenze e cubi scansionati; invito a creare l'account dopo la prima lezione.

## Resolution

Fatto: `src/app/Account.tsx` (conferma "Ho almeno 14 anni" obbligatoria per creare l'account o usare Google; accesso con Google, email + password, link via email; password dimenticata → pagina `#nuova-password`; da connesso: stato della sincronizzazione, scarica i miei dati, azzera progressi, elimina account con conferma, esci), `src/app/auth.ts` (client better-auth), `src/app/merge.ts` (unione ospite+account senza duplicati, testata), sincronizzazione in `ProgressProvider` (al login unisce, poi salva 0,8 s dopo ogni modifica). Invito a creare l'account dopo una lezione completata; i cubi confermati in Risolvi il mio finiscono nei progressi; link Account in home; proxy `/api` nel server di sviluppo Vite.
e2e con `wrangler dev`: ospite completa la notazione → crea account (bloccato senza 14+) → progressi sul server → secondo browser fa login e vede la lezione completata → eliminazione account → API 401.
