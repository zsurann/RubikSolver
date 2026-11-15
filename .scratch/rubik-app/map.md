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
- [Cosa salva l'account](issues/08-grilling-account.md): login facoltativo (Google, email+password, link magico); salva lezioni, tempi, preferenze, cubi scansionati; foto mai salvate; ospite locale unito al login; account solo 14+; elimina/esporta/azzera.
- [UX della scansione](issues/09-grilling-ux-scansione.md): ordine fisso guidato dal cubo 3D, scatto automatico, ritocco su cubo 3D, inserimento a mano se niente fotocamera, guida ai pezzi sospetti se lo stato è impossibile.
- [Piano di costruzione](issues/10-grilling-piano-costruzione.md): rilascio unico a funzioni complete; Claude un task per sessione con PR; test sulla logica; *.pages.dev; ticket task 13–27.
- [Testi delle lezioni](issues/11-prototype-testi-lezioni.md): bozza approvata come modello; tono amichevole e diretto, ~8 schermate, nomignoli per le formule, "Attento a…" con demo errore/giusto.
- [Accessibilità](issues/12-grilling-accessibilita.md): modalità daltonici con simboli, nomi dei colori sempre scritti, qualità grafica automatica + "Grafica leggera", rispetto di "riduci movimento".
- [Scheletro del progetto](issues/13-task-scheletro.md): React + TS + Vite, Vitest, oxlint, i18n IT/EN, CI; app "Cubo Facile"; anteprime Cloudflare da collegare a mano.
- [Motore del cubo](issues/14-task-motore-cubo.md): stringa facelet Kociemba, mosse dalla geometria, scramble, verify() con stato a pezzi; 13 test.
- [Cubo 3D](issues/15-task-cubo-3d.md): CubeView r3f + useCubePlayer/useSequence; frecce, strato illuminato, trascinamento, vista standard; demo /#cubo.
- [Solver principianti](issues/16-task-solver-principianti.md): 8 fasi con ricerca limitata alle formule insegnate + rotazioni y; ~156 mosse, ~8 ms; 1000 cubi risolti nei test.
- [Solver mosse minime](issues/17-task-solver-minime.md): min2phase.js in Web Worker, licenza MIT; ≤21 mosse su 1000 cubi.
- [Scansione](issues/18-task-scansione.md): griglia + Lab + abbinamento ai pezzi (ungherese) + rotazioni facce; scatto automatico, guida 3D, avviso centro; e2e con fotocamera finta ok.
- [Ritocco](issues/19-task-ritocco.md): EditScreen con tavolozza e tocco sugli adesivi, lampeggio incerti/sospetti, diagnose(), riscansione di una faccia, inserimento a mano.
- [Risolvi il mio](issues/20-task-risolvi-il-mio.md): scansione → ritocco → scelta metodo → guida una mossa alla volta con schede di fase, presa e "Mi sono perso"; e2e fino a cubo risolto.
- [Home e navigazione](issues/24-task-home-navigazione.md): benvenuto, home, impostazioni salvate nel browser, router a hash, stile comune chiaro/scuro.
- [Impara](issues/21-task-impara.md): 9 lezioni IT/EN con demo, sblocco progressivo, esercizio notazione ed esercizi di fase con Aiuto.
- [Pratica](issues/22-task-pratica.md): cubo libero con aiuto, cronometro con medie e storico, allenamento per fase.
- [Backend account](issues/23-task-backend-account.md): un Worker (app + /api) con better-auth su D1 UE, email Resend, progressi/export/cancellazione; provato in locale; pubblicazione da fare con l'account Cloudflare dell'utente.

## Not yet specified

(niente: tutto è in ticket)

## Out of scope

- App mobile nativa (scelta: web app).
- Cubi diversi dal 3x3 (2x2, 4x4, ecc.).
- Metodi avanzati (CFOP, Roux): l'app è per principianti.
- Dominio proprio: dopo il rilascio su *.pages.dev ([Piano di costruzione](issues/10-grilling-piano-costruzione.md)).
