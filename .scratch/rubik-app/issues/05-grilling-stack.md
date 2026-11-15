---
labels: [wayfinder:grilling]
status: closed
assignee: claude
blocked_by: [02-research-stack-3d-solver, 03-research-riconoscimento-colori, 04-research-backend-account]
---
## Question

Quale stack scegliamo, alla luce delle ricerche: framework frontend, motore 3D, solver (minime e principianti), riconoscimento colori, backend account, hosting?

## Resolution

- UI: React + TypeScript + Vite; cubo 3D con react-three-fiber (Three.js), modello e animazioni del cubo scritti da noi.
- Solver mosse minime: min2phase in Web Worker. Licenza da verificare quando si costruisce; se è GPL va bene (l'app diventa open source GPL).
- Solver metodo principianti a fasi: scritto da noi in TS.
- Riconoscimento colori: come da ricerca (griglia + Lab + abbinamento ai pezzi), senza OpenCV/ML.
- Backend account: Cloudflare Workers + D1 (dati vincolati all'UE) + better-auth; login scritto e mantenuto da noi.
- Hosting: Cloudflare (Pages / Workers static assets), deploy da GitHub.
