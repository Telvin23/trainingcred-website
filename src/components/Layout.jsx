import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { ChevronDown, Menu, X, Search, MessageCircle, ChevronRight, Sun, Moon, ArrowRight, LogIn, Building2, Monitor, Mic, Video, Users, Route } from 'lucide-react'
import { SITE, FORMATS, waLink } from '../data/site.js'
import { CATEGORIES, CITIES } from '../data/catalog.js'
import { COURSES } from '../data/courses.js'
import { Icon } from './Bits.jsx'
import LogoCube from './LogoCube.jsx'

export const FORMAT_ICON = { classroom: Building2, online: Monitor, masterclass: Mic, webinar: Video, 'in-house': Users, pathways: Route }
export const formatLink = (slug) => (slug === 'in-house' || slug === 'pathways' ? '/for-teams' : `/courses?format=${slug}`)

const Social = {
  facebook: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />,
  linkedin: <><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></>,
  instagram: <><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /></>,
  x: <path d="M4 4l16 16M20 4L4 20" />,
  tiktok: <path d="M9 12a4 4 0 1 0 4 4V4c.5 2.5 2.5 4.5 5 5" />,
}
export function SocialIcons({ className = '' }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {Object.entries(Social).filter(([k]) => SITE.socials[k]).map(([k, p]) => (
        <a key={k} href={SITE.socials[k]} aria-label={k === 'x' ? 'X' : k[0].toUpperCase() + k.slice(1)} target="_blank" rel="noopener noreferrer"
          className="glass flex h-10 w-10 items-center justify-center rounded-full text-muted transition hover:text-fg">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">{p}</svg>
        </a>
      ))}
    </div>
  )
}

export function Wordmark({ small, light }) {
  return (
    <span className={`group/logo flex items-center gap-2.5 ${light ? 'text-white' : 'text-fg'}`}>
      <LogoCube size={small ? 38 : 46} className="flex-none drop-shadow-[0_8px_18px_rgba(16,160,141,.45)]" />
      <span className="flex flex-col leading-[1.05]">
        <span className={`font-serif font-bold ${small ? 'text-[19px]' : 'text-[21px]'}`}>Training<span className="font-normal">cred</span></span>
        <span className="hidden font-serif text-[10px] italic opacity-70 sm:block">{SITE.tagline}</span>
      </span>
    </span>
  )
}

export function ThemeToggle({ className = '' }) {
  const [theme, setTheme] = useState('dark')
  useEffect(() => { setTheme(document.documentElement.dataset.theme || 'dark') }, [])
  const flip = () => {
    const t = theme === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.theme = t
    try { localStorage.setItem('tc-theme', t) } catch { /* private mode */ }
    setTheme(t)
  }
  return (
    <button type="button" onClick={flip} aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`glass flex h-11 w-11 items-center justify-center rounded-full text-fg transition hover:border-line-strong ${className}`}>
      {theme === 'dark' ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
    </button>
  )
}

const countCat = (slug) => COURSES.filter((c) => c.category === slug).length

function Panel({ id, open, children, wide }) {
  return (
    <div id={id} hidden={!open} className={`absolute left-1/2 top-[calc(100%+10px)] z-40 -translate-x-1/2 ${wide ? 'w-[min(1100px,calc(100vw-2rem))]' : 'w-[min(760px,calc(100vw-2rem))]'}`}>
      <div className="glass-strong rise rounded-3xl p-6">{children}</div>
    </div>
  )
}

export function Header() {
  const [menu, setMenu] = useState(null)
  const [drawer, setDrawer] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const loc = useLocation()
  useEffect(() => { setMenu(null); setDrawer(false) }, [loc.pathname, loc.search])
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') { setMenu(null); setDrawer(false) } }
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('keydown', onKey)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { window.removeEventListener('keydown', onKey); window.removeEventListener('scroll', onScroll) }
  }, [])
  useEffect(() => { document.body.style.overflow = drawer ? 'hidden' : '' }, [drawer])

  const tab = (key, label) => (
    <button type="button" aria-expanded={menu === key} aria-controls={`mega-${key}`} onClick={() => setMenu(menu === key ? null : key)}
      className={`flex items-center gap-1 whitespace-nowrap rounded-full px-3 py-2 text-[14.5px] font-semibold transition hover:bg-surface-2 ${menu === key ? 'bg-surface-2 text-fg' : 'text-muted hover:text-fg'}`}>
      {label}<ChevronDown size={15} className={`transition ${menu === key ? 'rotate-180' : ''}`} aria-hidden="true" />
    </button>
  )
  const plain = (to, label) => (
    <NavLink to={to} className={({ isActive }) => `whitespace-nowrap rounded-full px-3 py-2 text-[14.5px] font-semibold no-underline transition hover:bg-surface-2 hover:text-fg ${isActive ? 'bg-surface-2 text-fg' : 'text-muted'}`}>{label}</NavLink>
  )

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[100] focus:rounded-full focus:bg-solid focus:px-4 focus:py-2">Skip to content</a>
      <header className="sticky top-0 z-50 px-3 pt-3 sm:px-4" onMouseLeave={() => setMenu(null)}>
        <div className={`relative mx-auto flex max-w-[1280px] items-center gap-3 rounded-full py-2 pl-3 pr-2 transition-all duration-300 sm:pl-5 ${scrolled || menu ? 'glass-strong' : 'glass'}`}>
          <Link to="/" className="no-underline" aria-label="Trainingcred home"><Wordmark /></Link>
          <nav aria-label="Main" className="ml-4 hidden flex-1 items-center gap-0.5 lg:flex">
            {tab('courses', 'Courses')}
            {tab('formats', 'Formats')}
            {tab('destinations', 'Destinations')}
            {plain('/for-teams', 'For Teams')}
            {plain('/advisory', 'Advisory')}
            <span className="hidden xl:contents">{plain('/calendar', 'Calendar')}</span>
          </nav>
          <div className="ml-auto flex items-center gap-1.5">
            <Link to="/courses" aria-label="Search courses" className="flex h-11 w-11 items-center justify-center rounded-full text-fg transition hover:bg-surface-2"><Search size={19} aria-hidden="true" /></Link>
            <ThemeToggle className="hidden sm:flex" />
            <Link to="/login" className="hidden rounded-full px-4 py-2.5 text-[14.5px] font-semibold text-fg no-underline transition hover:bg-surface-2 md:block">Log in</Link>
            <Link to="/for-teams#quote" className="btn-amber btn-sm hidden 2xl:inline-flex">Team quote</Link>
            <Link to="/courses" className="btn-primary btn-sm hidden md:inline-flex">Find a course</Link>
            <button type="button" className="flex h-11 w-11 items-center justify-center rounded-full text-fg hover:bg-surface-2 lg:hidden" aria-label="Open menu" aria-expanded={drawer} onClick={() => setDrawer(true)}><Menu size={22} aria-hidden="true" /></button>
          </div>

          <Panel id="mega-courses" open={menu === 'courses'} wide>
            <div className="grid gap-6 lg:grid-cols-[1.7fr_1fr]">
              <div>
                <div className="eyebrow mb-3">Focus areas</div>
                <div className="grid gap-1 sm:grid-cols-2">
                  {CATEGORIES.map((c) => (
                    <Link key={c.slug} to={`/categories/${c.slug}`} className="group flex items-center gap-3 rounded-2xl p-2.5 no-underline transition hover:bg-surface-2">
                      <span className="flex h-9 w-9 flex-none items-center justify-center rounded-xl text-white" style={{ background: `linear-gradient(135deg, ${c.tint[0]}, ${c.tint[1]})` }}><Icon name={c.icon} size={17} /></span>
                      <span className="min-w-0 flex-1 text-[14.5px] font-semibold leading-snug text-fg">{c.name}</span>
                      <span className="text-xs font-semibold text-faint">{countCat(c.slug)}</span>
                    </Link>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-2 rounded-2xl bg-surface p-4">
                <div className="eyebrow mb-1">Most requested</div>
                {COURSES.filter((c) => c.popular).slice(0, 5).map((c) => (
                  <Link key={c.slug} to={`/courses/${c.slug}`} className="flex items-center justify-between gap-3 rounded-xl px-2 py-2 text-[14.5px] font-semibold text-fg no-underline hover:bg-surface-2">{c.title}<ChevronRight size={16} className="flex-none text-faint" aria-hidden="true" /></Link>
                ))}
                <Link to="/courses" className="btn-primary btn-sm mt-auto">Browse all courses</Link>
              </div>
            </div>
          </Panel>
          <Panel id="mega-formats" open={menu === 'formats'}>
            <div className="grid gap-2 sm:grid-cols-2">
              {FORMATS.map((f) => {
                const I = FORMAT_ICON[f.slug]
                return (
                  <Link key={f.slug} to={formatLink(f.slug)} className="flex gap-3 rounded-2xl p-3 no-underline transition hover:bg-surface-2">
                    <span className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-brand-soft text-brand"><I size={19} aria-hidden="true" /></span>
                    <span><span className="block font-bold text-fg">{f.name}</span><span className="text-sm text-muted">{f.short}</span></span>
                  </Link>
                )
              })}
            </div>
          </Panel>
          <Panel id="mega-destinations" open={menu === 'destinations'}>
            <div className="grid grid-cols-2 gap-1 sm:grid-cols-3">
              {CITIES.map((c) => (
                <Link key={c.slug} to={`/cities/${c.slug}`} className="rounded-xl px-3 py-2 no-underline transition hover:bg-surface-2">
                  <span className="block text-[14.5px] font-semibold text-fg">{c.name}</span><span className="text-xs text-faint">{c.country}</span>
                </Link>
              ))}
              <Link to="/courses?format=online" className="rounded-xl bg-brand-soft px-3 py-2 no-underline"><span className="block text-[14.5px] font-semibold text-fg">Live online</span><span className="text-xs text-brand">From anywhere</span></Link>
            </div>
          </Panel>
        </div>
      </header>

      {drawer && (
        <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <button type="button" className="absolute inset-0 bg-black/50 backdrop-blur-sm" aria-label="Close menu" onClick={() => setDrawer(false)} />
          <div className="glass-strong absolute inset-y-2 right-2 flex w-[88%] max-w-sm flex-col overflow-y-auto rounded-3xl !bg-solid/95">
            <div className="flex items-center justify-between p-4">
              <Wordmark small />
              <button type="button" className="glass flex h-11 w-11 items-center justify-center rounded-full" aria-label="Close menu" onClick={() => setDrawer(false)}><X size={20} aria-hidden="true" /></button>
            </div>
            <nav aria-label="Mobile" className="flex flex-col px-3">
              {[['/courses', 'All courses'], ['/calendar', 'Calendar'], ['/for-teams', 'For Teams'], ['/advisory', 'Advisory'], ['/about', 'About us'], ['/faq', 'FAQ'], ['/contact', 'Contact']].map(([to, l]) => (
                <Link key={to} to={to} className="flex items-center justify-between rounded-2xl px-3 py-3.5 text-base font-semibold text-fg no-underline hover:bg-surface-2">{l}<ChevronRight size={18} aria-hidden="true" className="text-faint" /></Link>
              ))}
              <details className="rounded-2xl px-3 py-3.5"><summary className="flex items-center justify-between text-base font-semibold">Focus areas<ChevronDown size={18} className="text-faint" aria-hidden="true" /></summary>
                <div className="flex flex-col pt-2">{CATEGORIES.map((c) => <Link key={c.slug} to={`/categories/${c.slug}`} className="py-2 text-[15px] text-muted no-underline">{c.name}</Link>)}</div>
              </details>
              <details className="rounded-2xl px-3 py-3.5"><summary className="flex items-center justify-between text-base font-semibold">Destinations<ChevronDown size={18} className="text-faint" aria-hidden="true" /></summary>
                <div className="grid grid-cols-2 pt-2">{CITIES.map((c) => <Link key={c.slug} to={`/cities/${c.slug}`} className="py-2 text-[15px] text-muted no-underline">{c.name}</Link>)}</div>
              </details>
            </nav>
            <div className="mt-auto flex flex-col gap-2 p-4">
              <div className="flex items-center justify-between rounded-2xl bg-surface px-4 py-2"><span className="text-sm font-semibold">Appearance</span><ThemeToggle /></div>
              <Link to="/login" className="btn-glass"><LogIn size={18} aria-hidden="true" />Log in</Link>
              <Link to="/for-teams#quote" className="btn-amber">Request a team quote</Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export function Footer() {
  return (
    <footer className="relative mt-10 px-3 pb-3 sm:px-4">
      <div className="glass mx-auto max-w-[1280px] overflow-hidden rounded-[32px]">
        <div className="grid gap-6 border-b border-line p-6 sm:p-10 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div>
            <h2 className="m-0 text-[26px] font-extrabold leading-tight sm:text-[32px]">New dates every month. <span className="text-gradient">Get them first.</span></h2>
            <p className="lede m-0 mt-2">One short message a month with new courses, cities and early-booking offers.</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row lg:justify-end">
            <a href={waLink('Hello Trainingcred, please add me to your monthly course dates update.')} target="_blank" rel="noopener noreferrer" className="btn-primary"><MessageCircle size={18} aria-hidden="true" />Get dates on WhatsApp</a>
            <Link to="/calendar" className="btn-glass">See the calendar<ArrowRight size={17} aria-hidden="true" /></Link>
          </div>
        </div>
        <div className="grid gap-10 p-6 sm:grid-cols-2 sm:p-10 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div className="flex flex-col gap-4 text-sm">
            <Wordmark />
            <p className="m-0 max-w-xs leading-relaxed text-muted">Short courses, in-house programmes and advisory for the modern workforce across Africa and the Middle East.</p>
            <div className="flex flex-col gap-1.5">
              <a href={SITE.phoneHref} className="font-semibold text-fg no-underline">{SITE.phone}</a>
              <a href={`mailto:${SITE.email}`} className="font-semibold text-fg no-underline">{SITE.email}</a>
              <span className="text-muted">{SITE.address}</span>
            </div>
            <SocialIcons />
          </div>
          {[
            ['Focus areas', CATEGORIES.slice(0, 6).map((c) => [`/categories/${c.slug}`, c.name]).concat([['/courses', 'All courses']])],
            ['Destinations', CITIES.slice(0, 7).map((c) => [`/cities/${c.slug}`, `${c.name}, ${c.country}`]).concat([['/destinations', 'All destinations']])],
            ['Company', [['/about', 'About us'], ['/for-teams', 'For Teams'], ['/advisory', 'Advisory'], ['/calendar', 'Calendar'], ['/faq', 'FAQ'], ['/contact', 'Contact'], ['/login', 'Log in']]],
          ].map(([h, links]) => (
            <div key={h}>
              <h3 className="m-0 mb-4 text-xs font-bold uppercase tracking-[.14em] text-faint">{h}</h3>
              <ul className="m-0 flex list-none flex-col gap-2.5 p-0 text-[14.5px]">
                {links.map(([to, l], n) => <li key={to + n}><Link to={to} className={`no-underline transition hover:text-fg ${n === links.length - 1 && h !== 'Company' ? 'font-semibold text-brand' : 'text-muted'}`}>{l}</Link></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-6 py-5 text-[13px] text-faint sm:px-10">
          <span>&copy; {new Date().getFullYear()} {SITE.legalName}. All rights reserved.</span>
          <span className="flex flex-wrap gap-5"><Link to="/terms" className="text-faint no-underline hover:text-fg">Terms</Link><Link to="/privacy" className="text-faint no-underline hover:text-fg">Privacy</Link><a href="/sitemap.xml" className="text-faint no-underline hover:text-fg">Sitemap</a></span>
        </div>
      </div>
    </footer>
  )
}

export function WhatsAppFab() {
  return (
    <a href={waLink()} target="_blank" rel="noopener noreferrer" aria-label="Chat with us on WhatsApp"
      className="btn-primary fixed bottom-4 right-4 z-40 !min-h-[52px] !px-4 shadow-[0_16px_40px_-10px_rgba(14,143,126,.9)] sm:bottom-6 sm:right-6 sm:!px-5">
      <MessageCircle size={20} aria-hidden="true" /><span className="hidden sm:inline">Chat with us</span>
    </a>
  )
}

export function Crumbs({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-[13px] text-faint">
      {items.map((it, i) => (
        <span key={it.path} className="flex items-center gap-1.5">
          {i > 0 && <ChevronRight size={13} aria-hidden="true" />}
          {i < items.length - 1 ? <Link to={it.path} className="text-faint no-underline hover:text-fg">{it.name}</Link> : <span className="text-muted" aria-current="page">{it.name}</span>}
        </span>
      ))}
    </nav>
  )
}

export function PageHero({ crumbs, eyebrow, title, intro, children, aside }) {
  return (
    <section className="relative">
      <div className="wrap pt-8 pb-8 sm:pt-12">
        <div className={`grid gap-8 ${aside ? 'lg:grid-cols-[1.4fr_1fr] lg:items-end' : ''}`}>
          <div className="rise flex flex-col gap-4">
            {crumbs && <Crumbs items={crumbs} />}
            {eyebrow && <span className="pill-label glass self-start text-brand">{eyebrow}</span>}
            <h1 className="m-0 max-w-[880px] text-[34px] font-extrabold leading-[1.08] sm:text-5xl">{title}</h1>
            {intro && <p className="lede m-0 max-w-[720px]">{intro}</p>}
            {children}
          </div>
          {aside}
        </div>
      </div>
    </section>
  )
}

export function SectionHead({ eyebrow, title, intro, action, center }) {
  return (
    <div className={`mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between ${center ? 'items-center text-center sm:flex-col sm:items-center' : ''}`}>
      <div className={`max-w-[680px] ${center ? 'mx-auto' : ''}`}>
        {eyebrow && <div className="eyebrow mb-2">{eyebrow}</div>}
        <h2 className="h2 m-0">{title}</h2>
        {intro && <p className="lede m-0 mt-2.5">{intro}</p>}
      </div>
      {action}
    </div>
  )
}
