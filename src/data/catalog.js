// Focus areas and training cities, based on the Trainingcred site (mega menu, footer and course-schedule URLs).
// `old` = category URL on the current trainingcred.com, kept for 301 redirects (see vercel.json).

export const CATEGORIES = [
  { slug: 'finance-accounting-treasury', tint: ['#0B5A86', '#0E8F7E'], name: 'Finance, Accounting & Treasury', icon: 'Landmark', intro: 'Financial analysis and modelling, investment appraisal, donor-funded project finance and treasury for finance teams.' },
  { slug: 'banking-credit-regulation', tint: ['#1E3A8A', '#0B5A86'], name: 'Banking, Credit & Financial Regulation', icon: 'Banknote', intro: 'International and Islamic banking, credit, digital payments and financial regulation.' },
  { slug: 'health-safety-environment', tint: ['#B45309', '#0E6B5C'], name: 'Health, Safety, Security & Environment', icon: 'ShieldCheck', intro: 'Workplace safety, security systems, first response, wellbeing and emergency management.' },
  { slug: 'energy-water-climate-environment', old: 'energy-water-climate-environment', tint: ['#047857', '#0E7490'], name: 'Energy, Water, Climate & Environment', icon: 'Leaf', intro: 'Climate science and policy, renewable energy, ecosystem restoration and environmental management.' },
  { slug: 'agriculture-food-rural', tint: ['#4D7C0F', '#0E6B5C'], name: 'Agriculture, Food & Rural Development', icon: 'Sprout', intro: 'Agricultural extension, rural finance, value chains and food security programmes.' },
  { slug: 'facilities-assets-property', tint: ['#9A3412', '#0B5A86'], name: 'Facilities, Assets & Property', icon: 'Building', intro: 'Real estate development and investment, facilities, smart buildings and asset management.' },
  { slug: 'health-systems', tint: ['#B91C1C', '#0E6B5C'], name: 'Health Systems & Programme Management', icon: 'HeartPulse', intro: 'Health information systems, health programme management and data for decisions.' },
  { slug: 'procurement-supply-chain', tint: ['#7C3AED', '#0B5A86'], name: 'Procurement, Supply Chain & Logistics', icon: 'Truck', intro: 'Strategic sourcing, sustainable procurement, transport, fleet and logistics management.' },
  { slug: 'monitoring-evaluation-accountability-and-learning', old: 'monitoring-evaluation-accountability-and-learning', tint: ['#0369A1', '#7C3AED'], name: 'Monitoring, Evaluation, Accountability & Learning', icon: 'BarChart3', intro: 'MEAL systems, results frameworks, data collection, analysis and knowledge management.' },
  { slug: 'project-programme-management', tint: ['#0E7490', '#1D4ED8'], name: 'Project, Grants & Programme Management', icon: 'KanbanSquare', intro: 'Project planning and delivery, grant management and donor compliance.' },
  { slug: 'leadership-management', tint: ['#B45309', '#9D174D'], name: 'Leadership, Management & Strategy', icon: 'Compass', intro: 'Executive and cross-border leadership, governance, culture and corporate social responsibility.' },
  { slug: 'people-hr-talent', tint: ['#BE185D', '#7C3AED'], name: 'People, HR & Personal Effectiveness', icon: 'Users', intro: 'Talent development, communication, presentation, motivation and goal setting.' },
  { slug: 'public-sector-law-governance', tint: ['#334155', '#0B5A86'], name: 'Public Sector, Law & Governance', icon: 'Scale', intro: 'Commercial law, public communications, corporate governance and board competence.' },
  { slug: 'ict-digital-ai', tint: ['#4338CA', '#0E7490'], name: 'ICT, Data, Digital & AI', icon: 'Cpu', intro: 'AI and knowledge systems, blockchain, ERP, data protection and productivity software.' },
  { slug: 'hospitality-tourism-travel', tint: ['#C2410C', '#BE185D'], name: 'Hospitality, Tourism & Travel', icon: 'Plane', intro: 'Front office, housekeeping, online travel distribution and corporate travel management.' },
  { slug: 'sales-marketing-customer', tint: ['#DB2777', '#F59E0B'], name: 'Sales, Marketing & Customer Experience', icon: 'TrendingUp', intro: 'Customer experience, sales closing techniques and commercial skills.' },
]

// region decides the currency shown: KE cities in KSh, the rest in USD.
export const CITIES = [
  { slug: 'nairobi', name: 'Nairobi', country: 'Kenya', region: 'KE' },
  { slug: 'mombasa', name: 'Mombasa', country: 'Kenya', region: 'KE' },
  { slug: 'naivasha', name: 'Naivasha', country: 'Kenya', region: 'KE' },
  { slug: 'kisumu', name: 'Kisumu', country: 'Kenya', region: 'KE' },
  { slug: 'kigali', name: 'Kigali', country: 'Rwanda', region: 'INT' },
  { slug: 'kampala', name: 'Kampala', country: 'Uganda', region: 'INT' },
  { slug: 'zanzibar', name: 'Zanzibar', country: 'Tanzania', region: 'INT' },
  { slug: 'dar-es-salaam', name: 'Dar es Salaam', country: 'Tanzania', region: 'INT' },
  { slug: 'addis-ababa', name: 'Addis Ababa', country: 'Ethiopia', region: 'INT' },
  { slug: 'accra', name: 'Accra', country: 'Ghana', region: 'INT' },
  { slug: 'lagos', name: 'Lagos', country: 'Nigeria', region: 'INT' },
  { slug: 'abuja', name: 'Abuja', country: 'Nigeria', region: 'INT' },
  { slug: 'johannesburg', name: 'Johannesburg', country: 'South Africa', region: 'INT' },
  { slug: 'pretoria', name: 'Pretoria', country: 'South Africa', region: 'INT' },
  { slug: 'cape-town', name: 'Cape Town', country: 'South Africa', region: 'INT' },
  { slug: 'cairo', name: 'Cairo', country: 'Egypt', region: 'INT' },
  { slug: 'dubai', name: 'Dubai', country: 'UAE', region: 'INT' },
]

export const categoryBySlug = (s) => CATEGORIES.find((c) => c.slug === s)
export const cityBySlug = (s) => CITIES.find((c) => c.slug === s)
