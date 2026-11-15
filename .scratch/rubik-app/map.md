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
- [Riconoscimento colori](issues/03-research-riconoscimento-colori.md): griglia guida + Lab, calibrazione sui centri, abbinamento ai pezzi a ΔE minimo, verify() + ritocco dei pezzi incerti; niente OpenCV/ML.
- [Scelta dello stack](issues/05-grilling-stack.md): React + TS + Vite + r3f; min2phase (GPL accettata); backend Cloudflare Workers + D1 UE + better-auth; hosting Cloudflare.
- [Flusso UX](issues/06-grilling-flusso-ux.md): benvenuto breve; login facoltativo; guida una mossa alla volta con "Mi sono perso"; presa mostrata a ogni fase; frecce + lettere; 1 lezione per fase; Pratica con cubo virtuale, timer, allenamento fase.
- [Prototipo dell'aspetto del cubo](issues/07-prototype-look-cubo.md): stile Classico, sfondo Studio, animazione morbida ~550 ms, freccia bianca pulsante + strato illuminato + didascalia.

## Not yet specified

- Contenuto dettagliato delle 9 lezioni (testi IT/EN, traguardi visivi, frasi incoraggianti, avviso "sembra rotto" nella fase finale).
- Dominio e CI per il deploy su Cloudflare.
- Licenza di min2phase.js da verificare in costruzione (GPL accettata dall'utente).
- Strategia di test (logica del cubo, solver, riconoscimento colori; verificare i 7 algoritmi del metodo su simulatore).
- Flusso di traduzione IT/EN.
- Accessibilità (daltonici: i colori del cubo sono il problema principale), prestazioni su telefoni economici.
- Privacy/GDPR per gli account e per le immagini della fotocamera.
- Suddivisione della costruzione in ticket `task` (quando le decisioni sono chiuse).

## Out of scope

- App mobile nativa (scelta: web app).
- Cubi diversi dal 3x3 (2x2, 4x4, ecc.).
- Metodi avanzati (CFOP, Roux): l'app è per principianti.
