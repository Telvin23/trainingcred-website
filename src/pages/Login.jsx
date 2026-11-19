import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, User, Building2, CalendarDays, FileText, Award, Receipt, Users, ShieldCheck, ArrowRight, Info } from 'lucide-react'
import { Seo } from '../lib/seo.jsx'
import { SITE, waLink } from '../data/site.js'

// DESIGN STAGE: the form is not connected yet. See the build log for the account system plan.
const PARTICIPANT = [
  [CalendarDays, 'My courses', 'Upcoming dates, joining instructions, venue and Zoom links'],
  [FileText, 'Materials', 'Slides, workbooks and recordings for each course'],
  [Award, 'Certificates', 'Download and share, with a QR code employers can verify'],
  [Receipt, 'Invoices & payments', 'Proforma, invoices, receipts and M-Pesa payment'],
]
const ORGANISATION = [
  [Users, 'Team bookings', 'Nominate staff and see every booking in one place'],
  [Receipt, 'One invoice', 'Group invoices, purchase orders and payment status'],
  [Award, 'Team certificates', 'Attendance and certificates for all your staff'],
  [CalendarDays, 'Training plan', 'Plan the year and request in-house programmes'],
]

export default function Login() {
  const [who, setWho] = useState('participant')
  const [mode, setMode] = useState('signin') // signin | register | link
  const [show, setShow] = useState(false)
  const [note, setNote] = useState(false)
  const perks = who === 'participant' ? PARTICIPANT : ORGANISATION
  const title = mode === 'register' ? 'Create your account' : mode === 'link' ? 'Sign in with an email link' : 'Welcome back'

  return (
    <>
      <Seo title="Log in" path="/login" noindex description="Sign in to your Trainingcred account." />
      <section className="wrap py-8 sm:py-12">
        <div className="grid overflow-hidden rounded-[36px] lg:grid-cols-[1.05fr_1fr]">
          {/* left: what the account gives you */}
          <div className="relative hidden min-h-[640px] flex-col justify-between overflow-hidden p-10 text-white lg:flex">
            <img src="/images/hero/hero5.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-[linear-gradient(160deg,rgba(5,15,28,.92),rgba(11,53,87,.78)_55%,rgba(14,143,126,.55))]" />
            <div className="relative">
              <span className="pill-label glass-photo">{who === 'participant' ? 'For participants' : 'For organisations'}</span>
              <h2 className="m-0 mt-5 max-w-md text-[34px] font-extrabold leading-tight">{who === 'participant' ? 'Everything about your training, in one place.' : 'Manage your team\'s training without the email chains.'}</h2>
            </div>
            <ul className="relative m-0 grid list-none gap-3 p-0">
              {perks.map(([I, t, d]) => (
                <li key={t} className="glass-photo flex gap-4 rounded-2xl p-4">
                  <span className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-white/15"><I size={19} className="text-amber" aria-hidden="true" /></span>
                  <span><span className="block font-bold">{t}</span><span className="text-[14px] text-white/75">{d}</span></span>
                </li>
              ))}
            </ul>
          </div>

          {/* right: the form */}
          <div className="glass-strong flex flex-col justify-center gap-6 p-6 sm:p-10 lg:rounded-none">
            <div role="tablist" aria-label="Account type" className="grid grid-cols-2 gap-1 rounded-full bg-surface p-1">
              {[['participant', 'Participant', User], ['organisation', 'Organisation', Building2]].map(([k, l, I]) => (
                <button key={k} type="button" role="tab" aria-selected={who === k} onClick={() => setWho(k)}
                  className={`flex min-h-11 items-center justify-center gap-2 rounded-full text-sm font-semibold transition ${who === k ? 'bg-fg text-bg' : 'text-muted hover:text-fg'}`}><I size={16} aria-hidden="true" />{l}</button>
              ))}
            </div>

            <div>
              <h1 className="m-0 text-[30px] font-extrabold">{title}</h1>
              <p className="m-0 mt-1.5 text-muted">{mode === 'register' ? 'Use the email you booked with and we will link your past courses.' : who === 'participant' ? 'See your courses, materials and certificates.' : 'Manage bookings, invoices and certificates for your team.'}</p>
            </div>

            <form className="flex flex-col gap-4" onSubmit={(e) => { e.preventDefault(); setNote(true) }}>
              {mode === 'register' && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="field">Full name<input className="input" name="name" autoComplete="name" required /></label>
                  <label className="field">Phone<input className="input" name="phone" type="tel" autoComplete="tel" required /></label>
                  {who === 'organisation' && <label className="field sm:col-span-2">Organisation<input className="input" name="organisation" autoComplete="organization" required /></label>}
                </div>
              )}
              <label className="field">Work email
                <span className="relative"><Mail size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-faint" aria-hidden="true" /><input className="input !pl-11" type="email" name="email" autoComplete="email" required /></span>
              </label>
              {mode !== 'link' && (
                <label className="field">
                  <span className="flex justify-between">Password{mode === 'signin' && <button type="button" onClick={() => setMode('link')} className="text-[13px] font-semibold text-brand">Forgot password?</button>}</span>
                  <span className="relative"><Lock size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-faint" aria-hidden="true" />
                    <input className="input !px-11" type={show ? 'text' : 'password'} name="password" autoComplete={mode === 'register' ? 'new-password' : 'current-password'} minLength={mode === 'register' ? 10 : undefined} required />
                    <button type="button" onClick={() => setShow(!show)} aria-label={show ? 'Hide password' : 'Show password'} className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-faint hover:text-fg">{show ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}</button>
                  </span>
                  {mode === 'register' && <span className="text-xs font-normal text-faint">At least 10 characters.</span>}
                </label>
              )}
              {mode === 'signin' && <label className="flex items-center gap-2 text-sm text-muted"><input type="checkbox" className="h-4 w-4 accent-[#0E8F7E]" />Keep me signed in on this device</label>}
              <button type="submit" className="btn-primary w-full">{mode === 'register' ? 'Create account' : mode === 'link' ? 'Email me a sign-in link' : 'Log in'}<ArrowRight size={18} aria-hidden="true" /></button>
              {note && (
                <p className="m-0 flex gap-2.5 rounded-2xl bg-accent-soft p-4 text-[14px] text-fg" role="status"><Info size={18} className="flex-none text-accent" aria-hidden="true" />
                  <span>Online accounts are opening soon. For now, your course advisor sends everything by email. Need something today? <a href={waLink('Hello Trainingcred, I need help with my booking.')} target="_blank" rel="noopener noreferrer">WhatsApp us</a>.</span></p>
              )}
            </form>

            <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-faint"><span className="h-px flex-1 bg-line" />or<span className="h-px flex-1 bg-line" /></div>
            <div className="grid gap-2 sm:grid-cols-2">
              <button type="button" onClick={() => setNote(true)} className="btn-glass">Continue with Google</button>
              <button type="button" onClick={() => setNote(true)} className="btn-glass">Continue with Microsoft</button>
            </div>
            {mode !== 'link' && <button type="button" onClick={() => setMode('link')} className="btn-glass btn-sm self-center"><Mail size={16} aria-hidden="true" />Sign in without a password</button>}

            <p className="m-0 text-center text-sm text-muted">
              {mode === 'register' ? <>Already have an account? <button type="button" onClick={() => setMode('signin')} className="font-semibold text-brand">Log in</button></> : <>New to Trainingcred? <button type="button" onClick={() => setMode('register')} className="font-semibold text-brand">Create an account</button></>}
            </p>
            <p className="m-0 flex items-center justify-center gap-1.5 text-center text-xs text-faint"><ShieldCheck size={14} aria-hidden="true" />Protected sign-in. Staff use the separate <Link to="/admin">staff page</Link>. Help: {SITE.email}</p>
          </div>
        </div>
      </section>
    </>
  )
}
