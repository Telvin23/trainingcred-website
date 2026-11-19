import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, ArrowRight, Building2, Monitor, Mic, Video, Users, Route, Briefcase, Quote } from 'lucide-react'
import { Seo, orgLd, faqLd } from '../lib/seo.jsx'
import { SITE, HERO_SLIDES, FORMATS, STEPS, WHY, GENERAL_FAQS, ADVISORY } from '../data/site.js'
import { CATEGORIES, CITIES } from '../data/catalog.js'
import { COURSES } from '../data/courses.js'
import { allSessions, monthKey, monthLabel } from '../lib/util.js'
import { HeroSlider, CourseGrid, FaqList, Icon } from '../components/Bits.jsx'

const FORMAT_ICON = { classroom: Building2, online: Monitor, masterclass: Mic, webinar: Video, 'in-house': Users, pathways: Route }
const CHIPS = [['Climate & IPCC', 'climate'], ['Procurement', 'procurement'], ['IFRS', 'ifrs'], ['Leadership', 'leadership'], ['M&E', 'evaluation'], ['AI at work', 'ai']]

export default function Home() {
  const nav = useNavigate()
  const sessions = allSessions()
  const months = [...new Set(sessions.map((s) => monthKey(s.start)))].slice(0, 4)
  const [city, setCity] = useState('all')
  const soon = []
  const seen = new Set()
  for (const s of sessions) {
    if (city !== 'all' && (city === 'online' ? s.format !== 'online' : s.city !== city)) continue
    if (seen.has(s.course.slug)) continue
    seen.add(s.course.slug); soon.push(s)
    if (soon.length === 6) break
  }
  const onSearch = (e) => {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const p = new URLSearchParams()
    for (const k of ['q', 'where', 'month']) { const v = f.get(k); if (v) p.set(k, v) }
    nav('/courses' + (p.toString() ? '?' + p : ''))
  }
  const count = (slug) => COURSES.filter((c) => c.category === slug).length

  return (
    <>
      <Seo path="/" description="Practical 5 and 10-day professional development courses in Nairobi, Kigali, Dubai and 15 more cities, live online or in-house for your team. Finance, procurement, M&E, climate, leadership and more."
        jsonLd={[orgLd(), { '@context': 'https://schema.org', '@type': 'WebSite', name: SITE.name, url: SITE.url, potentialAction: { '@type': 'SearchAction', target: SITE.url + '/courses?q={search_term_string}', 'query-input': 'required name=search_term_string' } }, faqLd(GENERAL_FAQS)]} />

      <HeroSlider slides={HERO_SLIDES}>
        <div className="wrap flex flex-col gap-5 pt-12 pb-6 sm:pt-20 lg:pt-24">
          <span className="eyebrow self-start rounded-md border border-white/30 bg-white/10 px-3 py-1.5">Short courses · Classroom · Live online · In-house</span>
          <h1 className="m-0 max-w-[820px] text-[34px] font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-[60px]">What does your team need to get better at?</h1>
          <p className="m-0 max-w-[680px] text-[17px] leading-relaxed text-haze sm:text-[19px]">Practical 5 and 10-day professional courses in {SITE.stats.cities} cities and live online, built around the work your people do every day.</p>
          <form role="search" onSubmit={onSearch} className="mt-2 flex max-w-[920px] flex-col gap-2 rounded-2xl bg-white p-2.5 text-ink shadow-[0_20px_50px_rgba(4,20,34,.35)] md:flex-row md:flex-wrap">
            <label className="flex flex-col md:flex-[3_1_280px] px-3 py-1.5 text-xs font-semibold text-muted">Course or topic
              <input name="q" type="search" placeholder="e.g. IFRS, procurement, climate finance" className="border-0 bg-transparent py-1 text-base font-medium text-ink outline-none" />
            </label>
            <div className="flex border-t md:flex-[2_1_300px] border-line md:border-t-0">
              <label className="flex flex-1 flex-col px-3 py-1.5 text-xs font-semibold text-muted md:border-l md:border-line">Where
                <select name="where" className="border-0 bg-transparent py-1 text-[15px] text-ink outline-none" defaultValue="">
                  <option value="">Any city or online</option><option value="online">Live online</option>
                  {CITIES.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                </select>
              </label>
              <label className="flex flex-1 flex-col border-l border-line px-3 py-1.5 text-xs font-semibold text-muted">When
                <select name="month" className="border-0 bg-transparent py-1 text-[15px] text-ink outline-none" defaultValue="">
                  <option value="">Any month</option>
                  {months.map((m) => <option key={m} value={m}>{monthLabel(m)}</option>)}
                </select>
              </label>
            </div>
            <button type="submit" className="btn-primary min-h-14 !px-7 text-base"><Search size={18} aria-hidden="true" />Find courses</button>
          </form>
          <div className="flex max-w-[920px] flex-wrap items-center gap-2">
            <span className="mr-1 text-sm text-haze">Popular now:</span>
            {CHIPS.map(([l, q]) => <Link key={q} to={`/courses?q=${q}`} className="chip border border-white/30 bg-white/10 text-white no-underline hover:bg-white/20 hover:text-white">{l}</Link>)}
          </div>
          <dl className="mt-4 grid max-w-[920px] grid-cols-2 gap-4 sm:grid-cols-4">
            {[[SITE.stats.categories, 'course categories'], [SITE.stats.topics, 'focused topics'], [SITE.stats.cities, 'training cities'], [SITE.stats.participants, 'participants trained']].map(([n, l]) => (
              <div key={l} className="border-l-2 border-white/35 pl-3.5"><dt className="sr-only">{l}</dt><dd className="m-0"><span className="block text-[26px] font-extrabold sm:text-[30px]">{n}</span><span className="text-sm text-haze">{l}</span></dd></div>
            ))}
          </dl>
        </div>
      </HeroSlider>

      {/* trust strip */}
      <section className="border-b border-line bg-white" aria-label="Organisations we have trained">
        <div className="wrap flex flex-wrap items-center gap-x-8 gap-y-3 py-6">
          <span className="text-sm font-semibold text-muted">Trusted by teams from</span>
          {['[Client logo]', '[Client logo]', '[Client logo]', '[Client logo]', '[Client logo]', '[Client logo]'].map((l, n) => <span key={n} className="rounded-lg border border-dashed border-line px-4 py-2 text-sm text-muted">{l}</span>)}
        </div>
      </section>

      {/* formats */}
      <section className="bg-white">
        <div className="wrap py-14">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div><h2 className="h2 m-0">Learn the way that suits you</h2><p className="m-0 mt-1.5 text-muted">Six ways to train, one standard of quality.</p></div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FORMATS.map((f) => {
              const I = FORMAT_ICON[f.slug]
              const to = f.slug === 'in-house' || f.slug === 'pathways' ? '/for-teams' : `/courses?format=${f.slug}`
              return (
                <Link key={f.slug} to={to} className="card group flex gap-4 p-5 text-ink no-underline transition hover:border-teal hover:shadow-[0_12px_30px_rgba(11,53,87,.08)]">
                  <span className="flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-mint text-teal"><I size={22} aria-hidden="true" /></span>
                  <span><span className="block text-[17px] font-extrabold">{f.name}</span><span className="mt-1 block text-[14.5px] leading-relaxed text-muted">{f.text}</span></span>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* starting soon */}
      <section className="bg-soft">
        <div className="wrap py-14">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
            <div><h2 className="h2 m-0">Starting soon</h2><p className="m-0 mt-1.5 text-muted">Reserve a seat on the next available dates.</p></div>
            <Link to="/calendar" className="flex items-center gap-1.5 font-bold text-teal no-underline">Full calendar<ArrowRight size={16} aria-hidden="true" /></Link>
          </div>
          <div className="no-scrollbar -mx-4 mb-5 flex gap-2 overflow-x-auto px-4" role="group" aria-label="Filter by city">
            {[['all', 'All cities'], ['online', 'Live online'], ['nairobi', 'Nairobi'], ['kigali', 'Kigali'], ['dubai', 'Dubai'], ['mombasa', 'Mombasa'], ['zanzibar', 'Zanzibar']].map(([k, l]) => (
              <button key={k} type="button" aria-pressed={city === k} onClick={() => setCity(k)}
                className={`chip min-h-10 flex-none border font-semibold ${city === k ? 'border-navy bg-navy text-white' : 'border-line bg-white text-ink hover:border-teal'}`}>{l}</button>
            ))}
          </div>
          {soon.length ? <CourseGrid sessions={soon} /> : <p className="text-muted">No dates in this city yet. <Link to="/contact">Ask us about new dates</Link>.</p>}
        </div>
      </section>

      {/* focus areas */}
      <section className="bg-white">
        <div className="wrap py-14">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <h2 className="h2 m-0">Browse by focus area</h2>
            <Link to="/courses" className="flex items-center gap-1.5 font-bold text-teal no-underline">All courses<ArrowRight size={16} aria-hidden="true" /></Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {CATEGORIES.map((c) => (
              <Link key={c.slug} to={`/categories/${c.slug}`} className="card flex items-center gap-3.5 p-4 text-ink no-underline transition hover:border-teal">
                <span className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-mint text-teal"><Icon name={c.icon} size={20} /></span>
                <span className="min-w-0"><span className="block text-[15px] font-bold leading-snug">{c.name}</span><span className="text-[13px] text-muted">{count(c.slug)} {count(c.slug) === 1 ? 'course' : 'courses'}</span></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* how it works + why */}
      <section className="bg-navy text-white">
        <div className="wrap grid gap-12 py-16 lg:grid-cols-2">
          <div>
            <h2 className="m-0 text-[28px] font-extrabold">How it works</h2>
            <ol className="m-0 mt-6 flex list-none flex-col gap-5 p-0">
              {STEPS.map((s, n) => (
                <li key={s.title} className="flex gap-4">
                  <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-white font-extrabold text-navy">{n + 1}</span>
                  <span><span className="block text-[17px] font-bold">{s.title}</span><span className="text-[15px] text-haze">{s.text}</span></span>
                </li>
              ))}
            </ol>
          </div>
          <div>
            <h2 className="m-0 text-[28px] font-extrabold">Why Trainingcred</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {WHY.map((w) => (
                <div key={w.title} className="rounded-2xl border border-white/15 bg-white/5 p-5">
                  <div className="text-[16px] font-bold">{w.title}</div><div className="mt-1.5 text-[14.5px] leading-relaxed text-haze">{w.text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* testimonials (placeholders until real quotes are collected) */}
      <section className="bg-white">
        <div className="wrap py-14">
          <h2 className="h2 m-0 mb-6">What participants say</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <figure key={n} className="card m-0 flex flex-col gap-4 p-6">
                <Quote size={26} className="text-teal" aria-hidden="true" />
                <blockquote className="m-0 text-[15.5px] leading-relaxed text-ink">[A real quote from a past participant about what changed in their work after the course.]</blockquote>
                <figcaption className="mt-auto text-sm"><strong>[Name]</strong><br /><span className="text-muted">[Role, Organisation]</span></figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* teams + advisory */}
      <section className="bg-soft">
        <div className="wrap grid gap-5 py-14 md:grid-cols-2">
          <div className="flex flex-col gap-4 rounded-3xl bg-teal p-7 text-white sm:p-9">
            <Users size={30} aria-hidden="true" />
            <h2 className="m-0 text-[26px] font-extrabold">Training a whole team?</h2>
            <p className="m-0 text-[16px] leading-relaxed text-white/90">Any course can run in-house on your dates, in your city or online, adapted to your organisation. Five or more people from one organisation also get group rates on public dates.</p>
            <Link to="/for-teams#quote" className="btn-white mt-auto self-start">Request a team quote</Link>
          </div>
          <div className="flex flex-col gap-4 rounded-3xl bg-navy p-7 text-white sm:p-9">
            <Briefcase size={30} aria-hidden="true" />
            <h2 className="m-0 text-[26px] font-extrabold">Advisory services</h2>
            <p className="m-0 text-[16px] leading-relaxed text-haze">Advisory services for consequential decisions: {ADVISORY.length} services across strategy, MEL, finance, procurement, HR and climate.</p>
            <Link to="/advisory" className="btn-ghost mt-auto self-start">Explore advisory</Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white">
        <div className="wrap py-14"><div className="mx-auto max-w-[900px]">
          <h2 className="h2 m-0 mb-3">Frequently asked questions</h2>
          <FaqList faqs={GENERAL_FAQS.slice(0, 5)} />
          <Link to="/faq" className="mt-5 inline-flex items-center gap-1.5 font-bold text-teal no-underline">All questions<ArrowRight size={16} aria-hidden="true" /></Link>
        </div></div>
      </section>
    </>
  )
}
