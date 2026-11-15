---
labels: [wayfinder:prototype]
status: closed
assignee: claude
blocked_by: [05-grilling-stack]
---
## Question

Come deve apparire e muoversi il cubo 3D? Prototipo grezzo con stile (materiali, colori, sfondo), rotazione con mouse/touch, animazione delle mosse (velocità, easing), evidenziazione della faccia da girare e frecce. L'utente reagisce e si fissa lo stile visivo.

Prototipo: `.scratch/rubik-app/prototypes/look-cubo.html` (https://claude.ai/artifact/8watFQFr4pyGhVHxi2as5P)

## Resolution

- Stile: Classico (adesivi lucidi arrotondati su plastica nera; palette Y #ffd500, W #ffffff, R #c41e3a, O #ff5800, G #009e60, B #0051ba).
- Sfondo: Studio (gradiente radiale grigio chiaro) con ombra morbida sotto il cubo.
- Animazione: Morbido (easing cubico in-out), durata di default ~550 ms, mosse doppie 1,5×.
- Aiuti: freccia bianca con bordo scuro che pulsa sulla faccia da girare, strato da girare illuminato, didascalia con lettera + frase ("Destra su"), contatore "N di M".
- Il prototipo resta il riferimento visivo (link sopra). Limite noto: frecce di L/D/B disegnate su faccia davanti/sopra; serve la vista standard automatica (già decisa nel Flusso UX).
