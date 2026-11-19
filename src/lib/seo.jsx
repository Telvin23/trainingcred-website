import { createContext, useContext, useEffect } from 'react'
import { SITE } from '../data/site.js'

// During prerender a collector object is provided; in the browser the hook updates the document head.
export const HeadContext = createContext(null)

export function Seo({ title, description, path = '/', image = '/images/hero/hero1.jpg', noindex = false, jsonLd = [] }) {
  const collector = useContext(HeadContext)
  const fullTitle = title ? `${title} | ${SITE.name}` : `${SITE.name} | Professional Development Training Courses in Africa`
  const url = SITE.url + (path === '/' ? '' : path)
  const head = { title: fullTitle, description, url, image: SITE.url + image, noindex, jsonLd: [].concat(jsonLd).filter(Boolean) }
  if (collector) collector.head = head

  useEffect(() => {
    document.title = head.title
    const set = (sel, attr, key, val) => {
      let el = document.head.querySelector(sel)
      if (!el) { el = document.createElement(sel.startsWith('link') ? 'link' : 'meta'); el.setAttribute(attr, key); document.head.appendChild(el) }
      el.setAttribute(sel.startsWith('link') ? 'href' : 'content', val)
    }
    set('meta[name="description"]', 'name', 'description', head.description || '')
    set('link[rel="canonical"]', 'rel', 'canonical', head.url)
    set('meta[property="og:title"]', 'property', 'og:title', head.title)
    set('meta[property="og:description"]', 'property', 'og:description', head.description || '')
    set('meta[property="og:url"]', 'property', 'og:url', head.url)
    set('meta[property="og:image"]', 'property', 'og:image', head.image)
    set('meta[name="robots"]', 'name', 'robots', head.noindex ? 'noindex, nofollow' : 'index, follow')
    document.querySelectorAll('script[data-seo-jsonld]').forEach((n) => n.remove())
    for (const j of head.jsonLd) {
      const s = document.createElement('script')
      s.type = 'application/ld+json'
      s.dataset.seoJsonld = '1'
      s.textContent = JSON.stringify(j)
      document.head.appendChild(s)
    }
  }, [head.title, head.description, head.url, head.image, head.noindex, JSON.stringify(head.jsonLd)])
  return null
}

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

// Used by the prerender script
export function headToHtml(h) {
  if (!h) return ''
  const t = [
    `<meta name="description" content="${esc(h.description)}" />`,
    `<link rel="canonical" href="${esc(h.url)}" />`,
    `<meta name="robots" content="${h.noindex ? 'noindex, nofollow' : 'index, follow'}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${esc(SITE.name)}" />`,
    `<meta property="og:title" content="${esc(h.title)}" />`,
    `<meta property="og:description" content="${esc(h.description)}" />`,
    `<meta property="og:url" content="${esc(h.url)}" />`,
    `<meta property="og:image" content="${esc(h.image)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
  ]
  for (const j of h.jsonLd) t.push(`<script type="application/ld+json" data-seo-jsonld="1">${JSON.stringify(j).replace(/</g, '\\u003c')}</script>`)
  return t.join('\n    ')
}

// ---------- structured data helpers
export const orgLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  name: SITE.legalName,
  alternateName: SITE.name,
  url: SITE.url,
  logo: SITE.url + '/favicon.svg',
  email: SITE.email,
  telephone: SITE.phone,
  address: { '@type': 'PostalAddress', streetAddress: 'Delta Riverside Office Park, Block 2, 3rd Floor, Riverside Drive', postOfficeBoxNumber: '63481-00619', addressLocality: 'Nairobi', addressCountry: 'KE' },
  hasCredential: { '@type': 'EducationalOccupationalCredential', name: 'CPD Certification Service member, provider no. 20263' },
  sameAs: Object.values(SITE.socials),
})

export const crumbsLd = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: SITE.url + it.path })),
})

export const faqLd = (faqs) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.filter((f) => !/\[/.test(f.a)).map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
})
