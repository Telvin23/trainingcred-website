import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, X, ChevronDown, Monitor, Building2, LayoutGrid } from 'lucide-react'
import { Seo, crumbsLd } from '../lib/seo.jsx'
import { COURSES } from '../data/courses.js'
import { CATEGORIES, CITIES, categoryBySlug, cityBySlug } from '../data/catalog.js'
import { upcoming, monthKey, monthLabel, allSessions, categoryName } from '../lib/util.js'
import { CourseGrid } from '../components/Bits.jsx'
import { Crumbs } from '../components/Layout.jsx'

export function useHydrated() {
  const [h, setH] = useState(false)
  useEffect(() => setH(true), [])
  return h
}

const norm = (s) => s.toLowerCase().normalize('NFKD')
const KEYS = ['q', 'category', 'where', 'format', 'month']
const PAGE = 18
const TOPICS = ['Leadership', 'Finance', 'Procurement', 'Project management', 'Monitoring', 'Data', 'Power BI', 'Excel', 'Python', 'AI', 'Communication', 'Governance', 'Supply chain', 'Risk', 'Customer', 'Strategy']
const SORTS = [['date', 'Soonest date'], ['fee-asc', 'Fee: low to high'], ['fee-desc', 'Fee: high to low'], ['az', 'Title: A to Z']]
// ordering only: put USD and KES fees on one scale
const feeValue = (f) => (f ? (f.currency === 'USD' ? f.amount * 130 : f.amount) : Infinity)
const shortCat = (name) => name

// Shared listing used by /courses, /categories/:slug and /cities/:slug
export function CourseListing({ fixed = {}, showFilters = true }) {
  const [params, setParams] = useSearchParams()
  const hydrated = useHydrated()
  const get = (k) => fixed[k] || (hydrated ? params.get(k) || '' : '')
  const f = Object.fromEntries(KEYS.map((k) => [k, get(k)]))
  const sort = (hydrated && params.get('sort')) || 'date'
  const [open, setOpen] = useState(false)
  const [shown, setShown] = useState(PAGE)
  const months = useMemo(() => [...new Set(allSessions().map((s) => monthKey(s.start)))].slice(0, 12), [])

  const set = (k, v) => {
    const p = new URLSearchParams(params)
    if (v) p.set(k, v); else p.delete(k)
    setParams(p, { replace: true, preventScrollReset: true })
    setShown(PAGE)
  }

  // One pass that can ignore a filter, so each sidebar list shows "how many if I pick this"
  const run = (flt, skip) => {
    const words = skip === 'q' ? [] : norm(flt.q).split(/\s+/).filter(Boolean)
    const out = []
    for (const c of COURSES) {
      if (skip !== 'category' && flt.category && c.category !== flt.category) continue
      if (words.length) {
        const hay = norm([c.title, c.summary, categoryName(c.category), c.outcomes.join(' '), c.modules.map((m) => m.title).join(' ')].join(' '))
        if (!words.every((w) => hay.includes(w))) continue
      }
      const wf = skip === 'where' ? '' : flt.where, ff = skip === 'format' ? '' : flt.format, mf = skip === 'month' ? '' : flt.month
      const ss = upcoming(c).filter((s) =>
        (!ff || s.format === ff) &&
        (!wf || (wf === 'online' ? s.format === 'online' : s.city === wf)) &&
        (!mf || monthKey(s.start) === mf))
      if ((wf || ff || mf) && !ss.length) continue
      out.push(ss[0] ? { ...ss[0], course: c } : { course: c })
    }
    return out
  }

  const dep = KEYS.map((k) => f[k]).join('|')
  const results = useMemo(() => {
    const out = run(f)
    const by = {
      date: (a, b) => ((a.start || '9') < (b.start || '9') ? -1 : (a.start || '9') > (b.start || '9') ? 1 : 0),
      'fee-asc': (a, b) => feeValue(a.fee5) - feeValue(b.fee5),
      'fee-desc': (a, b) => feeValue(b.fee5) - feeValue(a.fee5),
      az: (a, b) => a.course.title.localeCompare(b.course.title),
    }
    return out.sort(by[sort] || by.date)
  }, [dep, sort]) // eslint-disable-line react-hooks/exhaustive-deps

  const counts = useMemo(() => {
    const tally = (skip, keyOf) => {
      const m = new Map()
      for (const r of run(f, skip)) for (const k of keyOf(r)) m.set(k, (m.get(k) || 0) + 1)
      return m
    }
    const sess = (pred) => (r) => [...new Set(upcoming(r.course).filter(pred).map((s) => (s.format === 'online' ? 'online' : s.city)))]
    return {
      total: run(f, 'category').length,
      category: tally('category', (r) => [r.course.category]),
      where: tally('where', sess((s) => (!f.format || s.format === f.format) && (!f.month || monthKey(s.start) === f.month))),
      whereAll: run(f, 'where').length,
      format: tally('format', (r) => [...new Set(upcoming(r.course).filter((s) => (!f.where || (f.where === 'online' ? s.format === 'online' : s.city === f.where)) && (!f.month || monthKey(s.start) === f.month)).map((s) => s.format))]),
      formatAll: run(f, 'format').length,
      month: tally('month', (r) => [...new Set(upcoming(r.course).filter((s) => (!f.format || s.format === f.format) && (!f.where || (f.where === 'online' ? s.format === 'online' : s.city === f.where))).map((s) => monthKey(s.start)))]),
      monthAll: run(f, 'month').length,
    }
  }, [dep]) // eslint-disable-line react-hooks/exhaustive-deps

  const active = KEYS.map((k) => [k, f[k]]).filter(([k, v]) => v && !fixed[k])
  const labelOf = (k, v) => k === 'category' ? categoryBySlug(v)?.name : k === 'where' ? (v === 'online' ? 'Live online' : cityBySlug(v)?.name) : k === 'month' ? monthLabel(v) : k === 'format' ? ({ classroom: 'Classroom', online: 'Live online' }[v] || v) : `"${v}"`
  const monthShort = (m) => monthLabel(m).replace(/^(\w{3})\w*/, '$1')

  const filters = (
    <div className="flex flex-col gap-4">
      {!fixed.category && (
        <Panel title="Focus area" more={CATEGORIES.length > 7}>
          {(all) => <>
            <Opt on={!f.category} onClick={() => set('category', '')} label="All focus areas" n={counts.total} />
            {(all ? CATEGORIES : CATEGORIES.slice(0, 7)).map((c) => (
              <Opt key={c.slug} on={f.category === c.slug} onClick={() => set('category', c.slug)} label={shortCat(c.name)} n={counts.category.get(c.slug) || 0} />
            ))}
          </>}
        </Panel>
      )}
      <Panel title="Format">
        {() => (
          <div className="grid grid-cols-3 gap-1 rounded-xl bg-bg p-1" role="group" aria-label="Format">
            {[['', 'Any', LayoutGrid, counts.formatAll], ['classroom', 'Classroom', Building2, counts.format.get('classroom') || 0], ['online', 'Online', Monitor, counts.format.get('online') || 0]].map(([k, l, I, n]) => (
              <button key={k} type="button" aria-pressed={f.format === k} onClick={() => set('format', k)} title={`${n} courses`}
                className={`flex min-h-11 flex-col items-center justify-center gap-0.5 rounded-lg text-[12px] font-bold transition ${f.format === k ? 'bg-[#F59E0B] text-[#111827]' : 'text-muted hover:bg-surface-2 hover:text-fg'}`}>
                <I size={15} aria-hidden="true" />{l}
              </button>
            ))}
          </div>
        )}
      </Panel>
      {!fixed.where && (
        <Panel title="Where" more>
          {(all) => {
            const list = CITIES.filter((c) => counts.where.get(c.slug) || f.where === c.slug)
            return <>
              <Opt on={!f.where} onClick={() => set('where', '')} label="Anywhere" n={counts.whereAll} />
              <Opt on={f.where === 'online'} onClick={() => set('where', 'online')} label="Live online" n={counts.where.get('online') || 0} />
              {(all ? list : list.slice(0, 5)).map((c) => (
                <Opt key={c.slug} on={f.where === c.slug} onClick={() => set('where', c.slug)} label={`${c.name}, ${c.country}`} n={counts.where.get(c.slug) || 0} />
              ))}
            </>
          }}
        </Panel>
      )}
      <Panel title="Starting in">
        {() => (
          <div className="grid grid-cols-3 gap-1.5">
            <button type="button" aria-pressed={!f.month} onClick={() => set('month', '')} className={`min-h-10 rounded-lg border text-[13px] font-semibold transition ${!f.month ? 'border-[#F59E0B] bg-brand-soft text-brand' : 'border-line text-muted hover:border-line-strong hover:text-fg'}`}>Any</button>
            {months.map((m) => {
              const n = counts.month.get(m) || 0
              return (
                <button key={m} type="button" aria-pressed={f.month === m} disabled={!n && f.month !== m} onClick={() => set('month', m)} title={`${monthLabel(m)}: ${n} courses`}
                  className={`min-h-10 rounded-lg border text-[13px] font-semibold transition disabled:opacity-35 ${f.month === m ? 'border-[#F59E0B] bg-brand-soft text-brand' : 'border-line text-muted hover:border-line-strong hover:text-fg'}`}>{monthShort(m)}</button>
              )
            })}
          </div>
        )}
      </Panel>
    </div>
  )

  const list = results.slice(0, shown)
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <form role="search" onSubmit={(e) => e.preventDefault()} className="flex gap-2">
          <label className="relative flex-1">
            <span className="sr-only">Search courses</span>
            <Search size={19} className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-faint" aria-hidden="true" />
            <input type="search" className="w-full rounded-2xl border border-line bg-surface py-4 pr-5 text-[16px] text-fg outline-none transition placeholder:text-faint focus:border-[#F59E0B] focus:shadow-[0_0_0_4px_rgba(245,158,11,.15)]" style={{ paddingLeft: 52 }} placeholder="Search courses, topics or skills" value={f.q} onChange={(e) => set('q', e.target.value)} />
          </label>
          {showFilters && <button type="button" className="inline-flex min-h-[58px] items-center gap-2 rounded-2xl border border-line bg-surface px-4 font-bold text-fg lg:hidden" aria-expanded={open} onClick={() => setOpen(!open)}><SlidersHorizontal size={18} aria-hidden="true" />Filters</button>}
        </form>
        {!fixed.category && (
          <div className="-mx-4 flex items-center gap-2 overflow-x-auto px-4 no-scrollbar sm:mx-0 sm:flex-wrap sm:px-0">
            <span className="mr-1 flex-none text-[14px] text-faint">Popular topics:</span>
            {TOPICS.map((t) => {
              const on = norm(f.q) === norm(t)
              return <button key={t} type="button" aria-pressed={on} onClick={() => set('q', on ? '' : t)} className={`min-h-9 flex-none rounded-full border px-3.5 text-[13px] font-medium transition ${on ? 'border-[#F59E0B] bg-[#F59E0B] text-[#111827]' : 'border-line bg-surface text-muted hover:border-[#F59E0B]/60 hover:text-fg'}`}>{t}</button>
            })}
          </div>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        {showFilters && <aside className="hidden lg:block" aria-label="Filters"><div className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto pr-1 no-scrollbar">{filters}</div></aside>}
        <div className="min-w-0">
          {open && <div className="mb-5 lg:hidden">{filters}</div>}
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="mr-1 text-[15px] text-muted" aria-live="polite"><b className="text-fg">{results.length}</b> {results.length === 1 ? 'course' : 'courses'}</span>
              {active.map(([k, v]) => (
                <button key={k} type="button" onClick={() => set(k, '')} className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-[#F59E0B]/50 bg-brand-soft px-3 text-[13px] font-semibold text-brand" aria-label={`Remove filter ${labelOf(k, v)}`}>{labelOf(k, v)}<X size={14} aria-hidden="true" /></button>
              ))}
              {active.length > 1 && <button type="button" onClick={() => { setParams({}, { replace: true }); setShown(PAGE) }} className="font-semibold text-brand underline">Clear all</button>}
            </div>
            <label className="flex items-center gap-2 text-[14px] text-muted">Sort by
              <span className="relative">
                <select value={sort} onChange={(e) => set('sort', e.target.value === 'date' ? '' : e.target.value)} className="min-h-10 appearance-none rounded-xl border border-line bg-surface py-2 pl-3 pr-9 font-semibold text-fg outline-none focus:border-[#F59E0B]">
                  {SORTS.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
                </select>
                <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
              </span>
            </label>
          </div>
          {results.length ? <>
            <CourseGrid cols="sm:grid-cols-2 xl:grid-cols-3" sessions={list.map((r) => (r.id ? r : { course: r.course }))} />
            {results.length > shown && (
              <div className="mt-8 flex flex-col items-center gap-3">
                <p className="m-0 text-[14px] text-faint">Showing {shown} of {results.length}</p>
                <button type="button" onClick={() => setShown(shown + PAGE)} className="btn-primary">Show more courses</button>
              </div>
            )}
          </> : (
            <div className="rounded-2xl border border-line bg-surface p-8 text-center"><p className="m-0 text-lg font-bold">No courses match these filters.</p><p className="mt-2 text-muted">Try fewer filters, or <Link to="/contact">ask us</Link> - we run most topics on request.</p></div>
          )}
        </div>
      </div>
    </div>
  )
}

function Panel({ title, more, children }) {
  const [all, setAll] = useState(false)
  return (
    <section className="rounded-2xl border border-line bg-surface p-4">
      <h2 className="m-0 mb-3 px-1 text-[15px] font-extrabold text-fg">{title}</h2>
      <div className="flex flex-col gap-1">{children(all)}</div>
      {more && <button type="button" onClick={() => setAll(!all)} className="mt-2 flex w-full items-center justify-center gap-1 rounded-lg py-2 text-[13px] font-semibold text-brand hover:bg-brand-soft" aria-expanded={all}>{all ? 'Show less' : 'Show all'}<ChevronDown size={15} className={`transition ${all ? 'rotate-180' : ''}`} aria-hidden="true" /></button>}
    </section>
  )
}

function Opt({ on, onClick, label, n }) {
  return (
    <button type="button" aria-pressed={on} onClick={onClick} disabled={!n && !on}
      className={`flex min-h-10 w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-left text-[14px] transition disabled:opacity-40 ${on ? 'bg-brand-soft font-semibold text-brand shadow-[inset_3px_0_0_#F59E0B]' : 'text-muted hover:bg-surface-2 hover:text-fg'}`}>
      <span className="leading-snug">{label}</span>
      <span className={`flex-none rounded-md px-1.5 text-[12px] tabular-nums ${on ? 'text-brand' : 'text-faint'}`}>{n}</span>
    </button>
  )
}

export default function Courses() {
  const total = COURSES.length
  return (
    <>
      <Seo title="All Training Courses - Dates, Cities and Fees" path="/courses"
        description="Browse professional development courses by topic, city, format and month. Classroom courses in 18 cities, live online and in-house, with dates and fees."
        jsonLd={crumbsLd([{ name: 'Home', path: '/' }, { name: 'Courses', path: '/courses' }])} />
      <section className="wrap pt-8 pb-6 sm:pt-12">
        <Crumbs items={[{ name: 'Home', path: '/' }, { name: 'Courses', path: '/courses' }]} />
        <h1 className="m-0 mt-4 text-[36px] font-extrabold leading-[1.08] sm:text-5xl">Find a course</h1>
        <p className="lede m-0 mt-3 max-w-[760px]">Search every course by topic, city, format and month. Every date shows the fee per participant. <span className="font-bold text-accent">{total} courses</span> across {CATEGORIES.length} focus areas.</p>
      </section>
      <section className="wrap pb-16"><CourseListing /></section>
    </>
  )
}
