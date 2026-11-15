---
labels: [wayfinder:task]
status: closed
assignee: claude
blocked_by: [14-task-motore-cubo]
---
## Question

Solver mosse minime: min2phase in un Web Worker. Verificare la licenza (GPL accettata; se GPL aggiungere LICENSE e avviso). Test: risolve 1000 cubi mescolati in meno di 25 mosse.

## Resolution

Fatto in `src/solver/minimal.ts`: `solveMinimalSync(state)` (test) e `solveMinimal(state)` che gira in un Web Worker (`minimal.worker.ts`, ~23 KB). Licenza: min2phase.js@0.0.4 è "MIT or GPL-3.0"; scelta MIT, attribuzione nel README (niente GPL necessaria). Test: 1000 cubi mescolati risolti in ≤21 mosse; errore chiaro su stato impossibile. Verificato nel browser (pulsante "Soluzione breve" nella demo /#cubo).
