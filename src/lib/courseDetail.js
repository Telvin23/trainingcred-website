// Full outline (summary, outcomes, audience, modules ...) of a course imported from trainingcred.com.
// Prerendered pages carry it in <script id="course-detail">; client-side navigation fetches
// /course-data/<slug>.json. Courses written in courses.js already have everything and skip this.
import { useEffect, useState } from 'react'

const CACHE = new Map()

function embedded(slug) {
  if (typeof document === 'undefined') return globalThis.__COURSE_DETAIL__?.[slug] || null
  const el = document.getElementById('course-detail')
  if (el && el.dataset.slug === slug) { try { return JSON.parse(el.textContent) } catch { /* ignore */ } }
  return null
}

export function useCourseDetail(course) {
  const slug = course?.slug
  const need = !!course?.imported
  const [state, setState] = useState(() => (need ? { slug, data: CACHE.get(slug) || embedded(slug) } : null))
  const current = state && state.slug === slug ? state.data : need ? CACHE.get(slug) || null : null
  useEffect(() => {
    if (!need) return
    if (current) { CACHE.set(slug, current); return }
    let live = true
    fetch(`/course-data/${slug}.json`).then((r) => (r.ok ? r.json() : null)).then((d) => {
      if (!live || !d) return
      CACHE.set(slug, d); setState({ slug, data: d })
    }).catch(() => {})
    return () => { live = false }
  }, [slug, need, current])
  if (!need) return { course, detail: null, loading: false }
  if (!current) return { course, detail: null, loading: true }
  return {
    detail: current,
    loading: false,
    course: Object.assign(Object.create(Object.getPrototypeOf(course)), course, {
      summary: current.summary,
      outcomes: current.outcomes,
      audience: current.audience,
      modules: current.modules.map((t) => ({ title: t, text: '' })),
    }),
  }
}

export const detailScript = (slug, data) => JSON.stringify(data).replace(/</g, '\\u003c')
