---
labels: [wayfinder:grilling]
status: closed
assignee: claude
blocked_by: []
---
## Question

In quali passi costruiamo l'app e in che ordine? Suddividere in ticket `task` da una sessione ciascuno (es. scheletro progetto + deploy, motore del cubo e notazione, renderer 3D, solver principianti, min2phase, scansione, ritocco, Impara, Risolvi il mio, Pratica, account/backend, i18n), con dipendenze, cosa si può fare in parallelo e qual è la prima versione utilizzabile da pubblicare.

## Resolution

- Rilascio: un'unica uscita pubblica quando ci sono tutte e tre le modalità, account e IT/EN. Prima si pubblica solo su anteprime di Cloudflare.
- Esecuzione: Claude, un ticket `task` per sessione; l'utente prova e approva le PR. Ticket senza dipendenze reciproche in parallelo.
- Test: Vitest sulla logica (motore del cubo, solver con i 7 algoritmi verificati su 1000 cubi mescolati, riconoscimento colori su foto di esempio); UI provata a mano + screenshot Playwright. Niente E2E completi in CI.
- Dominio: per ora l'indirizzo gratuito *.pages.dev; dominio proprio dopo.
- Ordine: scheletro → motore del cubo → (3D | solver principianti | min2phase | scansione | backend in parallelo) → ritocco → Risolvi il mio / Impara / Pratica / home → sync account → inglese, accessibilità, privacy → rilascio. Ticket task 13–27.
