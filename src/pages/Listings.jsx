import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowRight, Search, ChevronDown } from 'lucide-react'
import { Seo, crumbsLd } from '../lib/seo.jsx'
import { SITE } from '../data/site.js'
import { categoryBySlug, cityBySlug, CITIES, CATEGORIES } from '../data/catalog.js'
import { COURSES } from '../data/courses.js'
import { allSessions, monthKey, monthLabel, dateRange, money, where, categoryName, monShort, dayNum, TODAY } from '../lib/util.js'
import { PageHero } from '../components/Layout.jsx'
import { CourseListing } from './Courses.jsx'
import NotFound from './NotFound.jsx'

export function Category() {
  const { slug } = useParams()
  const cat = categoryBySlug(slug)
  if (!cat) return <NotFound />
  const n = COURSES.filter((c) => c.category === slug).length
  const crumbs = [{ name: 'Home', path: '/' }, { name: 'Courses', path: '/courses' }, { name: cat.name, path: `/categories/${slug}` }]
  return (
    <>
      <Seo title={`${cat.name} Training Courses`} path={`/categories/${slug}`} description={`${cat.intro} ${n} courses in classroom, live online and in-house formats, with dates and fees.`}
        jsonLd={[crumbsLd(crumbs), { '@context': 'https://schema.org', '@type': 'ItemList', itemListElement: COURSES.filter((c) => c.category === slug).map((c, i) => ({ '@type': 'ListItem', position: i + 1, url: `${SITE.url}/courses/${c.slug}` })) }]} />
      <PageHero crumbs={crumbs} eyebrow="Focus area" title={`${cat.name} courses`} intro={cat.intro} />
      <section><div className="wrap py-10"><CourseListing fixed={{ category: slug }} /></div></section>
    </>
  )
}

export function City() {
  const { slug } = useParams()
  const city = cityBySlug(slug)
  if (!city) return <NotFound />
  const crumbs = [{ name: 'Home', path: '/' }, { name: 'Destinations', path: '/destinations' }, { name: city.name, path: `/cities/${slug}` }]
  return (
    <>
      <Seo title={`Training Courses in ${city.name}, ${city.country}`} path={`/cities/${slug}`} description={`Upcoming 5 and 10-day classroom training courses in ${city.name}, ${city.country}: dates, fees and how to book. Also available live online.`} jsonLd={crumbsLd(crumbs)} />
      <PageHero crumbs={crumbs} eyebrow="Training destination" title={`Training courses in ${city.name}`} intro={`5 and 10-day classroom courses in ${city.name}, ${city.country}, led by practitioner trainers in a professional conference venue. Joining instructions with the exact venue and hotel options follow your booking.`} />
      <section><div className="wrap py-10"><CourseListing fixed={{ where: slug }} /></div></section>
    </>
  )
}

export function Destinations() {
  const sessions = allSessions()
  return (
    <>
      <Seo title="Training Destinations" path="/destinations" description="Classroom training in Nairobi, Mombasa, Kigali, Kampala, Zanzibar, Addis Ababa, Dubai, Cairo, Lagos, Abuja, Johannesburg, Pretoria and Cape Town, or live online." />
      <PageHero crumbs={[{ name: 'Home', path: '/' }, { name: 'Destinations', path: '/destinations' }]} title="Training destinations" intro="Join a classroom course in one of our cities, or train live online from anywhere." />
      <section>
        <div className="wrap grid gap-4 py-12 sm:grid-cols-2 lg:grid-cols-3">
          {CITIES.map((c) => {
            const n = sessions.filter((s) => s.city === c.slug).length
            return (
              <Link key={c.slug} to={`/cities/${c.slug}`} className="card flex items-center justify-between gap-3 p-5 text-fg no-underline hover:border-[#F59E0B]">
                <span><span className="block text-lg font-extrabold">{c.name}</span><span className="text-sm text-muted">{c.country} · {n} upcoming {n === 1 ? 'date' : 'dates'}</span></span>
                <ArrowRight size={20} className="text-brand" aria-hidden="true" />
              </Link>
            )
          })}
        </div>
      </section>
    </>
  )
}

const WEEK_SHOW = 6
const addDaysIso = (iso, n) => { const d = new Date(iso + 'T00:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10) }
// Monday of the week an ISO date falls in
const weekOf = (iso) => { const d = new Date(iso + 'T00:00:00Z'); const k = (d.getUTCDay() + 6) % 7; return addDaysIso(iso, -k) }

export function Calendar() {
  const all = useMemo(() => allSessions(), [])
  const months = useMemo(() => [...new Set(all.map((s) => monthKey(s.start)))], [all])
  const [month, setMonth] = useState(months[0])
  const [format, setFormat] = useState('')
  const [whereF, setWhereF] = useState('')
  const [area, setArea] = useState('')
  const [q, setQ] = useState('')
  const [open, setOpen] = useState({})

  const match = (s, skipMonth) => (skipMonth || monthKey(s.start) === month) && (!format || s.format === format) &&
    (!whereF || (whereF === 'online' ? s.format === 'online' : s.city === whereF)) && (!area || s.course.category === area) &&
    (!q || s.course.title.toLowerCase().includes(q.trim().toLowerCase()))
  const monthCount = useMemo(() => { const m = new Map(); for (const s of all) if (match(s, true)) m.set(monthKey(s.start), (m.get(monthKey(s.start)) || 0) + 1); return m }, [all, format, whereF, area, q]) // eslint-disable-line react-hooks/exhaustive-deps
  const weeks = useMemo(() => {
    const m = new Map()
    for (const s of all) { if (!match(s)) continue; const w = weekOf(s.start); if (!m.has(w)) m.set(w, []); m.get(w).push(s) }
    return [...m.entries()]
  }, [all, month, format, whereF, area, q]) // eslint-disable-line react-hooks/exhaustive-deps
  const total = weeks.reduce((n, [, l]) => n + l.length, 0)
  const thisWeek = weekOf(TODAY), nextWeek = addDaysIso(thisWeek, 7)
  const reset = () => { setFormat(''); setWhereF(''); setArea(''); setQ('') }
  const filtered = format || whereF || area || q

  return (
    <>
      <Seo title="Training Calendar - Upcoming Course Dates" path="/calendar" description="Every upcoming course date by month: classroom sessions in 18 cities and live online, with fees per participant." />
      <PageHero crumbs={[{ name: 'Home', path: '/' }, { name: 'Calendar', path: '/calendar' }]} title="Training calendar" intro="All upcoming dates, month by month. Pick a date to reserve a seat.">
        <p className="m-0 text-[15px] text-muted"><b className="text-accent">{all.length.toLocaleString('en-US')} dates</b> over the next {months.length} months, new intakes every Monday.</p>
      </PageHero>
      <section className="wrap pb-16">
        <div className="rounded-3xl border border-line bg-surface p-4 shadow-[var(--glass-shadow)] sm:p-5">
          <nav aria-label="Months" className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
            {months.map((k) => {
              const [y, m] = k.split('-'); const on = k === month; const n = monthCount.get(k) || 0
              return (
                <button key={k} type="button" aria-pressed={on} onClick={() => { setMonth(k); setOpen({}) }}
                  className={`flex min-w-[92px] flex-none flex-col items-start rounded-2xl border px-4 py-2.5 text-left transition ${on ? 'border-[#F59E0B] bg-[#F59E0B] text-[#111827]' : 'border-line bg-bg text-fg hover:border-[#F59E0B]/60'}`}>
                  <span className="text-[16px] font-extrabold leading-tight">{monthLabel(k).split(' ')[0].slice(0, 3)} <span className={`text-[12px] font-semibold ${on ? 'text-[#111827]/70' : 'text-faint'}`}>{y}</span></span>
                  <span className={`text-[12px] font-semibold ${on ? 'text-[#111827]/75' : 'text-faint'}`}>{n} {n === 1 ? 'date' : 'dates'}</span>
                </button>
              )
            })}
          </nav>
          <div className="mt-4 grid gap-3 md:grid-cols-[auto_1fr_1fr_1.2fr]">
            <div className="grid grid-cols-3 gap-1 rounded-xl bg-bg p-1" role="group" aria-label="Format">
              {[['', 'All'], ['classroom', 'Classroom'], ['online', 'Online']].map(([k, l]) => (
                <button key={k} type="button" aria-pressed={format === k} onClick={() => setFormat(k)} className={`min-h-10 rounded-lg px-3 text-[13px] font-bold transition ${format === k ? 'bg-[#F59E0B] text-[#111827]' : 'text-muted hover:text-fg'}`}>{l}</button>
              ))}
            </div>
            <label className="sr-only" htmlFor="cal-where">Where</label>
            <select id="cal-where" className="input !py-2.5" value={whereF} onChange={(e) => setWhereF(e.target.value)}>
              <option value="">Anywhere</option><option value="online">Live online</option>
              {CITIES.map((c) => <option key={c.slug} value={c.slug}>{c.name}, {c.country}</option>)}
            </select>
            <label className="sr-only" htmlFor="cal-area">Focus area</label>
            <select id="cal-area" className="input !py-2.5" value={area} onChange={(e) => setArea(e.target.value)}>
              <option value="">All focus areas</option>{CATEGORIES.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
            </select>
            <label className="relative"><span className="sr-only">Search the calendar</span>
              <Search size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-faint" aria-hidden="true" />
              <input type="search" className="input !py-2.5" style={{ paddingLeft: 40 }} placeholder="Course title" value={q} onChange={(e) => setQ(e.target.value)} />
            </label>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-2">
          <p className="m-0 text-[15px] text-muted" aria-live="polite"><b className="text-fg">{total}</b> {total === 1 ? 'date' : 'dates'} in {monthLabel(month)}</p>
          {filtered && <button type="button" onClick={reset} className="text-[14px] font-semibold text-brand underline">Clear filters</button>}
        </div>

        {weeks.length ? weeks.map(([w, list]) => {
          const shown = open[w] ? list : list.slice(0, WEEK_SHOW)
          const tag = w === thisWeek ? 'This week' : w === nextWeek ? 'Next week' : null
          return (
            <section key={w} className="mt-8 grid gap-4 lg:grid-cols-[190px_1fr]" aria-label={`Week of ${dateRange(w, addDaysIso(w, 4))}`}>
              <header className="lg:sticky lg:top-28 lg:self-start">
                <div className="flex items-center gap-3 lg:flex-col lg:items-start lg:gap-2">
                  <span className="flex h-16 w-16 flex-none flex-col items-center justify-center rounded-2xl bg-[#0F172A] leading-none text-white ring-1 ring-line">
                    <span className="text-[11px] font-extrabold tracking-wider text-[#F59E0B]">{monShort(w)}</span><span className="text-[24px] font-extrabold">{dayNum(w)}</span>
                  </span>
                  <span>
                    <span className="block text-[12px] font-bold uppercase tracking-[.12em] text-faint">Week of</span>
                    <span className="block text-[16px] font-extrabold text-fg">{dateRange(w, addDaysIso(w, 4))}</span>
                    <span className="mt-1 flex flex-wrap gap-1.5 text-[12px] font-semibold">
                      {tag && <span className="rounded-full bg-brand-soft px-2 py-0.5 text-brand">{tag}</span>}
                      <span className="rounded-full border border-line px-2 py-0.5 text-muted">{list.length} {list.length === 1 ? 'course' : 'courses'}</span>
                    </span>
                  </span>
                </div>
              </header>
              <div>
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {shown.map((s) => (
                    <article key={s.id} className="group relative flex flex-col gap-2 rounded-2xl border border-line bg-surface p-4 transition hover:-translate-y-0.5 hover:border-[#F59E0B]/60">
                      <div className="flex items-center justify-between gap-2 text-[12px] font-semibold">
                        <span className="text-faint">{dateRange(s.start, s.end5)}</span>
                        <span className={`rounded-full px-2 py-0.5 ${s.format === 'online' ? 'bg-brand-soft text-brand' : 'border border-line text-muted'}`}>{s.format === 'online' ? 'Live online' : 'Classroom'}</span>
                      </div>
                      <h3 className="m-0 line-clamp-2 text-[15.5px] font-extrabold leading-snug"><Link to={`/courses/${s.course.slug}`} className="text-fg no-underline after:absolute after:inset-0 group-hover:text-brand">{s.course.title}</Link></h3>
                      <p className="m-0 text-[13px] text-muted">{categoryName(s.course.category).split(',')[0]} · {where(s)}</p>
                      <div className="mt-auto flex items-center justify-between gap-2 border-t border-line pt-3">
                        <span className="text-[16px] font-extrabold text-accent">{money(s.fee5)}</span>
                        <Link to={`/book/${s.course.slug}?session=${encodeURIComponent(s.id)}`} className="relative z-10 text-[14px] font-bold text-brand no-underline hover:underline">Reserve &rarr;</Link>
                      </div>
                    </article>
                  ))}
                </div>
                {list.length > WEEK_SHOW && (
                  <button type="button" onClick={() => setOpen({ ...open, [w]: !open[w] })} className="mt-3 inline-flex min-h-10 items-center gap-1.5 rounded-full border border-line px-4 text-[14px] font-semibold text-fg hover:border-[#F59E0B]/60">
                    {open[w] ? 'Show fewer' : `Show all ${list.length} this week`}<ChevronDown size={16} className={`transition ${open[w] ? 'rotate-180' : ''}`} aria-hidden="true" />
                  </button>
                )}
              </div>
            </section>
          )
        }) : (
          <div className="mt-8 rounded-2xl border border-line bg-surface p-8 text-center"><p className="m-0 text-lg font-bold">No dates match in {monthLabel(month)}.</p><p className="mt-2 text-muted">Try another month or fewer filters, or <Link to="/contact">ask us</Link> about a date that suits you.</p></div>
        )}
      </section>
    </>
  )
}
