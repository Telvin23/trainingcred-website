import { useCallback, useEffect, useMemo, useState } from 'react'
import { Lock, RefreshCw, LogOut, Download, MessageCircle, Mail, Phone, CalendarClock, UserRound, History, Repeat, ChevronDown } from 'lucide-react'
import { Seo } from '../lib/seo.jsx'

// Pipeline: new -> contacted -> confirmed -> invoiced -> paid -> attended  (or cancelled / lost)
const STATUSES = ['new', 'contacted', 'confirmed', 'invoiced', 'paid', 'attended', 'cancelled', 'lost']
const OPEN = new Set(['new', 'contacted', 'confirmed', 'invoiced'])
const TYPES = { booking: 'Seat booking', team: 'Team quote', brochure: 'Brochure', contact: 'Contact', advisory: 'Advisory' }
const TONE = { new: 'bg-amber/20 text-accent', contacted: 'bg-sky-500/15 text-sky-300', confirmed: 'bg-brand-soft text-brand', invoiced: 'bg-indigo-500/15 text-indigo-300', paid: 'bg-emerald-500/15 text-emerald-300', attended: 'bg-emerald-500/25 text-emerald-200', cancelled: 'bg-surface-2 text-faint', lost: 'bg-surface-2 text-faint' }

const todayKE = () => new Date(Date.now() + 3 * 3600 * 1000).toISOString().slice(0, 10)
// n days ahead in Nairobi time, moved off weekends to Monday
const addDays = (n) => { const d = new Date(Date.now() + 3 * 3600 * 1000); d.setUTCDate(d.getUTCDate() + n); while ([0, 6].includes(d.getUTCDay())) d.setUTCDate(d.getUTCDate() + 1); return d.toISOString().slice(0, 10) }
const store = {
  get: (k) => { try { return sessionStorage.getItem(k) || localStorage.getItem(k) || '' } catch { return '' } },
  set: (k, v, persist) => { try { const s = persist ? localStorage : sessionStorage; v ? s.setItem(k, v) : (sessionStorage.removeItem(k), localStorage.removeItem(k)) } catch { /* private mode */ } },
}

// Message templates staff send from the admin page (WhatsApp or email)
function template(r) {
  const first = String(r.name || '').split(' ')[0]
  const course = r.course_title || r.topic || 'your request'
  switch (r.status) {
    case 'new': return `Hello ${first}, this is Trainingcred about ${course} (ref ${r.ref}). Thank you for your request. Is now a good time to confirm a few details?`
    case 'contacted': return `Hello ${first}, following up on ${course} (ref ${r.ref}). Shall I go ahead and confirm your seat${r.session_label ? ' for ' + r.session_label : ''}?`
    case 'confirmed': return `Hello ${first}, your seat on ${course}${r.session_label ? ' (' + r.session_label + ')' : ''} is confirmed. I am sending the proforma invoice and joining instructions by email. Ref ${r.ref}.`
    case 'invoiced': return `Hello ${first}, a reminder that the invoice for ${course} (ref ${r.ref}) is due before the start date. Payment: bank transfer, M-Pesa or card. Let me know if you need anything for approval.`
    case 'paid': return `Hello ${first}, thank you, we have received your payment for ${course} (ref ${r.ref}). See you at the training. Joining details are in your email.`
    case 'attended': return `Hello ${first}, thank you for attending ${course}. Your certificate is attached in your email. We would value a short review of the course.`
    default: return `Hello ${first}, this is Trainingcred about ${course} (ref ${r.ref}).`
  }
}

export default function Admin() {
  const [pw, setPw] = useState('')
  const [me, setMe] = useState('')
  const [rows, setRows] = useState(null)
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const [view, setView] = useState('due')
  const [type, setType] = useState('')
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(null)

  const load = useCallback(async (key) => {
    setBusy(true); setErr('')
    try {
      const res = await fetch('/api/admin/enquiries', { headers: { Authorization: `Bearer ${key}` } })
      if (res.status === 401) { store.set('tc_admin', ''); setPw(''); setRows(null); throw new Error('Wrong password') }
      const out = await res.json()
      if (!res.ok) throw new Error(out.message || 'Could not load')
      store.set('tc_admin', key); setPw(key); setRows(out.rows)
    } catch (e) { setErr(e.message) } finally { setBusy(false) }
  }, [])
  useEffect(() => { setMe(store.get('tc_staff')); const k = store.get('tc_admin'); if (k) load(k) }, [load])

  const save = async (id, patch) => {
    const res = await fetch('/api/admin/enquiries', { method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${pw}` }, body: JSON.stringify({ id, by: me || 'staff', ...patch }) })
    const out = await res.json().catch(() => ({}))
    if (!res.ok || !out.row) { setErr('Could not save the change - refresh and try again'); return }
    setRows((r) => r.map((x) => (x.id === out.row.id ? out.row : x)))
  }

  const today = todayKE()
  const isDue = (r) => OPEN.has(r.status) && r.follow_up_on && String(r.follow_up_on).slice(0, 10) <= today
  const views = {
    due: ['Follow up today', (r) => isDue(r)],
    new: ['New', (r) => r.status === 'new'],
    open: ['In progress', (r) => OPEN.has(r.status)],
    mine: ['Mine', (r) => me && r.assigned_to === me && OPEN.has(r.status)],
    won: ['Paid & attended', (r) => r.status === 'paid' || r.status === 'attended'],
    all: ['All', () => true],
  }
  const shown = useMemo(() => (rows || []).filter((r) => views[view][1](r) && (!type || r.type === type) && (!q || JSON.stringify(r).toLowerCase().includes(q.toLowerCase()))), [rows, view, type, q, me])

  const csv = () => {
    const cols = ['ref', 'created_at', 'type', 'status', 'assigned_to', 'follow_up_on', 'name', 'email', 'phone', 'organisation', 'job_title', 'country', 'course_title', 'session_label', 'participants', 'fee_total', 'payer', 'topic', 'message', 'notes']
    const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([[cols.join(','), ...shown.map((r) => cols.map((c) => esc(r[c])).join(','))].join('\n')], { type: 'text/csv' }))
    a.download = `trainingcred-enquiries-${today}.csv`
    a.click()
  }

  if (!rows) {
    return (
      <>
        <Seo title="Bookings admin" path="/admin" noindex description="Staff only." />
        <section className="wrap py-16">
          <form onSubmit={(e) => { e.preventDefault(); const f = new FormData(e.currentTarget); const name = String(f.get('me') || '').trim(); setMe(name); store.set('tc_staff', name, true); load(f.get('pw')) }} className="glass-strong mx-auto flex max-w-sm flex-col gap-4 rounded-3xl p-6">
            <div className="flex items-center gap-2 text-lg font-extrabold"><Lock size={20} aria-hidden="true" />Staff sign in</div>
            <label className="field">Your name (shown in the history)<input className="input" name="me" defaultValue={me} required autoComplete="name" /></label>
            <label className="field">Admin password<input className="input" type="password" name="pw" required autoComplete="current-password" /></label>
            {err && <p className="m-0 text-sm font-semibold text-red-400" role="alert">{err}</p>}
            <button className="btn-primary" disabled={busy}>{busy ? 'Checking...' : 'Sign in'}</button>
          </form>
        </section>
      </>
    )
  }

  const count = (k) => rows.filter(views[k][1]).length
  return (
    <>
      <Seo title="Bookings admin" path="/admin" noindex description="Staff only." />
      <section className="wrap py-8">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div><h1 className="m-0 text-2xl font-extrabold">Bookings &amp; enquiries</h1><p className="m-0 text-sm text-muted">Signed in as {me || 'staff'}</p></div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => load(pw)} className="btn-glass btn-sm"><RefreshCw size={16} aria-hidden="true" />Refresh</button>
            <button type="button" onClick={csv} className="btn-glass btn-sm"><Download size={16} aria-hidden="true" />Export CSV</button>
            <button type="button" onClick={() => { store.set('tc_admin', ''); setRows(null); setPw('') }} className="btn-glass btn-sm"><LogOut size={16} aria-hidden="true" />Sign out</button>
          </div>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6" role="tablist" aria-label="Views">
          {Object.entries(views).map(([k, [label]]) => (
            <button key={k} type="button" role="tab" aria-selected={view === k} onClick={() => setView(k)} className={`card !rounded-2xl p-3 text-left transition ${view === k ? '!border-[#4FD1BE] bg-brand-soft' : ''}`}>
              <div className={`text-2xl font-extrabold ${k === 'due' && count('due') ? 'text-accent' : ''}`}>{count(k)}</div><div className="text-sm text-muted">{label}</div>
            </button>
          ))}
        </div>
        <div className="mb-4 flex flex-wrap gap-2">
          <input className="input !w-auto flex-1" placeholder="Search name, course, organisation, ref..." value={q} onChange={(e) => setQ(e.target.value)} />
          <select className="input !w-auto" value={type} onChange={(e) => setType(e.target.value)}><option value="">All types</option>{Object.entries(TYPES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
        </div>
        {err && <p className="text-sm font-semibold text-red-400" role="alert">{err}</p>}

        <div className="flex flex-col gap-2">
          {shown.map((r) => <Row key={r.id} r={r} open={open === r.id} toggle={() => setOpen(open === r.id ? null : r.id)} save={save} me={me} due={isDue(r)} today={today} />)}
          {!shown.length && <div className="card p-8 text-center text-muted">{view === 'due' ? 'Nothing to follow up today.' : 'Nothing here yet.'}</div>}
        </div>
      </section>
    </>
  )
}

function Row({ r, open, toggle, save, me, due, today }) {
  const [notes, setNotes] = useState(r.notes || '')
  const [log, setLog] = useState('')
  useEffect(() => setNotes(r.notes || ''), [r.notes])
  const wa = String(r.phone || '').replace(/[^0-9]/g, '').replace(/^0/, '254')
  const msg = template(r)
  const fu = r.follow_up_on ? String(r.follow_up_on).slice(0, 10) : ''
  const history = Array.isArray(r.history) ? r.history : []
  return (
    <div className={`card !rounded-2xl ${due ? '!border-amber/50' : ''}`}>
      <button type="button" onClick={toggle} aria-expanded={open} className="grid w-full grid-cols-1 gap-2 p-4 text-left sm:grid-cols-[150px_1.2fr_1.4fr_auto] sm:items-center sm:gap-4">
        <div className="text-[13px] text-muted">{new Date(r.created_at).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}<div className="text-xs text-faint">{r.ref}</div></div>
        <div><div className="flex flex-wrap items-center gap-2 font-bold">{r.name}{r.earlier > 0 && <span className="chip bg-surface-2 !py-0.5 text-[11px] text-muted"><Repeat size={11} aria-hidden="true" />Returning ({r.earlier})</span>}</div><div className="text-[13px] text-muted">{r.organisation || r.email}</div></div>
        <div><div className="text-[14px] font-semibold">{r.course_title || r.topic || TYPES[r.type]}</div><div className="text-[12.5px] text-faint">{TYPES[r.type]}{r.session_label ? ' · ' + r.session_label : ''}{r.participants ? ` · ${r.participants} seat(s)` : ''}{r.fee_total ? ' · ' + r.fee_total : ''}</div></div>
        <div className="flex flex-wrap items-center gap-2">
          <span className={`chip !py-1 text-xs capitalize ${TONE[r.status] || ''}`}>{r.status}</span>
          {fu && OPEN.has(r.status) && <span className={`chip !py-1 text-xs ${due ? 'bg-amber/20 text-accent' : 'bg-surface-2 text-muted'}`}><CalendarClock size={12} aria-hidden="true" />{fu === today ? 'Today' : fu}</span>}
          {r.assigned_to && <span className="chip bg-surface-2 !py-1 text-xs text-muted"><UserRound size={12} aria-hidden="true" />{r.assigned_to}</span>}
          <ChevronDown size={18} className={`text-faint transition ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
        </div>
      </button>
      {open && (
        <div className="grid gap-6 border-t border-line p-4 lg:grid-cols-[1fr_1fr_1fr]">
          <dl className="m-0 grid grid-cols-[110px_1fr] content-start gap-x-3 gap-y-1.5 text-sm">
            {[['Email', r.email], ['Phone', r.phone], ['Job title', r.job_title], ['Country', r.country], ['Format', r.format], ['City', r.city], ['Days', r.days], ['Fee each', r.fee_each], ['Payer', r.payer], ['Preferred dates', r.preferred_dates], ['Preferred city', r.preferred_city], ['Message', r.message], ['Confirmation', r.ack_sent ? 'Email sent to client' : 'Not sent']].filter(([, v]) => v).map(([k, v]) => (
              <div key={k} className="contents"><dt className="text-faint">{k}</dt><dd className="m-0 whitespace-pre-wrap break-words">{String(v)}</dd></div>
            ))}
          </dl>

          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-2">
              <label className="field">Status
                <select className="input !py-2 capitalize" value={r.status} onChange={(e) => save(r.id, { status: e.target.value, follow_up_on: OPEN.has(e.target.value) ? addDays(2) : '' })}>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
              </label>
              <label className="field">Follow up on
                <input className="input !py-2" type="date" value={fu} onChange={(e) => save(r.id, { follow_up_on: e.target.value })} />
              </label>
            </div>
            <div className="flex flex-wrap gap-2">
              {!r.assigned_to && me && <button type="button" className="btn-glass btn-sm" onClick={() => save(r.id, { assigned_to: me })}><UserRound size={15} aria-hidden="true" />Assign to me</button>}
              {r.assigned_to && r.assigned_to !== me && me && <button type="button" className="btn-glass btn-sm" onClick={() => save(r.id, { assigned_to: me })}>Take over</button>}
              {[['Tomorrow', 1], ['In 3 days', 3], ['Next week', 7]].map(([l, n]) => <button key={l} type="button" className="btn-glass btn-sm" onClick={() => save(r.id, { follow_up_on: addDays(n) })}>{l}</button>)}
            </div>
            <div className="rounded-2xl bg-surface p-3">
              <div className="mb-2 text-xs font-bold uppercase tracking-wider text-faint">Message for this stage</div>
              <p className="m-0 text-[13.5px] text-muted">{msg}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {wa && <a className="btn-primary btn-sm" target="_blank" rel="noopener noreferrer" href={`https://wa.me/${wa}?text=${encodeURIComponent(msg)}`} onClick={() => save(r.id, { log: 'WhatsApp message sent', ...(r.status === 'new' ? { status: 'contacted', follow_up_on: addDays(2) } : {}) })}><MessageCircle size={15} aria-hidden="true" />WhatsApp</a>}
                {r.email && <a className="btn-glass btn-sm" href={`mailto:${r.email}?subject=${encodeURIComponent(`Trainingcred - ${r.course_title || 'your request'} (${r.ref})`)}&body=${encodeURIComponent(msg)}`} onClick={() => save(r.id, { log: 'Email sent', ...(r.status === 'new' ? { status: 'contacted', follow_up_on: addDays(2) } : {}) })}><Mail size={15} aria-hidden="true" />Email</a>}
                {r.phone && <a className="btn-glass btn-sm" href={`tel:${r.phone}`}><Phone size={15} aria-hidden="true" />Call</a>}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); if (!log.trim()) return; save(r.id, { log: log.trim(), ...(r.status === 'new' ? { status: 'contacted' } : {}), follow_up_on: addDays(2) }); setLog('') }}>
              <input className="input !py-2" placeholder="Log a call or note, e.g. Called, wants 10 days" value={log} onChange={(e) => setLog(e.target.value)} />
              <button className="btn-primary btn-sm">Log</button>
            </form>
            <label className="field">Notes<textarea className="input min-h-20 !py-2" value={notes} onChange={(e) => setNotes(e.target.value)} onBlur={() => notes !== (r.notes || '') && save(r.id, { notes })} /></label>
            <div>
              <div className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-faint"><History size={13} aria-hidden="true" />History</div>
              <ol className="m-0 flex max-h-48 list-none flex-col gap-2 overflow-y-auto p-0 text-[13px]">
                {[...history].reverse().map((h, n) => (
                  <li key={n} className="border-l-2 border-line pl-3"><span className="text-fg">{h.what}</span><div className="text-[11.5px] text-faint">{new Date(h.at).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })} · {h.by}</div></li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
