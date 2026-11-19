// Every URL that gets its own prerendered HTML file (and goes into sitemap.xml).
import { COURSES } from './data/courses.js'
import { CATEGORIES, CITIES } from './data/catalog.js'

export function allRoutes() {
  return [
    { path: '/', priority: '1.0' },
    { path: '/courses', priority: '0.9' },
    { path: '/calendar', priority: '0.8' },
    { path: '/destinations', priority: '0.6' },
    { path: '/for-teams', priority: '0.8' },
    { path: '/advisory', priority: '0.6' },
    { path: '/about', priority: '0.5' },
    { path: '/contact', priority: '0.6' },
    { path: '/faq', priority: '0.5' },
    { path: '/privacy', priority: '0.2' },
    { path: '/terms', priority: '0.2' },
    ...COURSES.map((c) => ({ path: `/courses/${c.slug}`, priority: '0.8' })),
    ...CATEGORIES.map((c) => ({ path: `/categories/${c.slug}`, priority: '0.7' })),
    ...CITIES.map((c) => ({ path: `/cities/${c.slug}`, priority: '0.6' })),
    // not in sitemap
    ...COURSES.map((c) => ({ path: `/book/${c.slug}`, noSitemap: true })),
    { path: '/admin', noSitemap: true },
    { path: '/login', noSitemap: true },
    { path: '/404', noSitemap: true },
  ]
}
