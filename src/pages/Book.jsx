import { useEffect, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { Seo } from '../lib/seo.jsx'
import { courseBySlug } from '../data/courses.js'
import { upcoming, dateRange, money, where } from '../lib/util.js'
import { PageHero } from '../components/Layout.jsx'
import EnquiryForm from '../components/EnquiryForm.jsx'
import NotFound from './NotFound.jsx'

export default function Book() {
  const { slug } = useParams()
  const [params] = useSearchParams()
  const course = courseBySlug(slug)
  const sessions = course ? upcoming(course) : []
  const [sid, setSid] = useState(sessions[0]?.id || '')
  const [days, setDays] = useState(5)
  const [people, setPeople] = useState(1)
  useEffect(() => { const p = params.get('session'); if (p && sessions.some((s) => s.id === p)) setSid(p) }, [params])
  if (!course) return <NotFound />
  const s = sessions.find((x) => x.id === sid)
  const fee = s ? (days === 10 ? s.fee10 : s.fee5) : null
  const total = fee ? { ...fee, amount: fee.amount * Math.max(1, people) } : null
  const label = s ? `${dateRange(s.start, days === 10 ? s.end10 : s.end5)}, ${where(s)}, ${days} days` : 'Dates to be agreed'

  return (
    <>
      <Seo title={`Reserve a seat - ${course.title}`} path={`/book/${course.slug}`} noindex description={`Reserve a seat on ${course.title}.`} />
      <PageHero crumbs={[{ name: 'Home', path: '/' }, { name: course.title, path: `/courses/${course.slug}` }, { name: 'Reserve a seat', path: `/book/${course.slug}` }]} title="Reserve a seat" intro={course.title} />
      <section>
        <div className="wrap grid gap-8 py-10 lg:grid-cols-[1fr_360px]">
          <div className="card flex flex-col gap-6 p-5 sm:p-7">
            <fieldset className="m-0 border-0 p-0">
              <legend className="mb-3 text-lg font-extrabold">1. Choose a date</legend>
              <div className="flex max-h-[420px] flex-col gap-2 overflow-y-auto pr-1">
                {sessions.map((x) => (
                  <label key={x.id} className="flex min-h-14 cursor-pointer items-center gap-3 rounded-xl border border-line px-4 py-3 has-[:checked]:border-[#F59E0B] has-[:checked]:bg-brand-soft">
                    <input type="radio" name="session" value={x.id} checked={sid === x.id} onChange={() => setSid(x.id)} className="h-4 w-4 accent-[#F59E0B]" />
                    <span className="flex-1"><span className="block font-bold">{dateRange(x.start, x.end5)}</span><span className="text-sm text-muted">{where(x)}{x.format === 'classroom' ? ' · classroom' : ''}</span></span>
                    <span className="font-extrabold text-accent">{money(x.fee5)}</span>
                  </label>
                ))}
                {!sessions.length && <p className="m-0 text-muted">No dates scheduled. Send the form and we will propose dates.</p>}
              </div>
            </fieldset>
            <div className="grid gap-4 sm:grid-cols-2">
              <fieldset className="m-0 border-0 p-0">
                <legend className="mb-3 text-lg font-extrabold">2. Duration</legend>
                <div className="flex gap-2">
                  {course.durations.map((d) => (
                    <label key={d} className="flex min-h-11 flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-line font-bold has-[:checked]:border-[#F59E0B] has-[:checked]:bg-brand-soft">
                      <input type="radio" name="days" checked={days === d} onChange={() => setDays(d)} className="accent-[#F59E0B]" />{d} days
                    </label>
                  ))}
                </div>
              </fieldset>
              <label className="flex flex-col"><span className="mb-3 text-lg font-extrabold">3. Participants</span>
                <input className="input" type="number" min="1" max="200" value={people} onChange={(e) => setPeople(Math.max(1, Number(e.target.value) || 1))} />
              </label>
            </div>
            <div>
              <h2 className="m-0 mb-3 text-lg font-extrabold">4. Your details</h2>
              <EnquiryForm type="booking" fields={['organisation', 'jobTitle', 'country', 'payment', 'message']}
                extra={{ courseSlug: course.slug, courseTitle: course.title, sessionId: s?.id || '', sessionLabel: label, format: s?.format || '', city: s?.city || '', days, participants: people, feeEach: fee ? money(fee) : '', feeTotal: total ? money(total) : '' }}
                submitLabel="Reserve my seat" summary={`I would like to reserve ${people} seat(s) on ${course.title}: ${label}.`} />
            </div>
          </div>
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="card flex flex-col gap-3 p-5">
              <div className="eyebrow text-muted">Your booking</div>
              <div className="text-[17px] font-extrabold leading-snug">{course.title}</div>
              <div className="text-[14.5px] text-muted">{label}</div>
              <div className="flex justify-between border-t border-line pt-3 text-[14.5px]"><span>Fee per participant</span><strong>{fee ? money(fee) : '-'}</strong></div>
              <div className="flex justify-between text-[14.5px]"><span>Participants</span><strong>{people}</strong></div>
              <div className="flex justify-between border-t border-line pt-3 text-lg"><span className="font-bold">Total</span><strong className="text-brand">{total ? money(total) : '-'}</strong></div>
              <p className="m-0 text-[13px] leading-relaxed text-muted">No payment now. We confirm your seat by email and send a proforma invoice. Pay by bank transfer, M-Pesa or card before the course starts.</p>
              <Link to={`/courses/${course.slug}`} className="text-sm font-semibold">Back to course details</Link>
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}
