// Shared helpers for the Vercel serverless functions (files starting with _ are not routes).
import { neon } from '@neondatabase/serverless'
import { timingSafeEqual, randomBytes } from 'node:crypto'

let sql
let ready
export function db() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set')
  if (!sql) sql = neon(process.env.DATABASE_URL)
  return sql
}

// Creates the table on first use, so no manual database setup is needed.
export async function ensureSchema() {
  if (ready) return ready
  const q = db()
  ready = (async () => {
    await q`CREATE TABLE IF NOT EXISTS enquiries (
      id BIGSERIAL PRIMARY KEY,
      ref TEXT UNIQUE NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      type TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'new',
      name TEXT, email TEXT, phone TEXT, organisation TEXT, job_title TEXT, country TEXT,
      course_slug TEXT, course_title TEXT, session_id TEXT, session_label TEXT, format TEXT, city TEXT,
      days INT, participants INT, fee_each TEXT, fee_total TEXT, payer TEXT,
      topic TEXT, preferred_dates TEXT, preferred_city TEXT, message TEXT,
      page TEXT, ip TEXT, user_agent TEXT, notes TEXT, updated_at TIMESTAMPTZ
    )`
    await q`CREATE INDEX IF NOT EXISTS enquiries_created_idx ON enquiries (created_at DESC)`
  })().catch((e) => { ready = null; throw e })
  return ready
}

export function makeRef() {
  const d = new Date()
  const ymd = `${String(d.getUTCFullYear()).slice(2)}${String(d.getUTCMonth() + 1).padStart(2, '0')}${String(d.getUTCDate()).padStart(2, '0')}`
  return `TC-${ymd}-${randomBytes(3).toString('hex').toUpperCase()}`
}

export function checkAdmin(req) {
  const want = process.env.ADMIN_PASSWORD || ''
  const got = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '')
  if (want.length < 8 || !got) return false
  const a = Buffer.from(want), b = Buffer.from(got)
  return a.length === b.length && timingSafeEqual(a, b)
}

export const clip = (v, n = 300) => (v == null || v === '' ? null : String(v).trim().slice(0, n))

export async function readJson(req) {
  if (req.body && typeof req.body === 'object') return req.body
  if (typeof req.body === 'string') return JSON.parse(req.body || '{}')
  const chunks = []
  for await (const c of req) chunks.push(c)
  return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}')
}

export function send(res, code, body) {
  res.statusCode = code
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Cache-Control', 'no-store')
  res.end(JSON.stringify(body))
}
