# Cubo Facile

Web app che insegna a risolvere il cubo di Rubik 3x3 a chi parte da zero. Mappa del progetto: `.scratch/rubik-app/map.md`.

## Sviluppo

```sh
npm install
npm run dev      # server locale
npm test         # test (Vitest)
npm run lint     # oxlint
npm run build    # build in dist/
```

## Anteprime su Cloudflare Pages

Collegamento Git (una volta, dalla dashboard Cloudflare):

1. Workers & Pages → Create → Pages → Connect to Git → repo `rubiksolver`.
2. Framework preset: Vite. Build command `npm run build`, output `dist`.
3. Environment variable `NODE_VERSION` = `22`.

Ogni push crea un'anteprima `*.pages.dev`.
