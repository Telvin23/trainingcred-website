import { COURSES } from '../data/courses.js'
import { cityBySlug, categoryBySlug } from '../data/catalog.js'

/* global __BUILD_DATE__ */
export const TODAY = typeof __BUILD_DATE__ !== 'undefined' ? __BUILD_DATE__ : new Date().toISOString().slice(0, 10)

const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const MONTH = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const parts = (iso) => { const [y, m, d] = iso.split('-').map(Number); return { y, m, d } }

export const monShort = (iso) => MON[parts(iso).m - 1].toUpperCase()
export const dayNum = (iso) => String(parts(iso).d)
export const monthKey = (iso) => iso.slice(0, 7)
export const monthLabel = (key) => { const [y, m] = key.split('-').map(Number); return `${MONTH[m - 1]} ${y}` }

export function dateRange(a, b) {
  const A = parts(a), B = parts(b)
  if (A.y === B.y && A.m === B.m) return `${A.d} - ${B.d} ${MON[A.m - 1]} ${A.y}`
  if (A.y === B.y) return `${A.d} ${MON[A.m - 1]} - ${B.d} ${MON[B.m - 1]} ${A.y}`
  return `${A.d} ${MON[A.m - 1]} ${A.y} - ${B.d} ${MON[B.m - 1]} ${B.y}`
}

export const money = (f) => f ? `${f.currency === 'KES' ? 'KSh' : f.currency} ${f.amount.toLocaleString('en-US')}` : 'Price on request'

const UPCOMING = new WeakMap()
export const upcoming = (course) => {
  let u = UPCOMING.get(course)
  if (!u) { u = course.sessions.filter((s) => s.start > TODAY); UPCOMING.set(course, u) }
  return u
}
export const nextSession = (course, format) => upcoming(course).find((s) => !format || s.format === format)
export const where = (s) => s.format === 'online' ? 'Live online' : `${cityBySlug(s.city)?.name}, ${cityBySlug(s.city)?.country}`
export const fromFee = (course) => {
  const n = nextSession(course, 'online') || nextSession(course)
  return n ? n.fee5 : null
}
export const categoryName = (slug) => categoryBySlug(slug)?.name || ''

// All upcoming sessions across courses, sorted by date
let ALL_SESSIONS = null
export function allSessions() {
  if (ALL_SESSIONS) return ALL_SESSIONS
  const out = []
  for (const c of COURSES) for (const s of upcoming(c)) out.push({ ...s, course: c })
  return (ALL_SESSIONS = out.sort((a, b) => (a.start < b.start ? -1 : a.start > b.start ? 1 : a.course.title < b.course.title ? -1 : a.course.title > b.course.title ? 1 : 0)))
}

export const slugify = (s) => String(s).toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
