import { Link, useParams } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Seo, crumbsLd } from '../lib/seo.jsx'
import { categoryBySlug, cityBySlug, CITIES } from '../data/catalog.js'
import { COURSES } from '../data/courses.js'
import { allSessions, monthKey, monthLabel, dateRange, money, where, categoryName } from '../lib/util.js'
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
        jsonLd={[crumbsLd(crumbs), { '@context': 'https://schema.org', '@type': 'ItemList', itemListElement: COURSES.filter((c) => c.category === slug).map((c, i) => ({ '@type': 'ListItem', position: i + 1, url: `https://www.trainingcred.com/courses/${c.slug}` })) }]} />
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
      <PageHero crumbs={crumbs} eyebrow="Training destination" title={`Training courses in ${city.name}`} intro={`Classroom courses in ${city.name}, ${city.country}, with practitioner trainers in a professional venue. [Venue name and area - confirm.]`} />
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
              <Link key={c.slug} to={`/cities/${c.slug}`} className="card flex items-center justify-between gap-3 p-5 text-fg no-underline hover:border-[#4FD1BE]">
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

export function Calendar() {
  const sessions = allSessions()
  const byMonth = new Map()
  for (const s of sessions) { const k = monthKey(s.start); if (!byMonth.has(k)) byMonth.set(k, []); byMonth.get(k).push(s) }
  return (
    <>
      <Seo title="Training Calendar - Upcoming Course Dates" path="/calendar" description="Every upcoming course date by month: classroom sessions in 18 cities and live online, with fees per participant." />
      <PageHero crumbs={[{ name: 'Home', path: '/' }, { name: 'Calendar', path: '/calendar' }]} title="Training calendar" intro="All upcoming dates, month by month. Pick a date to reserve a seat." />
      <section>
        <div className="wrap py-10">
          <nav aria-label="Months" className="no-scrollbar -mx-4 mb-6 flex gap-2 overflow-x-auto px-4">
            {[...byMonth.keys()].map((k) => <a key={k} href={`#m-${k}`} className="chip min-h-10 flex-none border border-line bg-surface font-semibold text-fg no-underline hover:border-[#4FD1BE]">{monthLabel(k)}</a>)}
          </nav>
          {[...byMonth.entries()].map(([k, list]) => (
            <div key={k} id={`m-${k}`} className="mb-10 scroll-mt-28">
              <h2 className="h2 m-0 mb-4">{monthLabel(k)}</h2>
              <div className="overflow-hidden rounded-2xl border border-line bg-surface">
                {list.map((s, n) => (
                  <div key={s.id} className={`flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:gap-5 sm:px-5 ${n ? 'border-t border-line' : ''}`}>
                    <div className="text-[15px] font-extrabold sm:w-[170px]">{dateRange(s.start, s.end5)}</div>
                    <div className="flex-1"><Link to={`/courses/${s.course.slug}`} className="font-bold text-fg no-underline hover:text-brand">{s.course.title}</Link><div className="text-[13.5px] text-muted">{categoryName(s.course.category)} · {where(s)}</div></div>
                    <div className="font-extrabold text-accent sm:w-[120px] sm:text-right">{money(s.fee5)}</div>
                    <Link to={`/book/${s.course.slug}?session=${encodeURIComponent(s.id)}`} className="btn-glass !min-h-10 !py-2 text-sm">Reserve</Link>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
