// npm run photos  ->  shows which courses have a photo and the exact file name to use for the rest.
// Put photos in src/assets/courses/ named <course-slug>.jpg (png and webp also work).
import { readdirSync, readFileSync } from 'node:fs'
const files = new Set(readdirSync('src/assets/courses').map((f) => f.replace(/\.[a-z]+$/i, '')))
const src = readFileSync('src/data/courses.js', 'utf8')
const courses = [...src.matchAll(/C\('([^']+)', '([^']+)'/g)].map((m) => ({ slug: m[1], title: m[2] }))
const have = courses.filter((c) => files.has(c.slug)), missing = courses.filter((c) => !files.has(c.slug))
console.log(`\nWith a photo (${have.length}):`)
for (const c of have) console.log('  ok  ' + c.title)
console.log(`\nStill using cover art (${missing.length}) - save a photo as:`)
for (const c of missing) console.log(`  src/assets/courses/${c.slug}.jpg   (${c.title})`)
