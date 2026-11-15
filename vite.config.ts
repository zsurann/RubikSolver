import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // in sviluppo l'API gira su `npm run dev:worker` (porta 8787)
  server: { proxy: { '/api': 'http://localhost:8787' } },
})
