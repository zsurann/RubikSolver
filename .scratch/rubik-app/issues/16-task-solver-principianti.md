---
labels: [wayfinder:task]
status: closed
assignee: claude
blocked_by: [14-task-motore-cubo]
---
## Question

Solver del metodo principianti a fasi (8 fasi e 7 algoritmi del [Metodo principianti](01-research-metodo-principianti.md)): da uno stato restituisce la soluzione divisa per fasi, con giallo in alto. Test: risolve 1000 cubi mescolati; verifica i 7 algoritmi.

## Resolution

Fatto in `src/solver/beginner.ts`: `solveBeginner(state)` → 8 fasi, ognuna una lista di passi (mossa singola, rotazione `y` del cubo intero, o formula con nome `alg`). Giallo sempre in alto; per portare il pezzo davanti a destra il solver usa rotazioni `y` (da mostrare come "gira tutto il cubo"). Ogni passo è una ricerca in ampiezza limitata alle mosse/formule insegnate in quella fase, quindi la soluzione usa solo i 7 algoritmi del [Metodo principianti](01-research-metodo-principianti.md); fase 8 deterministica (R' D' R D sull'angolo davanti a destra, poi U). Giri consecutivi della stessa faccia uniti fuori dalle formule. La margherita viene saltata se la croce bianca c'è già.
Test: 1000 cubi mescolati risolti, solo formule del metodo, ordine delle fasi; i 7 algoritmi verificati (tornano all'inizio ripetuti). Misure su 300 cubi: ~156 mosse in media (max ~200), ~8 ms in media per soluzione (max ~90 ms).
