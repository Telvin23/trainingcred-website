import { Link } from 'react-router-dom'
import { Seo } from '../lib/seo.jsx'

export default function NotFound() {
  return (
    <>
      <Seo title="Page not found" path="/404" noindex description="This page could not be found." />
      <section className="bg-soft">
        <div className="wrap flex flex-col items-start gap-4 py-24">
          <span className="eyebrow text-teal">Error 404</span>
          <h1 className="m-0 text-4xl font-extrabold">We could not find that page</h1>
          <p className="m-0 max-w-xl text-lg text-muted">The course may have moved or the link may be old. Search all courses or go back to the home page.</p>
          <div className="flex flex-wrap gap-3"><Link to="/courses" className="btn-primary">Search courses</Link><Link to="/" className="btn-outline">Home page</Link></div>
        </div>
      </section>
    </>
  )
}
