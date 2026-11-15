---
labels: [wayfinder:map]
---
# Mappa: App web per risolvere il cubo di Rubik 3x3

## Destination

App web costruita e online: cubo 3D animato, scansione del cubo reale con fotocamera, tre modalità (Insegna metodo, Risolvi il mio, Pratica), pensata per chi non ha mai risolto un cubo. IT + EN, account cloud.

## Notes

- Dominio: web app (browser desktop + telefono), 3D, computer vision nel browser, didattica.
- **Override "plan, don't do":** la destinazione è l'app costruita, quindi la mappa porta anche l'esecuzione. Prima si chiudono le decisioni, poi i ticket `task` costruiscono.
- Preferenze fisse dell'utente:
  - Input del cubo: fotocamera, con ritocco manuale dei quadratini sbagliati.
  - "Risolvi il mio": l'utente sceglie tra metodo principianti (a fasi, come nel tutorial) e mosse minime.
  - Progressi salvati su account cloud.
  - Bella da vedere, animazioni curate, facile per un principiante assoluto.
- Tracker: markdown locale (`.scratch/rubik-app/`). Ticket in `issues/`, blocchi nel campo `blocked_by`, claim nel campo `assignee`.

## Decisions so far

- [Input, modalità, lingua, progressi](issues/00-grilling-iniziale.md): web app; fotocamera + ritocco manuale; tre modalità; soluzione a scelta (principianti/minime); IT+EN; account cloud.
- [Backend account](issues/04-research-backend-account.md): Supabase Free in UE (Frankfurt), SMTP esterno in produzione; alternativa Cloudflare.
- [Metodo principianti](issues/01-research-metodo-principianti.md): strati in 8 fasi con margherita, giallo sempre in alto, 7 algoritmi brevi senza B.
- [Stack 3D e solver](issues/02-research-stack-3d-solver.md): Three.js con cubo nostro; min2phase in Web Worker per le mosse minime; solver principianti a fasi da scrivere.

## Not yet specified

- Contenuto dettagliato delle lezioni (testi, quante fasi, schemi visivi per ogni algoritmo, come spiegare la notazione a un principiante). Dipende dal metodo scelto.
- Modalità Pratica: cosa dentro (timer, mescolata casuale, suggerimenti a richiesta, statistiche?).
- UX della scansione: ordine delle facce, guida a schermo, cosa succede se lo stato del cubo è impossibile.
- Hosting e deploy, dominio, CI.
- Licenza di min2phase.js (MIT o GPL) da confermare prima di usarlo.
- Strategia di test (logica del cubo, solver, riconoscimento colori; verificare i 7 algoritmi del metodo su simulatore).
- Flusso di traduzione IT/EN.
- Accessibilità (daltonici: i colori del cubo sono il problema principale), prestazioni su telefoni economici.
- Privacy/GDPR per gli account e per le immagini della fotocamera.
- Suddivisione della costruzione in ticket `task` (quando le decisioni sono chiuse).

## Out of scope

- App mobile nativa (scelta: web app).
- Cubi diversi dal 3x3 (2x2, 4x4, ecc.).
- Metodi avanzati (CFOP, Roux): l'app è per principianti.
