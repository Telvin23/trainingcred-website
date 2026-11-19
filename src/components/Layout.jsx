import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { ChevronDown, Menu, X, Search, MessageCircle, ChevronRight } from 'lucide-react'
import { SITE, FORMATS, waLink } from '../data/site.js'
import { CATEGORIES, CITIES } from '../data/catalog.js'
import { COURSES } from '../data/courses.js'

const Social = {
  facebook: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />,
  linkedin: <><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></>,
  instagram: <><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /></>,
  x: <path d="M4 4l16 16M20 4L4 20" />,
  tiktok: <path d="M9 12a4 4 0 1 0 4 4V4c.5 2.5 2.5 4.5 5 5" />,
}
export function SocialIcons({ className = '' }) {
  return (
    <div className={`flex items-center gap-3.5 ${className}`}>
      {Object.entries(Social).map(([k, p]) => (
        <a key={k} href={SITE.socials[k]} aria-label={k === 'x' ? 'X' : k[0].toUpperCase() + k.slice(1)} target="_blank" rel="noopener noreferrer" className="flex text-current opacity-90 hover:opacity-100 hover:text-current">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">{p}</svg>
        </a>
      ))}
    </div>
  )
}

export function Wordmark({ small }) {
  return (
    <span className="flex flex-col leading-[1.05]">
      <span className={`font-serif font-bold tracking-tight ${small ? 'text-[21px]' : 'text-[24px] lg:text-[26px]'}`}>Training<span className="font-normal">cred</span></span>
      <span className={`font-serif italic opacity-85 mt-[3px] ${small ? 'text-[9px]' : 'text-[10.5px]'}`}>{SITE.tagline}</span>
    </span>
  )
}

const countBy = (key, val) => COURSES.filter((c) => (key === 'category' ? c.category === val : c.sessions.some((s) => s.city === val))).length

function Mega({ id, open, children }) {
  return (
    <div id={id} hidden={!open} className="absolute left-0 right-0 top-full z-40 border-t border-white/10 bg-white text-ink shadow-2xl">
      <div className="wrap py-8">{children}</div>
    </div>
  )
}

export function Header() {
  const [menu, setMenu] = useState(null)
  const [drawer, setDrawer] = useState(false)
  const loc = useLocation()
  useEffect(() => { setMenu(null); setDrawer(false) }, [loc.pathname, loc.search])
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') { setMenu(null); setDrawer(false) } }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
  useEffect(() => { document.body.style.overflow = drawer ? 'hidden' : '' }, [drawer])

  const tab = (key, label) => (
    <button type="button" aria-expanded={menu === key} aria-controls={`mega-${key}`} onClick={() => setMenu(menu === key ? null : key)}
      className={`flex items-center gap-1 rounded-lg px-3 py-2.5 text-[15px] font-semibold text-white hover:bg-white/10 ${menu === key ? 'bg-white/15' : ''}`}>
      {label}<ChevronDown size={15} className={`transition ${menu === key ? 'rotate-180' : ''}`} aria-hidden="true" />
    </button>
  )
  const plain = (to, label) => (
    <NavLink to={to} className={({ isActive }) => `rounded-lg px-3 py-2.5 text-[15px] font-semibold text-white no-underline hover:bg-white/10 hover:text-white ${isActive ? 'bg-white/15' : ''}`}>{label}</NavLink>
  )

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2">Skip to content</a>
      <div className="bg-navy text-[13px] text-haze">
        <div className="wrap flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-2">
          <SocialIcons className="text-haze" />
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
            <a href={waLink()} className="text-haze hover:text-white" target="_blank" rel="noopener noreferrer">WhatsApp {SITE.phone}</a>
            <a href={`mailto:${SITE.email}`} className="hidden text-haze hover:text-white sm:inline">{SITE.email}</a>
          </div>
        </div>
      </div>
      <header className="sticky top-0 z-50 bg-teal text-white shadow-[0_2px_12px_rgba(0,0,0,.12)]" onMouseLeave={() => setMenu(null)}>
        <div className="wrap flex items-center gap-4 py-3 lg:gap-7">
          <Link to="/" className="text-white no-underline hover:text-white" aria-label="Trainingcred home"><Wordmark /></Link>
          <nav aria-label="Main" className="hidden flex-1 items-center gap-1 lg:flex">
            {tab('courses', 'Courses')}
            {tab('formats', 'Formats')}
            {tab('destinations', 'Destinations')}
            {plain('/for-teams', 'For Teams')}
            {plain('/advisory', 'Advisory')}
            {plain('/calendar', 'Calendar')}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <Link to="/courses" aria-label="Search courses" className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 text-white hover:bg-white/25 hover:text-white"><Search size={20} aria-hidden="true" /></Link>
            <Link to="/for-teams#quote" className="btn-white hidden !py-2.5 text-sm xl:inline-flex">Request a team quote</Link>
            <button type="button" className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 lg:hidden" aria-label="Open menu" aria-expanded={drawer} onClick={() => setDrawer(true)}><Menu size={22} aria-hidden="true" /></button>
          </div>
        </div>

        <Mega id="mega-courses" open={menu === 'courses'}>
          <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
            <div>
              <div className="eyebrow mb-3 text-muted">Focus areas</div>
              <div className="grid gap-x-6 sm:grid-cols-2">
                {CATEGORIES.map((c) => (
                  <Link key={c.slug} to={`/categories/${c.slug}`} className="flex items-center justify-between border-b border-line py-2.5 text-[15px] font-semibold text-ink no-underline hover:text-teal">
                    <span>{c.name}</span><span className="text-sm font-normal text-muted">{countBy('category', c.slug)}</span>
                  </Link>
                ))}
              </div>
            </div>
            <div className="rounded-2xl bg-soft p-5">
              <div className="eyebrow mb-3 text-muted">Most requested</div>
              {COURSES.filter((c) => c.popular).slice(0, 4).map((c) => (
                <Link key={c.slug} to={`/courses/${c.slug}`} className="block border-b border-line py-2.5 text-[15px] font-semibold text-ink no-underline last:border-0 hover:text-teal">{c.title}</Link>
              ))}
              <Link to="/courses" className="btn-primary mt-4 w-full">Browse all courses</Link>
            </div>
          </div>
        </Mega>
        <Mega id="mega-formats" open={menu === 'formats'}>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FORMATS.map((f) => (
              <Link key={f.slug} to={f.slug === 'in-house' || f.slug === 'pathways' ? '/for-teams' : `/courses?format=${f.slug}`} className="card block p-4 text-ink no-underline hover:border-teal">
                <div className="font-extrabold">{f.name}</div><div className="mt-1 text-sm text-muted">{f.short}</div>
              </Link>
            ))}
          </div>
        </Mega>
        <Mega id="mega-destinations" open={menu === 'destinations'}>
          <div className="grid grid-cols-2 gap-x-6 sm:grid-cols-3 lg:grid-cols-5">
            {CITIES.map((c) => (
              <Link key={c.slug} to={`/cities/${c.slug}`} className="border-b border-line py-2.5 text-[15px] font-semibold text-ink no-underline hover:text-teal">
                {c.name}<span className="block text-xs font-normal text-muted">{c.country}</span>
              </Link>
            ))}
            <Link to="/courses?format=online" className="border-b border-line py-2.5 text-[15px] font-semibold text-ink no-underline hover:text-teal">Live online<span className="block text-xs font-normal text-muted">From anywhere</span></Link>
          </div>
        </Mega>
      </header>

      {drawer && (
        <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <button type="button" className="absolute inset-0 bg-black/40" aria-label="Close menu" onClick={() => setDrawer(false)} />
          <div className="absolute right-0 top-0 flex h-full w-[86%] max-w-sm flex-col overflow-y-auto bg-white">
            <div className="flex items-center justify-between bg-teal px-4 py-3 text-white">
              <Wordmark small />
              <button type="button" className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15" aria-label="Close menu" onClick={() => setDrawer(false)}><X size={22} aria-hidden="true" /></button>
            </div>
            <nav aria-label="Mobile" className="flex flex-col px-4 py-2">
              {[['/courses', 'All courses'], ['/calendar', 'Calendar'], ['/for-teams', 'For Teams'], ['/advisory', 'Advisory'], ['/about', 'About us'], ['/faq', 'FAQ'], ['/contact', 'Contact']].map(([to, l]) => (
                <Link key={to} to={to} className="flex items-center justify-between border-b border-line py-3.5 text-base font-semibold text-ink no-underline">{l}<ChevronRight size={18} aria-hidden="true" className="text-muted" /></Link>
              ))}
              <details className="border-b border-line py-3.5"><summary className="flex items-center justify-between text-base font-semibold">Focus areas<ChevronDown size={18} className="chev text-muted transition" aria-hidden="true" /></summary>
                <div className="flex flex-col pt-2">{CATEGORIES.map((c) => <Link key={c.slug} to={`/categories/${c.slug}`} className="py-2 text-[15px] text-ink no-underline">{c.name}</Link>)}</div>
              </details>
              <details className="border-b border-line py-3.5"><summary className="flex items-center justify-between text-base font-semibold">Destinations<ChevronDown size={18} className="chev text-muted transition" aria-hidden="true" /></summary>
                <div className="grid grid-cols-2 pt-2">{CITIES.map((c) => <Link key={c.slug} to={`/cities/${c.slug}`} className="py-2 text-[15px] text-ink no-underline">{c.name}</Link>)}</div>
              </details>
            </nav>
            <div className="mt-auto flex flex-col gap-2 p-4">
              <Link to="/for-teams#quote" className="btn-primary">Request a team quote</Link>
              <a href={waLink()} className="btn-outline" target="_blank" rel="noopener noreferrer">WhatsApp us</a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export function Footer() {
  return (
    <footer className="bg-deep text-[#C9DAE6]">
      <div className="wrap pt-14 pb-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
          <div className="flex flex-col gap-3 text-sm">
            <span className="text-white"><Wordmark /></span>
            <p className="m-0 leading-relaxed">Short courses, in-house programmes and advisory for the modern workforce.</p>
            <a href={SITE.phoneHref} className="text-white">{SITE.phone}</a>
            <a href={`mailto:${SITE.email}`} className="text-white">{SITE.email}</a>
            <span>{SITE.address}</span>
            <SocialIcons className="mt-1 text-white" />
          </div>
          <div>
            <h3 className="mb-3 text-[13px] font-bold uppercase tracking-wider text-white">Focus areas</h3>
            <ul className="m-0 flex list-none flex-col gap-2 p-0 text-sm">
              {CATEGORIES.slice(0, 7).map((c) => <li key={c.slug}><Link to={`/categories/${c.slug}`} className="text-[#C9DAE6] hover:text-white">{c.name}</Link></li>)}
              <li><Link to="/courses" className="font-bold text-glow hover:text-white">All courses</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-[13px] font-bold uppercase tracking-wider text-white">Training cities</h3>
            <ul className="m-0 grid list-none grid-cols-2 gap-2 p-0 text-sm sm:grid-cols-1">
              {CITIES.slice(0, 8).map((c) => <li key={c.slug}><Link to={`/cities/${c.slug}`} className="text-[#C9DAE6] hover:text-white">{c.name}, {c.country}</Link></li>)}
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-[13px] font-bold uppercase tracking-wider text-white">Company</h3>
            <ul className="m-0 grid list-none grid-cols-2 gap-2 p-0 text-sm">
              {[['/about', 'About us'], ['/for-teams', 'For Teams'], ['/advisory', 'Advisory'], ['/calendar', 'Calendar'], ['/faq', 'FAQ'], ['/contact', 'Contact']].map(([to, l]) => <li key={to}><Link to={to} className="text-[#C9DAE6] hover:text-white">{l}</Link></li>)}
            </ul>
            <a href={waLink('Hello Trainingcred, please add me to your monthly course dates update.')} target="_blank" rel="noopener noreferrer" className="btn-primary mt-5 text-sm">Get new dates on WhatsApp</a>
          </div>
        </div>
        <div className="mt-10 flex flex-wrap justify-between gap-3 border-t border-[#1E3E57] pt-5 text-[13px]">
          <span>&copy; {new Date().getFullYear()} {SITE.legalName}. All rights reserved.</span>
          <span className="flex flex-wrap gap-5"><Link to="/terms" className="text-[#C9DAE6]">Terms</Link><Link to="/privacy" className="text-[#C9DAE6]">Privacy</Link><a href="/sitemap.xml" className="text-[#C9DAE6]">Sitemap</a></span>
        </div>
      </div>
    </footer>
  )
}

export function WhatsAppFab() {
  return (
    <a href={waLink()} target="_blank" rel="noopener noreferrer" aria-label="Chat with us on WhatsApp"
      className="fixed bottom-4 right-4 z-40 flex items-center gap-2 rounded-full bg-teal px-4 py-3.5 font-bold text-white no-underline shadow-[0_10px_30px_rgba(0,0,0,.25)] hover:bg-teal-dark hover:text-white sm:bottom-6 sm:right-6 sm:px-5">
      <MessageCircle size={20} aria-hidden="true" /><span className="hidden sm:inline">Chat with us</span>
    </a>
  )
}

export function Crumbs({ items, light }) {
  return (
    <nav aria-label="Breadcrumb" className={`flex flex-wrap items-center gap-2 text-[13.5px] ${light ? 'text-haze' : 'text-muted'}`}>
      {items.map((it, i) => (
        <span key={it.path} className="flex items-center gap-2">
          {i > 0 && <ChevronRight size={14} aria-hidden="true" />}
          {i < items.length - 1 ? <Link to={it.path} className={light ? 'text-haze hover:text-white' : 'text-muted'}>{it.name}</Link> : <span className={light ? 'text-white' : 'text-ink'} aria-current="page">{it.name}</span>}
        </span>
      ))}
    </nav>
  )
}

export function PageHero({ crumbs, eyebrow, title, intro, children }) {
  return (
    <section className="bg-gradient-to-br from-deep via-navy to-teal text-white">
      <div className="wrap flex flex-col gap-4 py-10 sm:py-14">
        {crumbs && <Crumbs items={crumbs} light />}
        {eyebrow && <span className="eyebrow self-start rounded-md border border-white/30 bg-white/10 px-3 py-1.5">{eyebrow}</span>}
        <h1 className="m-0 max-w-[880px] text-[30px] font-extrabold leading-[1.12] tracking-tight sm:text-[42px]">{title}</h1>
        {intro && <p className="m-0 max-w-[720px] text-[17px] leading-relaxed text-haze">{intro}</p>}
        {children}
      </div>
    </section>
  )
}
