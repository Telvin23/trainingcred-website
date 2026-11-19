import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Phone, Mail, MapPin, Clock, MessageCircle, Building2, Route, Users, Target, ClipboardList, Presentation } from 'lucide-react'
import { Seo, crumbsLd, faqLd, orgLd } from '../lib/seo.jsx'
import { SITE, GENERAL_FAQS, ADVISORY, WHY, waLink } from '../data/site.js'
import { PageHero } from '../components/Layout.jsx'
import { FaqList } from '../components/Bits.jsx'
import EnquiryForm from '../components/EnquiryForm.jsx'

export function ForTeams() {
  const [params] = useSearchParams()
  const [topic, setTopic] = useState('')
  useEffect(() => { setTopic(params.get('topic') || '') }, [params])
  return (
    <>
      <Seo title="In-house Training and Learning Pathways for Teams" path="/for-teams" description="Run any Trainingcred course privately for your team, on your dates, in your city or online. Group rates, tailored content and learning pathways. Quote within one working day."
        jsonLd={crumbsLd([{ name: 'Home', path: '/' }, { name: 'For Teams', path: '/for-teams' }])} />
      <PageHero crumbs={[{ name: 'Home', path: '/' }, { name: 'For Teams', path: '/for-teams' }]} eyebrow="For organisations" title="Training built around your team"
        intro="Any course can run in-house on your dates, in your city or online, adapted to your sector and goals. Five or more people from one organisation also get group rates on public dates.">
        <a href="#quote" className="btn-white mt-2 self-start">Request a team quote</a>
      </PageHero>
      <section className="bg-white">
        <div className="wrap grid gap-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
          {[[Building2, 'In-house courses', 'Any course, delivered privately at your premises, a venue of your choice or online.'], [Route, 'Learning pathways', 'A sequence of courses that builds one capability over several months.'], [Users, 'Group bookings', 'Five or more people on public dates, with one invoice and group rates.'], [Target, 'Tailored content', 'Your cases, your policies and your systems built into the exercises.']].map(([I, t, d]) => (
            <div key={t} className="card p-5"><I size={26} className="text-teal" aria-hidden="true" /><h2 className="m-0 mt-3 text-[17px] font-extrabold">{t}</h2><p className="m-0 mt-1.5 text-[14.5px] leading-relaxed text-muted">{d}</p></div>
          ))}
        </div>
      </section>
      <section className="bg-soft">
        <div className="wrap grid gap-10 py-12 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <h2 className="h2 m-0">How a team programme works</h2>
            <ol className="m-0 mt-5 flex list-none flex-col gap-4 p-0">
              {['Tell us the topic, team size, dates and location.', 'We propose an outline, trainer and fee within one working day.', 'We adapt the content after a short call with your team lead.', 'We deliver, assess participants and send a short training report.'].map((t, n) => (
                <li key={t} className="flex gap-3.5"><span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-teal font-extrabold text-white">{n + 1}</span><span className="pt-1.5 text-[15.5px]">{t}</span></li>
              ))}
            </ol>
          </div>
          <div id="quote" className="card scroll-mt-28 p-5 sm:p-7">
            <h2 className="m-0 mb-1 text-[22px] font-extrabold">Request a team quote</h2>
            <p className="m-0 mb-5 text-[14.5px] text-muted">We reply within one working day.</p>
            <EnquiryForm key={topic} type="team" fields={['organisation', 'jobTitle', 'country', 'participants', 'topic', 'preferredDates', 'preferredCity', 'message']}
              extra={{ topic, defaultParticipants: 10 }} submitLabel="Request my quote" summary="I would like a quote for team training." />
          </div>
        </div>
      </section>
    </>
  )
}

export function Advisory() {
  return (
    <>
      <Seo title="Advisory Services" path="/advisory" description="Advisory services for consequential decisions: strategy, monitoring and evaluation, financial management, procurement, HR and climate." />
      <PageHero crumbs={[{ name: 'Home', path: '/' }, { name: 'Advisory', path: '/advisory' }]} eyebrow="Advisory" title="Advisory services for consequential decisions"
        intro="Practical support from practitioners for the decisions that shape your organisation, from strategy and evaluation to systems and policies." />
      <section className="bg-white">
        <div className="wrap grid gap-4 py-12 sm:grid-cols-2 lg:grid-cols-3">
          {ADVISORY.map((a) => (
            <div key={a.title} className="card p-5"><ClipboardList size={24} className="text-teal" aria-hidden="true" /><h2 className="m-0 mt-3 text-[17px] font-extrabold">{a.title}</h2><p className="m-0 mt-1.5 text-[14.5px] leading-relaxed text-muted">{a.text}</p></div>
          ))}
        </div>
      </section>
      <section className="bg-soft">
        <div className="wrap grid gap-10 py-12 lg:grid-cols-[1fr_1.2fr]">
          <div><h2 className="h2 m-0">Talk to an advisor</h2><p className="mt-3 text-[16px] leading-relaxed text-muted">Tell us what you are working on. We will reply with how we would approach it, the team and an indicative budget.</p>
            <a href={waLink('Hello Trainingcred, I would like to discuss an advisory assignment.')} target="_blank" rel="noopener noreferrer" className="btn-outline mt-2"><MessageCircle size={18} aria-hidden="true" />WhatsApp us</a></div>
          <div className="card p-5 sm:p-7"><EnquiryForm type="advisory" fields={['organisation', 'jobTitle', 'country', 'topic', 'message']} submitLabel="Send request" summary="I would like to discuss an advisory assignment." /></div>
        </div>
      </section>
    </>
  )
}

export function About() {
  return (
    <>
      <Seo title="About Trainingcred" path="/about" description="Trainingcred Institute delivers practical professional development courses, in-house programmes and advisory across Africa and the Middle East." jsonLd={orgLd()} />
      <PageHero crumbs={[{ name: 'Home', path: '/' }, { name: 'About', path: '/about' }]} title="About Trainingcred" intro="Skills for the modern workforce: practical courses that change how people work on Monday morning." />
      <section className="bg-white">
        <div className="wrap grid gap-10 py-12 lg:grid-cols-2">
          <div className="text-[16px] leading-[1.75]">
            <p className="mt-0">Trainingcred Institute runs short professional courses for organisations across Africa and beyond: governments, NGOs and development partners, banks, and private companies. [Founding year, story and mission - confirm.]</p>
            <p>Our courses run as classroom sessions in {SITE.stats.cities} cities, live online, and in-house for teams. Every course is led by a practitioner trainer and built around exercises participants can use straight away.</p>
            <p>[Accreditation, memberships and partner institutions - add here.]</p>
          </div>
          <img src="/images/hero/hall.jpg" alt="Participants in a Trainingcred lecture hall" className="w-full rounded-3xl object-cover" loading="lazy" width="1200" height="675" />
        </div>
      </section>
      <section className="bg-soft">
        <div className="wrap grid gap-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
          {WHY.map((w) => <div key={w.title} className="card p-5"><Presentation size={24} className="text-teal" aria-hidden="true" /><h2 className="m-0 mt-3 text-[17px] font-extrabold">{w.title}</h2><p className="m-0 mt-1.5 text-[14.5px] leading-relaxed text-muted">{w.text}</p></div>)}
        </div>
      </section>
    </>
  )
}

export function Contact() {
  return (
    <>
      <Seo title="Contact Us" path="/contact" description={`Call or WhatsApp ${SITE.phone}, email ${SITE.email}, or send us a message. We reply within one working day.`} jsonLd={orgLd()} />
      <PageHero crumbs={[{ name: 'Home', path: '/' }, { name: 'Contact', path: '/contact' }]} title="Contact us" intro="Questions about a course, dates, fees or a team programme? We reply within one working day." />
      <section className="bg-soft">
        <div className="wrap grid gap-8 py-12 lg:grid-cols-[1fr_1.4fr]">
          <div className="flex flex-col gap-3">
            {[[MessageCircle, 'WhatsApp', SITE.phone, waLink()], [Phone, 'Call', SITE.phone, SITE.phoneHref], [Mail, 'Email', SITE.email, `mailto:${SITE.email}`], [MapPin, 'Office', SITE.address], [Clock, 'Hours', SITE.hours]].map(([I, k, v, href]) => (
              <div key={k} className="card flex gap-4 p-4"><span className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-mint text-teal"><I size={20} aria-hidden="true" /></span>
                <div><div className="text-[13px] text-muted">{k}</div>{href ? <a href={href} className="font-bold" {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{v}</a> : <div className="font-bold">{v}</div>}</div></div>
            ))}
          </div>
          <div className="card p-5 sm:p-7"><h2 className="m-0 mb-5 text-[22px] font-extrabold">Send us a message</h2><EnquiryForm type="contact" fields={['organisation', 'topic', 'message']} submitLabel="Send message" summary="" /></div>
        </div>
      </section>
    </>
  )
}

export function Faq() {
  const all = [
    ...GENERAL_FAQS,
    { q: 'Where are classroom courses held?', a: 'In professional training venues in each city. The venue is confirmed in your joining instructions about two weeks before the course. [Confirm.]' },
    { q: 'What do I need for a live online course?', a: 'A laptop with a camera, a stable internet connection and Zoom. We send the joining link and materials before day one.' },
    { q: 'Can I get a quote or proforma invoice for approval?', a: 'Yes. Reserve a seat or contact us and we will send a proforma invoice the same day.' },
  ]
  return (
    <>
      <Seo title="Frequently Asked Questions" path="/faq" description="Answers about fees, certificates, payment, venues, live online courses and in-house training." jsonLd={faqLd(all)} />
      <PageHero crumbs={[{ name: 'Home', path: '/' }, { name: 'FAQ', path: '/faq' }]} title="Frequently asked questions" />
      <section className="bg-white"><div className="wrap py-12"><div className="mx-auto max-w-[900px]"><FaqList faqs={all} /><p className="mt-6 text-muted">Still have a question? <Link to="/contact">Contact us</Link>.</p></div></div></section>
    </>
  )
}

export function Legal({ kind }) {
  const privacy = kind === 'privacy'
  return (
    <>
      <Seo title={privacy ? 'Privacy Notice' : 'Terms and Conditions'} path={privacy ? '/privacy' : '/terms'} description={privacy ? 'How Trainingcred collects and uses personal data.' : 'Terms for booking Trainingcred courses.'} />
      <PageHero crumbs={[{ name: 'Home', path: '/' }, { name: privacy ? 'Privacy' : 'Terms', path: privacy ? '/privacy' : '/terms' }]} title={privacy ? 'Privacy notice' : 'Terms and conditions'} />
      <section className="bg-white">
        <div className="wrap py-12"><div className="mx-auto max-w-[820px] text-[16px] leading-[1.75]">
          <p className="rounded-xl bg-amber-50 p-4 text-[14.5px]">Draft for review: have this text checked and completed by Trainingcred before the site goes live.</p>
          {privacy ? (<>
            <h2 className="text-xl font-extrabold">What we collect</h2><p>When you reserve a seat, request a quote or contact us, we collect your name, email, phone number, organisation, job title, country and the details of your request.</p>
            <h2 className="text-xl font-extrabold">How we use it</h2><p>Only to respond to your request, manage your booking and invoice, and send joining instructions. We do not sell your data. We send course updates only if you ask for them.</p>
            <h2 className="text-xl font-extrabold">Where it is stored and for how long</h2><p>In a secure database used only by Trainingcred staff. [Retention period - confirm.]</p>
            <h2 className="text-xl font-extrabold">Your rights</h2><p>Under the Kenya Data Protection Act, 2019 you can ask to see, correct or delete your data. Email {SITE.email}.</p>
          </>) : (<>
            <h2 className="text-xl font-extrabold">Bookings</h2><p>A seat is reserved when we confirm it by email. Fees are per participant. [Payment terms - confirm.]</p>
            <h2 className="text-xl font-extrabold">Changes and cancellations</h2><p>[Transfer, substitution and cancellation policy - confirm.]</p>
            <h2 className="text-xl font-extrabold">Course changes</h2><p>We may change a trainer or venue where needed and will tell you in advance. If we cancel a course you can transfer or receive a full refund.</p>
            <h2 className="text-xl font-extrabold">Certificates</h2><p>Certificates are issued to participants who attend the full course.</p>
          </>)}
        </div></div>
      </section>
    </>
  )
}
