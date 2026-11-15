---
labels: [wayfinder:research]
status: closed
assignee: claude
blocked_by: []
---
## Question

Come riconoscere in modo affidabile i colori delle 6 facce con la fotocamera nel browser (getUserMedia)? Approcci (griglia guida fissa + campionamento HSV/Lab, clustering dei 54 colori, OpenCV.js, modelli ML), accuratezza con luce scarsa e adesivi rosso/arancione, progetti open source esistenti e loro licenze. Come validare che lo stato scansionato sia un cubo possibile.

## Resolution

- Cattura: griglia guida 3x3 fissa su `getUserMedia`, mediana RGB del 50% interno di ogni cella su frame stabili, conversione in Lab. Niente OpenCV.js (~8 MB) né ML.
- Calibrazione: i 6 centri come riferimento a ogni sessione; il centro bianco corregge il bilanciamento del bianco.
- Assegnazione: abbinare angoli e spigoli ai pezzi reali a ΔE minimo (algoritmo ungherese), stile rubiks-color-resolver (MIT) riscritto in JS: 9 sticker per colore garantiti, rosso/arancione quasi sempre risolto.
- Validazione: `verify()` nostro (torsione angoli mod 3, flip spigoli mod 2, parità); se fallisce prova le 4 rotazioni per faccia, poi evidenzia i pezzi incerti da ritoccare a mano.
- Librerie: nessuna obbligatoria; `culori` (MIT) opzionale. `whiteBalanceMode`/`torch` solo se `getCapabilities()` li riporta (Safari non confermato). Accuratezza 95–97% dichiarata dai progetti citati, non misurata da noi.

Dettaglio: branch `research/riconoscimento-colori`, file `.scratch/rubik-app/research/03-riconoscimento-colori.md`.
