---
labels: [wayfinder:task]
status: closed
assignee: claude
blocked_by: [15-task-cubo-3d, 16-task-solver-principianti, 17-task-solver-minime, 19-task-ritocco]
---
## Question

Modalità Risolvi il mio: scelta tra metodo principianti e mosse minime, guida una mossa alla volta, fasi con titolo e traguardo, presa mostrata a ogni fase, pulsante Mi sono perso, come nel [Flusso UX](06-grilling-flusso-ux.md).

## Resolution

Fatto in `src/solve/`:
- `SolveMine.tsx`: scansione (o inserimento a mano) → ritocco → scelta "Metodo per principianti" (~150 mosse, 8 fasi) o "Soluzione breve" (~20 mosse, calcolata nel Worker) → guida.
- `Guide.tsx`: una mossa alla volta (freccia sul cubo 3D, lettera + frase, nome della formula e posizione "2/4"); "Fatto, avanti" / "Indietro" / "Vista standard" / "Mi sono perso" (torna alla scansione e ricalcola). A ogni fase una scheda con titolo, traguardo e presa ("giallo in alto, {colore} verso di te": il colore davanti cambia con le rotazioni y); avviso "sembra rotto" nell'ultima fase. Barra di avanzamento; schermata finale "Cubo risolto!".
- `items.ts`: dalle fasi del solver ai passi della guida (fasi vuote saltate), con test.
- Home: "Risolvi il mio" porta a `#risolvi`.
Test e2e in Chromium con fotocamera finta: home → scansione → ritocco → metodo principianti → 143 mosse cliccate → "Cubo risolto!" con il cubo 3D risolto.
