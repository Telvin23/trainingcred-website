// Runs every weekday at 7:00 am Nairobi time (see "crons" in vercel.json).
// Emails staff a list of requests to follow up today, new requests nobody has touched, and overdue ones.
// Vercel calls it with "Authorization: Bearer <CRON_SECRET>" when CRON_SECRET is set in the project.
import { db, ensureSchema, send } from '../_lib.js'

export default async function handler(req, res) {
  const secret = process.env.CRON_SECRET
  if (!secret || req.headers.authorization !== `Bearer ${secret}`) return send(res, 401, { message: 'Unauthorised' })
  if (!process.env.RESEND_API_KEY) return send(res, 200, { ok: true, skipped: 'RESEND_API_KEY not set' })
  await ensureSchema()
  const q = db()
  const rows = await q`SELECT ref, type, status, name, organisation, phone, course_title, topic, session_label, participants, fee_total, assigned_to, follow_up_on::text AS follow_up_on, created_at
    FROM enquiries WHERE status IN ('new','contacted','confirmed','invoiced') AND follow_up_on IS NOT NULL
    AND follow_up_on <= (now() AT TIME ZONE 'Africa/Nairobi')::date ORDER BY follow_up_on, created_at`
  if (!rows.length) return send(res, 200, { ok: true, due: 0 })
  const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;')
  const tr = rows.map((r) => `<tr><td>${esc(String(r.follow_up_on).slice(0, 10))}</td><td>${esc(r.status)}</td><td><b>${esc(r.name)}</b><br>${esc(r.organisation)}<br>${esc(r.phone)}</td><td>${esc(r.course_title || r.topic || r.type)}<br><small>${esc(r.session_label)} ${r.participants ? r.participants + ' seat(s)' : ''} ${esc(r.fee_total)}</small></td><td>${esc(r.assigned_to || 'unassigned')}</td><td>${r.ref}</td></tr>`).join('')
  const html = `<h2>${rows.length} request(s) to follow up today</h2><table cellpadding="6" border="1" style="border-collapse:collapse;font-family:Arial;font-size:13px"><tr><th>Due</th><th>Status</th><th>Client</th><th>Course</th><th>Owner</th><th>Ref</th></tr>${tr}</table><p>Open the admin page on the website (/admin) to update them.</p>`
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: process.env.NOTIFY_FROM || 'WeSkill Website <onboarding@resend.dev>', to: (process.env.NOTIFY_EMAIL || 'Learn@weskilltraininginstitute.education').split(',').map((s) => s.trim()), subject: `Follow up today: ${rows.length} request(s)`, html }),
  })
  return send(res, r.ok ? 200 : 502, { ok: r.ok, due: rows.length })
}
