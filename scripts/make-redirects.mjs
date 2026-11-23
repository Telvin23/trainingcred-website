// Rebuilds the "redirects" list in vercel.json so links from the old trainingcred.com keep working (301).
// Run after changing courses or categories:  node scripts/make-redirects.mjs
import { readFileSync, writeFileSync } from 'node:fs'
import { COURSES } from '../src/data/courses.js'
import { CATEGORIES } from '../src/data/catalog.js'

const r = (source, destination) => ({ source, destination, permanent: true })
const out = [
  // country folders on the old site: /ke/..., /us/..., /ug/... -> same path without the prefix
  r('/:cc([a-z]{2})', '/'),
  r('/:cc([a-z]{2})/:path*', '/:path*'),
  r('/training-courses', '/courses'), r('/training-courses/:path*', '/courses'),
  r('/course-finder', '/courses'), r('/course-finder/:path*', '/courses'),
  r('/training-calendar', '/calendar'), r('/training-calendar/:path*', '/calendar'),
  r('/corporate-training', '/for-teams'), r('/corporate-training/:path*', '/for-teams'),
  r('/contact-us', '/contact'), r('/about-trainingcred', '/about'), r('/privacy-policy', '/privacy'),
  r('/latest-added-courses', '/courses'),
  { source: '/login', destination: '/', permanent: false }, // login page removed 2026-11-23 (temporary, in case accounts come back)
]
for (const c of COURSES) {
  out.push(r(`/training-course/${c.slug}`, `/courses/${c.slug}`))
  out.push(r(`/course-schedules/${c.slug}/:city`, `/courses/${c.slug}`))
}
out.push(r('/training-course/:slug', '/courses'), r('/course-schedules/:slug/:city*', '/courses'))
for (const c of CATEGORIES) if (c.old) out.push(r(`/${c.old}/courses`, `/categories/${c.slug}`))

const cfg = JSON.parse(readFileSync('vercel.json', 'utf8'))
cfg.redirects = out
writeFileSync('vercel.json', JSON.stringify(cfg, null, 2) + '\n')
console.log(`vercel.json: ${out.length} redirects`)
