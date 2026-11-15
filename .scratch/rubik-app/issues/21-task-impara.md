---
labels: [wayfinder:task]
status: closed
assignee: claude
blocked_by: [15-task-cubo-3d, 16-task-solver-principianti, 11-prototype-testi-lezioni]
---
## Question

Modalità Impara: lezione sulla notazione + 8 lezioni (spiegazione animata, demo, esercizio su cubo virtuale con mescolata mirata), sblocco progressivo, testi nello stile fissato dai [Testi delle lezioni](11-prototype-testi-lezioni.md).

## Resolution

Fatto: `src/learn/lessons.ts` (9 lezioni IT/EN nello stile approvato: notazione + 8 fasi, schermate brevi, demo, "Attento a…", traguardo, incoraggiamento), `src/learn/Learn.tsx` (elenco con sblocco progressivo e lezioni completate; lezione con avanzamento, demo 3D "Guarda" su cubo risolto o su un cubo d'esempio all'inizio della fase; esercizio finale), esercizio di notazione (fai la mossa indicata; se sbagli il cubo torna indietro e ti dice cosa serviva), `src/practice/PhaseExercise.tsx` (cubo virtuale all'inizio della fase, pulsanti/tastiera, "Aiuto" = prossima mossa del solver con freccia, "Nuovo esercizio"). Progressi in `src/app/progress.tsx` (salvati nel browser). Solver: `phaseDone` e `phaseStarts`, testati su 50 cubi. e2e: notazione completata, margherita risolta con l'Aiuto, lezioni sbloccate.
Limite: la demo "phase" mostra le prime 16 mosse della fase sul cubo d'esempio; le demo errore/giusto in rosso/verde sono rese come riquadro "Attento a…" con testo (niente animazione dell'errore).
