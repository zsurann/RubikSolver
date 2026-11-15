---
labels: [wayfinder:task]
status: closed
assignee: claude
blocked_by: [13-task-scheletro, 15-task-cubo-3d]
---
## Question

Benvenuto breve (3 schermate, saltabile), home con Impara / Risolvi il mio / Pratica, navigazione, impostazioni (lingua, velocità, aiuti).

## Resolution

Fatto: `src/app/` con `Welcome` (3 schermate con cubo 3D e "Fammi vedere", saltabile, mostrata solo la prima volta), `Home` (Risolvi il mio in evidenza, Impara, Pratica, impostazioni), `SettingsScreen` (lingua IT/EN, durata mossa, frecce, strato evidenziato, modalità daltonici, grafica leggera, "Rivedi il benvenuto"), `settings.tsx` + `store.ts` (impostazioni salvate nel browser, con fallback in memoria). Router a hash con barra "← Home". Stile comune in `index.css` (token chiaro/scuro, Fredoka + Nunito, classi btn/card/stage/status). La guida usa velocità, frecce ed evidenziazione dalle impostazioni. Verificato con screenshot chiaro/scuro a 400 px.
