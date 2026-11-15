---
labels: [wayfinder:task]
status: closed
assignee: claude
blocked_by: [15-task-cubo-3d, 18-task-scansione]
---
## Question

Schermata di ritocco sul cubo 3D (pezzi incerti lampeggianti, tavolozza), inserimento a mano senza fotocamera, gestione stato impossibile come deciso nella [UX della scansione](09-grilling-ux-scansione.md).

## Resolution

Fatto:
- `src/edit/EditScreen.tsx`: cubo 3D girabile; tavolozza dei 6 colori con il nome scritto; scegli un colore e tocca i quadratini (i centri non si cambiano). Lampeggiano gli adesivi incerti della scansione (finché non li tocchi) e quelli dei pezzi impossibili. Messaggio di stato semplice; "Tutto giusto, continua" attivo solo se il cubo è valido; "Riscansiona la faccia X" sulla faccia con più adesivi sospetti.
- `src/edit/diagnose.ts`: quadratini mancanti, conteggi per colore, pezzi impossibili/doppi (con gli adesivi da controllare), torsione/flip/parità (testo: controlla, altrimenti il cubo è stato smontato o un adesivo spostato). `EMPTY` = solo centri per l'inserimento a mano.
- `ScanScreen`: rifà una sola faccia (`only` + `base`) con animazione da "giallo in alto, rosso davanti"; `ScanResult.samples` per ricomporre.
- `CubeView`: tocco sugli adesivi (`onStickerClick`, ignorato se è un trascinamento), `blink`, colore grigio per i quadratini ancora vuoti; il trascinamento cattura il puntatore solo quando ci si muove davvero.
- Colori e nomi condivisi in `src/cube/colors.ts`. Demo `/#scansione`: scansione → ritocco → stato confermato.
Test: diagnose (5 casi); e2e in Chromium: fotocamera negata → inserimento a mano → tocco colora un quadratino; fotocamera finta → ritocco "Tutto torna" → stato identico.
