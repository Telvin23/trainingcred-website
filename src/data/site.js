// Site-wide facts. Items in [brackets] are placeholders to confirm before launch.
export const SITE = {
  name: 'Trainingcred',
  legalName: 'Trainingcred Institute',
  tagline: 'Skills for the Modern Workforce',
  url: 'https://www.trainingcred.com',
  phone: '+254 759 509615',
  phoneHref: 'tel:+254759509615',
  whatsapp: '254759509615',
  email: 'info@trainingcred.com',
  address: '[Office address], Nairobi, Kenya',
  hours: 'Mon - Fri, 8:00 - 17:00 EAT',
  stats: { categories: 22, topics: 143, cities: 18, participants: '[000+]' },
  socials: {
    facebook: 'https://www.facebook.com/',
    linkedin: 'https://www.linkedin.com/',
    instagram: 'https://www.instagram.com/',
    x: 'https://x.com/',
    tiktok: 'https://www.tiktok.com/',
  },
}

export const waLink = (text) => `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text || 'Hello Trainingcred, I would like to ask about a course.')}`

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
  { title: 'Clear fees', text: 'Per-participant fees shown upfront, including tuition and materials.' },
]

export const GENERAL_FAQS = [
  { q: 'What does the fee include?', a: 'Fees are per participant and include tuition, course materials and the certificate. Classroom sessions also include [lunch and refreshments - confirm]. Travel and accommodation are not included.' },
  { q: 'Do I get a certificate?', a: 'Yes. Every participant who completes the course receives a Trainingcred certificate of completion.' },
  { q: 'Can you run a course just for our team?', a: 'Yes. Choose In-house training or a Learning pathway and we will build the outline, dates and venue around you. Request a team quote and we reply within one working day.' },
  { q: 'How do I pay?', a: '[Bank transfer, M-Pesa or card - confirm the options and when payment is due.] We send an invoice once your seat is confirmed.' },
  { q: 'Can I change my date or format after booking?', a: '[Your transfer and cancellation policy.]' },
  { q: 'Do you help with visas and invitation letters?', a: '[Confirm: we issue invitation letters for classroom participants on request.]' },
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
