# Research 03: riconoscimento dei colori con la fotocamera nel browser

Risponde a [issues/03-research-riconoscimento-colori.md](../issues/03-research-riconoscimento-colori.md).
Data: 2026-11-15.

## Raccomandazione

**Griglia guida fissa a schermo, campionamento in Lab, poi assegnazione globale vincolata a pezzi validi. Niente OpenCV.js e niente ML.**

1. **Cattura**: `getUserMedia({video:{facingMode:"environment"}})`, con sopra il video una griglia 3x3 fissa al centro. L'utente allinea la faccia alla griglia. Per ogni cella si prende la **mediana RGB del 50% interno** (così si evitano bordi neri e riflessi), calcolata su alcuni frame stabili. Niente rilevamento di contorni: la griglia fissa basta e risparmia gli ~8 MB di OpenCV.js.
2. **Spazio colore**: da sRGB a CIE Lab (conversione scritta a mano, ~30 righe, oppure `culori`, MIT). Distanza ΔE: per partire basta CIE76, CIEDE2000 se serve.
3. **Calibrazione per sessione dai centri**: i 6 centri fanno da riferimento per i 6 colori *con la luce del momento*. Prima del confronto si corregge il bilanciamento del bianco prendendo come riferimento il centro bianco (si scalano R, G, B finché diventa neutro).
4. **Assegnazione globale, non sticker per sticker**: dopo aver scansionato le 6 facce si fanno corrispondere gli 8 angoli e i 12 spigoli scansionati ai pezzi reali del cubo. Per gli angoli ci sono 8 combinazioni di 3 colori × 3 rotazioni, per gli spigoli 12 combinazioni di 2 colori × 2 flip. Il costo è la somma dei ΔE e si risolve con l'algoritmo ungherese (matrici 8x8 e 12x12). Il risultato ha per costruzione 9 sticker per colore e solo pezzi che esistono. È la stessa idea di `rubiks-color-resolver` (MIT): palette presa dai centri, angoli e spigoli abbinati alle combinazioni attese.
5. **Validazione** di parità, torsione degli angoli e flip degli spigoli (vedi sotto). Se fallisce, si evidenziano i pezzi meno sicuri e l'utente li ritocca a mano (cosa già prevista).
6. **Ritocco manuale** sempre disponibile: un tap sul quadratino ne cambia il colore, sia nell'anteprima live della faccia sia nella vista finale.

Accuratezza attesa: con la calibrazione per sessione, i progetti esistenti riportano circa il 95-97% di sticker giusti anche con luce difficile. Il vincolo "solo pezzi validi" corregge buona parte del resto e il ritocco manuale copre quello che rimane.

Librerie: nessuna obbligatoria. Opzionale `culori` (MIT) per Lab e ΔE. Per l'algoritmo ungherese bastano ~60 righe nostre. Il solver (vedi ricerca 02) fa da ultima verifica.

## Confronto degli approcci

| Approccio | Pro | Contro | Verdetto |
|---|---|---|---|
| **Griglia guida fissa + soglie HSV fisse** | Semplicissimo | Le soglie fisse non reggono quando cambia la luce; rosso/arancione e bianco/giallo si confondono. Bug tipico su Stack Overflow: il range del "rosso" non include il rosso pieno e quello del "bianco" è quasi nero | No, da solo |
| **Griglia fissa + Lab + riferimenti dai centri** | Si adatta alla luce della sessione, leggero, nessuna dipendenza | L'utente deve allineare bene il cubo | **Sì (base)** |
| **Clustering dei 54 colori** (k-means / 6 gruppi da 9) | Sfrutta il vincolo "9 per colore" | Il k-means puro non garantisce gruppi da 9; rosso e arancione possono finire nello stesso gruppo | Sì, ma meglio come assegnazione vincolata per pezzi (sopra) |
| **Assegnazione vincolata a pezzi** (angoli/spigoli validi) | Elimina le combinazioni impossibili (es. un angolo rosso-arancione); molti dubbi rosso/arancione si risolvono grazie ai colori degli sticker vicini sullo stesso pezzo | Un po' più di codice | **Sì (raccomandato)** |
| **OpenCV.js** (contorni, omografia) | Trova il cubo senza doverlo allineare alla griglia | ~7-8 MB (4 MB con una build ridotta), lento da caricare su telefono | No per l'MVP; da valutare solo se la griglia fissa si rivela scomoda |
| **ML** (CNN/MobileNet, ELM, KNN) | Robusto se addestrato bene | Serve un dataset, il modello pesa, i colori cambiano tra marche di cubi; un paper mostra che i classificatori addestrati offline scendono al ~76-81% con luci diverse da quelle del training | No |
| **Classificazione online/relativa** (propagazione delle etichette a partire dai centri, paper arXiv 1901.03470) | 97,6% su 5 condizioni di luce | In sostanza è "riferimenti dai centri + vincoli", cioè quello che già facciamo | Conferma l'approccio |

## Problemi noti e mitigazioni

### Rosso / arancione
- È la coppia più confusa: quando cambia la luminosità, le distribuzioni del rosso e dell'arancione si sovrappongono (arXiv 1901.03470). Un rosso sotto un LED caldo può sembrare un arancione sotto un neon freddo.
- La relazione **relativa** però resta stabile: nella stessa foto l'arancione è più chiaro (L* più alta) e più tendente al giallo (b* e tinta più alti) del rosso. Quindi si confronta con i centri della sessione, non con valori assoluti.
- Il vincolo per pezzi aiuta molto: con lo schema colori occidentale (bianco/giallo, verde/blu, rosso/arancione opposti), un angolo bianco-verde-X può essere solo rosso oppure solo arancione, non tutti e due.
- Ultima risorsa: se l'assegnazione resta incerta, si ordinano i 18 sticker rossi e arancioni per tinta/b* e si considerano arancioni i 9 "più arancioni".

### Bianco / giallo
- La luce calda (lampade gialle) fa sembrare giallo il bianco, e con luci miste il bilanciamento del bianco automatico del telefono va in confusione.
- In Lab il bianco ha croma bassa (a* e b* vicini a 0), il giallo ha b* alto. Va corretto prima il bilanciamento, usando il centro bianco come riferimento neutro.
- Il mosso causa errori (un centro giallo letto come bianco): si campiona solo quando i frame sono stabili, cioè con varianza bassa per qualche centinaio di ms.

### Luce
- La luce scarsa è il caso peggiore. CubeFlow passa dal 53,7% al 97,1% di sticker giusti con luce fioca solo ricalibrando per sessione; con luce forte e direzionale passa dal 79,0% al 95,2%.
- Riflessi: la mediana sul 50% interno della cella scarta le macchie bianche. All'utente va suggerito di evitare la luce diretta sulla faccia.
- Controlli della fotocamera: `whiteBalanceMode`, `exposureMode`, `colorTemperature` e `torch` esistono come vincoli di `MediaTrackConstraints`, ma il supporto varia per browser e dispositivo (Safari li gestisce solo in parte, con bug noti su `torch`/`whiteBalanceMode`). Vanno usati solo se `getCapabilities()` li riporta, senza mai darli per scontati. Idea utile: dove è supportato, dopo la prima faccia si blocca il bilanciamento del bianco (`manual`) così tutte e 6 le facce hanno la stessa resa.
- Testo per la UX: "luce uniforme, niente lampade gialle, tieni fermo il cubo".

### Orientamento delle facce (errore umano, non di colore)
- Una faccia scansionata ruotata produce uno stato impossibile anche se i colori sono perfetti. La UX deve imporre l'orientamento (es. "centro bianco verso di te, verde in alto", con un'icona a ogni passo).
- Si può recuperare in automatico: se la validazione fallisce, si provano le 4 rotazioni di ogni faccia (4^6 = 4096 combinazioni, istantaneo) e si propone quella valida con il costo più basso.

### Daltonismo / accessibilità
- È nella mappa come punto aperto: nella vista di ritocco, oltre al colore, va mostrata anche la lettera (W/Y/R/O/G/B) o un simbolo.

## Validazione dello stato scansionato

I controlli, in ordine, ognuno con un messaggio chiaro per l'utente:

1. **Centri**: 6 colori diversi, con le coppie opposte coerenti con lo schema colori.
2. **Conteggi**: esattamente 9 sticker per colore (già garantito dall'assegnazione per pezzi).
3. **Pezzi esistenti**: ogni angolo è una delle 8 combinazioni reali e compare una sola volta; lo stesso vale per i 12 spigoli. Gli angoli hanno anche un verso: bianco-verde-rosso in senso orario non è lo stesso pezzo che in senso antiorario.
4. **Torsione degli angoli**: somma degli orientamenti degli angoli ≡ 0 (mod 3).
5. **Flip degli spigoli**: somma degli orientamenti degli spigoli ≡ 0 (mod 2).
6. **Parità**: la parità della permutazione degli angoli è uguale a quella della permutazione degli spigoli (numero di inversioni mod 2).

Queste condizioni sono necessarie e sufficienti (è il "teorema fondamentale della cubologia"); gli stati validi sono 43.252.003.274.489.856.000. Il solver Python di Kociemba fa esattamente questi controlli in `cubie.py::verify()`, con i messaggi "Total edge flip is wrong", "Total corner twist is wrong" e "Wrong edge and corner parity". È GPL-3.0: va usato come riferimento, non copiato. Conviene scrivere un `verify()` nostro (poche decine di righe) sulla rappresentazione a cubie che serve comunque al solver, e testarlo su stati ottenuti da mosse note: un forum riporta un'implementazione con sympy che dava errore su uno stato valido, quindi i test servono. `cubejs` (MIT) accetta la stessa stringa di 54 facelet (ordine U, R, F, D, L, B), ma il suo README non documenta alcuna validazione: meglio non contarci.

Messaggi utili per l'utente: torsione o flip sbagliati di solito vogliono dire uno sticker letto male su quel pezzo; parità sbagliata vuol dire due pezzi scambiati o una faccia ruotata. In ogni caso si evidenziano come candidati al ritocco i pezzi con il ΔE più alto.

## Progetti esistenti

| Progetto | Cosa fa | Licenza | Note |
|---|---|---|---|
| [dwalton76/rubiks-color-resolver](https://github.com/dwalton76/rubiks-color-resolver) | Dagli RGB degli sticker (cubi fino a 7x7) ai colori: Lab, palette dai centri (mediane), angoli e spigoli abbinati alle combinazioni attese (TSP), permutazione dei nomi a costo minimo | MIT | Python/MicroPython. Il miglior riferimento per l'algoritmo; da portare in JS l'idea, non il codice |
| [kkoomen/qbr](https://github.com/kkoomen/qbr) | Scanner da webcam + solver, modalità di calibrazione dei colori salvata, ΔE CIEDE2000 (dai topic del repo) | MIT | Python/OpenCV; dichiara il "99,9%" con buona luce dopo la calibrazione |
| [ViknanS/cubear](https://github.com/ViknanS/cubear) | Web app tutta lato client: OpenCV.js per contorni + omografia, mediana sul 50% interno, Lab, palette dai centri, riassegnazione 9 per colore, fallback manuale | MIT | Stack molto simile al nostro (React, Three.js, cubejs) ma progetto minuscolo (2 commit, 0 stelle): utile per le idee, non come dipendenza |
| [evanw123/CubeFlow](https://github.com/evanw123/CubeFlow) | Il browser cattura la faccia con una guida 3x3, la classificazione gira su un server Python con calibrazione per sessione, controllo di legalità, ritocco manuale | non indicata | L'unico con misure di accuratezza per tipo di luce (vedi sopra) |
| [jayemm-netizen/Rubiks-cube-solver](https://github.com/jayemm-netizen/Rubiks-cube-solver) | Web app per telefono: campiona il centro di ogni sticker, tap per cambiare colore, controllo dei conteggi, Kociemba tramite cube.js | nessuna licenza (non riusabile) | Buon esempio di UX "scansiona + ritocca" |
| [nicjm18/Rubik-Cube-Solver](https://github.com/nicjm18/Rubik-Cube-Solver) | Web app con Three.js, divide i 54 sticker in 6 gruppi da 9 usando i centri come semi | non verificata | |
| [ldez/cubejs](https://github.com/ldez/cubejs) | Solver Kociemba in JS, `fromString` a 54 facelet | MIT | 359 stelle; nessuna validazione documentata |
| [hkociemba/RubiksCube-TwophaseSolver](https://github.com/hkociemba/RubiksCube-TwophaseSolver) | Solver di riferimento con un `verify()` completo | GPL-3.0 | Solo come riferimento |

Non c'è un progetto JS maturo e mantenuto da adottare come libreria di riconoscimento. Conviene scrivere un modulo nostro (piccolo, testabile con foto di esempio) ispirandosi a rubiks-color-resolver e cubear.

Non verificato: l'attività recente dei repo (date degli ultimi commit), perché l'API GitHub non era accessibile da questa sessione. Le licenze sono lette dalle pagine dei repo.

## Fonti

- Paper "Color Recognition for Rubik's Cube Robot" (HSV, ELM, propagazione delle etichette, drift con la luce, rosso/arancione): https://ar5iv.labs.arxiv.org/html/1901.03470
- rubiks-color-resolver: https://github.com/dwalton76/rubiks-color-resolver , sorgente https://raw.githubusercontent.com/dwalton76/rubiks-color-resolver/master/rubikscolorresolver/solver.py
- qbr: https://github.com/kkoomen/qbr
- CubeAR: https://github.com/ViknanS/cubear
- CubeFlow: https://github.com/evanw123/CubeFlow
- jayemm-netizen/Rubiks-cube-solver: https://github.com/jayemm-netizen/Rubiks-cube-solver
- nicjm18/Rubik-Cube-Solver: https://github.com/nicjm18/Rubik-Cube-Solver
- cubejs: https://github.com/ldez/cubejs , https://npmjs.com/package/cubejs
- Solver two-phase di Kociemba e verify(): https://github.com/hkociemba/RubiksCube-TwophaseSolver , https://raw.githubusercontent.com/hkociemba/RubiksCube-TwophaseSolver/master/cubie.py
- muodov/kociemba (formato della stringa, GPL-2.0): https://github.com/muodov/kociemba
- Condizioni di risolvibilità: https://arxiv.org/pdf/2501.00144 , https://ruwix.com/the-rubiks-cube/unsolvable-rubiks-cube-invalid-scramble , https://www.speedsolving.com/threads/defining-if-a-mixed-rubiks-cube-is-valid-or-not.76462/latest , https://rosettacode.org/wiki/User:Arjun_sunel/Solvability_of_a_3x3x3_Rubik%27s_Cube_State%3F , https://awesome.ecosyste.ms/projects/github.com%2Fvihdzp%2Frubik-lean4
- Soglie HSV sbagliate (Stack Overflow): https://kiwix.lema.org/stackoverflow.com_en_all_2023-11/questions/72033920/is-there-a-way-to-make-colour-detector-more-accurate
- CIEDE2000 più debole nella regione del rosso: https://library.imaging.org/jist/articles/68/6/060403
- Bilanciamento del bianco automatico e luci miste: https://blogs.windows.com/devices/2013/05/06/all-you-need-to-know-about-your-smartphones-white-balance/ , https://people.csail.mit.edu/fredo/comp-photo-book/03-basic-image-processing-and-isp-13-auto-exposure-and-auto-white-balance.html
- Bianco/giallo e rosso/arancione nella percezione: https://www.speedsolving.com/goto/post?id=1210054 , https://www.speedcube.us/blogs/speedcubing_news_and_advice/best-cubes-for-colorblind-solvers
- MediaTrackConstraints (whiteBalanceMode, exposureMode, torch): https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints
- Bug WebKit su torch/whiteBalanceMode: https://bugs.webkit.org/show_bug.cgi?id=280970 , https://lists.webkit.org/pipermail/webkit-changes/2024-December/311252.html , https://bugs.webkit.org/show_bug.cgi?id=270779
- Dimensioni di OpenCV.js: https://answers.opencv.org/question/209264/opencvjs-smaller-package , https://answers.opencv.org/question/229032/opencv_jswasm-is-too-large , https://answers.opencv.org/question/181963/decreasing-size-of-opencvjs
- culori (Lab, differenze di colore, MIT): https://github.com/Evercoder/culori
