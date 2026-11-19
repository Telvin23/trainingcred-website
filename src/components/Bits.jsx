import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Landmark, Banknote, ShieldCheck, Leaf, Sprout, Truck, KanbanSquare, BarChart3, Compass, Users, Scale, HeartPulse, Cpu, BookOpen, Building, Plane, TrendingUp, Plus, MapPin, Clock, Check, Pause, Play, ChevronLeft, ChevronRight, Monitor, Building2, ArrowUpRight, CalendarDays } from 'lucide-react'
import { categoryBySlug } from '../data/catalog.js'
import { dayNum, monShort, money, nextSession, where, fromFee, dateRange } from '../lib/util.js'

const ICONS = { Landmark, Banknote, ShieldCheck, Leaf, Sprout, Truck, KanbanSquare, BarChart3, Compass, Users, Scale, HeartPulse, Cpu, Building, Plane, TrendingUp }
export function Icon({ name, ...p }) {
  const C = ICONS[name] || BookOpen
  return <C aria-hidden="true" {...p} />
}

export function CheckItem({ children }) {
  return <li className="flex gap-3 text-[15px] leading-relaxed"><span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-brand-soft text-brand"><Check size={13} strokeWidth={3} aria-hidden="true" /></span><span>{children}</span></li>
}

// Generated cover art per focus area: no mismatched stock photos.
export function CourseCover({ category, className = '', children, big }) {
  const cat = categoryBySlug(category)
  const [a, b] = cat?.tint || ['#0B5A86', '#0E8F7E']
  return (
    <div className={`relative overflow-hidden ${className}`} style={{ background: `radial-gradient(120% 90% at 0% 0%, ${a} 0%, transparent 60%), radial-gradient(100% 100% at 100% 100%, ${b} 0%, transparent 65%), #071627` }}>
      <svg className="absolute inset-0 h-full w-full opacity-[.16]" aria-hidden="true"><defs><pattern id={`p-${category}`} width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.2" fill="#fff" /></pattern></defs><rect width="100%" height="100%" fill={`url(#p-${category})`} /></svg>
      <div className="absolute -bottom-6 -right-4 text-white/15" aria-hidden="true"><Icon name={cat?.icon} size={big ? 220 : 130} strokeWidth={1.2} /></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" aria-hidden="true" />
      {children}
    </div>
  )
}

export function CourseCard({ course, session }) {
  const s = session || nextSession(course)
  const cat = categoryBySlug(course.category)
  return (
    <article className="card card-hover group relative flex h-full flex-col overflow-hidden">
      <CourseCover category={course.category} className="h-40">
        <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2">
          <span className="chip glass-photo !py-1 text-xs text-white">{cat?.name.split(',')[0].split(' & ')[0]}</span>
          {s && <span className="chip glass-photo !py-1 text-xs text-white">{s.format === 'online' ? <Monitor size={13} aria-hidden="true" /> : <Building2 size={13} aria-hidden="true" />}{s.format === 'online' ? 'Live online' : 'Classroom'}</span>}
        </div>
        {s && (
          <div className="glass-photo absolute bottom-3 left-3 flex items-center gap-2 rounded-2xl px-3 py-1.5 text-white" aria-hidden="true">
            <span className="text-[11px] font-extrabold tracking-wider text-amber">{monShort(s.start)}</span><span className="text-lg font-extrabold leading-none">{dayNum(s.start)}</span>
          </div>
        )}
      </CourseCover>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="m-0 text-[17px] font-bold leading-snug">
          <Link to={`/courses/${course.slug}`} className="text-fg no-underline after:absolute after:inset-0 group-hover:text-brand">{course.title}</Link>
        </h3>
        <p className="m-0 line-clamp-2 text-[14px] leading-relaxed text-muted">{course.summary}</p>
        {s && (
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-faint">
            <span className="flex items-center gap-1.5"><MapPin size={14} aria-hidden="true" />{where(s)}</span>
            <span className="flex items-center gap-1.5"><Clock size={14} aria-hidden="true" />{course.durations.join(' or ')} days</span>
          </div>
        )}
        <div className="mt-auto flex items-end justify-between gap-3 border-t border-line pt-4">
          <div><div className="text-[11px] font-semibold uppercase tracking-wider text-faint">From</div><div className="text-[19px] font-extrabold text-accent">{money(s ? s.fee5 : fromFee(course))}</div></div>
          <Link to={`/book/${course.slug}${s ? `?session=${encodeURIComponent(s.id)}` : ''}`} className="btn-primary btn-sm relative z-10">Reserve<ArrowUpRight size={16} aria-hidden="true" /></Link>
        </div>
      </div>
    </article>
  )
}

export function CourseGrid({ courses, sessions, cols = 'sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4' }) {
  const list = sessions || courses.map((c) => ({ course: c }))
  return (
    <div className={`grid gap-5 ${cols}`}>
      {list.map((x) => <CourseCard key={(x.id || '') + x.course.slug} course={x.course} session={x.id ? x : undefined} />)}
    </div>
  )
}

// Compact row used in lists (calendar, hero "next up")
export function SessionRow({ s, compact }) {
  return (
    <Link to={`/book/${s.course.slug}?session=${encodeURIComponent(s.id)}`} className="group flex items-center gap-3 rounded-2xl p-2.5 no-underline transition hover:bg-white/10">
      <span className="flex h-12 w-12 flex-none flex-col items-center justify-center rounded-xl bg-white/10 text-white" aria-hidden="true">
        <span className="text-[10px] font-extrabold tracking-wider text-amber">{monShort(s.start)}</span><span className="text-[17px] font-extrabold leading-none">{dayNum(s.start)}</span>
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[14px] font-bold text-white">{s.course.title}</span>
        <span className="block truncate text-[12.5px] text-white/70">{where(s)} · {money(s.fee5)}</span>
      </span>
      {!compact && <ArrowUpRight size={17} className="flex-none text-white/60 transition group-hover:text-white" aria-hidden="true" />}
    </Link>
  )
}

export function FaqList({ faqs }) {
  return (
    <div className="flex flex-col gap-3">
      {faqs.map((f) => (
        <details key={f.q} className="glass group rounded-2xl px-5 py-4 open:bg-surface-2">
          <summary className="flex items-center justify-between gap-4 text-[16px] font-bold">{f.q}<span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-surface-2"><Plus size={17} className="chev transition" aria-hidden="true" /></span></summary>
          <p className="m-0 mt-3 pr-10 text-[15px] leading-relaxed text-muted">{f.a}</p>
        </details>
      ))}
    </div>
  )
}

// Interactive photo slideshow used as the hero background.
export function HeroSlider({ slides, interval = 6000, children }) {
  const [i, setI] = useState(0)
  const [playing, setPlaying] = useState(true)
  const [hover, setHover] = useState(false)
  const touch = useRef(null)
  const paused = !playing || hover
  useEffect(() => {
    if (paused) return
    const t = setTimeout(() => setI((x) => (x + 1) % slides.length), interval)
    return () => clearTimeout(t)
  }, [i, paused, interval, slides.length])
  useEffect(() => { if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) setPlaying(false) }, [])
  const go = (n) => setI((n + slides.length) % slides.length)

  const controls = (
    <div className="glass-photo flex items-center gap-1 rounded-full p-1.5 text-white">
      <button type="button" onClick={() => go(i - 1)} aria-label="Previous photo" className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/15"><ChevronLeft size={18} aria-hidden="true" /></button>
      <div className="hidden items-center gap-1.5 sm:flex" role="group" aria-label="Choose a photo">
        {slides.map((s, n) => (
          <button key={s.src} type="button" onClick={() => go(n)} aria-label={`Photo ${n + 1}: ${s.caption}`} aria-current={n === i}
            className={`relative h-9 overflow-hidden rounded-full border bg-cover bg-center transition-all ${n === i ? 'w-16 border-white' : 'w-9 border-white/30 opacity-70 hover:opacity-100'}`} style={{ backgroundImage: `url(${s.src})` }}>
            {n === i && <span key={i + (paused ? 'p' : 'r')} className="progress absolute inset-x-0 bottom-0 h-[3px] bg-amber" style={{ animationDuration: `${interval}ms` }} />}
          </button>
        ))}
      </div>
      <span className="px-2 text-xs font-semibold tabular-nums sm:hidden">{i + 1} / {slides.length}</span>
      <button type="button" onClick={() => setPlaying(!playing)} aria-label={playing ? 'Pause slideshow' : 'Play slideshow'} className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/15">{playing ? <Pause size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}</button>
      <button type="button" onClick={() => go(i + 1)} aria-label="Next photo" className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/15"><ChevronRight size={18} aria-hidden="true" /></button>
    </div>
  )

  return (
    <section aria-roledescription="carousel" aria-label="Featured photos"
      className={`relative -mt-[76px] overflow-hidden pt-[76px] text-white ${paused ? 'paused' : ''}`}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      onTouchStart={(e) => { touch.current = e.touches[0].clientX }}
      onTouchEnd={(e) => { if (touch.current == null) return; const d = e.changedTouches[0].clientX - touch.current; if (Math.abs(d) > 50) go(i + (d < 0 ? 1 : -1)); touch.current = null }}>
      <div className="absolute inset-0" aria-hidden="true">
        {slides.map((s, n) => (
          <div key={s.src} className={`absolute inset-0 transition-opacity duration-[1200ms] ${n === i ? 'opacity-100' : 'opacity-0'}`}>
            <img src={s.src} alt="" className={`h-full w-full object-cover ${n === i ? 'slide-on' : ''}`} loading={n === 0 ? 'eager' : 'lazy'} fetchPriority={n === 0 ? 'high' : 'auto'} />
          </div>
        ))}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,15,28,.78)_0%,rgba(5,15,28,.55)_40%,rgba(5,15,28,.9)_100%)] lg:bg-[linear-gradient(95deg,rgba(5,15,28,.94)_0%,rgba(5,15,28,.72)_48%,rgba(5,15,28,.35)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(700px_400px_at_15%_30%,rgba(14,143,126,.35),transparent_70%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-bg" />
      </div>
      <div className="relative">{children({ controls, caption: slides[i].caption })}</div>
    </section>
  )
}

export function Stat({ n, label }) {
  return (
    <div className="flex flex-col">
      <span className="text-[26px] font-extrabold leading-none sm:text-[30px]">{n}</span>
      <span className="mt-1 text-[13px] text-white/70">{label}</span>
    </div>
  )
}

export function DateBadge({ s }) {
  return <span className="inline-flex items-center gap-1.5 text-[13px] text-muted"><CalendarDays size={14} aria-hidden="true" />{dateRange(s.start, s.end5)}</span>
}
