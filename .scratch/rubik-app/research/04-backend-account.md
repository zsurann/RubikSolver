# 04 — Backend per account cloud e progressi utente

Ricerca del 2026-11-15. Risponde a `issues/04-research-backend-account.md`.

## Raccomandazione

**Supabase (piano Free, regione `eu-central-1` Frankfurt), con il frontend statico ospitato a parte (Cloudflare Pages/Workers static assets, GitHub Pages o Netlify).**

Perché:
- Login email (password o magic link) e Google sono già pronti nel piano Free, senza un backend da scrivere: il frontend statico usa `supabase-js` e le Row Level Security policy di Postgres.
- Il free tier (50.000 MAU, 500 MB di DB) è molto più di quanto serve per lezioni completate e tempi di pratica.
- I dati, account inclusi, stanno nella regione UE che scegli quando crei il progetto (lo schema `auth` vive nello stesso Postgres). Con Firebase il punto è meno chiaro.
- Schema SQL standard: se un domani servirà migrare, l'uscita è facile (si fa `pg_dump`).

Limiti da sapere:
1. Un progetto Free **va in pausa dopo 7 giorni senza attività**. Con utenti reali di solito non succede, ma in fase di sviluppo sì: si riattiva dalla dashboard (per evitare la pausa servono Pro a $25/mese o un ping periodico).
2. L'SMTP integrato manda **solo 2 email/ora**. Per conferme e magic link in produzione va configurato un SMTP proprio (Resend, Brevo e simili hanno free tier).

Alternativa se si vuole un solo fornitore e zero pause: **Cloudflare (Workers + D1 con `jurisdiction=eu` + better-auth)**. È gratis e generoso, ma l'auth la si scrive e la si mantiene da soli. Da scegliere solo se si è disposti a scrivere qualche centinaio di righe di backend.

## Tabella di confronto

| | **Supabase** | **Firebase** | **Cloudflare Workers + D1 + better-auth** | **Appwrite Cloud** | **PocketBase (self-host)** |
|---|---|---|---|---|---|
| Login email | Sì (password, magic link, OTP) | Sì (password, link email) | Sì, tramite libreria (better-auth); invio email a parte | Sì | Sì |
| Login Google | Sì, incluso nel Free | Sì | Sì (OAuth configurato a mano nella libreria) | Sì | Sì (15+ provider OAuth2) |
| Free tier | 50k MAU, DB 500 MB, 5 GB egress, 2 progetti; **pausa dopo 7 giorni di inattività** | Spark: 50k MAU, Firestore 1 GiB, 50k letture/20k scritture al giorno | Workers 100k richieste/giorno; D1 5 GB, 5M righe lette e 100k scritte al giorno; asset statici gratis e illimitati | ~75k MAU, 5 GB banda, 2 GB storage; pausa dopo 7 giorni di inattività (fonti terze) | Software gratis; si paga la VPS |
| Primo piano a pagamento | Pro $25/mese | Blaze pay-as-you-go (Spark incluso) | Workers Paid $5/mese | Start $10/mese, Pro $25/mese | VPS ~€4/mese (Hetzner) |
| Region UE | Sì: Frankfurt, Paris, Ireland, Stockholm (scelta alla creazione) | Firestore sì (regioni europee, multi-region `eur3`); per l'**Auth** non c'è conferma ufficiale di una sede UE | D1 `jurisdiction=eu` garantisce che i dati restino nell'UE (solo alla creazione) | Frankfurt (fonti terze) | Dove sta la VPS (es. Germania/Finlandia) |
| Facilità con frontend statico | Alta: SDK JS + RLS, nessun server | Alta: SDK JS + Security Rules, nessun server | Media: Worker con endpoint e sessioni da scrivere | Alta: SDK JS | Alta lato SDK, ma il server va gestito (aggiornamenti, backup, TLS) |
| Hosting incluso | No (si usa Pages/Netlify/GitHub Pages) | Sì (Hosting: 10 GB, 360 MB/giorno sul Free) | Sì (static assets dei Workers) | Sì (Appwrite Sites) | Sì (serve anche file statici) |
| Lock-in | Basso (Postgres) | Alto (Firestore NoSQL proprietario) | Basso (SQLite) | Medio (open source, self-host possibile) | Basso |

Note:
- Firebase funziona bene ed è facile, ma per gli utenti UE i dubbi sono due: non c'è una conferma ufficiale che l'Auth possa stare nell'UE, e Firestore è proprietario. Il trasferimento verso gli USA è coperto dall'EU-US Data Privacy Framework, a cui Google aderisce. È legale, ma va scritto nella privacy policy.
- I numeri di Appwrite vengono in parte da aggregatori, che tra loro non concordano su tutto (per esempio sul prezzo del Pro). Il blog ufficiale conferma solo il piano Start da $10.
- PocketBase è il più economico a regime e tiene tutto in UE, ma aggiunge un server da amministrare. Per un progetto piccolo è più manutenzione che risparmio.

## GDPR: il minimo da fare

L'app tratta dati personali (email, eventuale nome e foto da Google, progressi legati all'account). Il titolare del trattamento è chi gestisce l'app; il fornitore del backend è responsabile del trattamento (processor).

1. **Privacy policy** in italiano, linkata nella schermata di registrazione e nel footer. Deve dire: chi è il titolare e come contattarlo; quali dati si raccolgono (email, progressi, tempi); la finalità (salvare e sincronizzare i progressi); la base giuridica (esecuzione del servizio richiesto, art. 6.1.b); i fornitori usati (es. Supabase, regione UE; Google per il login) ed eventuali trasferimenti fuori UE; per quanto tempo si conservano i dati; i diritti dell'utente (accesso, rettifica, cancellazione, portabilità) e il reclamo al Garante.
2. **DPA**: Supabase, Google/Firebase e Cloudflare offrono un Data Processing Addendum standard. Va accettato o almeno verificato dalla dashboard.
3. **Consenso**: per creare l'account non serve un consenso a parte (la base è il contratto). Basta un testo del tipo "Registrandoti accetti la Privacy Policy". Il consenso diventa necessario solo per newsletter, analytics non anonimi o cookie non tecnici; se questi mancano, **non serve il banner cookie**, perché i cookie e il localStorage della sessione di login sono tecnici.
4. **Cancellazione account**: un pulsante "Elimina account" che cancella l'utente e i suoi progressi. Su Supabase: una Edge Function o RPC con service key chiama `auth.admin.deleteUser` e la cascata FK elimina le righe collegate. Firebase: `user.delete()` più la cancellazione dei documenti.
5. **Minimizzazione**: salvare solo quello che serve (niente nome o foto se non si usano). Opzionale: un export JSON dei progressi per la portabilità.
6. **Minori**: in Italia l'età del consenso digitale è 14 anni (art. 2-quinquies, D.lgs. 196/2003). Con la base contrattuale il punto pesa meno, ma un'app di Rubik per principianti può attirare ragazzini: conviene indicarlo nella policy.

## Fonti (consultate il 2026-11-15)

- Supabase pricing: https://supabase.com/pricing
- Supabase regioni: https://supabase.com/docs/guides/platform/regions
- Supabase rate limit auth/SMTP: https://supabase.com/docs/guides/auth/rate-limits
- Firebase pricing: https://firebase.google.com/pricing
- Firebase privacy/GDPR: https://firebase.google.com/support/privacy
- Richiesta "Firebase Authentication for EU" (dati Auth negli USA, thread datato): https://firebase.uservoice.com/forums/948424-general/suggestions/46591651-firebase-authentication-for-eu
- Cloudflare D1 pricing: https://developers.cloudflare.com/d1/platform/pricing/
- Cloudflare D1 data location / jurisdiction: https://developers.cloudflare.com/d1/configuration/data-location/
- Cloudflare Workers pricing: https://developers.cloudflare.com/workers/platform/pricing/
- better-auth su Cloudflare Workers (guida di terzi): https://portfolio-web-8bj.pages.dev/posts/better-auth-cloudflare-workers
- Appwrite pricing: https://appwrite.io/pricing
- Appwrite Start plan (blog ufficiale): https://appwrite.io/blog/post/introducing-appwrite-cloud-start-plan
- Appwrite limiti free (aggregatore, da verificare): https://agentdeals.dev/vendor/appwrite-cloud
- PocketBase FAQ: https://pocketbase.io/faq/
- Prezzo Hetzner (fonte secondaria): https://dev.to/0012303/hetzner-has-the-cheapest-vps-eu379month-for-2-vcpu-4gb-ram-40gb-ssd-free-trial-credits-3h6i
