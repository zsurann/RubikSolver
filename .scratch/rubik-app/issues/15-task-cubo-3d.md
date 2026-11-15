---
labels: [wayfinder:task]
status: closed
assignee: claude
blocked_by: [13-task-scheletro, 14-task-motore-cubo]
---
## Question

Componente cubo 3D con react-three-fiber secondo il [Prototipo dell'aspetto del cubo](07-prototype-look-cubo.md): stile Classico, sfondo Studio, animazione morbida, frecce, strato illuminato, didascalia, vista standard automatica, trascinamento; API per riprodurre una sequenza passo per passo (avanti/indietro/play/velocità).

## Resolution

Fatto in `src/cube3d/`:
- `CubeView.tsx`: cubo r3f stile Classico (stato dalla stringa facelet), sfondo Studio con ombra morbida, animazione morbida (mosse doppie 1,5×, più lente con "riduci movimento"), freccia pulsante + strato illuminato per la prossima mossa, trascinamento con inerzia, ritorno alla vista standard (`viewKey`).
- `player.ts`: `useCubePlayer` (coda di mosse animate, reducer puro testato) e `useSequence` (formula passo per passo: avanti, indietro, riproduci, velocità).
- `moves.ts` (asse/strati/angolo, posizione e verso delle frecce) e `describe.ts` (frasi IT/EN per ogni mossa).
- Pagina di prova: `/#cubo`.
Verificato con test (verso delle frecce, coda, descrizioni) e screenshot Playwright (R, U, F). Limite: bundle ~317 KB gzip per three + r3f; caricare il 3D in modo lazy se serve. Modalità daltonici e qualità automatica restano nel ticket di accessibilità.
