// Categories and training cities.
// SAMPLE DATA: replace with the real catalogue export later (same shape).

export const CATEGORIES = [
  { slug: 'finance-accounting-treasury', name: 'Finance, Accounting & Treasury', icon: 'Landmark', intro: 'IFRS, budgeting, treasury, financial analysis and public financial management for finance teams.' },
  { slug: 'banking-credit-regulation', name: 'Banking, Credit & Financial Regulation', icon: 'Banknote', intro: 'Credit risk, regulatory compliance, AML and modern banking operations.' },
  { slug: 'health-safety-environment', name: 'Health, Safety, Security & Environment', icon: 'ShieldCheck', intro: 'Occupational safety, security management and environmental compliance.' },
  { slug: 'energy-water-climate', name: 'Energy, Water, Climate & Environment', icon: 'Leaf', intro: 'Climate science and policy, climate finance, renewable energy and water management.' },
  { slug: 'agriculture-food-rural', name: 'Agriculture, Food & Rural Development', icon: 'Sprout', intro: 'Value chains, food security, agribusiness and rural development programmes.' },
  { slug: 'procurement-supply-chain', name: 'Procurement, Supply Chain & Logistics', icon: 'Truck', intro: 'Strategic procurement, contract management, warehousing and logistics.' },
  { slug: 'project-programme-management', name: 'Project, Programme & Portfolio Management', icon: 'KanbanSquare', intro: 'Planning, delivery and control of projects and donor-funded programmes.' },
  { slug: 'monitoring-evaluation', name: 'Monitoring, Evaluation & Data', icon: 'BarChart3', intro: 'M&E systems, impact evaluation, data analysis and reporting.' },
  { slug: 'leadership-management', name: 'Leadership, Management & Strategy', icon: 'Compass', intro: 'Leadership, strategy, change management and management skills.' },
  { slug: 'people-hr-talent', name: 'People, HR & Talent', icon: 'Users', intro: 'HR strategy, performance management, payroll and talent development.' },
  { slug: 'audit-risk-compliance', name: 'Audit, Risk, Compliance & Financial Crime', icon: 'Scale', intro: 'Internal audit, enterprise risk, fraud prevention and governance.' },
  { slug: 'health-systems', name: 'Health Systems & Programme Management', icon: 'HeartPulse', intro: 'Health programme management, supply chains and health financing.' },
  { slug: 'ict-digital-ai', name: 'ICT, Digital & AI', icon: 'Cpu', intro: 'Data protection, cyber security, digital transformation and AI at work.' },
]

// region is used for currency: KE cities quote in KSh, others in USD.
export const CITIES = [
  { slug: 'nairobi', name: 'Nairobi', country: 'Kenya', region: 'KE' },
  { slug: 'mombasa', name: 'Mombasa', country: 'Kenya', region: 'KE' },
  { slug: 'kigali', name: 'Kigali', country: 'Rwanda', region: 'INT' },
  { slug: 'kampala', name: 'Kampala', country: 'Uganda', region: 'INT' },
  { slug: 'zanzibar', name: 'Zanzibar', country: 'Tanzania', region: 'INT' },
  { slug: 'addis-ababa', name: 'Addis Ababa', country: 'Ethiopia', region: 'INT' },
  { slug: 'dubai', name: 'Dubai', country: 'UAE', region: 'INT' },
  { slug: 'cairo', name: 'Cairo', country: 'Egypt', region: 'INT' },
  { slug: 'lagos', name: 'Lagos', country: 'Nigeria', region: 'INT' },
  { slug: 'abuja', name: 'Abuja', country: 'Nigeria', region: 'INT' },
  { slug: 'johannesburg', name: 'Johannesburg', country: 'South Africa', region: 'INT' },
  { slug: 'pretoria', name: 'Pretoria', country: 'South Africa', region: 'INT' },
  { slug: 'cape-town', name: 'Cape Town', country: 'South Africa', region: 'INT' },
]

export const categoryBySlug = (s) => CATEGORIES.find((c) => c.slug === s)
export const cityBySlug = (s) => CITIES.find((c) => c.slug === s)
