// Contenuto delle 9 lezioni (notazione + 8 fasi), nello stile approvato nei "Testi delle lezioni":
// tu, frasi brevi, una idea per schermata, nomignoli per le formule, "Attento a…" al momento giusto.
import type { PhaseId } from '../solver/beginner'

export type T = { it: string; en: string }
/**
 * Demo sul cubo 3D. `from: 'solved'` parte dal cubo risolto (+ `setup`), `from: 'phase'` dal cubo
 * di esempio all'inizio della fase della lezione. `moves: 'phase'` = le prime mosse della soluzione della fase.
 */
export type Demo = { from: 'solved' | 'phase'; setup?: string; moves: string | 'phase' }
export type Screen = { text: T; demo?: Demo; warn?: boolean }
export type LessonId = 'notation' | PhaseId
export type Lesson = { id: LessonId; title: T; screens: Screen[]; goal: T; cheer: T }

export const LESSONS: Lesson[] = [
  {
    id: 'notation',
    title: { it: 'Come si legge una mossa', en: 'How to read a move' },
    screens: [
      { text: { it: 'Prima di iniziare, una regola d’oro: tieni il cubo sempre così. Giallo in alto, rosso verso di te.', en: 'Before we start, one golden rule: always hold the cube like this. Yellow on top, red facing you.' } },
      { text: { it: 'Guarda i quadratini al centro di ogni faccia: non si muovono mai rispetto agli altri centri. Il giallo è sempre sopra, il rosso sempre davanti.', en: 'Look at the square in the middle of each face: it never moves relative to the other centers. Yellow is always on top, red always in front.' }, demo: { from: 'solved', moves: 'R L U D' } },
      { text: { it: 'Ogni faccia ha una lettera, dall’inglese: U sopra, D sotto, F davanti, R destra, L sinistra. La faccia dietro, B, nel nostro metodo non serve mai.', en: 'Each face has a letter: U up, D down, F front, R right, L left. The back face, B, is never needed in our method.' } },
      { text: { it: 'Una lettera da sola vuol dire: gira quella faccia di un quarto di giro in senso orario, come se la guardassi da davanti a lei. R = destra su.', en: 'A letter alone means: turn that face a quarter turn clockwise, as if you were looking straight at it. R = right side up.' }, demo: { from: 'solved', moves: 'R' } },
      { text: { it: 'Con l’apostrofo, R’ (si legge “R primo”), è lo stesso giro ma al contrario: destra giù.', en: 'With an apostrophe, R’ (say “R prime”), it is the same turn backwards: right side down.' }, demo: { from: 'solved', moves: "R'" } },
      { text: { it: 'Un 2 vuol dire due quarti di giro: U2 = gira la faccia sopra due volte. Il verso non conta.', en: 'A 2 means two quarter turns: U2 = turn the top face twice. The direction does not matter.' }, demo: { from: 'solved', moves: 'U2' } },
      { text: { it: 'Durante una sequenza non girare il cubo intero in mano: se lo giri, le lettere cambiano significato. Giallo in alto, rosso verso di te, sempre.', en: 'During a sequence do not turn the whole cube in your hands: if you do, the letters change meaning. Yellow on top, red facing you, always.' }, warn: true },
    ],
    goal: { it: 'Esercizio: fai ogni mossa sul cubo virtuale premendo il pulsante giusto.', en: 'Exercise: do each move on the virtual cube by pressing the right button.' },
    cheer: { it: 'Hai imparato la lingua del cubo. Da qui in poi è solo pratica.', en: 'You have learned the language of the cube. From here on it is just practice.' },
  },
  {
    id: 'daisy',
    title: { it: 'La margherita', en: 'The daisy' },
    screens: [
      { text: { it: 'Prima fase: costruiamo una margherita. Un fiore con il centro giallo e 4 petali bianchi.', en: 'First phase: we build a daisy. A flower with a yellow center and 4 white petals.' } },
      { text: { it: 'I petali sono spigoli: i pezzi con 2 colori, a metà di ogni bordo. Ce ne sono 4 con il bianco.', en: 'The petals are edges: the pieces with 2 colors, in the middle of each border. Four of them have white.' } },
      { text: { it: 'Obiettivo: portare i 4 spigoli bianchi in alto, intorno al giallo, con il bianco verso l’alto. Niente formule: si fa a occhio, uno alla volta.', en: 'Goal: bring the 4 white edges to the top, around yellow, with white facing up. No formulas: you do it by eye, one at a time.' }, demo: { from: 'phase', moves: 'phase' } },
      { text: { it: 'Caso facile: lo spigolo bianco è nello strato di mezzo. Gira la faccia di lato per portarlo su. Caso in basso: mettilo sotto un posto libero e fai un mezzo giro (F2, R2…).', en: 'Easy case: the white edge is in the middle layer. Turn the side face to bring it up. Bottom case: put it under a free spot and do a half turn (F2, R2…).' } },
      { text: { it: 'Prima di portare su un petalo, gira la faccia sopra (U) finché il posto sopra di lui è libero. Altrimenti spingi fuori un petalo che avevi già messo.', en: 'Before bringing up a petal, turn the top face (U) until the spot above it is free. Otherwise you push out a petal you had already placed.' }, warn: true },
    ],
    goal: { it: 'Traguardo: sopra hai il centro giallo con 4 bianchi intorno. Gli altri pezzi non contano.', en: 'Goal: on top you have the yellow center with 4 whites around it. The other pieces do not matter.' },
    cheer: { it: 'Primo fiore fatto! Ora lo trasformiamo in una croce.', en: 'First flower done! Now we turn it into a cross.' },
  },
  {
    id: 'whiteCross',
    title: { it: 'La croce bianca', en: 'The white cross' },
    screens: [
      { text: { it: 'Ora portiamo i petali sotto, uno alla volta, per fare una croce bianca sulla faccia bianca.', en: 'Now we bring the petals down, one at a time, to make a white cross on the white face.' } },
      { text: { it: 'Guarda il colore di lato di un petalo. Gira la faccia sopra (U) finché quel colore è sopra il centro dello stesso colore.', en: 'Look at the side color of a petal. Turn the top face (U) until that color sits above the center of the same color.' } },
      { text: { it: 'Ora fai un mezzo giro di quella faccia (es. F2): il petalo scende sotto, al suo posto. Ripeti per tutti e 4.', en: 'Now do a half turn of that face (e.g. F2): the petal goes down, into its place. Repeat for all 4.' }, demo: { from: 'phase', moves: 'phase' } },
      { text: { it: 'Non fare il mezzo giro finché i colori non combaciano: lo spigolo finirebbe sotto ma nel posto sbagliato.', en: 'Do not do the half turn until the colors match: the edge would go down but into the wrong place.' }, warn: true },
    ],
    goal: { it: 'Traguardo: una croce bianca sotto, e ogni spigolo ha il colore del suo centro di lato.', en: 'Goal: a white cross underneath, and each edge matches the center on its side.' },
    cheer: { it: 'Croce fatta! Le basi sono pronte.', en: 'Cross done! The foundations are ready.' },
  },
  {
    id: 'whiteCorners',
    title: { it: 'Gli angoli bianchi', en: 'The white corners' },
    screens: [
      { text: { it: 'Hai la croce bianca sotto. Ora mettiamo i 4 angoli bianchi, e il primo strato sarà completo.', en: 'You have the white cross underneath. Now we place the 4 white corners, and the first layer will be complete.' } },
      { text: { it: 'Un angolo ha 3 colori. Ogni angolo bianco ha un solo posto giusto: quello tra i centri dei suoi altri due colori.', en: 'A corner has 3 colors. Each white corner has only one right spot: between the centers of its other two colors.' } },
      { text: { it: 'Trova un angolo bianco nello strato in alto. Gira il cubo e la faccia sopra finché è sopra il suo posto, in alto davanti a destra.', en: 'Find a white corner in the top layer. Turn the cube and the top face until it is above its spot, top front right.' } },
      { text: { it: 'Ecco la formula più famosa del cubo, la mossa del cavatappi: R U R’ U’. Destra su, sopra a sinistra, destra giù, sopra a destra.', en: 'Here is the most famous formula of the cube, the corkscrew move: R U R’ U’. Right up, top left, right down, top right.' }, demo: { from: 'solved', moves: "R U R' U'" } },
      { text: { it: 'Ripeti il cavatappi finché l’angolo va al suo posto con il bianco sotto: a volte 1 volta, a volte 3 o 5. Il resto del cubo torna a posto da solo.', en: 'Repeat the corkscrew until the corner drops into place with white underneath: sometimes once, sometimes 3 or 5 times. The rest of the cube fixes itself.' }, demo: { from: 'phase', moves: 'phase' } },
      { text: { it: 'Non fermarti a metà di un R U R’ U’: finisci sempre le 4 mosse, anche se sembra che stai rovinando tutto.', en: 'Never stop halfway through an R U R’ U’: always finish all 4 moves, even if it looks like you are ruining everything.' }, warn: true },
    ],
    goal: { it: 'Traguardo: la faccia sotto tutta bianca, e la prima fila di ogni lato di un solo colore.', en: 'Goal: the bottom face all white, and the first row of each side a single color.' },
    cheer: { it: 'Primo strato completo! Un terzo del cubo è tuo.', en: 'First layer complete! A third of the cube is yours.' },
  },
  {
    id: 'middleLayer',
    title: { it: 'Il secondo strato', en: 'The second layer' },
    screens: [
      { text: { it: 'Ora mettiamo i 4 spigoli dello strato di mezzo. Sono quelli senza giallo.', en: 'Now we place the 4 edges of the middle layer. They are the ones without yellow.' } },
      { text: { it: 'Trova uno spigolo senza giallo nello strato in alto. Gira la faccia sopra finché il suo colore davanti combacia con il centro davanti: fa una “T” rovesciata.', en: 'Find an edge without yellow in the top layer. Turn the top face until its front color matches the front center: it makes an upside-down “T”.' } },
      { text: { it: 'Se il colore in alto dello spigolo è quello del centro a destra, usa lo spigolo a destra: U R U’ R’ U’ F’ U F.', en: 'If the top color of the edge matches the right center, use edge to the right: U R U’ R’ U’ F’ U F.' }, demo: { from: 'solved', moves: "U R U' R' U' F' U F" } },
      { text: { it: 'Se è quello del centro a sinistra, usa lo spigolo a sinistra: U’ L’ U L U F U’ F’. È lo specchio della prima.', en: 'If it matches the left center, use edge to the left: U’ L’ U L U F U’ F’. It is the mirror of the first.' }, demo: { from: 'solved', moves: "U' L' U L U F U' F'" } },
      { text: { it: 'Se uno spigolo è già in mezzo ma al contrario, mettici sopra uno spigolo qualsiasi e fai una delle due formule: lo fai uscire e poi lo rimetti giusto.', en: 'If an edge is already in the middle but flipped, put any edge above it and do one of the two formulas: you pop it out and then put it back right.' }, warn: true },
    ],
    goal: { it: 'Traguardo: i primi due strati completi.', en: 'Goal: the first two layers complete.' },
    cheer: { it: 'Due strati su tre! Ora tocca al giallo.', en: 'Two layers out of three! Now it is yellow’s turn.' },
  },
  {
    id: 'yellowCross',
    title: { it: 'La croce gialla', en: 'The yellow cross' },
    screens: [
      { text: { it: 'Guarda la faccia sopra: conta solo il giallo degli spigoli. Puoi vedere un punto, una “L”, una linea o già la croce.', en: 'Look at the top face: only the yellow on the edges counts. You may see a dot, an “L”, a line or already the cross.' } },
      { text: { it: 'La formula è F R U R’ U’ F’. Si ricorda così: “FUR – U’R’F’”, le prime tre in un verso, le ultime tre al contrario.', en: 'The formula is F R U R’ U’ F’. Remember it as “FUR – U’R’F’”: the first three one way, the last three backwards.' }, demo: { from: 'solved', moves: "F R U R' U' F'" } },
      { text: { it: 'Con la “L”, tienila in alto a sinistra (dietro e sinistra). Con la linea, tienila orizzontale. Fai la formula e ripeti: punto → L → linea → croce.', en: 'With the “L”, hold it top left (back and left). With the line, hold it horizontal. Do the formula and repeat: dot → L → line → cross.' }, demo: { from: 'phase', moves: 'phase' } },
    ],
    goal: { it: 'Traguardo: una croce gialla sopra.', en: 'Goal: a yellow cross on top.' },
    cheer: { it: 'Croce gialla! Manca pochissimo.', en: 'Yellow cross! Almost there.' },
  },
  {
    id: 'yellowEdges',
    title: { it: 'Gli spigoli gialli', en: 'The yellow edges' },
    screens: [
      { text: { it: 'Ora gli spigoli gialli devono avere anche il colore di lato giusto. Gira la faccia sopra finché almeno 2 combaciano con i loro centri.', en: 'Now the yellow edges must also have the right side color. Turn the top face until at least 2 match their centers.' } },
      { text: { it: 'Se i due giusti sono vicini, tienili dietro e a destra e fai R U R’ U R U2 R’ U. Se sono opposti, fai la formula una volta e riprova.', en: 'If the two right ones are next to each other, hold them at the back and right and do R U R’ U R U2 R’ U. If they are opposite, do the formula once and try again.' }, demo: { from: 'solved', moves: "R U R' U R U2 R' U" } },
      { text: { it: 'Per ricordarla: R va avanti e indietro, U è sempre orario.', en: 'To remember it: R goes back and forth, U is always clockwise.' }, demo: { from: 'phase', moves: 'phase' } },
    ],
    goal: { it: 'Traguardo: gli spigoli gialli con il colore del loro lato.', en: 'Goal: the yellow edges matching their sides.' },
    cheer: { it: 'Spigoli a posto! Restano solo gli angoli.', en: 'Edges in place! Only the corners are left.' },
  },
  {
    id: 'yellowCornersPosition',
    title: { it: 'Gli angoli gialli al loro posto', en: 'Yellow corners in place' },
    screens: [
      { text: { it: 'Un angolo è “al suo posto” se ha i colori delle tre facce intorno, anche se è girato male.', en: 'A corner is “in place” if it has the colors of the three faces around it, even if it is twisted.' } },
      { text: { it: 'Trova un angolo al suo posto e tienilo davanti a destra. Poi fai U R U’ L’ U R’ U’ L: gli altri tre girano in tondo.', en: 'Find a corner in place and hold it front right. Then do U R U’ L’ U R’ U’ L: the other three cycle around.' }, demo: { from: 'solved', moves: "U R U' L' U R' U' L" } },
      { text: { it: 'Ripeti finché tutti e 4 sono al loro posto. Se nessuno lo è, fai la formula una volta da qualsiasi lato.', en: 'Repeat until all 4 are in place. If none are, do the formula once from any side.' }, demo: { from: 'phase', moves: 'phase' } },
    ],
    goal: { it: 'Traguardo: ogni angolo giallo nel suo posto, anche se girato.', en: 'Goal: every yellow corner in its place, even if twisted.' },
    cheer: { it: 'Ultimo passo in arrivo!', en: 'Last step coming up!' },
  },
  {
    id: 'yellowCornersOrientation',
    title: { it: 'Gli angoli gialli girati giusti', en: 'Yellow corners turned right' },
    screens: [
      { text: { it: 'Ultima fase! Tieni davanti a destra un angolo con il giallo non in alto. Fai R’ D’ R D finché il giallo va in alto (2 o 4 volte).', en: 'Last phase! Hold a corner whose yellow is not on top at front right. Do R’ D’ R D until yellow goes on top (2 or 4 times).' }, demo: { from: 'solved', moves: "R' D' R D R' D' R D" } },
      { text: { it: 'Poi gira solo la faccia sopra (U) per portare il prossimo angolo davanti a destra, e ripeti. Non girare il cubo intero!', en: 'Then turn only the top face (U) to bring the next corner to front right, and repeat. Do not turn the whole cube!' }, demo: { from: 'phase', moves: 'phase' } },
      { text: { it: 'Durante questa fase il cubo sembrerà rovinarsi tutto. È normale: continua fino in fondo e torna tutto a posto.', en: 'During this phase the cube will look completely messed up. That is normal: keep going to the end and it all comes back.' }, warn: true },
    ],
    goal: { it: 'Traguardo: il cubo risolto!', en: 'Goal: the solved cube!' },
    cheer: { it: 'Hai risolto il cubo di Rubik. Complimenti!', en: 'You solved the Rubik’s Cube. Congratulations!' },
  },
]

/** Sequenza dell'esercizio sulla notazione. */
export const NOTATION_DRILL = ['R', "R'", 'U', "U'", 'F', "F'", 'L', "L'", 'D', "D'"]
