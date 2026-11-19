import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Build date is baked in so past sessions drop off the site at every build (Vercel rebuilds daily via cron if set).
const today = new Date().toISOString().slice(0, 10)

export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: { __BUILD_DATE__: JSON.stringify(today) },
})
