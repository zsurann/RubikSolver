# Research 02 — Stack 3D e solver

Risponde a `issues/02-research-stack-3d-solver.md`. Data: 2026-11-15.

## Raccomandazione

1. **Rendering: Three.js "puro"** (MIT, ~186 KB gzip), con un cubo scritto da noi: 27 cubetti con bordi arrotondati (`RoundedBoxGeometry` degli addons), materiali PBR e animazione delle mosse fatta a mano (rotazione di un gruppo di 9 cubetti con easing). È l'unica strada che dà insieme **look curato** e **controllo totale sull'animazione** (pausa, velocità, passo avanti/indietro, frecce e evidenziazioni per il tutorial).
   - **react-three-fiber** (MIT, +~58 KB gzip più React) va bene solo se la UI la facciamo comunque in React: è Three.js con un'altra sintassi, non cambia né la resa né il controllo. Decisione da prendere nel ticket 05 (grilling stack).
   - **Babylon.js** scartato: Apache-2.0 e ottimo, ma ~1,8 MB gzip per `@babylonjs/core` (con tree-shaking scende, comunque molto più pesante) e niente in più che serva a un cubo.
   - **cubing.js / `<twisty-player>`** non come renderer principale: è ottimo per mostrare algoritmi, ma l'aspetto si personalizza poco (solo CSS, sfondo, stickering) e le API utili sono marcate *experimental*, "cambieranno prima della 1.0". Si può usare per un prototipo veloce o per l'anteprima delle formule.
2. **Solver mosse minime: min2phase** (algoritmo a due fasi di Kociemba, di Chen Shuang), in un **Web Worker**. Misurato da noi in Node 22: init completo ~220 ms, **~1,5 ms a soluzione, ~20,5 mosse in media** (max 21). Due modi equivalenti di prenderlo:
   - `min2phase.js` (npm, licenza "MIT or GPL-3.0", ~80 KB non compresso, zero dipendenze) — il più leggero, consigliato;
   - `cubing/search` (`experimentalSolve3x3x3IgnoringCenters`), che contiene lo stesso min2phase già in worker (misurato ~21 ms a soluzione incluso l'overhead del worker). Conviene se usiamo già cubing.js per altro (parsing notazione, scramble WCA).
   - Nota onesta per la UI: è "quasi ottimo" (~20 mosse), **non l'ottimo garantito**. Il vero ottimo (Korf/Reid) richiede tabelle da decine di MB a decine di GB e secondi/minuti di calcolo: non adatto al telefono. Consiglio di chiamarla "soluzione breve" o "~20 mosse".
3. **Solver metodo principianti a fasi: va scritto noi.** Non esiste una libreria JS mantenuta e usabile che restituisca la soluzione LBL divisa per fasi (dettagli sotto). Stima: **~600–1000 righe TypeScript + test, 3–5 giorni**, complessità media. Le fasi devono coincidere con quelle del tutorial (ticket 01), quindi scriverlo noi è comunque un vantaggio.

Stack consigliato in una riga: **Three.js (eventualmente via r3f) + modello del cubo nostro + min2phase.js in Web Worker + solver LBL nostro.**

## Motori 3D e librerie cubo

| Opzione | Versione (npm, nov 2026) | Licenza | Peso (gzip, bundlephobia) | Qualità visiva | Controllo animazioni | Note |
|---|---|---|---|---|---|---|
| **Three.js** | 0.187.0 | MIT | ~186 KB (tree-shakable) | Alta: PBR, ombre, env map, bordi arrotondati | Totale (le animazioni le scriviamo noi) | 36 M download/settimana, ecosistema enorme, tanti cubi d'esempio (es. bsehovac/the-cube, MIT) |
| **react-three-fiber** (+drei) | 9.8.2 / 10.7.9 | MIT | ~58 KB + React (+ three) | Uguale a Three.js | Totale; animazioni con `useFrame` o react-spring | Ha senso solo con UI React |
| **Babylon.js** | 9.36.0 | Apache-2.0 | ~1,8 MB (core intero) | Alta | Totale, sistema animazioni integrato | Sovradimensionato per un cubo |
| **cubing.js** (`<twisty-player>`) | 0.66.1 | MPL-2.0 OR GPL-3.0+ | ~2,3 MB su disco (usa three internamente) | Buona ma stile fisso "speedcubing" | Play/pausa/timeline, tempo; parametri `experimental-*` instabili | Include anche notation, scramble, solver, bluetooth. MPL-2.0 va bene per un'app chiusa (copyleft solo sui file della libreria) |
| **sr-puzzlegen** | 1.0.4 (2022) | ISC | — | Immagini statiche 2D/3D | Nessuna | Utile solo per icone/miniature dei casi |

## Solver mosse minime

Benchmark nostro (Node 22, 200 cubi random per min2phase, 50 per cubejs, 20 per cubing.js). Nel browser da telefono aspettarsi 2–5× più lento: resta comunque istantaneo.

| Libreria | Algoritmo | Init | Tempo/soluzione | Mosse medie | Tabelle / peso | Licenza | Stato |
|---|---|---|---|---|---|---|---|
| **min2phase.js** (cs0x7f) | Kociemba 2 fasi ottimizzato | ~220 ms (`initFull`), oppure lazy | **~1,5 ms** | **20,5** (max 21) | Tabelle generate in RAM all'avvio (pochi MB), file ~80 KB | MIT o GPL-3.0 (doppia) | Pubblicato 2024; è il solver di csTimer e di quasi tutti i timer online |
| **cubing/search** | min2phase incluso | primo scramble lento (warm-up worker) | ~21 ms (con worker) | 20,8 | dentro cubing.js | MPL-2.0 / GPL | Attivo (release ott 2026); API "experimental" |
| **cubejs** (ldez) | Kociemba 2 fasi senza simmetrie | ~1,4 s (README: 4–5 s su PC medio) | ~60 ms (README: 10–400 ms, a volte 2 s) | 21,8 | ~6 KB gzip | MIT | Fermo dal 2019; ha già il worker (`asyncInit`) |
| **cube-solver** (torjusti) | Kociemba + sotto-solver Cross/XCross/EOLine/FB | ~2 s | ~100 ms (README) | — | — | MIT | Fermo dal 2021 |
| **kociemba** (npm d-band) | Kociemba | — | — | — | — | MIT | Fermo dal 2020 |
| Ottimo vero (Korf/Reid) | IDA* con pattern DB | — | da secondi a minuti | ≤20 (ottimo) | da ~35 MB (Reid, simmetrie) a 33 GB | — | Non adatto al web/telefono |

## Solver metodo principianti a fasi

**Cosa esiste:**
- `rubiks-cube-solver` (npm, MIT, 2019): restituisce la soluzione divisa per fasi (`partitioned: true` → `cross`, `f2l`, `oll`, `pll`), ma è **CFOP/Fridrich, non principianti**. Utile come riferimento di struttura (stato a 54 facelet, riconoscimento dei casi), non riusabile così com'è.
- `tibordp/neishauben` (MIT): simulatore web con solver LBL, ma il solver è in C compilato in WASM, è un'app e non una libreria, e non risulta che restituisca le fasi.
- `ligangwang/rubikscube`: progetto web/Cordova che dichiara un solver LBL; non è un pacchetto, stato incerto.
- `cube-solver` (torjusti) risolve singole fasi (Cross ecc.), ma con ricerca ottimale, non con le mosse "da principiante".

**Conclusione: va scritto.** Proposta di struttura:
- Modello del cubo condiviso con renderer e solver (permutazione/orientamento di spigoli e angoli, oppure 54 facelet), con `applyMove`.
- Una funzione per fase, ognuna restituisce `{fase, mosse[], casoRiconosciuto}`:
  1. croce bianca: ricerca IDDFS per un pezzo alla volta (≤ ~8 mosse per spigolo, istantanea) oppure regole;
  2. angoli del primo strato: porta l'angolo sopra lo slot e ripeti `R U R' U'` finché è a posto;
  3. spigoli del secondo strato: due formule (destra/sinistra) + estrazione dei pezzi mal posizionati;
  4. croce gialla: `F R U R' U' F'` sui casi punto/L/linea;
  5. permutazione spigoli gialli: `R U R' U R U2 R'`;
  6. posizionamento angoli gialli: `U R U' L' U R' U' L`;
  7. orientamento angoli gialli: `R' D' R D` ripetuto + `U`.
- Le formule esatte e i nomi delle fasi vanno allineati con il metodo scelto nel ticket 01.
- Test: migliaia di cubi random → ogni fase lascia il cubo nello stato atteso e la fine è risolta. Lunghezza tipica 100–150 mosse (normale per LBL).

**Stima:** ~600–1000 righe + test, 3–5 giorni. Il rischio è basso (le fasi sono deterministiche); le parti delicate sono il riconoscimento dei casi e la gestione dei pezzi "incastrati" nel posto sbagliato.

## Fonti

- Three.js: https://www.npmjs.com/package/three , https://github.com/mrdoob/three.js
- react-three-fiber: https://www.npmjs.com/package/@react-three/fiber , https://github.com/pmndrs/react-three-fiber
- Babylon.js: https://www.npmjs.com/package/@babylonjs/core
- Pesi bundle: https://bundlephobia.com (API `/api/size`, consultata il 2026-11-15)
- cubing.js / twisty-player: https://js.cubing.net/cubing/twisty , https://js.cubing.net/cubing/ , https://github.com/cubing/cubing.js
- min2phase.js: https://github.com/cs0x7f/min2phase.js , https://www.npmjs.com/package/min2phase.js
- Note su min2phase (velocità, licenza, uso in csTimer): https://next.cuberoot.me/code/algorithms/min2phase , https://github.com/cubing/min2phase
- cubejs: https://github.com/ldez/cubejs
- cube-solver: https://github.com/torjusti/cube-solver , https://cdn.jsdelivr.net/npm/cube-solver@2.4.1/README.md
- rubiks-cube-solver (CFOP a fasi): https://github.com/slammayjammay/rubiks-cube-solver
- neishauben (LBL in C/WASM): https://github.com/tibordp/neishauben
- rubikscube (LBL dichiarato): https://github.com/ligangwang/rubikscube
- Cubo Three.js d'esempio: https://github.com/bsehovac/the-cube
- Solver ottimali e dimensioni delle tabelle: https://en.wikipedia.org/wiki/Optimal_solutions_for_Rubik%27s_Cube , https://www.cs.princeton.edu/courses/archive/fall06/cos402/papers/korfrubik.pdf , https://www.cuberoot.me/math/group/algorithms
- Benchmark: eseguiti localmente con `min2phase.js@0.0.4`, `cubejs@1.3.2`, `cubing@0.66.1` su Node 22.23.
