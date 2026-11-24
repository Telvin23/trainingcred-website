// Home page - design D "Combined" (approved 2026-11-23). Styles: src/styles/home.css.
// Course dates, prices and counts come from the course data, so they stay current at every build.
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, BarChart3, Package, LineChart, Monitor, Star, Award, Pause, Play, MapPin } from 'lucide-react'
import { Seo, orgLd } from '../lib/seo.jsx'
import { SITE } from '../data/site.js'
import { CATEGORIES, CITIES, cityBySlug } from '../data/catalog.js'
import { COURSES } from '../data/courses.js'
import { upcoming, money, monShort, dayNum, allSessions } from '../lib/util.js'
import { TREES_PATH } from '../components/home/trees.js'
import { CourseCard } from '../components/Bits.jsx'
import '../styles/home.css'

const IMG = (f) => `/images/home/${f}`
const HERO = (f) => `/images/hero/${f}`
const byslug = (s) => COURSES.find((c) => c.slug === s)

// Next session of a course, preferring a format and city
function sessionOf(slug, format, city) {
  const c = byslug(slug)
  if (!c) return null
  const ups = upcoming(c)
  const s = ups.find((x) => (!format || x.format === format) && (!city || x.city === city))
    || ups.find((x) => !format || x.format === format) || ups[0]
  return s ? { course: c, s } : null
}
const whereText = (s) => (s.format === 'online' ? 'Live online' : cityBySlug(s.city)?.name || '')

// ---------------------------------------------------------------- content (as approved in design D)
const CALENDAR = [
  { slug: 'monitoring-and-evaluation-of-projects', label: 'MEAL', format: 'online' },
  { slug: 'procurement-and-supply-chain-management-training', label: 'Procurement and Supply Chain', format: 'classroom', city: 'mombasa' },
  { slug: 'dhis2-health-information-system-management-training', label: 'DHIS2 Health Information Systems', format: 'online' },
]
const CHIPS = [
  ['MEAL', 'monitoring-and-evaluation-of-projects'],
  ['Procurement & Supply Chain', 'procurement-and-supply-chain-management-training'],
  ['Power BI', 'power-bi-az-dashboards-dax'],
  ['DHIS2', 'dhis2-health-information-system-management-training'],
  ['Grant Management', 'grant-management-and-donor-compliance'],
  ['Visionary Leadership', 'visionary-leadership-for-executives-training'],
]
const AREAS = [
  { slug: 'finance-accounting-treasury', name: 'Finance & Accounting', sub: 'Modelling, FP&A, donor finance', img: 'finmodel.jpg', alt: 'Analyst reviewing financial charts', Icon: BarChart3 },
  { slug: 'procurement-supply-chain', name: 'Procurement & Supply Chain', sub: 'Sourcing, logistics, fleet', img: 'warehouse.jpg', alt: 'Storekeeper checking stock in a warehouse', Icon: Package },
  { slug: 'monitoring-evaluation-accountability-and-learning', name: 'MEAL & Data', sub: 'M&E, Power BI, DHIS2', img: 'powerbi.jpg', alt: 'Data dashboard on a laptop', Icon: LineChart },
  { slug: 'ict-digital-ai', name: 'ICT, Digital & AI', sub: 'Cloud, cyber, data science', img: 'ai.jpg', alt: 'Hand touching an AI interface', Icon: Monitor },
  { slug: 'leadership-management', name: 'Leadership & Management', sub: 'Executives, culture, governance', img: 'suits.jpg', alt: 'Managers in conversation', Icon: Star },
]
// Destinations: the same areas as the previous home page tabs (Online, Nairobi, Kigali, Dubai, Mombasa, Zanzibar).
// Order around the carousel; Nairobi starts in the centre.
// City photos: drop <slug>.jpg into src/assets/cities and it is picked up at build (same as course photos)
const CITY_PHOTOS = import.meta.glob('../assets/cities/*.{jpg,jpeg,png,webp}', { eager: true, query: '?url', import: 'default' })
const cityPhoto = (slug, fallback) => {
  const hit = Object.entries(CITY_PHOTOS).find(([k]) => k.split('/').pop().replace(/\.\w+$/, '') === slug)
  return hit ? hit[1] : fallback ? `/images/cities/${fallback}` : null
}
const AREA_LIST = [
  { slug: 'mombasa', img: 'mombasa.jpg', tone: '#2B5A5E' },
  { slug: 'kigali', img: 'kigali.jpg', tone: '#2F5A4A' },
  { slug: 'nairobi', img: 'nairobi.jpg', tone: '#6B5233' },
  { slug: 'dubai', img: 'dubai.jpg', tone: '#3A4F6B' },
  { slug: 'zanzibar', img: 'zanzibar.jpg', tone: '#245A63' },
  { slug: 'online', img: 'online.jpg', tone: '#4B3E5C' },
  // more destinations - photos to come (public/images/cities/<slug>.jpg, then add img here)
  ...['naivasha', 'kisumu', 'kampala', 'accra', 'lagos', 'johannesburg', 'cairo']
    .map((slug, i) => ({ slug, tone: ['#2B5A5E', '#6B5233', '#2F5A4A', '#3A4F6B', '#4B3E5C', '#245A63'][i % 6] })),
]

// Hero mountain: the current hero photos as jagged peaks (back to front). d = parallax depth in px.
const PEAKS = [
  { d: 6, img: 'hero4.jpg', style: { bottom: '20%', left: '-4%', width: '46%', height: '44%', filter: 'blur(1.2px)', clipPath: 'polygon(0% 100%, 0% 62%, 8% 48%, 15% 55%, 26% 22%, 33% 30%, 41% 10%, 50% 26%, 58% 20%, 70% 46%, 82% 40%, 100% 100%)' }, tint: 'linear-gradient(180deg, rgba(214,120,70,.55) 0%, rgba(70,50,70,.6) 100%)', caption: 'High-level dialogue' },
  { d: 6, img: 'hero3.jpg', style: { bottom: '20%', left: '60%', width: '46%', height: '48%', filter: 'blur(1.2px)', clipPath: 'polygon(0% 100%, 14% 56%, 24% 60%, 36% 24%, 44% 32%, 55% 6%, 63% 22%, 72% 16%, 84% 44%, 100% 38%, 100% 100%)' }, tint: 'linear-gradient(180deg, rgba(214,120,70,.55) 0%, rgba(70,50,70,.6) 100%)', caption: 'Policy workshop' },
  { d: 8, mist: { left: '-10%', right: '-10%', bottom: '22%', height: 130, background: '#D8CFCF', filter: 'blur(42px)', opacity: 0.32 } },
  { d: 11, summit: true, img: 'hall.jpg' },
  { d: 14, mist: { left: '-10%', right: '-10%', bottom: '12%', height: 120, background: '#CFC8CC', filter: 'blur(40px)', opacity: 0.3 } },
  { d: 17, img: 'hero2.jpg', style: { bottom: '4%', left: '4%', width: '40%', height: '46%', clipPath: 'polygon(0% 100%, 12% 58%, 20% 64%, 34% 28%, 42% 36%, 55% 8%, 66% 34%, 76% 30%, 90% 66%, 100% 100%)' }, tint: 'linear-gradient(180deg, rgba(224,127,58,.25) 0%, rgba(14,26,34,.6) 70%)' },
  { d: 17, img: 'hero6.jpg', style: { bottom: '4%', left: '64%', width: '38%', height: '44%', clipPath: 'polygon(0% 100%, 10% 66%, 24% 40%, 32% 46%, 46% 12%, 54% 24%, 62% 18%, 78% 52%, 90% 48%, 100% 70%, 100% 100%)' }, tint: 'linear-gradient(180deg, rgba(224,127,58,.25) 0%, rgba(14,26,34,.6) 70%)' },
  { d: 24, img: 'hero1.jpg', style: { bottom: 0, left: '-2%', width: '30%', height: '26%', clipPath: 'polygon(0% 100%, 0% 60%, 20% 30%, 34% 40%, 52% 0%, 70% 36%, 86% 28%, 100% 100%)' }, tint: 'rgba(14,26,34,.62)' },
  { d: 24, img: 'hero5.jpg', style: { bottom: 0, left: '46%', width: '30%', height: '24%', clipPath: 'polygon(0% 100%, 16% 44%, 30% 52%, 48% 0%, 64% 38%, 80% 30%, 100% 100%)' }, tint: 'rgba(14,26,34,.62)' },
  { d: 26, mist: { left: '10%', right: '10%', bottom: '5%', height: 110, background: '#D9D3D3', filter: 'blur(36px)', opacity: 0.28 } },
]
const par = (d) => `translate3d(calc(var(--mx, 0) * ${d}px), calc(var(--my, 0) * ${d / 2}px), 0)`

// ---------------------------------------------------------------- parts
function HeroMountain() {
  return (
    <div className="h-hero-bg" aria-hidden="true">
      <div className="h-stars" style={{ transform: par(2) }} />
      <div className="h-blob h-glow" style={{ left: '36%', top: '40%', width: '46%', height: '26%', background: '#F59E4B', filter: 'blur(70px)', opacity: 0.7, transform: par(3) }} />
      <div className="h-layer" style={{ transform: par(4) }}>
        <div className="h-blob h-cloud" style={{ left: '10%', top: '27%', width: '36%', height: 54, background: '#E8823A', filter: 'blur(20px)', opacity: 0.55 }} />
        <div className="h-blob h-cloud h-cloud-2" style={{ left: '44%', top: '21%', width: '34%', height: 44, background: '#F2A65A', filter: 'blur(18px)', opacity: 0.5 }} />
        <div className="h-blob h-cloud" style={{ left: '64%', top: '33%', width: '30%', height: 40, background: '#C2552B', filter: 'blur(16px)', opacity: 0.55 }} />
      </div>
      {PEAKS.map((p, i) => {
        if (p.mist) return <div key={i} className="h-blob h-mist" style={{ position: 'absolute', ...p.mist, transform: par(p.d) }} />
        if (p.summit) return (
          <div key={i} className="h-peak h-summit" style={{ bottom: '8%', left: '28%', width: '52%', height: '80%', transform: par(p.d) }}>
            <div className="h-peak-clip" style={{ clipPath: 'polygon(0% 100%, 10% 70%, 18% 74%, 27% 46%, 34% 52%, 42% 24%, 47% 30%, 52% 0%, 56% 10%, 59% 6%, 64% 26%, 70% 22%, 77% 48%, 85% 44%, 93% 72%, 100% 100%)' }}>
              <img src={HERO(p.img)} alt="" />
              <i style={{ background: 'linear-gradient(180deg, rgba(245,158,75,.38) 0%, rgba(14,26,34,.3) 40%, rgba(14,26,34,.55) 100%)' }} />
            </div>
          </div>
        )
        return (
          <div key={i} className="h-peak" style={{ ...p.style, transform: par(p.d) }}>
            <img src={HERO(p.img)} alt="" />
            <i style={{ background: p.tint }} />
          </div>
        )
      })}
      <svg className="h-trees" viewBox="0 0 1440 360" preserveAspectRatio="xMidYMax slice" style={{ transform: par(32) }}><path fill="#061017" d={TREES_PATH} /></svg>
      <div className="h-scrim" />
    </div>
  )
}

const SHIFT = [0, 1, 1.79, 2.5] // card distance from the centre, in units of --u
const SCALE = [1, 0.8, 0.64, 0.5]

function Destinations() {
  const sessions = useMemo(() => allSessions(), [])
  const areas = useMemo(() => AREA_LIST.map((a) => {
    const online = a.slug === 'online'
    const c = online ? null : cityBySlug(a.slug)
    const match = (s) => (online ? s.format === 'online' : s.city === a.slug)
    const first = sessions.find(match)
    return {
      ...a, match, photo: cityPhoto(a.slug, a.img),
      name: online ? 'Live online' : c?.name,
      country: online ? 'From anywhere' : a.slug === 'nairobi' ? `${c?.country} · Head office` : c?.country,
      count: online ? COURSES.length : COURSES.filter((x) => x.classroomCities.includes(a.slug)).length,
      price: first ? `from ${money(first.fee5)}` : 'dates on request',
      link: online ? '/courses?where=online' : `/cities/${a.slug}`,
    }
  }), [sessions])
  const n = areas.length
  const [idx, setIdx] = useState(AREA_LIST.findIndex((a) => a.slug === 'nairobi'))
  const [hover, setHover] = useState(false)
  const [playing, setPlaying] = useState(true)
  const pick = (i) => setIdx(((i % n) + n) % n)

  // moves on its own every 5 s; stops while the visitor hovers or focuses inside, or presses pause
  useEffect(() => {
    if (!playing || hover) return
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = setTimeout(() => setIdx((i) => (i + 1) % n), 5000)
    return () => clearTimeout(t)
  }, [idx, playing, hover, n])

  const area = areas[idx]
  // next dates in this area, one per course, like the previous home page
  const soon = useMemo(() => {
    const out = [], seen = new Set()
    for (const s of sessions) {
      if (!area.match(s) || seen.has(s.course.slug)) continue
      seen.add(s.course.slug); out.push(s)
      if (out.length === 3) break
    }
    return out
  }, [area, sessions])

  return (
    <section className="h-dest" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)} onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setHover(false) }}>
      <div className="h-wrap h-dest-inner">
        <div className="h-head" style={{ marginBottom: 36 }}>
          <div>
            <p className="h-eyebrow-line" style={{ margin: '0 0 12px' }}>Destinations</p>
            <h2 className="h-h2">Where will you learn?</h2>
          </div>
          <div className="h-dest-tools">
            <button type="button" className="h-round" aria-label="Previous" onClick={() => pick(idx - 1)}><ChevronLeft size={18} aria-hidden="true" /></button>
            <button type="button" className="h-round" aria-label={playing ? 'Pause the slideshow' : 'Play the slideshow'} onClick={() => setPlaying(!playing)}>{playing ? <Pause size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}</button>
            <button type="button" className="h-round" aria-label="Next" onClick={() => pick(idx + 1)}><ChevronRight size={18} aria-hidden="true" /></button>
          </div>
        </div>

        <div className="h-stage" aria-roledescription="carousel" aria-label="Training destinations">
          {areas.map((a, i) => {
            let off = (i - idx + n) % n
            if (off > n / 2) off -= n
            const k = Math.abs(off)
            const center = off === 0
            const style = {
              transform: `translateX(calc(-50% + ${Math.sign(off) * SHIFT[Math.min(k, 3)]} * var(--u))) scale(${SCALE[Math.min(k, 3)]})`,
              opacity: k > 2 ? 0 : k === 2 ? 0.55 : k === 1 ? 0.85 : 1,
              zIndex: 10 - k,
              pointerEvents: k > 2 ? 'none' : 'auto',
              background: a.photo ? a.tone : `linear-gradient(160deg, ${a.tone} 0%, #0F172A 100%)`,
            }
            const inner = (
              <>
                {a.photo ? <img src={a.photo} alt="" loading="lazy" /> : <span className="h-city-icon" aria-hidden="true">{a.slug === 'online' ? <Monitor size={64} /> : <MapPin size={64} />}</span>}
                <i className="h-city-shade" />
                <span className="h-city-text">
                  <span className="c-country">{a.country}</span>
                  <span className="c-name">{a.name}</span>
                  <span className="c-meta">{a.count} courses · {a.price}</span>
                  {center && <span className="c-go">See courses in {a.name} &rarr;</span>}
                </span>
              </>
            )
            return center
              ? <Link key={a.slug} to={a.link} className={`h-city is-center ${k === 2 ? 'is-far' : ''}`} style={style} aria-label={`See courses in ${a.name}`}>{inner}</Link>
              : <button key={a.slug} type="button" className={`h-city ${k === 2 ? 'is-far' : ''}`} style={style} onClick={() => pick(i)} tabIndex={k > 2 ? -1 : 0} aria-label={`Show ${a.name}`}>{inner}</button>
          })}
        </div>

        <div className="h-city-chips" role="tablist" aria-label="Choose a destination">
          {areas.map((a, i) => <button key={a.slug} type="button" role="tab" className="h-city-chip" aria-selected={i === idx} aria-pressed={i === idx} onClick={() => pick(i)}>{a.name}</button>)}
        </div>

        <div className="h-dest-courses" data-theme="dark">
          <div className="h-head" style={{ marginBottom: 22 }}>
            <h3 style={{ margin: 0, fontFamily: 'Fraunces, Georgia, serif', fontWeight: 400, fontSize: 28, color: '#fff' }}>Starting soon {area.slug === 'online' ? 'live online' : `in ${area.name}`}</h3>
            <Link to={area.link} className="h-link" style={{ color: '#F59E0B' }}>All courses {area.slug === 'online' ? 'live online' : `in ${area.name}`} &rarr;</Link>
          </div>
          {/* always 3 slots so the section keeps the same height when the city changes */}
          <div className="h-dest-grid">
            {soon.map((s) => <CourseCard key={s.id} course={s.course} session={s} />)}
            {!soon.length && <p className="h-dest-none">No dates in {area.name} yet. <Link to="/contact" style={{ color: '#F59E0B' }}>Ask us about new dates</Link>.</p>}
          </div>
        </div>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------- page
export default function Home() {
  // hero parallax: the mountain layers follow the mouse
  const heroRef = useRef(null)
  const onHeroMove = (e) => {
    const el = heroRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty('--mx', (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3))
    el.style.setProperty('--my', (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3))
  }
  const onHeroLeave = () => { const el = heroRef.current; if (el) { el.style.setProperty('--mx', '0'); el.style.setProperty('--my', '0') } }

  return (
    <div className="home">
      <Seo path="/" description="Practical 5 and 10-day professional development courses in Nairobi, Kigali, Dubai and 14 more cities, live online or in-house for your team. Finance, procurement, MEAL, ICT, leadership and more."
        jsonLd={[orgLd(), { '@context': 'https://schema.org', '@type': 'WebSite', name: SITE.name, url: SITE.url, potentialAction: { '@type': 'SearchAction', target: SITE.url + '/courses?q={search_term_string}', 'query-input': 'required name=search_term_string' } }]} />

      {/* HERO */}
      <section className="h-hero" ref={heroRef} onMouseMove={onHeroMove} onMouseLeave={onHeroLeave}>
        <HeroMountain />
        <div className="h-wrap h-hero-inner">
          <div className="h-hero-row" style={{ marginTop: 96 }}>
            <div style={{ maxWidth: 640 }}>
              <p className="h-kicker">{COURSES.length} courses · {CITIES.length} cities · live online</p>
              <h1>Every career has a summit. Train for yours.</h1>
              <p className="h-hero-sub">Finance, procurement, MEAL, ICT, leadership and 11 more focus areas: five- and ten-day courses in {CITIES.length} cities, or live online.</p>
              <p style={{ margin: '26px 0 10px', fontSize: 13, color: '#CBD5E1' }}>Popular right now</p>
              <div className="h-chips">
                {CHIPS.map(([l, s]) => <Link key={s} to={`/courses/${s}`} className="h-chip">{l}</Link>)}
              </div>
            </div>
            <div className="h-cal">
              <p style={{ margin: '0 0 14px', fontSize: 12, letterSpacing: '.18em', textTransform: 'uppercase', color: '#F59E0B' }}>Next on the calendar</p>
              {CALENDAR.map((it) => {
                const x = sessionOf(it.slug, it.format, it.city)
                if (!x) return null
                return (
                  <Link key={it.slug} to={`/courses/${it.slug}`} className="h-cal-row">
                    <span className="h-date">{monShort(x.s.start)}<br /><b>{dayNum(x.s.start)}</b></span>
                    <span>
                      <span style={{ display: 'block', color: '#fff', fontWeight: 600, fontSize: 14, lineHeight: 1.35 }}>{it.label}</span>
                      <span style={{ display: 'block', color: '#94A3B8', fontSize: 12 }}>{whereText(x.s)} · from {money(x.s.fee5)}</span>
                    </span>
                  </Link>
                )
              })}
              <Link to="/calendar" style={{ display: 'inline-block', marginTop: 12, fontSize: 14, fontWeight: 700, color: '#F59E0B', textDecoration: 'none' }}>Full calendar &rarr;</Link>
            </div>
          </div>
        </div>
      </section>

      {/* 1. FOCUS AREAS: find by need */}
      <section className="h-wrap h-section">
        <div className="h-head">
          <div><p className="h-eyebrow">Focus areas</p><h2 className="h-h2">Find the right skills for your role</h2></div>
          <Link to="/courses" className="h-link">All {CATEGORIES.length} focus areas &rarr;</Link>
        </div>
        <div className="h-areas">
          {AREAS.map((a) => (
            <Link key={a.slug} to={`/categories/${a.slug}`} className="h-area">
              <img src={IMG(a.img)} alt={a.alt} loading="lazy" />
              <div className="h-area-body">
                <span className="h-badge"><a.Icon size={20} aria-hidden="true" /></span>
                <b>{a.name}</b>
                <span className="h-sub">{a.sub}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 2. WHERE WILL YOU LEARN: area carousel + next dates there */}
      <Destinations />

      {/* 3. BROWSE BY WHAT YOU DO: split panel + all focus areas (approved mockup 2026-11-24) */}
      <section className="h-wrap h-section">
        <div className="h-split2">
          <div className="h-split2-left">
            <p className="h-split2-pill">Focus areas</p>
            <h2 className="h-split2-h">Browse by <em>what you do</em></h2>
            <p className="h-split2-sub">Pick your field and see every course, date and city in it.</p>
            <Link to="/courses" className="h-split2-btn">Search all courses &rarr;</Link>
            <img className="h-split2-img" src={IMG('cap-books.jpg')} alt="" loading="lazy" />
          </div>
          <div className="h-split2-right">
            <div className="h-split2-head">
              <p>All {CATEGORIES.length} areas &middot; {COURSES.length} courses</p>
              <Link to="/courses" className="h-link">Search all &rarr;</Link>
            </div>
            <ol className="h-split2-list">
              {CATEGORIES.map((c, i) => {
                const n = COURSES.filter((x) => x.category === c.slug).length
                return (
                  <li key={c.slug}>
                    <Link to={`/categories/${c.slug}`} className="h-split2-row">
                      <span className="h-split2-no" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                      <span className="h-split2-tx"><b>{c.name}</b><span>{n} {n === 1 ? 'course' : 'courses'}</span></span>
                      <span className="h-split2-go" aria-hidden="true">&rarr;</span>
                    </Link>
                  </li>
                )
              })}
            </ol>
          </div>
        </div>
      </section>

      {/* 4. LEARNING PATH: how booking works */}
      <section className="h-wrap h-section">
        <div className="h-head-center"><p className="h-eyebrow">How it works</p><h2 className="h-h2">Your learning path</h2></div>
        <ol className="h-steps">
          {[
            ['Choose your course', 'Filter by focus area, city and month.'],
            ['Reserve a seat', 'Hold your place online; our team confirms the details with you.'],
            ['Attend 5 or 10 days', 'Practical sessions, case work and tools you keep.'],
            ['Earn your CPD certificate', 'Continuing professional development you can show.'],
          ].map(([t, d], i) => <li key={t}><span className="num">{i + 1}</span><b>{t}</b><p>{d}</p></li>)}
        </ol>
      </section>

      {/* 5. STATS: proof */}
      <section className="h-stats">
        <div className="h-wrap h-stats-grid">
          <div><p className="n">{COURSES.length}</p><p className="l">Courses on offer</p></div>
          <div><p className="n">{CATEGORIES.length}</p><p className="l">Focus areas</p></div>
          <div><p className="n">{CITIES.length}</p><p className="l">Classroom cities</p></div>
          <div><p className="n">5 or 10</p><p className="l">Days per course</p></div>
          <div><p className="n">Weekly</p><p className="l">Monday intakes</p></div>
        </div>
      </section>

      {/* 6. ABOUT: trust */}
      <section className="h-wrap h-split h-about">
        <div className="h-about-img">
          <div><img src={IMG('workshop.jpg')} alt="Delegates in discussion during a WeSkill workshop" loading="lazy" /></div>
          {SITE.cpd.provider && <div className="h-cpd">
            <Award size={28} color="#F59E0B" aria-hidden="true" />
            <p style={{ margin: '8px 0 2px', fontSize: 13, color: '#CBD5E1' }}>CPD Certification Service</p>
            <p className="serif" style={{ margin: 0, fontSize: 20 }}>Provider no. {SITE.cpd.provider}</p>
          </div>}
        </div>
        <div>
          <p className="h-eyebrow-line">About WeSkill</p>
          <h2 className="h-h2" style={{ fontSize: 'clamp(34px, 3.8vw, 44px)' }}>Assess. Engage. Empower.</h2>
          <p style={{ margin: '20px 0 0', fontSize: 17, lineHeight: 1.75, color: '#475569' }}>We build practical skills for public, private and non-profit teams: finance, procurement, MEAL, leadership, ICT and 11 more focus areas. Join a classroom intake in {CITIES.length} cities, learn live online, or bring a programme in-house.</p>
          <Link to="/about" className="h-link" style={{ display: 'inline-block', marginTop: 24 }}>Read our story &rarr;</Link>
        </div>
      </section>

      {/* 7. FOR TEAMS: second audience */}
      <section className="h-teams">
        <div className="h-wrap h-teams-inner">
          <div className="h-head" style={{ marginBottom: 0 }}>
            <div>
              <p className="h-eyebrow" style={{ color: '#F59E0B' }}>For teams</p>
              <h2 className="h-h2" style={{ color: '#fff' }}>Training a whole team?</h2>
              <p style={{ margin: '12px 0 36px', color: '#BFDCD9', maxWidth: 600, lineHeight: 1.6 }}>Bring any course to your organisation, or let us build a programme around your goals.</p>
            </div>
            <Link to="/for-teams#quote" className="h-btn-gold" style={{ marginBottom: 36 }}>Request a team quote</Link>
          </div>
          <div className="h-teams-grid">
            {[
              ['suits.jpg', 'Managers in conversation at the office', 'In-house training', 'Any course, at your office or online, for your team only.', '/for-teams'],
              ['kanban.jpg', 'Planning board covered in sticky notes', 'Custom programmes', 'Combined modules built around a skills gap you name.', '/for-teams'],
              ['presenter.jpg', 'Consultant presenting at a flip chart', 'Advisory', 'Training needs and capacity reviews for your organisation.', '/advisory'],
            ].map(([img, alt, t, d, to]) => (
              <Link key={t} to={to} className="h-team" style={{ color: '#fff', textDecoration: 'none' }}>
                <img src={IMG(img)} alt={alt} loading="lazy" />
                <div><b>{t}</b><p>{d}</p></div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
