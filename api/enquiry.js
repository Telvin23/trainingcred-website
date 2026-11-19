// POST /api/enquiry  - saves a booking / quote / brochure / contact / advisory request and emails staff.
import { db, ensureSchema, makeRef, clip, readJson, send } from './_lib.js'

const TYPES = new Set(['booking', 'team', 'brochure', 'contact', 'advisory'])
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const recent = new Map() // simple per-instance throttle: max 5 per minute per IP

export default async function handler(req, res) {
  if (req.method !== 'POST') return send(res, 405, { ok: false, message: 'Method not allowed' })
  let b
  try { b = await readJson(req) } catch { return send(res, 400, { ok: false, message: 'Invalid request' }) }
  if (b.website) return send(res, 200, { ok: true, ref: 'TC-OK' }) // honeypot: pretend success

  const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || null
  const now = Date.now()
  const hits = (recent.get(ip) || []).filter((t) => now - t < 60000)
  if (hits.length >= 5) return send(res, 429, { ok: false, message: 'Too many requests, please wait a minute' })
  recent.set(ip, [...hits, now])

  const type = TYPES.has(b.type) ? b.type : null
  const name = clip(b.name, 120), email = clip(b.email, 160), phone = clip(b.phone, 40)
  if (!type || !name || !email || !EMAIL.test(email) || !phone) return send(res, 400, { ok: false, message: 'Please fill in your name, a valid email and phone number' })
  const int = (v, max) => { const n = parseInt(v, 10); return Number.isFinite(n) && n > 0 ? Math.min(n, max) : null }

  const row = {
    ref: makeRef(), type, name, email, phone,
    organisation: clip(b.organisation, 160), job_title: clip(b.jobTitle, 120), country: clip(b.country, 60),
    course_slug: clip(b.courseSlug, 160), course_title: clip(b.courseTitle, 200), session_id: clip(b.sessionId, 200), session_label: clip(b.sessionLabel, 200),
    format: clip(b.format, 30), city: clip(b.city, 60), days: int(b.days, 30), participants: int(b.participants, 500),
    fee_each: clip(b.feeEach, 40), fee_total: clip(b.feeTotal, 40), payer: clip(b.payer, 60),
    topic: clip(b.topic, 200), preferred_dates: clip(b.preferredDates, 120), preferred_city: clip(b.preferredCity, 120),
    message: clip(b.message, 2000), page: clip(b.page, 200), ip, user_agent: clip(req.headers['user-agent'], 300),
  }

  try {
    await ensureSchema()
    const q = db()
    // first follow-up: next working day; history starts with the submission
    const due = nextWorkingDay()
    const hist = JSON.stringify([{ at: new Date().toISOString(), by: 'website', what: 'Received from ' + (row.page || 'website') }])
    await q`INSERT INTO enquiries (ref, type, name, email, phone, organisation, job_title, country, course_slug, course_title, session_id, session_label, format, city, days, participants, fee_each, fee_total, payer, topic, preferred_dates, preferred_city, message, page, ip, user_agent, follow_up_on, history)
      VALUES (${row.ref}, ${row.type}, ${row.name}, ${row.email}, ${row.phone}, ${row.organisation}, ${row.job_title}, ${row.country}, ${row.course_slug}, ${row.course_title}, ${row.session_id}, ${row.session_label}, ${row.format}, ${row.city}, ${row.days}, ${row.participants}, ${row.fee_each}, ${row.fee_total}, ${row.payer}, ${row.topic}, ${row.preferred_dates}, ${row.preferred_city}, ${row.message}, ${row.page}, ${row.ip}, ${row.user_agent}, ${due}, ${hist}::jsonb)`
  } catch (e) {
    console.error('enquiry save failed:', e.message)
    return send(res, 500, { ok: false, message: 'Could not save' })
  }

  await notify(row).catch((e) => console.error('email failed:', e.message))
  await acknowledge(row).catch((e) => console.error('ack email failed:', e.message))
  return send(res, 200, { ok: true, ref: row.ref })
}

const LABEL = { booking: 'Seat booking', team: 'Team quote request', brochure: 'Brochure request', contact: 'Contact message', advisory: 'Advisory request' }
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

async function notify(r) {
  const key = process.env.RESEND_API_KEY
  if (!key) return
  const lines = [['Reference', r.ref], ['Name', r.name], ['Email', r.email], ['Phone', r.phone], ['Organisation', r.organisation], ['Job title', r.job_title], ['Country', r.country], ['Course', r.course_title], ['Session', r.session_label], ['Participants', r.participants], ['Total', r.fee_total], ['Payer', r.payer], ['Topic', r.topic], ['Preferred dates', r.preferred_dates], ['Preferred city', r.preferred_city], ['Message', r.message]].filter(([, v]) => v)
  const html = `<h2>${LABEL[r.type]}</h2><table cellpadding="6">${lines.map(([k, v]) => `<tr><td><b>${k}</b></td><td>${esc(v)}</td></tr>`).join('')}</table><p>Open the admin page: /admin</p>`
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.NOTIFY_FROM || 'Trainingcred Website <onboarding@resend.dev>',
      to: (process.env.NOTIFY_EMAIL || 'info@trainingcred.com').split(',').map((s) => s.trim()),
      reply_to: r.email,
      subject: `${LABEL[r.type]}: ${r.name}${r.course_title ? ' - ' + r.course_title : ''} (${r.ref})`,
      html,
    }),
    signal: AbortSignal.timeout(8000),
  })
  if (!res.ok) throw new Error('Resend HTTP ' + res.status)
}

function nextWorkingDay() {
  const d = new Date(Date.now() + 3 * 3600 * 1000) // Nairobi time
  d.setUTCDate(d.getUTCDate() + 1)
  while ([0, 6].includes(d.getUTCDay())) d.setUTCDate(d.getUTCDate() + 1)
  return d.toISOString().slice(0, 10)
}

const NEXT = {
  booking: 'A course advisor will confirm your seat and send a proforma invoice and joining instructions within one working day.',
  team: 'A training advisor will send you a proposal with the outline, trainer, dates and fee within one working day.',
  brochure: 'The full course brochure with outline, dates and fees will reach you within one working day.',
  contact: 'A member of our team will reply within one working day.',
  advisory: 'An advisor will contact you within one working day to understand the assignment.',
}

// Confirmation to the person who filled the form (only when Resend is set up)
async function acknowledge(r) {
  const key = process.env.RESEND_API_KEY
  if (!key) return
  const wa = 'https://wa.me/254759509615?text=' + encodeURIComponent('Hello Trainingcred, my reference is ' + r.ref)
  const html = `<div style="font-family:Arial,sans-serif;max-width:560px;color:#10212E">
    <h2 style="color:#0B6E61">Thank you, ${esc(r.name.split(' ')[0])}. We have received your request.</h2>
    <p>Your reference is <b>${r.ref}</b>.</p>
    ${r.course_title ? `<p><b>Course:</b> ${esc(r.course_title)}${r.session_label ? '<br><b>Date:</b> ' + esc(r.session_label) : ''}${r.participants ? '<br><b>Participants:</b> ' + r.participants : ''}${r.fee_total ? '<br><b>Total:</b> ' + esc(r.fee_total) : ''}</p>` : ''}
    <p><b>What happens next:</b> ${NEXT[r.type]}</p>
    <p>Questions? Reply to this email, call +254 759 509615 or <a href="${wa}">WhatsApp us</a>.</p>
    <p style="color:#4A5A66;font-size:13px">Trainingcred Institute, Delta Riverside Office Park, Riverside Drive, Nairobi. CPD provider no. 20263.</p></div>`
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.NOTIFY_FROM || 'Trainingcred <onboarding@resend.dev>',
      to: [r.email],
      reply_to: (process.env.NOTIFY_EMAIL || 'info@trainingcred.com').split(',')[0].trim(),
      subject: `We received your request (${r.ref}) - Trainingcred`,
      html,
    }),
    signal: AbortSignal.timeout(8000),
  })
  if (!res.ok) throw new Error('Resend HTTP ' + res.status)
  await db()`UPDATE enquiries SET ack_sent = true WHERE ref = ${r.ref}`
}
