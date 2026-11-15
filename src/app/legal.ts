// Testi legali brevi e chiari. CONTROLLER/CONTACT vanno completati da chi pubblica l'app.
export const CONTROLLER = '[Nome del titolare]'
export const CONTACT = '[email di contatto]'
export const UPDATED = '2026-11-15'

type Section = { h: string; p: string[] }
export const PRIVACY: Record<'it' | 'en', Section[]> = {
  it: [
    { h: 'Chi siamo', p: [`Titolare del trattamento: ${CONTROLLER}. Contatto per la privacy: ${CONTACT}.`] },
    { h: 'Senza account', p: ['Puoi usare tutta l’app senza account. Impostazioni, lezioni completate, tempi e cubi restano solo nel tuo browser e non ci vengono inviati.'] },
    { h: 'Fotocamera', p: ['Le immagini della fotocamera vengono elaborate solo sul tuo dispositivo per riconoscere i colori. Non vengono mai salvate né inviate a nessuno.'] },
    { h: 'Con l’account (facoltativo, dai 14 anni)', p: [
      'Salviamo: email, nome (la parte prima della @ o quello di Google), password cifrata o collegamento a Google, sessioni di accesso; i tuoi progressi (lezioni, tempi, cubi scansionati come elenco di colori).',
      'Base giuridica: esecuzione del servizio che hai chiesto (art. 6.1.b GDPR). Conserviamo i dati finché hai l’account; quando lo elimini li cancelliamo subito.',
      'Fornitori: Cloudflare (hosting e database, dati nell’Unione Europea), Resend (invio delle email di accesso), Google (solo se scegli “Continua con Google”).',
    ] },
    { h: 'Cookie', p: ['Usiamo solo un cookie tecnico per tenerti connesso all’account. Niente cookie di profilazione o pubblicità, niente statistiche di terze parti.'] },
    { h: 'I tuoi diritti', p: ['Dalla pagina Account puoi scaricare i tuoi dati, azzerarli o eliminare l’account. Per altre richieste (accesso, rettifica, opposizione) scrivi a ' + CONTACT + '. Puoi anche rivolgerti al Garante per la protezione dei dati personali.'] },
  ],
  en: [
    { h: 'Who we are', p: [`Data controller: ${CONTROLLER}. Privacy contact: ${CONTACT}.`] },
    { h: 'Without an account', p: ['You can use the whole app without an account. Settings, completed lessons, times and cubes stay only in your browser and are not sent to us.'] },
    { h: 'Camera', p: ['Camera images are processed only on your device to recognize the colors. They are never saved or sent to anyone.'] },
    { h: 'With an account (optional, 14+)', p: [
      'We store: email, name (the part before the @ or your Google name), hashed password or Google link, sign-in sessions; your progress (lessons, times, scanned cubes as a list of colors).',
      'Legal basis: providing the service you asked for (Art. 6.1.b GDPR). We keep the data while you have an account; when you delete it we erase it right away.',
      'Providers: Cloudflare (hosting and database, data in the European Union), Resend (sign-in emails), Google (only if you choose “Continue with Google”).',
    ] },
    { h: 'Cookies', p: ['We only use a technical cookie to keep you signed in. No profiling or advertising cookies, no third-party analytics.'] },
    { h: 'Your rights', p: ['From the Account page you can download your data, reset it or delete your account. For other requests (access, rectification, objection) write to ' + CONTACT + '. You can also contact your data protection authority.'] },
  ],
}
export const TERMS: Record<'it' | 'en', string[]> = {
  it: ['Cubo Facile è gratuito e offerto così com’è, senza garanzie.', 'Non usare il servizio per attività illecite o per sovraccaricarlo. Possiamo chiudere account usati in modo abusivo.', 'Il solver per la soluzione breve usa min2phase di Chen Shuang (licenza MIT).'],
  en: ['Cubo Facile is free and provided as is, without warranties.', 'Do not use the service for unlawful activities or to overload it. We may close accounts used abusively.', 'The short-solution solver uses min2phase by Chen Shuang (MIT license).'],
}
