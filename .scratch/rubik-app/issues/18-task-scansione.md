---
labels: [wayfinder:task]
status: closed
assignee: claude
blocked_by: [13-task-scheletro, 14-task-motore-cubo]
---
## Question

Scansione con fotocamera secondo il [Riconoscimento colori](03-research-riconoscimento-colori.md) e la [UX della scansione](09-grilling-ux-scansione.md): griglia guida, Lab, calibrazione sui centri, abbinamento ai pezzi a ΔE minimo, scatto automatico, ordine fisso delle facce. Test sul riconoscimento con foto di esempio.

## Resolution

Fatto in `src/scan/`:
- `color.ts` (sRGB→Lab, CIEDE2000 verificato sui valori di Sharma, bilanciamento del bianco sul centro bianco), `hungarian.ts`, `sample.ts` (mediana del 50% interno di ogni cella + uniformità).
- `assemble.ts`: 54 colori → stato; riferimenti dai 6 centri; angoli e spigoli abbinati ai pezzi reali con l'algoritmo ungherese (9 adesivi per colore garantiti); se lo stato non è valido prova le 4 rotazioni di ogni faccia; restituisce `uncertain` (adesivi poco sicuri) per il ritocco.
- `ScanScreen.tsx`: fotocamera posteriore, griglia 3x3 fissa, scatto automatico dopo 0,5 s di immagine ferma e adesivi uniformi, pulsante "Scatta ora", ordine F R B L U D con animazione 3D di come girare il cubo, avviso se il centro non è quello atteso ("Riprova" / "Va bene così"), schermata "fotocamera non disponibile" con inserimento a mano (`onManual`, da implementare nel Ritocco).
- Demo `/#scansione`; `scripts/fake-cube-video.cjs` crea un video finto per Chromium.
Test: 300 cubi ricostruiti da colori con luce calda, ombre e rumore; faccia ruotata raddrizzata; adesivo ambiguo segnalato. Prova end-to-end in Chromium con fotocamera finta: stato ricostruito identico, 0 incerti.
Non verificato: telefono vero e luce reale.
