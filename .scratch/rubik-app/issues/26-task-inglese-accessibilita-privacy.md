---
labels: [wayfinder:task]
status: closed
assignee: claude
blocked_by: [25-task-sync-progressi, 12-grilling-accessibilita]
---
## Question

Traduzione inglese completa, accessibilità come deciso in [Accessibilità](12-grilling-accessibilita.md), privacy policy e termini IT/EN, pagina impostazioni dati.

## Resolution

Fatto:
- Inglese: tutta l'interfaccia ha le chiavi EN (tipo controllato: `en` deve avere le stesse chiavi di `it`), lezioni in IT/EN, errori del login tradotti dai codici di better-auth; lingua scelta nelle impostazioni (predefinita dal browser), `<html lang>` aggiornato. Tolte le pagine di prova `#cubo` e `#scansione` (sostituite da Risolvi il mio).
- Accessibilità: modalità daltonici con simboli ★ ○ ▲ ◆ ■ ✚ sugli adesivi del cubo 3D (anche nel ritocco) e nella tavolozza; nomi dei colori sempre scritti; "Grafica leggera" (niente antialias, ombra e alta risoluzione) e abbassamento automatico della risoluzione sotto ~25 fps; "riduci movimento" già rispettato; focus visibile, pulsanti alti almeno 44 px.
- Privacy e termini IT/EN (`#privacy`, `#termini`, link in home, impostazioni e account); "Cancella i dati di questo browser" nelle impostazioni; export/azzera/elimina nella pagina account.
Da completare dall'utente: nome del titolare e email di contatto in `src/app/legal.ts`.
