// Site-wide facts. Sources: Trainingcred site screenshots (phone, email, stats, formats, fees),
// CPD UK provider listing no. 20263 (address, mission, accreditation), LinkedIn/Facebook pages.
// Items marked CONFIRM in comments are sensible defaults written for the draft; check with Trainingcred.
export const SITE = {
  name: 'WeSkill Training Institute',
  shortName: 'WeSkill',
  legalName: 'WeSkill Training Institute',
  tagline: 'Empowering People, Advancing Careers',
  url: 'https://weskilltraininginstitute.education',
  phone: '+254 759 509615',
  phoneHref: 'tel:+254759509615',
  whatsapp: '254759509615',
  email: 'Learn@weskilltraininginstitute.education',
  address: 'Nairobi, Kenya',
  addressShort: 'Nairobi, Kenya',
  postal: '', // CONFIRM: WeSkill postal address
  mapUrl: 'https://www.google.com/maps/search/?api=1&query=Nairobi+Kenya',
  hours: 'Monday - Friday, 8:00 am - 5:00 pm EAT', // CONFIRM
  trainingHours: '8:30 am - 4:30 pm', // CONFIRM
  // CPD: 20263 is Trainingcred Institute's number, so it is hidden. Put WeSkill's own provider number here to show it again.
  cpd: { body: 'The CPD Certification Service (UK)', provider: '' },
  mission: 'To enhance the impact, effectiveness, and efficiency of social and organizational interventions.',
  approach: ['Assess', 'Engage', 'Empower'],
  stats: { categories: 22, topics: 143, cities: 18 },
  socials: {}, // CONFIRM: WeSkill social pages (Trainingcred's removed)
}

export const waLink = (text) => `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text || 'Hello WeSkill, I would like to ask about a course.')}`

export const HERO_SLIDES = [
  { src: '/images/hero/hero1.jpg', caption: 'Boardroom strategy session' },
  { src: '/images/hero/hero2.jpg', caption: 'Leadership forum' },
  { src: '/images/hero/hero3.jpg', caption: 'Policy workshop' },
  { src: '/images/hero/hero4.jpg', caption: 'High-level dialogue' },
  { src: '/images/hero/hero5.jpg', caption: 'Team design sprint' },
  { src: '/images/hero/hero6.jpg', caption: 'Executive roundtable' },
]

export const FORMATS = [
  { slug: 'classroom', name: 'Classroom', short: 'Face to face in 18 cities, 5 or 10 days.', text: 'Learn with a practitioner trainer and peers from across the region in a fully equipped training venue.' },
  { slug: 'online', name: 'Live online', short: 'Live on Zoom with a trainer.', text: 'The same course delivered live online, with group work, Q&A and course materials.' },
  { slug: 'masterclass', name: 'Masterclasses', short: 'Short expert sessions.', text: 'Focused one or two-day sessions led by senior practitioners on one topic.' },
  { slug: 'webinar', name: 'Webinars', short: 'Free and paid talks.', text: 'Short live talks on current topics, open to everyone.' },
  { slug: 'in-house', name: 'In-house', short: 'Just for your team.', text: 'Any course delivered privately for your organisation, on your dates and in your city.' },
  { slug: 'pathways', name: 'Learning pathways', short: 'Multi-course programmes.', text: 'A sequence of courses that builds one capability across a team over several months.' },
]

export const STEPS = [
  { title: 'Find your course', text: 'Search by topic, city or month, or browse the categories.' },
  { title: 'Pick a format and date', text: 'Classroom in one of 18 cities, live online, or in-house for your team.' },
  { title: 'Reserve a seat', text: 'Book one person or a whole team in two minutes. We confirm by email.' },
  { title: 'Attend and get certified', text: 'Practical sessions, course materials and a certificate on completion.' },
]

export const WHY = [
  { title: 'Practical, not lecture-only', text: 'Case work and tools participants use back at their desks on Monday.' },
  { title: 'Practitioner trainers', text: 'Facilitators who have done the job they teach.' },
  { title: 'Flexible formats and cities', text: 'Classroom, live online or in-house, with dates every month.' },
  ...(SITE.cpd.provider ? [{ title: 'CPD-accredited certificates', text: `Member of ${SITE.cpd.body}, provider no. ${SITE.cpd.provider}.` }] : [{ title: 'Certificate of completion', text: 'Every participant who completes the course receives a certificate.' }]),
]

export const GENERAL_FAQS = [
  { q: 'What does the fee include?', a: 'The fee is per participant and covers tuition, course materials, a CPD-accredited certificate of completion and, for classroom courses, the training venue with lunch and two tea breaks each day. Travel, accommodation and visas are paid by the participant.' },
  ...(SITE.cpd.provider ? [{ q: 'Is the certificate accredited?', a: `Yes. WeSkill Training Institute is a member of The CPD Certification Service (UK), provider number ${SITE.cpd.provider}. Participants who complete the course receive a certificate of completion with the CPD hours attended.` }] : []),
  { q: 'Can you run a course just for our team?', a: 'Yes. Any course can run in-house on your dates, at your premises, in a venue of your choice or online, and we adapt the content to your sector. Request a team quote and we reply within one working day.' },
  { q: 'How do I pay?', a: 'After you reserve, we send a proforma invoice. You can pay by bank transfer, M-Pesa or card. Payment is due before the course starts; organisations that need a purchase order or a letter of undertaking can ask us for terms.' },
  { q: 'Can I change my date or cancel?', a: 'You can move to another date or format, or send a colleague in your place, at no cost up to 7 days before the start. Cancellations made at least 14 days before the start are refunded less a 10% administration fee; after that the fee can be used for a later course within 12 months.' },
  { q: 'Do you help with visas and invitation letters?', a: 'Yes. Once your seat is confirmed we issue an official invitation letter for your visa application, plus joining instructions with the venue, hotel suggestions and airport pickup options.' },
]

export const ADVISORY = [
  { title: 'Organisational strategy', text: 'Strategic plans, theory of change and results frameworks.' },
  { title: 'Monitoring, evaluation & learning', text: 'Baseline, midline and end-line evaluations, MEL systems and dashboards.' },
  { title: 'Financial management', text: 'Policies, controls, donor compliance and audit readiness.' },
  { title: 'Procurement & supply chain', text: 'Procurement manuals, supplier frameworks and process reviews.' },
  { title: 'HR & organisational development', text: 'Structures, job evaluation, performance systems and policies.' },
  { title: 'Climate & environment', text: 'Climate risk screening, ESIA support and climate finance proposals.' },
  { title: 'Training needs analysis', text: 'Find the skills gaps that matter and plan the learning to close them.' },
]
