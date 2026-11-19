import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Landmark, Banknote, ShieldCheck, Leaf, Sprout, Truck, KanbanSquare, BarChart3, Compass, Users, Scale, HeartPulse, Cpu, BookOpen } from 'lucide-react'
import { ChevronDown, MapPin, Clock, Check, Pause, Play, ChevronLeft, ChevronRight } from 'lucide-react'
import { categoryName, dayNum, monShort, money, nextSession, where, fromFee } from '../lib/util.js'

const ICONS = { Landmark, Banknote, ShieldCheck, Leaf, Sprout, Truck, KanbanSquare, BarChart3, Compass, Users, Scale, HeartPulse, Cpu }
export function Icon({ name, ...p }) {
  const C = ICONS[name] || BookOpen
  return <C aria-hidden="true" {...p} />
}

export function CheckItem({ children }) {
  return <li className="flex gap-2.5 text-[15px] leading-relaxed"><Check size={18} className="mt-0.5 flex-none text-teal" aria-hidden="true" /><span>{children}</span></li>
}

export function CourseCard({ course, session }) {
  const s = session || nextSession(course)
  return (
    <article className="card flex flex-col gap-3 p-5 transition hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(11,53,87,.10)]">
      <div className="flex items-start gap-3">
        {s && (
          <div className="w-14 flex-none rounded-xl bg-mint py-1.5 text-center" aria-hidden="true">
            <div className="text-[11px] font-extrabold text-teal">{monShort(s.start)}</div>
            <div className="text-[22px] font-extrabold leading-tight text-navy">{dayNum(s.start)}</div>
          </div>
        )}
        <div className="min-w-0">
          <div className="text-[11.5px] font-bold uppercase tracking-wide text-teal">{categoryName(course.category)}</div>
          <h3 className="m-0 mt-1 text-[16.5px] font-bold leading-snug"><Link to={`/courses/${course.slug}`} className="text-ink no-underline after:absolute after:inset-0 hover:text-teal">{course.title}</Link></h3>
        </div>
      </div>
      {s && (
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[13.5px] text-muted">
          <span className="flex items-center gap-1.5"><MapPin size={14} aria-hidden="true" />{where(s)}</span>
          <span className="flex items-center gap-1.5"><Clock size={14} aria-hidden="true" />{course.durations.join(' or ')} days</span>
        </div>
      )}
      <div className="mt-auto flex items-center justify-between gap-3 pt-1">
        <div><span className="text-xs text-muted">from </span><span className="text-[17px] font-extrabold text-navy">{money(s ? s.fee5 : fromFee(course))}</span></div>
        <Link to={`/book/${course.slug}${s ? `?session=${encodeURIComponent(s.id)}` : ''}`} className="btn-primary relative z-10 !px-4 !py-2.5 text-sm">Reserve a seat</Link>
      </div>
    </article>
  )
}
// card wrapper needs relative positioning for the stretched link
export function CourseGrid({ courses, sessions }) {
  const list = sessions || courses.map((c) => ({ course: c }))
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
      {list.map((x) => <div key={(x.id || '') + x.course.slug} className="relative flex"><div className="flex w-full flex-col [&>article]:h-full"><CourseCard course={x.course} session={x.id ? x : undefined} /></div></div>)}
    </div>
  )
}

export function FaqList({ faqs }) {
  return (
    <div className="flex flex-col">
      {faqs.map((f) => (
        <details key={f.q} className="border-b border-line py-4">
          <summary className="flex items-center justify-between gap-4 text-[16.5px] font-bold">{f.q}<ChevronDown size={20} className="chev flex-none text-muted transition" aria-hidden="true" /></summary>
          <p className="m-0 mt-2.5 text-[15px] leading-relaxed text-muted">{f.a}</p>
        </details>
      ))}
    </div>
  )
}

// Interactive hero slideshow: autoplay, pause on hover/focus, thumbnails, arrows, swipe, keyboard.
export function HeroSlider({ slides, interval = 6000, children, thumbs = true }) {
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
  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) setPlaying(false)
  }, [])
  const go = (n) => setI((n + slides.length) % slides.length)

  return (
    <section aria-roledescription="carousel" aria-label="Featured photos"
      className={`relative overflow-hidden bg-deep text-white ${paused ? 'paused' : ''}`}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      onTouchStart={(e) => { touch.current = e.touches[0].clientX }}
      onTouchEnd={(e) => { if (touch.current == null) return; const d = e.changedTouches[0].clientX - touch.current; if (Math.abs(d) > 50) go(i + (d < 0 ? 1 : -1)); touch.current = null }}
      onKeyDown={(e) => { if (e.target.closest('input,select,textarea')) return; if (e.key === 'ArrowRight') go(i + 1); if (e.key === 'ArrowLeft') go(i - 1) }}>
      <div className="absolute inset-0" aria-hidden="true">
        {slides.map((s, n) => (
          <div key={s.src} className={`absolute inset-0 transition-opacity duration-1000 ${n === i ? 'opacity-100' : 'opacity-0'}`}>
            <img src={s.src} alt="" className={`h-full w-full object-cover ${n === i ? 'slide-on' : ''}`} loading={n === 0 ? 'eager' : 'lazy'} fetchPriority={n === 0 ? 'high' : 'auto'} />
          </div>
        ))}
        <div className="absolute inset-0 bg-[linear-gradient(170deg,rgba(8,42,68,.95)_0%,rgba(11,53,87,.86)_55%,rgba(14,107,92,.62)_100%)] md:bg-[linear-gradient(100deg,rgba(8,42,68,.94)_0%,rgba(11,53,87,.84)_45%,rgba(14,107,92,.45)_100%)]" />
      </div>
      <div className="relative">
        {children}
        <div className="wrap flex flex-wrap items-center gap-x-4 gap-y-3 pb-8">
          {thumbs && (
            <div className="hidden gap-2.5 md:flex" role="group" aria-label="Choose a photo">
              {slides.map((s, n) => (
                <button key={s.src} type="button" onClick={() => go(n)} aria-label={`Photo ${n + 1}: ${s.caption}`} aria-current={n === i}
                  className={`relative h-[58px] w-[92px] overflow-hidden rounded-[10px] border-2 bg-cover bg-center transition hover:-translate-y-0.5 hover:opacity-100 ${n === i ? 'border-white opacity-100' : 'border-white/35 opacity-70'}`}
                  style={{ backgroundImage: `url(${s.src})` }}>
                  {n === i && <span key={i + (paused ? 'p' : 'r')} className="progress absolute inset-x-0 bottom-0 h-[3px] bg-white" style={{ animationDuration: `${interval}ms` }} />}
                </button>
              ))}
            </div>
          )}
          <div className={`flex items-center gap-2 ${thumbs ? 'md:hidden' : ''}`} role="group" aria-label="Choose a photo">
            {slides.map((s, n) => (
              <button key={s.src} type="button" onClick={() => go(n)} aria-label={`Photo ${n + 1}: ${s.caption}`} aria-current={n === i}
                className="flex h-11 items-center"><span className={`block h-2.5 rounded-full transition-all ${n === i ? 'w-7 bg-white' : 'w-2.5 bg-white/45'}`} /></button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => go(i - 1)} aria-label="Previous photo" className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-white/10 hover:bg-white/20"><ChevronLeft size={18} aria-hidden="true" /></button>
            <button type="button" onClick={() => setPlaying(!playing)} aria-label={playing ? 'Pause slideshow' : 'Play slideshow'} className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-white/10 hover:bg-white/20">{playing ? <Pause size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}</button>
            <button type="button" onClick={() => go(i + 1)} aria-label="Next photo" className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-white/10 hover:bg-white/20"><ChevronRight size={18} aria-hidden="true" /></button>
          </div>
          <span className="text-[13px] text-haze" aria-live="polite">{slides[i].caption}</span>
        </div>
      </div>
    </section>
  )
}
