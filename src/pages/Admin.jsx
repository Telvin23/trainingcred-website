import { useCallback, useEffect, useMemo, useState } from 'react'
import { Lock, RefreshCw, LogOut, Download, MessageCircle, Mail } from 'lucide-react'
import { Seo } from '../lib/seo.jsx'

const STATUSES = ['new', 'contacted', 'confirmed', 'invoiced', 'paid', 'cancelled']
const TYPES = { booking: 'Seat booking', team: 'Team quote', brochure: 'Brochure', contact: 'Contact', advisory: 'Advisory' }
const COLORS = { new: 'bg-amber-100 text-amber-900', contacted: 'bg-sky-100 text-sky-900', confirmed: 'bg-mint text-teal', invoiced: 'bg-indigo-100 text-indigo-900', paid: 'bg-emerald-100 text-emerald-900', cancelled: 'bg-gray-200 text-gray-700' }

const store = {
  get: () => { try { return sessionStorage.getItem('tc_admin') || '' } catch { return '' } },
  set: (v) => { try { v ? sessionStorage.setItem('tc_admin', v) : sessionStorage.removeItem('tc_admin') } catch { /* private mode */ } },
}

export default function Admin() {
  const [pw, setPw] = useState('')
  const [rows, setRows] = useState(null)
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const [type, setType] = useState('')
  const [status, setStatus] = useState('')
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(null)

  const load = useCallback(async (key) => {
    setBusy(true); setErr('')
    try {
      const res = await fetch('/api/admin/enquiries', { headers: { Authorization: `Bearer ${key}` } })
      if (res.status === 401) { store.set(''); setPw(''); setRows(null); throw new Error('Wrong password') }
      const out = await res.json()
      if (!res.ok) throw new Error(out.message || 'Could not load')
      store.set(key); setPw(key); setRows(out.rows)
    } catch (e) { setErr(e.message) } finally { setBusy(false) }
  }, [])
  useEffect(() => { const k = store.get(); if (k) load(k) }, [load])

  const save = async (id, patch) => {
    setRows((r) => r.map((x) => (x.id === id ? { ...x, ...patch } : x)))
    const res = await fetch('/api/admin/enquiries', { method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${pw}` }, body: JSON.stringify({ id, ...patch }) })
    if (!res.ok) setErr('Could not save the change - refresh and try again')
  }

  const shown = useMemo(() => (rows || []).filter((r) =>
    (!type || r.type === type) && (!status || r.status === status) &&
    (!q || JSON.stringify(r).toLowerCase().includes(q.toLowerCase()))), [rows, type, status, q])

  const csv = () => {
    const cols = ['ref', 'created_at', 'type', 'status', 'name', 'email', 'phone', 'organisation', 'job_title', 'country', 'course_title', 'session_label', 'participants', 'fee_total', 'payer', 'topic', 'message', 'notes']
    const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`
    const body = [cols.join(','), ...shown.map((r) => cols.map((c) => esc(r[c])).join(','))].join('\n')
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([body], { type: 'text/csv' }))
    a.download = `trainingcred-enquiries-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
  }

  return (
    <>
      <Seo title="Bookings admin" path="/admin" noindex description="Staff only." />
      <section className="min-h-[70vh] bg-soft">
        <div className="wrap py-8">
          {!rows ? (
            <form onSubmit={(e) => { e.preventDefault(); load(new FormData(e.currentTarget).get('pw')) }} className="card mx-auto mt-10 flex max-w-sm flex-col gap-4 p-6">
              <div className="flex items-center gap-2 text-lg font-extrabold"><Lock size={20} aria-hidden="true" />Staff sign in</div>
              <label className="field">Admin password<input className="input" type="password" name="pw" required autoComplete="current-password" /></label>
              {err && <p className="m-0 text-sm font-semibold text-red-700" role="alert">{err}</p>}
              <button className="btn-primary" disabled={busy}>{busy ? 'Checking...' : 'Sign in'}</button>
            </form>
          ) : (
            <>
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <h1 className="m-0 text-2xl font-extrabold">Bookings &amp; enquiries</h1>
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => load(pw)} className="btn-outline !py-2 text-sm"><RefreshCw size={16} aria-hidden="true" />Refresh</button>
                  <button type="button" onClick={csv} className="btn-outline !py-2 text-sm"><Download size={16} aria-hidden="true" />Export CSV</button>
                  <button type="button" onClick={() => { store.set(''); setRows(null); setPw('') }} className="btn border border-line !py-2 text-sm text-ink"><LogOut size={16} aria-hidden="true" />Sign out</button>
                </div>
              </div>
              <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-6">
                {STATUSES.map((s) => (
                  <button key={s} type="button" onClick={() => setStatus(status === s ? '' : s)} className={`card p-3 text-left ${status === s ? '!border-teal ring-2 ring-teal/20' : ''}`}>
                    <div className="text-2xl font-extrabold">{rows.filter((r) => r.status === s).length}</div><div className="text-sm capitalize text-muted">{s}</div>
                  </button>
                ))}
              </div>
              <div className="mb-4 flex flex-wrap gap-2">
                <input className="input !w-auto flex-1" placeholder="Search name, course, organisation..." value={q} onChange={(e) => setQ(e.target.value)} />
                <select className="input !w-auto" value={type} onChange={(e) => setType(e.target.value)}><option value="">All types</option>{Object.entries(TYPES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
              </div>
              {err && <p className="text-sm font-semibold text-red-700" role="alert">{err}</p>}
              <div className="overflow-x-auto rounded-2xl border border-line bg-white">
                <table className="w-full min-w-[900px] border-collapse text-left text-sm">
                  <thead className="bg-[#EEF3F6] text-xs uppercase text-muted"><tr>{['Received', 'Type', 'Name', 'Course / topic', 'Seats', 'Total', 'Status', ''].map((h) => <th key={h} className="px-3 py-2.5 font-bold">{h}</th>)}</tr></thead>
                  <tbody>
                    {shown.map((r) => (
                      <FragmentRow key={r.id} r={r} open={open === r.id} toggle={() => setOpen(open === r.id ? null : r.id)} save={save} />
                    ))}
                    {!shown.length && <tr><td colSpan={8} className="p-6 text-center text-muted">Nothing here yet.</td></tr>}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  )
}

function FragmentRow({ r, open, toggle, save }) {
  const [notes, setNotes] = useState(r.notes || '')
  const wa = String(r.phone || '').replace(/[^0-9]/g, '').replace(/^0/, '254')
  return (
    <>
      <tr className="border-t border-line align-top">
        <td className="px-3 py-3 whitespace-nowrap">{new Date(r.created_at).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}<div className="text-xs text-muted">{r.ref}</div></td>
        <td className="px-3 py-3">{TYPES[r.type] || r.type}</td>
        <td className="px-3 py-3"><div className="font-bold">{r.name}</div><div className="text-xs text-muted">{r.organisation}</div></td>
        <td className="px-3 py-3"><div className="font-semibold">{r.course_title || r.topic || '-'}</div><div className="text-xs text-muted">{r.session_label}</div></td>
        <td className="px-3 py-3">{r.participants || '-'}</td>
        <td className="px-3 py-3 whitespace-nowrap">{r.fee_total || '-'}</td>
        <td className="px-3 py-3">
          <select aria-label="Status" value={r.status} onChange={(e) => save(r.id, { status: e.target.value })} className={`rounded-lg border-0 px-2 py-1.5 text-xs font-bold capitalize ${COLORS[r.status] || ''}`}>
            {STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </td>
        <td className="px-3 py-3"><button type="button" onClick={toggle} className="font-bold text-teal underline" aria-expanded={open}>{open ? 'Close' : 'Open'}</button></td>
      </tr>
      {open && (
        <tr className="bg-soft"><td colSpan={8} className="px-4 py-4">
          <div className="grid gap-4 md:grid-cols-2">
            <dl className="m-0 grid grid-cols-[130px_1fr] gap-x-3 gap-y-1.5">
              {[['Email', r.email], ['Phone', r.phone], ['Job title', r.job_title], ['Country', r.country], ['Format', r.format], ['City', r.city], ['Days', r.days], ['Fee each', r.fee_each], ['Payer', r.payer], ['Preferred dates', r.preferred_dates], ['Preferred city', r.preferred_city], ['Page', r.page], ['Message', r.message]].filter(([, v]) => v).map(([k, v]) => (
                <div key={k} className="contents"><dt className="text-muted">{k}</dt><dd className="m-0 whitespace-pre-wrap break-words">{String(v)}</dd></div>
              ))}
            </dl>
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap gap-2">
                {wa && <a className="btn-primary !py-2 text-sm" target="_blank" rel="noopener noreferrer" href={`https://wa.me/${wa}?text=${encodeURIComponent(`Hello ${r.name}, this is Trainingcred about your request (${r.ref}).`)}`}><MessageCircle size={16} aria-hidden="true" />WhatsApp</a>}
                {r.email && <a className="btn-outline !py-2 text-sm" href={`mailto:${r.email}?subject=${encodeURIComponent(`Your Trainingcred request ${r.ref}`)}`}><Mail size={16} aria-hidden="true" />Email</a>}
              </div>
              <label className="field">Staff notes<textarea className="input min-h-24" value={notes} onChange={(e) => setNotes(e.target.value)} /></label>
              <button type="button" className="btn-navy self-start !py-2 text-sm" onClick={() => save(r.id, { notes })}>Save notes</button>
            </div>
          </div>
        </td></tr>
      )}
    </>
  )
}
