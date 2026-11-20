import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Download, MessageCircle, Clock, Award, Globe, CalendarDays, Monitor, Building2, Users, ArrowUpRight, Check, Phone } from 'lucide-react'
import { Seo, crumbsLd, faqLd } from '../lib/seo.jsx'
import { courseBySlug, COURSES } from '../data/courses.js'
import { categoryBySlug, cityBySlug } from '../data/catalog.js'
import { SITE, GENERAL_FAQS, waLink } from '../data/site.js'
import { upcoming, nextSession, dateRange, money, where, monthLabel, monthKey } from '../lib/util.js'
import { Crumbs, SectionHead } from '../components/Layout.jsx'
import { CheckItem, CourseGrid, FaqList, CourseCover } from '../components/Bits.jsx'
import EnquiryForm from '../components/EnquiryForm.jsx'
import NotFound from './NotFound.jsx'

const COURSE_FAQS = [
  { q: 'What is the difference between the 5-day and 10-day options?', a: 'The 10-day option adds a second week of applied work: deeper case studies and a practical assignment you complete with trainer feedback.' },
  ...GENERAL_FAQS.slice(0, 4),
]

export default function Course() {
  const { slug } = useParams()
  const course = courseBySlug(slug)
  const [filter, setFilter] = useState('all')
  const [all, setAll] = useState(false)
  const [mode, setMode] = useState(() => (course && upcoming(course)[0]?.format) || 'online') // open on the format of the very next date
  if (!course) return <NotFound />
  const cat = categoryBySlug(course.category)
  const sessions = upcoming(course)
  const matching = sessions.filter((s) => filter === 'all' || s.format === filter)
  const shown = all ? matching : matching.slice(0, 6)
  const next = sessions[0]
  const byMode = { online: nextSession(course, 'online'), classroom: nextSession(course, 'classroom') }
  const pick = byMode[mode] || next
  const classCities = new Set(sessions.filter((s) => s.city).map((s) => s.city))
  const related = COURSES.filter((c) => c.category === course.category && c.slug !== course.slug).concat(COURSES.filter((c) => c.popular && c.category !== course.category && c.slug !== course.slug)).slice(0, 3)
  const crumbs = [{ name: 'Home', path: '/' }, { name: 'Courses', path: '/courses' }, { name: cat.name, path: `/categories/${cat.slug}` }, { name: course.title, path: `/courses/${course.slug}` }]
  const path = `/courses/${course.slug}`

  const courseLd = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.title,
    description: course.summary,
    url: SITE.url + path,
    provider: { '@type': 'Organization', name: SITE.legalName, sameAs: SITE.url },
    inLanguage: 'en',
    educationalCredentialAwarded: 'Certificate of completion',
    teaches: course.outcomes,
    offers: next ? { '@type': 'Offer', category: 'Paid', price: next.fee5.amount, priceCurrency: next.fee5.currency, url: SITE.url + path } : undefined,
    hasCourseInstance: sessions.slice(0, 12).map((s) => ({
      '@type': 'CourseInstance',
      courseMode: s.format === 'online' ? 'Online' : 'Onsite',
      startDate: s.start,
      endDate: s.end5,
      courseSchedule: { '@type': 'Schedule', duration: 'P5D', repeatFrequency: 'Daily', repeatCount: 5, startDate: s.start, endDate: s.end5 },
      location: s.format === 'online' ? { '@type': 'VirtualLocation', url: SITE.url + path } : { '@type': 'Place', name: cityBySlug(s.city).name, address: { '@type': 'PostalAddress', addressLocality: cityBySlug(s.city).name, addressCountry: cityBySlug(s.city).country } },
      offers: { '@type': 'Offer', price: s.fee5.amount, priceCurrency: s.fee5.currency, availability: 'https://schema.org/InStock', url: `${SITE.url}/book/${course.slug}?session=${s.id}` },
    })),
  }

  const tabs = [['dates', 'Dates & fees'], ['overview', 'Overview'], ['curriculum', 'Curriculum'], ['faqs', 'FAQs']]

  return (
    <>
      <Seo title={course.title} path={path} description={`${course.summary} ${course.durations.join(' or ')} days, classroom in ${classCities.size} cities or live online${next ? `, next session ${dateRange(next.start, next.end5)}` : ''}.`}
        jsonLd={[courseLd, crumbsLd(crumbs), faqLd(COURSE_FAQS)]} />

      {/* HERO: identity of the course + key facts, grouped */}
      <section className="wrap pt-6 sm:pt-10">
        <CourseCover category={course.category} image={course.image} big className="rounded-[36px] text-white">
          <div className={`relative grid gap-8 p-6 sm:p-10 lg:grid-cols-[1.5fr_1fr] lg:p-12 ${course.image ? 'pt-44 sm:pt-56' : ''}`}>
            <div className="rise flex flex-col gap-5">
              <div className="[&_a]:!text-white/70 [&_span]:!text-white/80 [&_nav]:!text-white/60"><Crumbs items={crumbs} /></div>
              <Link to={`/categories/${cat.slug}`} className="pill-label glass-photo self-start text-white no-underline hover:text-white">{cat.name}</Link>
              <h1 className="m-0 text-[32px] font-extrabold leading-[1.08] sm:text-[46px]">{course.title}</h1>
              <p className="m-0 max-w-[640px] text-[17px] leading-relaxed text-white/80">{course.summary}</p>
              <dl className="m-0 mt-2 grid max-w-[640px] grid-cols-2 gap-3 sm:grid-cols-4">
                {[[Clock, 'Duration', `${course.durations.join(' or ')} days`], [Building2, 'Classroom', `${classCities.size} cities`], [Monitor, 'Online', 'Live on Zoom'], [Award, 'Certificate', 'Included']].map(([I, k, v]) => (
                  <div key={k} className="glass-photo rounded-2xl p-3"><I size={17} className="text-amber" aria-hidden="true" /><dt className="mt-2 text-[11.5px] uppercase tracking-wider text-white/60">{k}</dt><dd className="m-0 text-[14.5px] font-bold">{v}</dd></div>
                ))}
              </dl>
            </div>
          </div>
        </CourseCover>
      </section>

      {/* BODY: content left, booking panel right (sticky) */}
      <div className="wrap grid gap-8 py-8 lg:grid-cols-[1fr_380px]">
        <div className="min-w-0">
          <nav aria-label="On this page" className="glass no-scrollbar sticky top-[86px] z-30 mb-8 flex gap-1 overflow-x-auto rounded-full p-1.5">
            {tabs.map(([id, l]) => <a key={id} href={`#${id}`} className="flex-none rounded-full px-4 py-2 text-sm font-semibold text-muted no-underline transition hover:bg-surface-2 hover:text-fg">{l}</a>)}
          </nav>

          <section id="dates" className="scroll-mt-40">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
              <div><h2 className="h2 m-0 !text-[28px]">Dates &amp; fees</h2><p className="m-0 mt-1 text-[15px] text-muted">Fees are per participant. Pick a date to reserve.</p></div>
              <div role="group" aria-label="Filter dates" className="glass flex gap-1 rounded-full p-1">
                {[['all', 'All'], ['classroom', 'Classroom'], ['online', 'Online']].map(([k, l]) => (
                  <button key={k} type="button" aria-pressed={filter === k} onClick={() => { setFilter(k); setAll(false) }} className={`min-h-9 rounded-full px-4 text-sm font-semibold transition ${filter === k ? 'bg-fg text-bg' : 'text-muted hover:text-fg'}`}>{l}</button>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2.5">
              {shown.length === 0 && <p className="card m-0 p-6 text-muted">No dates for this format yet. <Link to="/contact">Request a date</Link>.</p>}
              {shown.map((s) => (
                <div key={s.id} className="card card-hover flex flex-col gap-3 !rounded-2xl p-4 sm:flex-row sm:items-center sm:gap-5 sm:px-5">
                  <span className={`flex h-11 w-11 flex-none items-center justify-center rounded-xl ${s.format === 'online' ? 'bg-brand-soft text-brand' : 'bg-accent-soft text-accent'}`}>{s.format === 'online' ? <Monitor size={19} aria-hidden="true" /> : <Building2 size={19} aria-hidden="true" />}</span>
                  <div className="flex-1">
                    <div className="text-[16px] font-extrabold">{dateRange(s.start, s.end5)}</div>
                    <div className="text-[13.5px] text-muted">{where(s)} · Mon - Fri · or 10 days to {dateRange(s.start, s.end10).split(' - ')[1]}</div>
                  </div>
                  <div className="sm:text-right"><div className="text-[18px] font-extrabold text-accent">{money(s.fee5)}</div><div className="text-[12px] text-faint">10 days {money(s.fee10)}</div></div>
                  <Link to={`/book/${course.slug}?session=${encodeURIComponent(s.id)}`} className="btn-primary btn-sm">Reserve</Link>
                </div>
              ))}
            </div>
            {matching.length > shown.length && <button type="button" onClick={() => setAll(true)} className="btn-glass mt-4">Show all {matching.length} dates</button>}
            <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-dashed border-line-strong p-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="m-0 text-[15px]"><strong>Booking 5 or more people?</strong> <span className="text-muted">Request a private session on your dates and in your city.</span></p>
              <Link to={`/for-teams?topic=${encodeURIComponent(course.title)}#quote`} className="btn-amber btn-sm">Team quote</Link>
            </div>
          </section>

          <section id="overview" className="mt-16 scroll-mt-40">
            <h2 className="h2 m-0 !text-[28px]">Overview</h2>
            <p className="mt-3 text-[16.5px] leading-[1.75] text-muted">{course.summary} The course is practical throughout: short inputs, worked examples, group exercises and tools participants take back to their work.</p>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div className="card p-6"><h3 className="m-0 mb-4 text-lg font-extrabold">You will be able to</h3><ul className="m-0 flex list-none flex-col gap-3 p-0">{course.outcomes.map((o) => <CheckItem key={o}>{o}</CheckItem>)}</ul></div>
              <div className="flex flex-col gap-5">
                <div className="card p-6"><h3 className="m-0 mb-4 text-lg font-extrabold">Who should attend</h3>
                  <div className="flex flex-wrap gap-2">{course.audience.map((a) => <span key={a} className="chip bg-surface-2 text-fg">{a}</span>)}</div></div>
                <dl className="card m-0 grid grid-cols-2 gap-4 p-6 text-[14.5px]">
                  {[[Globe, 'Language', 'English'], [CalendarDays, 'Daily hours', SITE.trainingHours], [Users, 'Class size', 'Small groups'], [Award, 'Certificate', 'On completion']].map(([I, k, v]) => (
                    <div key={k} className="flex gap-2.5"><I size={18} className="mt-0.5 flex-none text-brand" aria-hidden="true" /><div><dt className="text-[12.5px] text-faint">{k}</dt><dd className="m-0 font-bold">{v}</dd></div></div>
                  ))}
                </dl>
              </div>
            </div>
          </section>

          <section id="curriculum" className="mt-16 scroll-mt-40">
            <h2 className="h2 m-0 mb-6 !text-[28px]">Curriculum</h2>
            <ol className="relative m-0 flex list-none flex-col gap-3 p-0">
              {course.modules.map((m, n) => (
                <li key={m.title} className="card flex gap-4 !rounded-2xl p-5">
                  <span className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-brand-soft text-sm font-extrabold text-brand">{String(n + 1).padStart(2, '0')}</span>
                  <div><h3 className="m-0 text-[16px] font-bold">{m.title}</h3><p className="m-0 mt-1 text-[14.5px] leading-relaxed text-muted">{m.text}</p></div>
                </li>
              ))}
            </ol>
          </section>

          <section id="faqs" className="mt-16 scroll-mt-40"><h2 className="h2 m-0 mb-6 !text-[28px]">FAQs</h2><FaqList faqs={COURSE_FAQS} /></section>
        </div>

        {/* booking panel */}
        <aside className="lg:sticky lg:top-[86px] lg:self-start" aria-label="Book this course">
          <div className="glass-strong flex flex-col gap-4 rounded-[28px] p-5">
            <div role="group" aria-label="Format" className="grid grid-cols-2 gap-1 rounded-full bg-surface p-1">
              {[['online', 'Live online', Monitor], ['classroom', 'Classroom', Building2]].map(([k, l, I]) => (
                <button key={k} type="button" aria-pressed={mode === k} onClick={() => setMode(k)} disabled={!byMode[k]}
                  className={`flex min-h-10 items-center justify-center gap-1.5 rounded-full text-sm font-semibold transition disabled:opacity-40 ${mode === k ? 'bg-fg text-bg' : 'text-muted hover:text-fg'}`}><I size={15} aria-hidden="true" />{l}</button>
              ))}
            </div>
            {pick && (
              <>
                <div>
                  <div className="text-xs font-bold uppercase tracking-[.14em] text-faint">Next date</div>
                  <div className="mt-1 text-[22px] font-extrabold">{dateRange(pick.start, pick.end5)}</div>
                  <div className="text-[14px] text-muted">{where(pick)} · 5 days</div>
                </div>
                <div className="flex items-baseline justify-between border-y border-line py-3"><span className="text-sm text-muted">Fee per participant</span><span className="text-[26px] font-extrabold text-accent">{money(pick.fee5)}</span></div>
                <Link to={`/book/${course.slug}?session=${encodeURIComponent(pick.id)}`} className="btn-primary w-full">Reserve a seat<ArrowUpRight size={18} aria-hidden="true" /></Link>
                <a href="#dates" className="text-center text-sm font-semibold no-underline">or choose another date ({sessions.filter((s) => s.format === mode).length} available)</a>
              </>
            )}
            <ul className="m-0 flex list-none flex-col gap-2 border-t border-line p-0 pt-4 text-[13.5px] text-muted">
              {['No payment needed to reserve', 'Invoice and proforma on request', 'Certificate of completion'].map((t) => <li key={t} className="flex items-center gap-2"><Check size={15} className="text-brand" aria-hidden="true" />{t}</li>)}
            </ul>
          </div>
          <div className="card mt-4 flex flex-col gap-3 !rounded-[28px] p-5" id="brochure">
            <div className="flex items-center gap-2 font-bold"><Download size={18} className="text-brand" aria-hidden="true" />Get the brochure</div>
            <EnquiryForm compact type="brochure" extra={{ courseSlug: course.slug, courseTitle: course.title }} fields={[]} submitLabel="Email me the PDF" summary={`Please send the brochure for ${course.title}.`} />
          </div>
          <div className="mt-4 flex gap-2">
            <a href={waLink(`Hello Trainingcred, I have a question about "${course.title}".`)} target="_blank" rel="noopener noreferrer" className="btn-glass btn-sm flex-1"><MessageCircle size={16} aria-hidden="true" />Ask an advisor</a>
            <a href={SITE.phoneHref} className="btn-glass btn-sm" aria-label={`Call ${SITE.phone}`}><Phone size={16} aria-hidden="true" /></a>
          </div>
        </aside>
      </div>

      <section className="wrap py-12">
        <SectionHead eyebrow="Keep exploring" title="Related courses" />
        <CourseGrid courses={related} cols="sm:grid-cols-2 lg:grid-cols-3" />
      </section>
    </>
  )
}
