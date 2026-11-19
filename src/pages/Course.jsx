import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Check, Download, MessageCircle, Clock, Award, Globe, CalendarDays } from 'lucide-react'
import { Seo, crumbsLd, faqLd } from '../lib/seo.jsx'
import { courseBySlug, COURSES } from '../data/courses.js'
import { categoryBySlug, cityBySlug } from '../data/catalog.js'
import { SITE, GENERAL_FAQS, waLink } from '../data/site.js'
import { upcoming, nextSession, dateRange, money, where, monthLabel, monthKey } from '../lib/util.js'
import { Crumbs } from '../components/Layout.jsx'
import { CheckItem, CourseGrid, FaqList } from '../components/Bits.jsx'
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
  if (!course) return <NotFound />
  const cat = categoryBySlug(course.category)
  const sessions = upcoming(course)
  const matching = sessions.filter((s) => filter === 'all' || s.format === filter)
  const shown = all ? matching : matching.slice(0, 8)
  const next = sessions[0]
  const nextClass = nextSession(course, 'classroom')
  const nextOnline = nextSession(course, 'online')
  const classCities = new Set(sessions.filter((s) => s.city).map((s) => s.city))
  const related = COURSES.filter((c) => c.category === course.category && c.slug !== course.slug).concat(COURSES.filter((c) => c.popular && c.category !== course.category)).slice(0, 4)
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

  const modes = [
    { name: 'Classroom', tag: `${classCities.size} cities`, text: 'Five days face to face with a trainer and peers from across the region.', s: nextClass, f: 'classroom' },
    { name: 'Live online', tag: 'From anywhere', text: 'The same course delivered live online, with group work and course materials.', s: nextOnline, f: 'online' },
    { name: 'In-house', tag: 'For teams', text: 'Run privately for your organisation, on your dates and in your city or online.', team: true },
  ]

  return (
    <>
      <Seo title={course.title} path={path} description={`${course.summary} ${course.durations.join(' or ')} days, classroom in ${classCities.size} cities or live online${next ? `, next session ${dateRange(next.start, next.end5)}` : ''}.`}
        jsonLd={[courseLd, crumbsLd(crumbs), faqLd(COURSE_FAQS)]} />

      <section className="bg-gradient-to-br from-deep via-navy to-teal text-white">
        <div className="wrap flex flex-col gap-5 py-8 sm:py-12">
          <Crumbs items={crumbs} light />
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex max-w-[720px] flex-1 flex-col gap-4">
              <Link to={`/categories/${cat.slug}`} className="eyebrow self-start rounded-md border border-white/30 bg-white/10 px-3 py-1.5 text-white no-underline hover:text-white">{cat.name}</Link>
              <h1 className="m-0 text-[30px] font-extrabold leading-[1.12] tracking-tight sm:text-[44px]">{course.title}</h1>
              <p className="m-0 text-[17px] leading-relaxed text-haze sm:text-lg">{course.summary}</p>
              <ul className="m-0 flex list-none flex-wrap gap-x-5 gap-y-2 p-0 text-[14.5px]">
                {['Certificate of completion', 'Practitioner trainers', `Classroom in ${classCities.size} cities or live online`, 'Course materials included'].map((t) => <li key={t} className="flex items-center gap-1.5"><Check size={16} aria-hidden="true" />{t}</li>)}
              </ul>
            </div>
            {next && (
              <aside aria-label="Next session" className="flex w-full flex-col gap-3 rounded-2xl bg-white p-5 text-ink shadow-[0_20px_50px_rgba(4,20,34,.35)] lg:w-[360px]">
                <span className="eyebrow text-muted">Next session</span>
                <div className="text-[22px] font-extrabold">{dateRange(next.start, next.end5)}</div>
                <div className="text-[14.5px] text-muted">{where(next)} · Mon - Fri · 5 days</div>
                <div className="flex items-baseline gap-2"><span className="text-[13px] text-muted">from</span><span className="text-[28px] font-extrabold text-teal">{money(next.fee5)}</span></div>
                <Link to={`/book/${course.slug}?session=${encodeURIComponent(next.id)}`} className="btn-primary">Reserve a seat</Link>
                <a href="#brochure" className="btn border border-line text-navy hover:bg-soft"><Download size={18} aria-hidden="true" />Get the brochure</a>
              </aside>
            )}
          </div>
        </div>
      </section>

      <nav aria-label="On this page" className="sticky top-[68px] z-30 border-b border-line bg-white/95 shadow-[0_2px_10px_rgba(11,53,87,.06)] backdrop-blur">
        <div className="wrap no-scrollbar flex items-center gap-1 overflow-x-auto">
          {[['dates', 'Dates & Prices'], ['about', 'About'], ['curriculum', 'Curriculum'], ['faqs', 'FAQs'], ['advisor', 'Ask an advisor'], ['brochure', 'Brochure']].map(([id, l]) => (
            <a key={id} href={`#${id}`} className="flex-none whitespace-nowrap px-3 py-4 text-[14.5px] font-semibold text-ink no-underline hover:text-teal">{l}</a>
          ))}
          <Link to={`/book/${course.slug}`} className="btn-primary ml-auto hidden flex-none !rounded-full !py-2 text-sm sm:inline-flex">Reserve a seat</Link>
        </div>
      </nav>

      <section className="scroll-mt-32 bg-soft" id="formats">
        <div className="wrap py-12">
          <h2 className="h2 m-0 mb-6">Choose how you want to learn</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {modes.map((m) => (
              <div key={m.name} className="card flex flex-col gap-2.5 p-5">
                <div className="flex items-center justify-between gap-2"><h3 className="m-0 text-xl font-extrabold">{m.name}</h3><span className="chip bg-mint !py-1 text-xs font-bold text-teal">{m.tag}</span></div>
                <p className="m-0 text-[14.5px] leading-relaxed text-muted">{m.text}</p>
                {m.team ? (
                  <><div className="text-sm"><strong>Any date</strong> that suits your team</div><div className="text-[20px] font-extrabold text-navy">Quote on request</div>
                    <Link to={`/for-teams?topic=${encodeURIComponent(course.title)}#quote`} className="btn-outline mt-auto">Request a team quote</Link></>
                ) : m.s ? (
                  <><div className="text-sm"><strong>Next:</strong> {dateRange(m.s.start, m.s.end5)}{m.s.city ? ` · ${cityBySlug(m.s.city).name}` : ''}</div><div className="text-[20px] font-extrabold text-navy">from {money(m.s.fee5)}</div>
                    <button type="button" onClick={() => { setFilter(m.f); document.getElementById('dates')?.scrollIntoView() }} className="btn-outline mt-auto">See {m.name.toLowerCase()} dates</button></>
                ) : (
                  <><div className="text-sm text-muted">No dates scheduled yet.</div><Link to="/contact" className="btn-outline mt-auto">Ask for dates</Link></>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="scroll-mt-32 bg-white" id="dates">
        <div className="wrap py-12">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
            <div><h2 className="h2 m-0">Dates &amp; prices</h2><p className="m-0 mt-1.5 text-[15px] text-muted">Fees are per participant.</p></div>
            <div role="group" aria-label="Filter dates" className="flex gap-1 rounded-full bg-[#EEF3F6] p-1">
              {[['all', 'All'], ['classroom', 'Classroom'], ['online', 'Live online']].map(([k, l]) => (
                <button key={k} type="button" aria-pressed={filter === k} onClick={() => setFilter(k)} className={`min-h-10 rounded-full px-4 text-sm font-bold ${filter === k ? 'bg-white text-ink shadow' : 'text-muted'}`}>{l}</button>
              ))}
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl border border-line">
            {shown.length === 0 && <p className="m-0 p-6 text-muted">No dates for this format yet. <Link to="/contact">Request a date</Link>.</p>}
            {shown.map((s, n) => (
              <div key={s.id} className={`flex flex-col gap-3 p-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-6 sm:px-6 ${n ? 'border-t border-line' : ''}`}>
                <div className="sm:w-[190px]"><div className="text-[17px] font-extrabold">{dateRange(s.start, s.end5)}</div><div className="text-[13px] text-muted">{monthLabel(monthKey(s.start))}</div></div>
                <div className="flex-1 text-[14.5px] sm:min-w-[220px]"><div className="font-bold">{where(s)}{s.format === 'classroom' ? ' · classroom' : ''}</div><div className="text-muted">Mon - Fri · 5 days · or 10 days to {dateRange(s.start, s.end10).split(' - ')[1]}</div></div>
                <div className="sm:w-[150px] sm:text-right"><div className="text-[19px] font-extrabold text-navy">{money(s.fee5)}</div><div className="text-[12.5px] text-muted">10 days: {money(s.fee10)}</div></div>
                <Link to={`/book/${course.slug}?session=${encodeURIComponent(s.id)}`} className="btn-primary !py-2.5 text-sm">Reserve a seat</Link>
              </div>
            ))}
          </div>
          {matching.length > shown.length && <button type="button" onClick={() => setAll(true)} className="btn-outline mt-4">Show all {matching.length} dates</button>}
          <div className="mt-5 flex flex-col gap-3 rounded-2xl bg-mint p-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="m-0 text-[15px]"><strong>Booking for a team?</strong> Five or more people from one organisation can request a private session on your dates and in your city.</p>
            <div className="flex flex-wrap gap-2"><Link to={`/for-teams?topic=${encodeURIComponent(course.title)}#quote`} className="btn-navy !py-2.5 text-sm">Request a private session</Link><Link to="/contact" className="btn border border-navy !py-2.5 text-sm text-navy">Request other dates</Link></div>
          </div>
        </div>
      </section>

      <section className="scroll-mt-32 bg-soft" id="about">
        <div className="wrap grid gap-8 py-12 lg:grid-cols-2">
          <div>
            <h2 className="h2 m-0">About this course</h2>
            <p className="mt-3 text-[16px] leading-[1.75]">{course.summary} The course is practical throughout: short inputs, worked examples, group exercises and tools participants take back to their work.</p>
            <h3 className="mb-3 mt-6 text-lg font-extrabold">By the end you will be able to</h3>
            <ul className="m-0 flex list-none flex-col gap-2.5 p-0">{course.outcomes.map((o) => <CheckItem key={o}>{o}</CheckItem>)}</ul>
          </div>
          <div className="flex flex-col gap-4">
            <div className="card p-5"><h3 className="m-0 mb-3 text-lg font-extrabold">Who should attend</h3>
              <div className="flex flex-wrap gap-2">{course.audience.map((a) => <span key={a} className="chip bg-[#EEF3F6]">{a}</span>)}</div></div>
            <dl className="card m-0 grid grid-cols-2 gap-4 p-5 text-[14.5px]">
              {[[Clock, 'Duration', `${course.durations.join(' or ')} days`], [Globe, 'Language', 'English'], [CalendarDays, 'Daily hours', '[9:00 - 16:00 EAT]'], [Award, 'Certificate', 'Yes, on completion']].map(([I, k, v]) => (
                <div key={k} className="flex gap-2.5"><I size={18} className="mt-0.5 flex-none text-teal" aria-hidden="true" /><div><dt className="text-[13px] text-muted">{k}</dt><dd className="m-0 font-bold">{v}</dd></div></div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="scroll-mt-32 bg-white" id="curriculum">
        <div className="wrap py-12">
          <h2 className="h2 m-0 mb-6">Curriculum</h2>
          <ol className="m-0 grid list-none gap-3 p-0 md:grid-cols-2">
            {course.modules.map((m, n) => (
              <li key={m.title} className="card flex gap-4 p-5">
                <span className="flex-none whitespace-nowrap text-[13px] font-extrabold text-teal">MODULE {n + 1}</span>
                <div><h3 className="m-0 text-[16px] font-bold">{m.title}</h3><p className="m-0 mt-1 text-[14.5px] leading-relaxed text-muted">{m.text}</p></div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="scroll-mt-32 bg-navy text-white" id="advisor">
        <div className="wrap grid gap-8 py-12 lg:grid-cols-2">
          <div className="flex flex-col gap-3">
            <h2 className="m-0 text-[26px] font-extrabold">Not sure this is the right course?</h2>
            <p className="m-0 text-[16px] leading-relaxed text-haze">Talk to a course advisor. We will check the fit, suggest alternatives and help with nominations, invitation letters and invoices.</p>
            <div className="flex flex-wrap gap-2.5"><a href={waLink(`Hello Trainingcred, I have a question about "${course.title}".`)} target="_blank" rel="noopener noreferrer" className="btn-white"><MessageCircle size={18} aria-hidden="true" />WhatsApp an advisor</a><a href={SITE.phoneHref} className="btn-ghost">Call {SITE.phone}</a></div>
          </div>
          <div id="brochure" className="scroll-mt-32 rounded-2xl border border-white/20 bg-white/5 p-5 sm:p-6">
            <h3 className="m-0 mb-1 text-lg font-extrabold">Get the free brochure</h3>
            <p className="m-0 mb-4 text-sm text-haze">We send the full outline, dates and fees for this course.</p>
            <EnquiryForm dark type="brochure" extra={{ courseSlug: course.slug, courseTitle: course.title }} fields={['organisation']} submitLabel="Send me the brochure" summary={`Please send the brochure for ${course.title}.`} />
          </div>
        </div>
      </section>

      <section className="scroll-mt-32 bg-white" id="faqs">
        <div className="wrap py-12"><div className="mx-auto max-w-[900px]"><h2 className="h2 m-0 mb-3">FAQs</h2><FaqList faqs={COURSE_FAQS} /></div></div>
      </section>

      <section className="bg-soft">
        <div className="wrap py-12"><h2 className="h2 m-0 mb-6">Related courses</h2><CourseGrid courses={related} /></div>
      </section>
    </>
  )
}
