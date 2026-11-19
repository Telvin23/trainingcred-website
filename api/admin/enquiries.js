// GET   /api/admin/enquiries          list the latest 1000 (Authorization: Bearer <ADMIN_PASSWORD>)
// PATCH /api/admin/enquiries {id, status?, notes?}
import { db, ensureSchema, checkAdmin, readJson, send, clip } from '../_lib.js'

const STATUSES = new Set(['new', 'contacted', 'confirmed', 'invoiced', 'paid', 'cancelled'])

export default async function handler(req, res) {
  if (!process.env.ADMIN_PASSWORD) return send(res, 500, { message: 'ADMIN_PASSWORD is not set on the server' })
  if (!checkAdmin(req)) { await new Promise((r) => setTimeout(r, 600)); return send(res, 401, { message: 'Wrong password' }) }
  try {
    await ensureSchema()
    const q = db()
    if (req.method === 'GET') {
      const rows = await q`SELECT * FROM enquiries ORDER BY created_at DESC LIMIT 1000`
      return send(res, 200, { rows })
    }
    if (req.method === 'PATCH') {
      const b = await readJson(req)
      const id = parseInt(b.id, 10)
      if (!Number.isFinite(id)) return send(res, 400, { message: 'Missing id' })
      if (b.status !== undefined) {
        if (!STATUSES.has(b.status)) return send(res, 400, { message: 'Bad status' })
        await q`UPDATE enquiries SET status = ${b.status}, updated_at = now() WHERE id = ${id}`
      }
      if (b.notes !== undefined) await q`UPDATE enquiries SET notes = ${clip(b.notes, 4000)}, updated_at = now() WHERE id = ${id}`
      return send(res, 200, { ok: true })
    }
    return send(res, 405, { message: 'Method not allowed' })
  } catch (e) {
    console.error('admin error:', e.message)
    return send(res, 500, { message: 'Database error' })
  }
}
