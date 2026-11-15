---
labels: [wayfinder:research]
status: closed
assignee: claude
blocked_by: []
---
## Question

Quale stack web per un cubo 3D animato e bello? Confronta Three.js, react-three-fiber, Babylon.js e librerie già pronte per il cubo (es. cubing.js / twisty-player): qualità visiva, controllo sulle animazioni, licenze, dimensione. Quali solver JS esistono per le mosse minime (es. Kociemba / min2phase in JS, cubejs) e quanto sono veloci nel browser? Esiste già un solver "metodo principianti" in JS che restituisce la soluzione divisa per fasi, o va scritto?

## Resolution

- 3D: Three.js con cubo scritto da noi (27 cubetti arrotondati, animazioni proprie: pausa, velocità, passo avanti/indietro). react-three-fiber solo se la UI è React. Scartati Babylon.js (~1,8 MB gzip) e twisty-player (poco personalizzabile; ok per prototipi).
- Mosse minime: min2phase (Kociemba a due fasi) in un Web Worker; in Node ~220 ms di avvio, ~1,5 ms a soluzione, ~20,5 mosse. Presentarlo come "soluzione breve", non ottima. Licenza da confermare (MIT o GPL).
- Metodo principianti a fasi: da scrivere noi, ~600–1000 righe TS + test, rischio basso, fasi allineate al metodo scelto nel ticket 01.

Dettaglio: branch `research/stack-3d-solver`, file `.scratch/rubik-app/research/02-stack-3d-solver.md`.
