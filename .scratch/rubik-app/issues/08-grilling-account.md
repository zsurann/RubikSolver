---
labels: [wayfinder:grilling]
status: closed
assignee: claude
blocked_by: [04-research-backend-account]
---
## Question

Cosa salva l'account e quanto è obbligatorio? Login richiesto o facoltativo (uso da ospite), quali dati (lezioni completate, tempi di pratica, cubi scansionati?), si salvano le immagini della fotocamera o solo i colori?

## Resolution

- Login facoltativo (già deciso nel Flusso UX). Metodi: Google, email + password (con recupero via email), link magico via email. Niente Apple.
- Dati salvati nell'account: lezioni completate/sbloccate, tempi di pratica (tempo + data, per media e record), preferenze (lingua, velocità animazioni, aiuti visivi), cubi scansionati (solo lo stato a 54 colori, con data).
- Immagini della fotocamera: mai salvate né inviate al server; elaborate solo nel browser.
- Da ospite: progressi salvati nel browser; al primo login vengono uniti all'account.
- Minori: account solo 14+ (conferma "ho almeno 14 anni" alla registrazione); sotto i 14 si usa l'app da ospite.
- Controllo utente: elimina account (cancella tutti i dati), esporta dati in JSON, azzera progressi.
