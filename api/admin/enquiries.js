// GET   /api/admin/enquiries   latest 2000 requests, each with how many earlier requests the same email made
// PATCH /api/admin/enquiries   {id, status?, notes?, assigned_to?, follow_up_on?, by?}  every change is added to history
// Authorization: Bearer <ADMIN_PASSWORD>
import { db, ensureSchema, checkAdmin, readJson, send, clip } from '../_lib.js'

const STATUSES = new Set(['new', 'contacted', 'confirmed', 'invoiced', 'paid', 'attended', 'cancelled', 'lost'])

export default async function handler(req, res) {
  if (!process.env.ADMIN_PASSWORD) return send(res, 500, { message: 'ADMIN_PASSWORD is not set on the server' })
  if (!checkAdmin(req)) { await new Promise((r) => setTimeout(r, 600)); return send(res, 401, { message: 'Wrong password' }) }
  try {
    await ensureSchema()
    const q = db()
    if (req.method === 'GET') {
      const rows = await q`SELECT e.*, e.follow_up_on::text AS follow_up_on, (SELECT count(*)::int FROM enquiries p WHERE lower(p.email) = lower(e.email) AND p.created_at < e.created_at) AS earlier
                           FROM enquiries e ORDER BY e.created_at DESC LIMIT 2000`
      return send(res, 200, { rows })
    }
    if (req.method === 'PATCH') {
      const b = await readJson(req)
      const id = parseInt(b.id, 10)
      if (!Number.isFinite(id)) return send(res, 400, { message: 'Missing id' })
      const by = clip(b.by, 60) || 'staff'
      const [cur] = await q`SELECT status, assigned_to, follow_up_on FROM enquiries WHERE id = ${id}`
      if (!cur) return send(res, 404, { message: 'Not found' })
      const log = []
      if (b.status !== undefined) {
        if (!STATUSES.has(b.status)) return send(res, 400, { message: 'Bad status' })
        if (b.status !== cur.status) {
          await q`UPDATE enquiries SET status = ${b.status} WHERE id = ${id}`
          log.push(`Status ${cur.status} -> ${b.status}`)
          // closed requests need no more follow-up
          if (['paid', 'attended', 'cancelled', 'lost'].includes(b.status) && b.follow_up_on === undefined) await q`UPDATE enquiries SET follow_up_on = NULL WHERE id = ${id}`
        }
      }
      if (b.assigned_to !== undefined) {
        const a = clip(b.assigned_to, 60)
        await q`UPDATE enquiries SET assigned_to = ${a} WHERE id = ${id}`
        log.push(a ? `Assigned to ${a}` : 'Unassigned')
      }
      if (b.follow_up_on !== undefined) {
        const d = /^\d{4}-\d{2}-\d{2}$/.test(b.follow_up_on || '') ? b.follow_up_on : null
        await q`UPDATE enquiries SET follow_up_on = ${d} WHERE id = ${id}`
        log.push(d ? `Follow up on ${d}` : 'Follow-up cleared')
      }
      if (b.notes !== undefined) {
        await q`UPDATE enquiries SET notes = ${clip(b.notes, 4000)} WHERE id = ${id}`
        log.push('Notes updated')
      }
      if (b.log) log.push(clip(b.log, 300))
      if (log.length) {
        const entries = JSON.stringify(log.map((what) => ({ at: new Date().toISOString(), by, what })))
        await q`UPDATE enquiries SET history = history || ${entries}::jsonb, updated_at = now() WHERE id = ${id}`
      }
      const [row] = await q`SELECT e.*, e.follow_up_on::text AS follow_up_on, (SELECT count(*)::int FROM enquiries p WHERE lower(p.email) = lower(e.email) AND p.created_at < e.created_at) AS earlier FROM enquiries e WHERE id = ${id}`
      return send(res, 200, { ok: true, row })
    }
    return send(res, 405, { message: 'Method not allowed' })
  } catch (e) {
    console.error('admin error:', e.message)
    return send(res, 500, { message: 'Database error' })
  }
}
