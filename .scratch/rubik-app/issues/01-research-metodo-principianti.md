---
labels: [wayfinder:research]
status: closed
assignee: claude
blocked_by: []
---
## Question

Qual è il metodo migliore per insegnare il 3x3 a un principiante assoluto? Confronta le varianti del metodo a strati (margherita/croce, angoli, secondo strato, croce gialla, OLL/PLL a 2 sguardi semplificati, ecc.): quanti algoritmi da memorizzare, tasso di successo, come lo insegnano le guide migliori (es. guida ufficiale Rubik's, J Perm, ruwix). Come presentare la notazione (R U R' U') a chi non la conosce? Raccomanda un metodo con l'elenco delle fasi e degli algoritmi.

## Resolution

Metodo a strati in 8 fasi: margherita → croce bianca → angoli bianchi → secondo strato → croce gialla → spigoli gialli → posizione angoli gialli → orientamento angoli gialli. Giallo sempre in alto (niente capovolgimenti). 7 algoritmi brevi, solo U/R/F/L/D:
- angoli bianchi `R U R' U'`
- secondo strato `U R U' R' U' F' U F` / `U' L' U L U F U' F'`
- croce gialla `F R U R' U' F'`
- spigoli gialli `R U R' U R U2 R' U`
- posizione angoli gialli `U R U' L' U R' U' L`
- orientamento angoli gialli `R' D' R D`
Ordine fasi da guida ufficiale Rubik's, algoritmi finali più corti da ruwix/J Perm. Notazione introdotta gradualmente con frecce sulle facce. Algoritmi non ancora verificati su simulatore.

Dettaglio: branch `research/metodo-principianti`, file `.scratch/rubik-app/research/01-metodo-principianti.md`.
