---
labels: [wayfinder:task]
status: closed
assignee: claude
blocked_by: [13-task-scheletro]
---
## Question

Motore del cubo in TS puro: stato a 54 adesivi e a pezzi, mosse e notazione (U R F L D B, ', 2, rotazioni del cubo intero), mescolata casuale, verify() (torsione angoli, flip spigoli, parità). Con test.

## Resolution

Fatto in `src/cube/cube.ts`. Stato = stringa facelet di Kociemba (54 lettere, ordine U R F D L B; U = giallo, F = rosso nella UI). Permutazioni delle mosse calcolate dalla geometria 3D, non scritte a mano. API: `parseAlg`, `applyMove`, `applyAlg`, `invertAlg`, `isSolved` (accetta cubo ruotato), `scramble(n, random)`, `verify` (lunghezza, conteggi, centri, angoli, spigoli, torsione, flip, parità) che restituisce anche lo stato a pezzi `cp/co/ep/eo` per i solver. Mosse: U R F D L B, x y z, con ' e 2. 13 test (verso di ogni mossa, identità, 500 mescolate valide, ogni tipo di stato impossibile).
