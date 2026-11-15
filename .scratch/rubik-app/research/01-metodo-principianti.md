# Research 01 — Metodo per insegnare il 3x3 a un principiante assoluto

Risponde a: `.scratch/rubik-app/issues/01-research-metodo-principianti.md`

## Raccomandazione

Consiglio il **metodo a strati (LBL) in 8 fasi**, con la **margherita** in partenza e il **giallo sempre in alto** dall'inizio alla fine. Sono **7 sequenze da imparare**, tutte brevi (4–8 mosse) e costruite quasi tutte sui due "trigger" `R U R' U'` e `R' D' R D`.
- È l'ordine usato dalla guida ufficiale Rubik's (margherita → croce bianca → angoli → secondo strato → croce gialla …) e da ruwix. Gli algoritmi più lunghi e difficili della guida ufficiale (9 mosse, con `B2` o con le mosse `L R'` contemporanee) li ho sostituiti con quelli più corti di ruwix e J Perm.
- Il cubo **non si capovolge mai**: giallo in alto, bianco in basso, dalla margherita alla fine. Per un cubo 3D animato questo conta molto, perché la camera resta fissa e chi impara non perde l'orientamento.
- Le mosse usate sono solo **U, R, F, L, D**. `B` non compare mai, e così si evita la mossa più difficile da visualizzare.
- Non ho trovato dati rigorosi sul "tasso di successo". Le fonti divulgative stimano **2–3 ore** fino alla prima risoluzione guidata e **1–4 settimane** (30 min/giorno) per risolverlo da soli.

## Confronto delle varianti

| Variante | Fasi | Sequenze da memorizzare | Pro | Contro |
|---|---|---|---|---|
| **Guida ufficiale Rubik's** ("You CAN Do the Cube") | 3 strati, 8 passaggi | ~8 (corner swap `R' F R' B2 R F' R' B2 R2 U'`, edge cycle `F2 U L R' F2 L' R U F2`) | Margherita, filastrocche ("FUR U'R'F'", "Feed the fish"), consigli didattici ottimi | Ultimi due algoritmi lunghi (9–10 mosse), usano `B2` e `L R'` insieme |
| **ruwix** (beginner method) | 7 passi | ~7 (`R' D' R D`, 2 per il secondo strato, `F R U R' U' F'`, Sune+U, `U R U' L' U R' U' L`) | Algoritmi brevi, molto diffuso, animazioni per ogni passo | Il primo strato si fa con il bianco in alto, poi il cubo si capovolge (passaggio scomodo nel 3D) |
| **J Perm** (jperm.net/3x3) | 7 passi | ~7 blocchi basati sulla "4-move sequence" destra/sinistra | Niente notazione formale ("ruota la faccia superiore con la mano destra"), un solo trigger riusato quasi ovunque | Senza notazione l'utente non può passare ad altre guide o a 4LLL/CFOP; nell'ultimo passo si capovolge il cubo |
| **Wikibooks** (classico) | 6 passi | ~20 sequenze, molti casi | Spiega bene il "perché" | Troppi casi per un principiante |
| **4LLL / 2-look OLL+PLL** | F2L + 4 sguardi | 16+ | Passo successivo naturale verso lo speedcubing | Troppo per chi parte da zero: da proporre come "livello 2" |

**Scelta**: struttura e didattica della guida ufficiale, con algoritmi di ruwix/J Perm per l'ultimo strato e con l'orientamento fisso (giallo in alto).

## Fasi e algoritmi raccomandati

Orientamento fisso: **giallo in alto (U), bianco in basso (D)**. La faccia F è quella che guarda l'utente.

| # | Fase | Algoritmo | Come tenere il cubo / note |
|---|---|---|---|
| 1 | **Margherita**: 4 spigoli bianchi intorno al centro giallo | intuitivo (0 algoritmi) | Porta in alto gli spigoli bianchi con mosse singole, senza spingere fuori quelli già messi (ruota prima `U`). |
| 2 | **Croce bianca** | intuitivo: `U` fino ad allineare il colore laterale con il suo centro, poi `F2` | Ripeti per i 4 spigoli. La croce finisce in basso, senza capovolgere il cubo. |
| 3 | **Angoli bianchi** (primo strato) | `R U R' U'` ripetuto (1, 3 o 5 volte) | Porta l'angolo in alto, sopra la sua posizione (in alto davanti a destra), e ripeti finché non è risolto. Se è già in basso ma storto: una volta per farlo uscire. |
| 4a | **Secondo strato, spigolo a destra** | `U R U' R' U' F' U F` | Spigolo in alto davanti, il suo colore frontale allineato al centro F, destinazione a destra. |
| 4b | **Secondo strato, spigolo a sinistra** | `U' L' U L U F U' F'` | Speculare. Spigolo bloccato o al contrario: esegui 4a/4b con uno spigolo qualsiasi per farlo uscire. |
| 5 | **Croce gialla** | `F R U R' U' F'` | Casi: punto → L → linea → croce. Tieni la L in alto a sinistra (dietro + sinistra) e la linea orizzontale. Ripeti fino alla croce. |
| 6 | **Spigoli gialli al loro posto** | `R U R' U R U2 R' U` (Sune + U) | Ruota `U` finché 2 spigoli combaciano con i centri. Se sono adiacenti, tienili dietro e a destra. Se sono opposti, esegui una volta da qualsiasi lato e poi rifai. |
| 7 | **Angoli gialli al loro posto** | `U R U' L' U R' U' L` | Tieni in alto davanti a destra un angolo già al posto giusto (anche se ruotato). Se non ce n'è nessuno, esegui una volta da qualsiasi lato. Ripeti finché sono tutti al posto giusto. |
| 8 | **Orientare gli angoli gialli** | `R' D' R D` ripetuto (2 o 4 volte per angolo) | Angolo storto in alto davanti a destra: ripeti finché il giallo non è in alto. Poi **gira solo U** per portare lì il prossimo. Non ruotare il cubo intero. A metà sembra tutto rovinato: è normale. |

Riepilogo: **7 algoritmi** (`R U R' U'`, 4a, 4b, `F R U R' U' F'`, Sune+U, ciclo angoli, `R' D' R D`) più 2 fasi intuitive.

Alternativa ufficiale per le fasi 6–8: Sune per orientare gli angoli, `R' F R' B2 R F' R' B2 R2 U'` per scambiare gli angoli e `F2 U L R' F2 L' R U F2` per gli spigoli. È valida, ma più lunga e usa `B`, quindi non la consiglio.

## Notazione: come presentarla a chi non la conosce

Linee guida che si ritrovano nella guida ufficiale, in coach.rubiks.com/it e in J Perm:

1. **Prima i pezzi, poi le mosse.** I centri sono fissi e danno il colore alla faccia: bianco è opposto a giallo, blu a verde, rosso ad arancio. Gli spigoli hanno 2 colori, gli angoli 3. La guida ufficiale propone un gesto tattile: "un dito per un centro, due per uno spigolo, tre per un angolo".
2. **Lettere = facce**, con le iniziali inglesi (standard internazionale, mantenuto anche nella versione italiana ufficiale): U su, D giù, R destra, L sinistra, F fronte (B dietro, non serve). In UI: "R (destra)".
3. **Senso della rotazione**: lettera semplice = ¼ di giro **orario guardando quella faccia**; `'` (apice, "primo") = antiorario; `2` = mezzo giro. Questo è il punto che confonde di più (es. `U` e `L` "sembrano" girare al contrario). Sul cubo 3D va mostrata una freccia direttamente sulla faccia.
4. **Introduzione graduale**: nelle fasi 1–3 servono solo `U`, `F`, `R`. `L` e `D` arrivano alle fasi 4 e 8. Insegna ogni lettera nuova quando serve, non tutte all'inizio.
5. **Raggruppa in trigger.** `R U R' U'` diventa un "pezzo unico" con un nome: "la mossa base" (J Perm: "4-move sequence"). I 4a/4b si leggono come `U R U' R'` + `U' F' U F`.
6. **Filastrocche e mnemonici** (guida ufficiale): "FUR – U'R'F'" (le prime tre mosse sono orarie, le ultime tre antiorarie); per il Sune: "R va avanti e indietro, U sempre orario".
7. **Tieni la faccia F fissa** per tutto l'algoritmo. La guida ufficiale consiglia di appoggiare il cubo sul tavolo.

## Consigli didattici per l'app

- **Player mossa per mossa**: evidenzia la mossa corrente nella stringa, mostra una freccia sulla faccia, offri avanti/indietro/rallenta/ripeti. Sostituisce il "post-it sul pezzo" e il "riguardati in video" della guida ufficiale.
- **Evidenzia il pezzo da seguire** e metti in grigio quelli irrilevanti (la guida ufficiale usa il grigio per "non importa").
- **Un traguardo visivo per ogni fase** ("quando il tuo cubo è così, passa alla fase successiva") e la possibilità di **esercitarsi su una sola fase** con uno scramble mirato. La guida ufficiale consiglia di ripetere uno strato più volte prima di passare al successivo, e le fonti concordano che allenarsi per singola fase rende più dell'eseguire solo risoluzioni complete.
- **Prevenire gli errori noti**: non capire la notazione, ruotare il cubo intero a metà algoritmo, interrompere una sequenza, rovinare il primo strato nella fase 4, panico nella fase 8 ("sembra rotto": avvisare prima). Va spiegato anche il caso "irrisolvibile" (1 o 3 spigoli gialli orientati, oppure un solo angolo ruotato), che si verifica solo se il cubo è stato smontato.
- **Mindset**: frasi incoraggianti ("sei a due terzi!") come nella guida ufficiale.
- **Livello 2 opzionale**: 4LLL (2-look OLL + 2-look PLL), per chi vuole andare più veloce.

## Fonti

- Guida ufficiale Rubik's 3x3 (PDF "You CAN Do the Rubik's Cube Solution Guide"): https://cdn.shopify.com/s/files/1/0881/0899/0813/files/Rubiks-3x3-Solve-Guide.pdf
- Rubik's Coach, guida rapida in italiano (terminologia, algoritmi): https://coach.rubiks.com/it/guida-rapida
- ruwix, Beginner's method: https://ruwix.com/the-rubiks-cube/how-to-solve-the-rubiks-cube-beginners-method/
- ruwix, posizionare gli angoli gialli: https://ruwix.com/the-rubiks-cube/how-to-solve-the-rubiks-cube-beginners-method/step-6-position-yellow-corners
- ruwix, orientare gli angoli gialli: https://ruwix.com/the-rubiks-cube/how-to-solve-the-rubiks-cube-beginners-method/orient-yellow-corners-how-to-solve-last-layer-corner/
- J Perm, How To Solve The 3x3: https://jperm.net/3x3
- Wikibooks, How to Solve the Rubik's Cube: https://en.wikibooks.org/wiki/How_to_Solve_the_Rubik's_Cube
- cube.academy, Beginner / 4-look LL: https://www.cube.academy/beginner-algs
- speedcube.nl, errori dei principianti: https://www.speedcube.nl/en/8-mistakes-that-beginners-make-when-solving-a-rubiks-cube/
- speedcube.nl, tempi dei principianti: https://www.speedcube.nl/en/what-is-the-average-solving-time-for-beginners/
- Errori comuni (cuberkart): https://cuberkart.com/blogs/news/common-rubiks-cube-mistakes-beginners-make-and-how-to-avoid-them
