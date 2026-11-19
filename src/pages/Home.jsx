import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, ArrowRight, ArrowUpRight, Quote, MessageCircle, Phone, Sparkles, MapPin, CalendarDays, Users, Briefcase, Award, BadgeCheck, ShieldCheck, Landmark, HeartHandshake, Globe2, Banknote, HeartPulse, Zap, Sprout, Hotel, Building2, GraduationCap } from 'lucide-react'
import { Seo, orgLd, faqLd } from '../lib/seo.jsx'
import { SITE, HERO_SLIDES, FORMATS, STEPS, WHY, GENERAL_FAQS, ADVISORY, waLink } from '../data/site.js'
import { CATEGORIES, CITIES } from '../data/catalog.js'
import { COURSES } from '../data/courses.js'
import { allSessions, monthKey, monthLabel } from '../lib/util.js'
import { HeroSlider, CourseGrid, FaqList, Icon, Stat, SessionRow } from '../components/Bits.jsx'
import { SectionHead, FORMAT_ICON, formatLink } from '../components/Layout.jsx'

const SECTORS = [[Landmark, 'Government & public sector'], [HeartHandshake, 'NGOs & humanitarian'], [Globe2, 'Development partners'], [Banknote, 'Banks & financial institutions'], [HeartPulse, 'Health programmes'], [Zap, 'Energy & utilities'], [Sprout, 'Agriculture & food'], [Hotel, 'Hotels & tourism'], [Building2, 'Private companies'], [GraduationCap, 'Universities & research']]
const CHIPS = [['Climate & IPCC', 'climate'], ['Procurement', 'procurement'], ['Financial modelling', 'modelling'], ['Leadership', 'leadership'], ['MEAL', 'evaluation'], ['DHIS2', 'dhis2']]
const CITY_TABS = [['all', 'All'], ['online', 'Online'], ['nairobi', 'Nairobi'], ['kigali', 'Kigali'], ['dubai', 'Dubai'], ['mombasa', 'Mombasa'], ['zanzibar', 'Zanzibar']]

export default function Home() {
  const nav = useNavigate()
  const sessions = allSessions()
  const months = [...new Set(sessions.map((s) => monthKey(s.start)))].slice(0, 4)
  const [city, setCity] = useState('all')
  const pick = (filter, n) => {
    const out = [], seen = new Set()
    for (const s of sessions) {
      if (!filter(s) || seen.has(s.course.slug)) continue
      seen.add(s.course.slug); out.push(s)
      if (out.length === n) break
    }
    return out
  }
  const soon = pick((s) => city === 'all' || (city === 'online' ? s.format === 'online' : s.city === city), 6)
  const nextUp = pick(() => true, 3)
  const onSearch = (e) => {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const p = new URLSearchParams()
    for (const k of ['q', 'where', 'month']) { const v = f.get(k); if (v) p.set(k, v) }
    nav('/courses' + (p.toString() ? '?' + p : ''))
  }
  const count = (slug) => COURSES.filter((c) => c.category === slug).length
  const fmt = Object.fromEntries(FORMATS.map((f) => [f.slug, f]))

  return (
    <>
      <Seo path="/" description="Practical 5 and 10-day professional development courses in Nairobi, Kigali, Dubai and 15 more cities, live online or in-house for your team. Finance, procurement, M&E, climate, leadership and more."
        jsonLd={[orgLd(), { '@context': 'https://schema.org', '@type': 'WebSite', name: SITE.name, url: SITE.url, potentialAction: { '@type': 'SearchAction', target: SITE.url + '/courses?q={search_term_string}', 'query-input': 'required name=search_term_string' } }, faqLd(GENERAL_FAQS)]} />

      {/* 1. HERO: one message, one action (search), proof underneath */}
      <HeroSlider slides={HERO_SLIDES}>
        {({ controls, caption }) => (
          <div className="wrap grid grid-cols-1 gap-10 pb-16 pt-12 sm:pt-16 lg:grid-cols-[1.35fr_1fr] lg:items-center lg:gap-12 lg:pb-24 lg:pt-24">
            <div className="rise flex min-w-0 flex-col gap-6">
              <span className="pill-label glass-photo self-start text-white"><Sparkles size={13} className="text-amber" aria-hidden="true" />{SITE.tagline}</span>
              <h1 className="m-0 text-[38px] font-extrabold leading-[1.04] sm:text-[54px] lg:text-[64px]">
                What does your team need to <span className="text-gradient">get better at?</span>
              </h1>
              <p className="m-0 max-w-[600px] text-[17px] leading-relaxed text-white/80 sm:text-[19px]">Practical 5 and 10-day courses in {SITE.stats.cities} cities, live online, or in-house for your team.</p>

              <form role="search" onSubmit={onSearch} className="glass-photo flex max-w-[720px] flex-col gap-1.5 rounded-[26px] p-2 md:flex-row md:items-stretch md:rounded-full">
                <label className="flex flex-1 items-center gap-3 rounded-full px-4 py-2.5 md:min-w-0">
                  <Search size={20} className="flex-none text-white/70" aria-hidden="true" />
                  <span className="sr-only">Course or topic</span>
                  <input name="q" type="search" placeholder="Course or topic" className="w-full min-w-0 border-0 bg-transparent text-base font-medium text-white outline-none placeholder:text-white/60" />
                </label>
                <div className="flex gap-1.5">
                  <label className="flex flex-1 items-center rounded-full bg-white/10 px-3 md:flex-none"><span className="sr-only">Where</span>
                    <MapPin size={16} className="mr-1.5 flex-none text-white/70" aria-hidden="true" />
                    <select name="where" defaultValue="" className="h-11 w-full border-0 bg-transparent pr-1 text-[14.5px] font-semibold text-white outline-none md:w-[100px] [&>option]:text-black">
                      <option value="">Anywhere</option><option value="online">Online</option>
                      {CITIES.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                    </select>
                  </label>
                  <label className="flex flex-1 items-center rounded-full bg-white/10 px-3 md:flex-none"><span className="sr-only">When</span>
                    <CalendarDays size={16} className="mr-1.5 flex-none text-white/70" aria-hidden="true" />
                    <select name="month" defaultValue="" className="h-11 w-full border-0 bg-transparent pr-1 text-[14.5px] font-semibold text-white outline-none md:w-[96px] [&>option]:text-black">
                      <option value="">Any time</option>
                      {months.map((m) => <option key={m} value={m}>{monthLabel(m)}</option>)}
                    </select>
                  </label>
                </div>
                <button type="submit" className="btn-amber">Search</button>
              </form>

              <div className="flex flex-wrap items-center gap-2">
                <span className="mr-1 text-[13px] font-semibold text-white/60">Trending</span>
                {CHIPS.map(([l, q]) => <Link key={q} to={`/courses?q=${q}`} className="chip glass-photo !py-1 text-[13px] text-white no-underline hover:bg-white/20 hover:text-white">{l}</Link>)}
              </div>
            </div>

            {/* right: what is happening next + slideshow controls */}
            <div className="rise flex min-w-0 flex-col gap-3 [animation-delay:.15s]">
              <div className="glass-photo rounded-[28px] p-3">
                <div className="flex items-center justify-between px-2.5 pb-1.5 pt-1">
                  <span className="text-xs font-bold uppercase tracking-[.14em] text-white/70">Starting next</span>
                  <Link to="/calendar" className="text-[13px] font-semibold text-white no-underline hover:text-amber">Calendar</Link>
                </div>
                {nextUp.map((s) => <SessionRow key={s.id} s={s} />)}
              </div>
              <div className="glass-photo grid grid-cols-2 gap-4 rounded-[28px] px-5 py-4 sm:grid-cols-4 sm:gap-2">
                <Stat n={SITE.stats.categories} label="categories" />
                <Stat n={SITE.stats.topics} label="topics" />
                <Stat n={SITE.stats.cities} label="cities" />
                <Stat n="CPD" label="accredited" />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                {controls}
                <span className="text-[13px] text-white/70" aria-live="polite">{caption}</span>
              </div>
            </div>
          </div>
        )}
      </HeroSlider>

      {/* 2. WHO WE TRAIN */}
      <section aria-label="Sectors we train" className="overflow-hidden py-6">
        <p className="mb-4 text-center text-xs font-bold uppercase tracking-[.14em] text-faint">Training for teams across government, development and business</p>
        <div className="relative [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
          <div className="marquee flex w-max gap-3">
            {[...SECTORS, ...SECTORS].map(([I, l], n) => <span key={n} className="glass flex items-center gap-2.5 whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-semibold text-muted"><I size={16} className="text-brand" aria-hidden="true" />{l}</span>)}
          </div>
        </div>
      </section>

      {/* 3. COURSES: the core job of the site */}
      <section className="wrap py-16">
        <SectionHead eyebrow="Starting soon" title="Reserve a seat on the next dates" intro="Every date shows the city, format and the fee per participant."
          action={<Link to="/courses" className="btn-glass self-start sm:self-auto">All courses<ArrowRight size={17} aria-hidden="true" /></Link>} />
        <div className="glass no-scrollbar mb-6 inline-flex max-w-full gap-1 overflow-x-auto rounded-full p-1.5" role="tablist" aria-label="Filter by city">
          {CITY_TABS.map(([k, l]) => (
            <button key={k} type="button" role="tab" aria-selected={city === k} onClick={() => setCity(k)}
              className={`flex-none rounded-full px-4 py-2 text-sm font-semibold transition ${city === k ? 'bg-fg text-bg shadow' : 'text-muted hover:text-fg'}`}>{l}</button>
          ))}
        </div>
        {soon.length ? <CourseGrid sessions={soon} cols="sm:grid-cols-2 lg:grid-cols-3" /> : <p className="text-muted">No dates in this city yet. <Link to="/contact">Ask us about new dates</Link>.</p>}
      </section>

      {/* 4. FORMATS: bento grid, grouped by "join a public course" vs "train your team" */}
      <section className="wrap py-16">
        <SectionHead eyebrow="Formats" title="Learn the way that suits you" intro="Join a public course on your own, or bring a programme to your whole team." />
        <div className="grid gap-4 md:grid-cols-6 md:grid-rows-[auto_auto]">
          <Link to={formatLink('classroom')} className="card card-hover group relative min-h-[300px] overflow-hidden no-underline md:col-span-3 md:row-span-2">
            <img src="/images/hero/hero6.jpg" alt="" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050F1C] via-[#050F1C]/60 to-transparent" />
            <div className="relative flex h-full flex-col justify-end gap-2 p-7 text-white">
              <span className="pill-label glass-photo self-start">Most popular</span>
              <h3 className="m-0 text-[28px] font-extrabold">{fmt.classroom.name}</h3>
              <p className="m-0 max-w-md text-white/80">{fmt.classroom.text} 18 cities, 5 or 10 days.</p>
              <span className="mt-2 inline-flex items-center gap-1.5 font-bold text-amber">See classroom dates<ArrowUpRight size={18} aria-hidden="true" /></span>
            </div>
          </Link>
          {['online', 'masterclass', 'webinar'].map((k, n) => {
            const I = FORMAT_ICON[k]
            return (
              <Link key={k} to={formatLink(k)} className={`card card-hover flex flex-col gap-3 p-6 no-underline ${n === 0 ? 'md:col-span-3' : 'md:col-span-3 lg:col-span-3'}`}>
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-soft text-brand"><I size={21} aria-hidden="true" /></span>
                <h3 className="m-0 text-[19px] font-extrabold text-fg">{fmt[k].name}</h3>
                <p className="m-0 text-[14.5px] leading-relaxed text-muted">{fmt[k].text}</p>
              </Link>
            )
          }).slice(0, 2)}
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {['webinar', 'in-house', 'pathways'].map((k) => {
            const I = FORMAT_ICON[k]
            const team = k !== 'webinar'
            return (
              <Link key={k} to={formatLink(k)} className="card card-hover flex flex-col gap-3 p-6 no-underline">
                <div className="flex items-center justify-between"><span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${team ? 'bg-accent-soft text-accent' : 'bg-brand-soft text-brand'}`}><I size={21} aria-hidden="true" /></span>{team && <span className="pill-label bg-accent-soft text-accent">For teams</span>}</div>
                <h3 className="m-0 text-[19px] font-extrabold text-fg">{fmt[k].name}</h3>
                <p className="m-0 text-[14.5px] leading-relaxed text-muted">{fmt[k].text}</p>
              </Link>
            )
          })}
        </div>
      </section>

      {/* 5. FOCUS AREAS */}
      <section className="wrap py-16">
        <SectionHead eyebrow="Focus areas" title="Browse by what you do" action={<Link to="/courses" className="btn-glass self-start sm:self-auto">Search all<ArrowRight size={17} aria-hidden="true" /></Link>} />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {CATEGORIES.map((c) => (
            <Link key={c.slug} to={`/categories/${c.slug}`} className="card card-hover group flex items-center gap-4 !rounded-2xl p-4 no-underline">
              <span className="flex h-12 w-12 flex-none items-center justify-center rounded-2xl border border-line bg-surface text-brand transition group-hover:border-[#4FD1BE]/50 group-hover:bg-brand-soft"><Icon name={c.icon} size={21} /></span>
              <span className="min-w-0 flex-1"><span className="block text-[15px] font-bold leading-snug text-fg">{c.name}</span><span className="text-[13px] text-faint">{count(c.slug)} {count(c.slug) === 1 ? 'course' : 'courses'}</span></span>
              <ArrowUpRight size={18} className="flex-none text-faint transition group-hover:text-brand" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>

      {/* 6. HOW + WHY grouped: the process and the promise */}
      <section className="wrap py-16">
        <div className="glass relative overflow-hidden rounded-[36px] p-6 sm:p-10 lg:p-14">
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#0E8F7E]/30 blur-3xl" aria-hidden="true" />
          <SectionHead eyebrow="How it works" title="From search to certificate in four steps" />
          <ol className="relative m-0 grid list-none gap-6 p-0 md:grid-cols-4">
            <div className="absolute left-6 right-6 top-6 hidden h-px bg-gradient-to-r from-brand via-amber to-brand opacity-40 md:block" aria-hidden="true" />
            {STEPS.map((s, n) => (
              <li key={s.title} className="relative flex flex-col gap-3">
                <span className="glass-strong flex h-12 w-12 items-center justify-center rounded-2xl text-lg font-extrabold text-brand">{n + 1}</span>
                <span className="text-[17px] font-bold">{s.title}</span>
                <span className="text-[14.5px] leading-relaxed text-muted">{s.text}</span>
              </li>
            ))}
          </ol>
          <div className="mt-12 grid gap-4 border-t border-line pt-10 sm:grid-cols-2 lg:grid-cols-4">
            {WHY.map((w, n) => {
              const I = [Award, Users, MapPin, BadgeCheck][n]
              return (
                <div key={w.title} className="flex gap-3">
                  <I size={22} className="mt-0.5 flex-none text-accent" aria-hidden="true" />
                  <div><div className="font-bold">{w.title}</div><div className="mt-1 text-[14px] leading-relaxed text-muted">{w.text}</div></div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 7. ORGANISATIONS: teams + advisory side by side */}
      <section className="wrap py-16">
        <SectionHead eyebrow="For organisations" title="Build capability across your organisation" />
        <div className="grid gap-5 lg:grid-cols-[1.25fr_1fr]">
          <div className="card relative flex min-h-[360px] flex-col justify-end overflow-hidden p-7 sm:p-9">
            <img src="/images/hero/hero1.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050F1C] via-[#050F1C]/75 to-[#050F1C]/20" />
            <div className="relative flex flex-col gap-3 text-white">
              <span className="pill-label glass-photo self-start"><Users size={13} aria-hidden="true" />In-house and group training</span>
              <h3 className="m-0 text-[28px] font-extrabold leading-tight">Training a whole team?</h3>
              <p className="m-0 max-w-lg text-white/80">Any course, on your dates, in your city or online, adapted to your organisation. Quote within one working day.</p>
              <div className="mt-2 flex flex-wrap gap-2"><Link to="/for-teams#quote" className="btn-amber">Request a team quote</Link><Link to="/for-teams" className="btn-photo">How it works</Link></div>
            </div>
          </div>
          <div className="card flex flex-col gap-4 p-7 sm:p-9">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-soft text-brand"><Briefcase size={22} aria-hidden="true" /></span>
            <h3 className="m-0 text-[24px] font-extrabold">Advisory services</h3>
            <p className="m-0 text-muted">Practitioner support for the decisions that shape your organisation.</p>
            <ul className="m-0 grid list-none gap-2 p-0 text-[14.5px]">
              {ADVISORY.slice(0, 5).map((a) => <li key={a.title} className="flex items-center gap-2.5"><span className="h-1.5 w-1.5 flex-none rounded-full bg-amber" />{a.title}</li>)}
            </ul>
            <Link to="/advisory" className="btn-glass mt-auto self-start">Explore advisory<ArrowRight size={17} aria-hidden="true" /></Link>
          </div>
        </div>
      </section>

      {/* 8. TRUST: accreditation + mission + approach */}
      <section className="wrap py-16">
        <div className="grid gap-5 lg:grid-cols-[1fr_1.4fr]">
          <div className="card relative flex flex-col gap-4 overflow-hidden p-7 sm:p-9">
            <div className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-amber/20 blur-3xl" aria-hidden="true" />
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-soft text-accent"><ShieldCheck size={28} aria-hidden="true" /></span>
            <div className="eyebrow">Accredited</div>
            <h2 className="m-0 text-[28px] font-extrabold leading-tight">CPD-accredited training</h2>
            <p className="m-0 text-muted">Trainingcred Institute is a member of {SITE.cpd.body}, provider no. {SITE.cpd.provider}. Every participant who completes a course receives a certificate recording the CPD hours attended.</p>
            <Link to="/about" className="btn-glass mt-auto self-start">About Trainingcred<ArrowRight size={17} aria-hidden="true" /></Link>
          </div>
          <div className="card flex flex-col gap-6 p-7 sm:p-9">
            <Quote size={30} className="text-brand" aria-hidden="true" />
            <blockquote className="m-0 text-[22px] font-bold leading-snug sm:text-[26px]">Our mission is {SITE.mission.charAt(0).toLowerCase() + SITE.mission.slice(1)}</blockquote>
            <div className="grid gap-3 sm:grid-cols-3">
              {[['Assess', 'We start from the skills gap and the work your people actually do.'], ['Engage', 'Practitioner trainers, real cases and hands-on exercises.'], ['Empower', 'Tools, templates and action plans to use straight away.']].map(([t, d], n) => (
                <div key={t} className="rounded-2xl bg-surface p-4">
                  <div className="flex items-center gap-2"><span className="text-xs font-extrabold text-accent">0{n + 1}</span><span className="text-lg font-extrabold">{t}</span></div>
                  <p className="m-0 mt-1.5 text-[14px] leading-relaxed text-muted">{d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 9. FAQ grouped with direct contact */}
      <section className="wrap py-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.5fr]">
          <div className="flex flex-col gap-4">
            <SectionHead eyebrow="Questions" title="Good to know before you book" />
            <div className="card -mt-4 flex flex-col gap-3 p-6">
              <div className="font-bold">Talk to a course advisor</div>
              <p className="m-0 text-[14.5px] text-muted">We help with course choice, nominations, invitation letters and invoices.</p>
              <div className="flex flex-wrap gap-2">
                <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn-primary btn-sm"><MessageCircle size={16} aria-hidden="true" />WhatsApp</a>
                <a href={SITE.phoneHref} className="btn-glass btn-sm"><Phone size={16} aria-hidden="true" />{SITE.phone}</a>
              </div>
            </div>
          </div>
          <div><FaqList faqs={GENERAL_FAQS.slice(0, 5)} /><Link to="/faq" className="mt-5 inline-flex items-center gap-1.5 font-bold no-underline">All questions<ArrowRight size={16} aria-hidden="true" /></Link></div>
        </div>
      </section>
    </>
  )
}
