import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { Seo, crumbsLd } from '../lib/seo.jsx'
import { COURSES } from '../data/courses.js'
import { CATEGORIES, CITIES, categoryBySlug, cityBySlug } from '../data/catalog.js'
import { upcoming, monthKey, monthLabel, allSessions, categoryName } from '../lib/util.js'
import { CourseGrid } from '../components/Bits.jsx'
import { PageHero } from '../components/Layout.jsx'

export function useHydrated() {
  const [h, setH] = useState(false)
  useEffect(() => setH(true), [])
  return h
}

const norm = (s) => s.toLowerCase().normalize('NFKD')

// Shared listing used by /courses, /categories/:slug and /cities/:slug
export function CourseListing({ fixed = {}, showFilters = true }) {
  const [params, setParams] = useSearchParams()
  const hydrated = useHydrated()
  const get = (k) => fixed[k] || (hydrated ? params.get(k) || '' : '')
  const q = get('q'), category = get('category'), whereF = get('where'), format = get('format'), month = get('month')
  const [open, setOpen] = useState(false)
  const months = useMemo(() => [...new Set(allSessions().map((s) => monthKey(s.start)))], [])

  const set = (k, v) => {
    const p = new URLSearchParams(params)
    if (v) p.set(k, v); else p.delete(k)
    setParams(p, { replace: true, preventScrollReset: true })
  }

  const results = useMemo(() => {
    const words = norm(q).split(/\s+/).filter(Boolean)
    const out = []
    for (const c of COURSES) {
      if (category && c.category !== category) continue
      if (words.length) {
        const hay = norm([c.title, c.summary, categoryName(c.category), c.outcomes.join(' '), c.modules.map((m) => m.title).join(' ')].join(' '))
        if (!words.every((w) => hay.includes(w))) continue
      }
      const ss = upcoming(c).filter((s) =>
        (!format || format === 'masterclass' || format === 'webinar' || s.format === format) &&
        (!whereF || (whereF === 'online' ? s.format === 'online' : s.city === whereF)) &&
        (!month || monthKey(s.start) === month))
      if ((whereF || format || month) && !ss.length) continue
      out.push(ss[0] ? { ...ss[0], course: c } : { course: c })
    }
    return out.sort((a, b) => (a.start || '9') < (b.start || '9') ? -1 : 1)
  }, [q, category, whereF, format, month])

  const active = [['q', q], ['category', category], ['where', whereF], ['format', format], ['month', month]].filter(([k, v]) => v && !fixed[k])
  const labelOf = (k, v) => k === 'category' ? categoryBySlug(v)?.name : k === 'where' ? (v === 'online' ? 'Live online' : cityBySlug(v)?.name) : k === 'month' ? monthLabel(v) : k === 'format' ? ({ classroom: 'Classroom', online: 'Live online' }[v] || v) : `"${v}"`

  const filters = (
    <div className="flex flex-col gap-4">
      {!fixed.category && (
        <label className="field">Focus area
          <select className="input" value={category} onChange={(e) => set('category', e.target.value)}>
            <option value="">All focus areas</option>{CATEGORIES.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
          </select>
        </label>
      )}
      {!fixed.where && (
        <label className="field">Where
          <select className="input" value={whereF} onChange={(e) => set('where', e.target.value)}>
            <option value="">Any city or online</option><option value="online">Live online</option>
            {CITIES.map((c) => <option key={c.slug} value={c.slug}>{c.name}, {c.country}</option>)}
          </select>
        </label>
      )}
      <label className="field">Format
        <select className="input" value={format} onChange={(e) => set('format', e.target.value)}>
          <option value="">Any format</option><option value="classroom">Classroom</option><option value="online">Live online</option>
        </select>
      </label>
      <label className="field">Month
        <select className="input" value={month} onChange={(e) => set('month', e.target.value)}>
          <option value="">Any month</option>{months.map((m) => <option key={m} value={m}>{monthLabel(m)}</option>)}
        </select>
      </label>
    </div>
  )

  return (
    <div className="grid gap-8 lg:grid-cols-[270px_1fr]">
      {showFilters && (
        <aside className="hidden lg:block" aria-label="Filters"><div className="sticky top-24 card p-5"><div className="mb-4 font-extrabold">Filter courses</div>{filters}</div></aside>
      )}
      <div className="min-w-0">
        <div className="mb-5 flex flex-col gap-3">
          <form role="search" onSubmit={(e) => e.preventDefault()} className="flex gap-2">
            <label className="relative flex-1">
              <span className="sr-only">Search courses</span>
              <Search size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" aria-hidden="true" />
              <input type="search" className="input !pl-10" placeholder="Search by course or topic" value={q} onChange={(e) => set('q', e.target.value)} />
            </label>
            {showFilters && <button type="button" className="btn-outline lg:hidden" aria-expanded={open} onClick={() => setOpen(!open)}><SlidersHorizontal size={18} aria-hidden="true" />Filters</button>}
          </form>
          {open && <div className="card p-4 lg:hidden">{filters}</div>}
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="font-semibold text-muted" aria-live="polite">{results.length} {results.length === 1 ? 'course' : 'courses'}</span>
            {active.map(([k, v]) => (
              <button key={k} type="button" onClick={() => set(k, '')} className="chip min-h-9 gap-1.5 border border-line bg-white font-semibold text-ink hover:border-teal" aria-label={`Remove filter ${labelOf(k, v)}`}>{labelOf(k, v)}<X size={14} aria-hidden="true" /></button>
            ))}
            {active.length > 1 && <button type="button" onClick={() => setParams({}, { replace: true })} className="font-semibold text-teal underline">Clear all</button>}
          </div>
        </div>
        {results.length ? <CourseGrid sessions={results.map((r) => (r.id ? r : { course: r.course }))} /> : (
          <div className="card p-8 text-center"><p className="m-0 text-lg font-bold">No courses match these filters.</p><p className="mt-2 text-muted">Try fewer filters, or <Link to="/contact">ask us</Link> - we run most topics on request.</p></div>
        )}
      </div>
    </div>
  )
}

export default function Courses() {
  return (
    <>
      <Seo title="All Training Courses - Dates, Cities and Fees" path="/courses"
        description="Browse professional development courses by topic, city, format and month. Classroom courses in 18 cities, live online and in-house, with dates and fees."
        jsonLd={crumbsLd([{ name: 'Home', path: '/' }, { name: 'Courses', path: '/courses' }])} />
      <PageHero crumbs={[{ name: 'Home', path: '/' }, { name: 'Courses', path: '/courses' }]} title="Find a course" intro="Search every course by topic, city, format and month. Every date shows the fee per participant." />
      <section className="bg-soft"><div className="wrap py-10"><CourseListing /></div></section>
    </>
  )
}
