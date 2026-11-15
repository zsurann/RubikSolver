import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // il cubo 3D (three.js) pesa ~250 KB gzip: è in un pezzo separato caricato solo quando serve
  build: { chunkSizeWarningLimit: 1000 },
  // in sviluppo l'API gira su `npm run dev:worker` (porta 8787)
  server: { proxy: { '/api': 'http://localhost:8787' } },
})
