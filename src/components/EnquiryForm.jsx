import { useState } from 'react'
import { CheckCircle2, AlertTriangle } from 'lucide-react'
import { SITE, waLink } from '../data/site.js'

const COUNTRIES = ['Kenya', 'Uganda', 'Tanzania', 'Rwanda', 'Ethiopia', 'Nigeria', 'Ghana', 'South Africa', 'Somalia', 'South Sudan', 'Zambia', 'Malawi', 'United Arab Emirates', 'Other']

// type: booking | team | contact | brochure | advisory
// extra: fixed values sent with the form (course, session...)
export default function EnquiryForm({ type, extra = {}, fields = [], submitLabel = 'Send', summary, compact = false }) {
  const [state, setState] = useState({ status: 'idle' })
  const show = (f) => fields.includes(f)
  const label = 'field'

  async function onSubmit(e) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const data = Object.fromEntries(form.entries())
    if (data.website) return // honeypot
    setState({ status: 'sending' })
    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, ...extra, ...data, page: typeof location !== 'undefined' ? location.pathname : '' }),
      })
      const out = await res.json().catch(() => ({}))
      if (!res.ok || !out.ok) throw new Error(out.message || 'Could not send')
      setState({ status: 'done', ref: out.ref })
      if (typeof window !== 'undefined' && window.gtag) window.gtag('event', 'generate_lead', { form_type: type })
    } catch (err) {
      const text = `Hello WeSkill. ${summary || ''}\nName: ${data.name || ''}\nOrganisation: ${data.organisation || ''}\nPhone: ${data.phone || ''}\nEmail: ${data.email || ''}\n${data.message || ''}`
      setState({ status: 'error', message: err.message, wa: waLink(text) })
    }
  }

  if (state.status === 'done') {
    return (
      <div className="flex flex-col gap-3 rounded-2xl bg-brand-soft p-6 text-fg" role="status">
        <CheckCircle2 size={34} className="text-brand" aria-hidden="true" />
        <h3 className="m-0 text-xl font-extrabold">Thank you, we have received it.</h3>
        <p className="m-0 leading-relaxed">Your reference is <strong>{state.ref}</strong>. A course advisor will contact you within one working day. For anything urgent, WhatsApp us on {SITE.phone}.</p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate={false}>
      <div className={`grid gap-4 ${compact ? '' : 'sm:grid-cols-2'}`}>
        <label className={label}>Full name<input className="input" name="name" required autoComplete="name" maxLength={120} /></label>
        <label className={label}>Work email<input className="input" name="email" type="email" required autoComplete="email" maxLength={160} /></label>
        <label className={label}>Phone or WhatsApp<input className="input" name="phone" type="tel" required autoComplete="tel" maxLength={40} placeholder="+254 7.." /></label>
        {show('organisation') && <label className={label}>Organisation<input className="input" name="organisation" autoComplete="organization" maxLength={160} /></label>}
        {show('jobTitle') && <label className={label}>Job title<input className="input" name="jobTitle" autoComplete="organization-title" maxLength={120} /></label>}
        {show('country') && (
          <label className={label}>Country<select className="input" name="country" defaultValue="Kenya">{COUNTRIES.map((c) => <option key={c}>{c}</option>)}</select></label>
        )}
        {show('participants') && <label className={label}>Number of participants<input className="input" name="participants" type="number" min="1" max="500" defaultValue={extra.defaultParticipants || 1} required /></label>}
        {show('topic') && <label className={`${label} sm:col-span-2`}>Course or topic<input className="input" name="topic" maxLength={200} defaultValue={extra.topic || ''} placeholder="e.g. Procurement, IFRS, leadership" /></label>}
        {show('preferredDates') && <label className={label}>Preferred dates or month<input className="input" name="preferredDates" maxLength={120} /></label>}
        {show('preferredCity') && <label className={label}>Preferred city or online<input className="input" name="preferredCity" maxLength={120} /></label>}
      </div>
      {show('payment') && (
        <fieldset className="m-0 flex flex-col gap-2 border-0 p-0">
          <legend className={`${label} mb-1.5`}>Who is paying?</legend>
          <div className="flex flex-wrap gap-2">
            {['My organisation', 'Myself', 'A sponsor or donor'].map((p, n) => (
              <label key={p} className="glass flex min-h-11 cursor-pointer items-center gap-2 rounded-full px-4 text-[15px] has-[:checked]:border-[#F59E0B] has-[:checked]:bg-brand-soft">
                <input type="radio" name="payer" value={p} defaultChecked={n === 0} className="accent-[#F59E0B]" />{p}
              </label>
            ))}
          </div>
        </fieldset>
      )}
      {show('message') && <label className={label}>Message (optional)<textarea className="input min-h-28" name="message" maxLength={2000} /></label>}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      {state.status === 'error' && (
        <div className="flex gap-3 rounded-2xl border border-amber/40 bg-accent-soft p-4 text-[14.5px] text-fg" role="alert">
          <AlertTriangle size={20} className="flex-none text-accent" aria-hidden="true" />
          <span>We could not send this right now. Please <a href={state.wa} target="_blank" rel="noopener noreferrer" className="font-bold">send it on WhatsApp</a> or email <a href={`mailto:${SITE.email}`} className="font-bold">{SITE.email}</a>.</span>
        </div>
      )}
      <p className="m-0 text-[13px] text-faint">We use your details only to respond to this request. See our <a href="/privacy">privacy notice</a>.</p>
      <button type="submit" className={`btn-primary ${compact ? 'w-full' : 'self-start'}`} disabled={state.status === 'sending'}>{state.status === 'sending' ? 'Sending...' : submitLabel}</button>
    </form>
  )
}
