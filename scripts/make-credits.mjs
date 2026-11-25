// Turns image-credits.csv (written by the photo scripts) into public/photo-credits.json for the /photo-credits page.
import { existsSync, readFileSync, writeFileSync } from 'node:fs'

function parseCsv(text) {
  const rows = []; let row = [], cell = '', q = false
  text = text.replace(/^﻿/, '')
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    if (q) {
      if (ch === '"' && text[i + 1] === '"') { cell += '"'; i++ }
      else if (ch === '"') q = false
      else cell += ch
    } else if (ch === '"') q = true
    else if (ch === ',') { row.push(cell); cell = '' }
    else if (ch === '\n' || ch === '\r') { if (ch === '\r' && text[i + 1] === '\n') i++; row.push(cell); if (row.some((c) => c !== '')) rows.push(row); row = []; cell = '' }
    else cell += ch
  }
  if (cell || row.length) { row.push(cell); rows.push(row) }
  return rows
}

const out = []
if (existsSync('image-credits.csv')) {
  const rows = parseCsv(readFileSync('image-credits.csv', 'utf8'))
  let head = rows.shift()
  for (const r of rows) {
    if (r[0] === head[0]) continue // repeated header lines from appends
    const o = Object.fromEntries(head.map((h, i) => [h, r[i] || '']))
    out.push({ used: o.title || o.slug, creator: o.creator, license: o.license, url: o.landing_url, attribution: o.attribution })
  }
}
writeFileSync('public/photo-credits.json', JSON.stringify(out))
console.log(`make-credits: ${out.length} photo credits`)
