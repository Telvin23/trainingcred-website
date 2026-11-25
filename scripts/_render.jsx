// Renders every route to static HTML in dist/ (run by scripts/prerender.mjs after vite build).
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router'
import App from '../src/App.jsx'
import { HeadContext, headToHtml } from '../src/lib/seo.jsx'
import { allRoutes } from '../src/routes.js'
import { SITE } from '../src/data/site.js'

const dist = join(process.cwd(), 'dist')
const template = readFileSync(join(dist, 'index.html'), 'utf8')
const routes = allRoutes()
let n = 0
const detailDir = join(process.cwd(), 'public', 'course-data')
const emptyShell = template.replace(/<title>[\s\S]*?<\/title>/, `<title>${SITE.name}</title>`).replace('<!--head-->', '<meta name="robots" content="noindex" />')
for (const r of routes) {
  if (r.shell) { writeFileSync(join(dist, r.path.slice(1) + '.html'), emptyShell); n++; continue }
  globalThis.__COURSE_DETAIL__ = {}
  const m = r.path.match(/^\/courses\/([^/]+)$/)
  if (m) { try { globalThis.__COURSE_DETAIL__[m[1]] = JSON.parse(readFileSync(join(detailDir, m[1] + '.json'), 'utf8')) } catch { /* a course written in courses.js */ } }
  const collector = {}
  const html = renderToString(
    <HeadContext.Provider value={collector}>
      <StaticRouter location={r.path}><App /></StaticRouter>
    </HeadContext.Provider>,
  )
  const h = collector.head
  const page = template
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${(h?.title || SITE.name).replace(/&/g, '&amp;').replace(/</g, '&lt;')}</title>`)
    .replace('<!--head-->', headToHtml(h))
    .replace('<div id="root"><!--app--></div>', `<div id="root">${html}</div>`)
  const file = r.path === '/' ? join(dist, 'index.html') : r.path === '/404' ? join(dist, '404.html') : join(dist, r.path.slice(1) + '.html')
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, page)
  n++
}

const today = new Date().toISOString().slice(0, 10)
const urls = routes.filter((r) => !r.noSitemap).map((r) => `  <url><loc>${SITE.url}${r.path === '/' ? '/' : r.path}</loc><lastmod>${today}</lastmod><priority>${r.priority}</priority></url>`)
writeFileSync(join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`)
console.log(`prerender: ${n} pages + sitemap.xml (${urls.length} URLs)`)
