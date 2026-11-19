// Compiles scripts/_render.jsx with Vite (SSR build) into a temp folder, runs it, then removes the temp folder.
import { build } from 'vite'
import react from '@vitejs/plugin-react'
import { rmSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outDir = join(__dirname, '.prerender-tmp')
const today = new Date().toISOString().slice(0, 10)

await build({
  configFile: false,
  logLevel: 'warn',
  plugins: [react()],
  define: { __BUILD_DATE__: JSON.stringify(today) },
  build: { ssr: join(__dirname, '_render.jsx'), outDir, emptyOutDir: true, minify: false, rollupOptions: { output: { entryFileNames: 'render.mjs' } } },
})
try {
  await import(pathToFileURL(join(outDir, 'render.mjs')).href)
} finally {
  rmSync(outDir, { recursive: true, force: true })
}
