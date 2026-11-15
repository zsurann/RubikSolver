---
labels: [wayfinder:task]
status: closed
assignee: claude
blocked_by: [15-task-cubo-3d, 16-task-solver-principianti]
---
## Question

Modalità Pratica: cubo virtuale libero (mouse/touch/tastiera) con aiuto 'prossima mossa', timer + statistiche per il cubo vero, allenamento su una sola fase.

## Resolution

Fatto in `src/practice/`: `Practice.tsx` con tre schede. Cubo libero (pulsanti + tastiera, Mescola, "Prossima mossa" = prossima mossa del metodo con freccia, Cubo risolto, Vista standard). Cronometro per il cubo vero (mescolata da fare, tocco o Spazio per partire/fermare, migliore, media di 5 e di 12 senza migliore/peggiore, numero di risoluzioni, storico, cancella ultimo; tempi nei progressi). Allena una fase (scelta della fase → `PhaseExercise`). `stats.ts` testato. Verificato con screenshot.
