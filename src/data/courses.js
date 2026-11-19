// SAMPLE COURSES (about 20) so every page can be built and tested.
// Titles are typical Trainingcred topics; outlines, cities, dates and fees are SAMPLE values
// to be replaced by the real catalogue (same shape) before launch.
import { cityBySlug } from './catalog.js'

const C = (slug, title, category, summary, outcomes, audience, modules, opts = {}) => ({
  slug, title, category, summary, outcomes, audience,
  modules: modules.map(([t, d]) => ({ title: t, text: d })),
  durations: opts.durations || [5, 10],
  popular: !!opts.popular,
  classroomCities: opts.cities || ['nairobi', 'kigali', 'dubai'],
  selfPaced: false,
})

const RAW = [
  C('role-of-ipcc-in-climate-science-and-policy', 'The Role of IPCC in Climate Science and Policy', 'energy-water-climate',
    'Understand how IPCC assessments are produced, how to read them, and how to turn their findings into policy, programme design and funding proposals.',
    ['Explain how IPCC working groups, assessment reports and summaries for policymakers are produced and approved', 'Read IPCC scenarios, confidence language and regional findings for Africa', 'Use IPCC evidence in policy briefs, NDC updates and national adaptation plans', 'Strengthen climate finance proposals with credible, cited science', 'Communicate climate risk clearly to decision makers'],
    ['Climate and environment officers', 'Policy analysts', 'NGO programme staff', 'Researchers', 'Government planners', 'Climate finance teams'],
    [['How the IPCC works', 'Mandate, working groups, the assessment cycle and approval of the summaries.'], ['The physical science basis', 'Warming, emissions pathways and what the scenarios mean.'], ['Impacts, adaptation and vulnerability', 'Regional risks for Africa: water, agriculture, health, cities and ecosystems.'], ['Mitigation pathways', 'Energy, land use and sector options, and what net zero requires.'], ['From science to policy', 'Using IPCC evidence in NDCs, national plans and negotiation positions.'], ['Climate finance and communication', 'Fundable proposals and explaining climate risk to non-specialists.']],
    { popular: true, cities: ['cairo', 'nairobi', 'kigali', 'dubai'] }),
  C('climate-finance-and-proposal-writing', 'Climate Finance and Proposal Writing', 'energy-water-climate',
    'Learn how climate funds work and write concept notes and proposals that meet GCF, GEF and Adaptation Fund requirements.',
    ['Map the main climate funds and their access modalities', 'Build a climate rationale backed by evidence', 'Design a logical framework and results indicators', 'Prepare budgets and co-financing plans', 'Write a complete concept note'],
    ['Project developers', 'NGO and government staff', 'Consultants', 'Accredited entity staff'],
    [['The climate finance landscape', 'GCF, GEF, Adaptation Fund, bilateral and private sources.'], ['Climate rationale', 'Linking risk data to the proposed intervention.'], ['Theory of change and logframe', 'Results chains, indicators and targets.'], ['Budgeting and co-finance', 'Costing, financial models and co-financing letters.'], ['Safeguards and gender', 'Environmental, social and gender requirements.'], ['Writing workshop', 'Draft and review a concept note with trainer feedback.']],
    { popular: true, cities: ['nairobi', 'zanzibar', 'kigali'] }),
  C('ifrs-for-finance-professionals', 'IFRS for Finance Professionals', 'finance-accounting-treasury',
    'A practical update on International Financial Reporting Standards, with worked examples for preparing compliant financial statements.',
    ['Apply the key IFRS standards to common transactions', 'Prepare and present IFRS-compliant financial statements', 'Account for leases, revenue and financial instruments', 'Explain recent and upcoming changes in IFRS', 'Prepare for audit questions on IFRS treatment'],
    ['Accountants', 'Finance managers', 'Auditors', 'Financial controllers'],
    [['The IFRS framework', 'Conceptual framework and presentation of financial statements.'], ['Revenue (IFRS 15)', 'The five-step model with case examples.'], ['Leases (IFRS 16)', 'Recognition, measurement and disclosure.'], ['Financial instruments (IFRS 9)', 'Classification, impairment and hedging basics.'], ['Group accounts', 'Consolidation essentials.'], ['Disclosures and updates', 'Recent amendments and sustainability reporting (IFRS S1/S2).']],
    { popular: true, cities: ['nairobi', 'mombasa', 'dubai', 'johannesburg'] }),
  C('budgeting-and-financial-planning', 'Budgeting, Forecasting and Financial Planning', 'finance-accounting-treasury',
    'Build realistic budgets and rolling forecasts and use them to steer decisions.',
    ['Build zero-based and incremental budgets', 'Create rolling forecasts in Excel', 'Analyse variances and explain them', 'Link budgets to strategy and KPIs', 'Present financial plans to non-finance managers'],
    ['Finance officers', 'Budget holders', 'Programme managers', 'Business analysts'],
    [['Budgeting approaches', 'Incremental, zero-based and activity-based budgeting.'], ['Forecasting', 'Drivers, rolling forecasts and scenarios.'], ['Excel modelling', 'Structured models and checks.'], ['Variance analysis', 'Finding and explaining the gaps.'], ['Performance management', 'KPIs and dashboards.'], ['Presenting the numbers', 'Telling the story behind the budget.']],
    { cities: ['nairobi', 'kampala', 'kigali'] }),
  C('grant-management-and-donor-compliance', 'Grant Management and Donor Compliance', 'project-programme-management',
    'Manage donor-funded grants from award to close-out while staying compliant with USAID, EU, FCDO and UN rules.',
    ['Interpret grant agreements and donor regulations', 'Set up grant budgets and cost allocation', 'Manage sub-grants and partner compliance', 'Prepare donor financial and narrative reports', 'Get ready for audits and close-out'],
    ['Grant managers', 'Finance officers', 'Programme managers', 'Compliance officers'],
    [['The grant lifecycle', 'From award to close-out.'], ['Donor rules', 'USAID, EU, FCDO and UN requirements compared.'], ['Budget management', 'Cost allocation, budget realignment and cost share.'], ['Sub-grants', 'Partner assessment and monitoring.'], ['Reporting', 'Financial and narrative reports donors accept.'], ['Audit and close-out', 'Audit readiness and closing a grant cleanly.']],
    { popular: true, cities: ['nairobi', 'kigali', 'addis-ababa'] }),
  C('project-management-professional-pmp-prep', 'Project Management Professional (PMP) Exam Preparation', 'project-programme-management',
    'Prepare for the PMP exam with the current exam content outline, practice questions and study plan.',
    ['Understand the PMP exam content outline', 'Apply predictive, agile and hybrid approaches', 'Answer situational exam questions', 'Complete the 35 contact hours requirement', 'Follow a realistic study plan to exam day'],
    ['Project managers', 'Team leads', 'Engineers', 'Consultants'],
    [['People domain', 'Leading teams and stakeholders.'], ['Process domain', 'Scope, schedule, cost, quality and risk.'], ['Business environment', 'Compliance, value and organisational change.'], ['Agile and hybrid', 'Scrum, Kanban and hybrid delivery.'], ['Exam practice', 'Timed practice questions with review.'], ['Study plan', 'Application process and the road to exam day.']],
    { durations: [5, 10], cities: ['nairobi', 'dubai', 'lagos'] }),
  C('monitoring-and-evaluation-of-projects', 'Monitoring and Evaluation of Projects and Programmes', 'monitoring-evaluation',
    'Design and run an M&E system that produces data managers actually use.',
    ['Design results frameworks and indicators', 'Develop M&E plans and data collection tools', 'Collect data with mobile tools', 'Analyse and visualise results', 'Plan and manage evaluations'],
    ['M&E officers', 'Programme managers', 'Researchers', 'Donor-funded project staff'],
    [['M&E foundations', 'Theory of change and results chains.'], ['Indicators', 'SMART indicators and reference sheets.'], ['Data collection', 'Tools, sampling and mobile data collection.'], ['Data analysis', 'Excel, dashboards and data quality.'], ['Evaluation', 'Designs, terms of reference and managing evaluators.'], ['Learning and use', 'Turning data into decisions.']],
    { popular: true, cities: ['nairobi', 'kigali', 'kampala', 'zanzibar'] }),
  C('data-analysis-with-power-bi', 'Data Analysis and Visualisation with Power BI', 'monitoring-evaluation',
    'Turn spreadsheets into interactive dashboards with Power BI.',
    ['Clean and model data in Power Query', 'Write essential DAX measures', 'Build interactive dashboards', 'Share reports securely', 'Design dashboards people understand'],
    ['Analysts', 'M&E officers', 'Finance staff', 'Managers who report on data'],
    [['Getting data in', 'Power Query and data cleaning.'], ['Data models', 'Relationships and star schemas.'], ['DAX essentials', 'Measures, time intelligence and context.'], ['Visuals', 'Choosing the right chart.'], ['Dashboards', 'Layout, filters and drill-through.'], ['Publishing', 'Power BI service, sharing and refresh.']],
    { cities: ['nairobi', 'dubai', 'kigali'] }),
  C('strategic-procurement-and-contract-management', 'Strategic Procurement and Contract Management', 'procurement-supply-chain',
    'Plan procurement strategically, run fair tenders and manage contracts to deliver value.',
    ['Develop category and procurement strategies', 'Run compliant competitive tenders', 'Evaluate bids and negotiate', 'Draft and manage contracts and KPIs', 'Manage supplier risk and performance'],
    ['Procurement officers', 'Supply chain managers', 'Contract managers', 'User departments'],
    [['Strategic procurement', 'Spend analysis and category strategy.'], ['Tendering', 'Methods, documents and timelines.'], ['Evaluation and negotiation', 'Fair evaluation and negotiation skills.'], ['Contract drafting', 'Key clauses and risk allocation.'], ['Contract management', 'KPIs, variations and disputes.'], ['Supplier relationships', 'Performance reviews and development.']],
    { popular: true, cities: ['nairobi', 'mombasa', 'dubai'] }),
  C('warehouse-and-inventory-management', 'Warehouse and Inventory Management', 'procurement-supply-chain',
    'Run efficient warehouses and keep the right stock at the right cost.',
    ['Design warehouse layout and flows', 'Apply inventory control methods', 'Use stock KPIs and cycle counting', 'Reduce losses and obsolete stock', 'Plan for warehouse safety'],
    ['Store and warehouse staff', 'Inventory controllers', 'Logistics officers'],
    [['Warehouse operations', 'Receiving, storage, picking and dispatch.'], ['Inventory methods', 'ABC, EOQ and reorder points.'], ['Stock control', 'Cycle counts and reconciliation.'], ['Systems', 'WMS and barcoding basics.'], ['Loss prevention', 'Shrinkage and obsolete stock.'], ['Safety', 'Safe storage and handling.']],
    { cities: ['mombasa', 'nairobi', 'lagos'] }),
  C('leadership-and-change-management', 'Leadership and Change Management', 'leadership-management',
    'Lead people through change with clarity, confidence and practical tools.',
    ['Understand your leadership style', 'Lead and communicate change', 'Handle resistance constructively', 'Build team engagement', 'Make better decisions under pressure'],
    ['Managers', 'Team leaders', 'Senior officers moving into leadership'],
    [['Leadership foundations', 'Styles, values and self-awareness.'], ['Leading change', 'Models and a practical change plan.'], ['Communication', 'Messages that land.'], ['Resistance', 'Working with concerns.'], ['Teams', 'Trust, engagement and performance.'], ['Decision making', 'Tools for complex decisions.']],
    { popular: true, cities: ['nairobi', 'dubai', 'cape-town', 'zanzibar'] }),
  C('strategic-planning-and-execution', 'Strategic Planning and Execution', 'leadership-management',
    'Develop a strategic plan and turn it into results with clear priorities and tracking.',
    ['Analyse the strategic environment', 'Set vision, goals and priorities', 'Translate strategy into annual plans', 'Track performance with a balanced scorecard', 'Review and adapt strategy'],
    ['Senior managers', 'Strategy and planning officers', 'Board members'],
    [['Strategic analysis', 'PESTEL, SWOT and stakeholder mapping.'], ['Direction', 'Vision, mission and goals.'], ['Strategic choices', 'Prioritisation and trade-offs.'], ['Execution', 'Operational plans and budgets.'], ['Performance tracking', 'Balanced scorecard and OKRs.'], ['Review', 'Learning and adaptation.']],
    { cities: ['nairobi', 'kigali', 'dubai'] }),
  C('hr-management-and-performance', 'HR Management and Performance Systems', 'people-hr-talent',
    'Strengthen core HR practice and build performance systems people trust.',
    ['Apply core HR processes and policies', 'Design performance management systems', 'Set objectives and run appraisals', 'Handle discipline and grievances fairly', 'Use HR data for decisions'],
    ['HR officers', 'HR managers', 'Line managers'],
    [['HR foundations', 'Policies and employment law basics.'], ['Recruitment', 'Competency-based selection.'], ['Performance systems', 'Objectives, reviews and ratings.'], ['Employee relations', 'Discipline and grievances.'], ['Reward', 'Pay structures and benefits.'], ['HR analytics', 'Measuring what matters.']],
    { cities: ['nairobi', 'kampala', 'johannesburg'] }),
  C('internal-audit-and-risk-based-auditing', 'Internal Audit and Risk-Based Auditing', 'audit-risk-compliance',
    'Plan and deliver risk-based audits in line with the Global Internal Audit Standards.',
    ['Apply the Global Internal Audit Standards', 'Build a risk-based audit plan', 'Test controls and gather evidence', 'Write clear audit reports', 'Follow up on audit findings'],
    ['Internal auditors', 'Risk officers', 'Audit committee members'],
    [['Standards', 'Global Internal Audit Standards overview.'], ['Risk assessment', 'Audit universe and risk-based planning.'], ['Fieldwork', 'Testing controls and sampling.'], ['Evidence', 'Working papers and documentation.'], ['Reporting', 'Findings that drive action.'], ['Follow-up', 'Tracking implementation.']],
    { cities: ['nairobi', 'dubai', 'kigali'] }),
  C('anti-money-laundering-and-compliance', 'Anti-Money Laundering and Compliance', 'banking-credit-regulation',
    'Prevent, detect and report money laundering and terrorist financing.',
    ['Explain AML/CFT laws and FATF standards', 'Apply customer due diligence and KYC', 'Spot red flags and typologies', 'File suspicious transaction reports', 'Build a risk-based compliance programme'],
    ['Compliance officers', 'Bank staff', 'SACCO and fintech staff', 'Auditors'],
    [['The AML framework', 'FATF, local law and regulators.'], ['KYC and CDD', 'Onboarding and enhanced due diligence.'], ['Typologies', 'How money is laundered.'], ['Monitoring', 'Transaction monitoring and red flags.'], ['Reporting', 'STRs and record keeping.'], ['Compliance programmes', 'Risk-based approach and training.']],
    { cities: ['nairobi', 'dubai', 'lagos'] }),
  C('credit-risk-management', 'Credit Risk Management', 'banking-credit-regulation',
    'Assess, price and monitor credit risk across a loan portfolio.',
    ['Analyse borrower creditworthiness', 'Use credit scoring and rating models', 'Apply IFRS 9 expected credit loss', 'Monitor portfolio quality', 'Manage problem loans'],
    ['Credit officers', 'Risk managers', 'Relationship managers'],
    [['Credit analysis', 'Financial statements and cash flow.'], ['Scoring and rating', 'Models and their limits.'], ['IFRS 9 ECL', 'Staging and provisions.'], ['Portfolio management', 'Concentration and early warning.'], ['Collections', 'Restructuring and recovery.'], ['Regulation', 'Capital and prudential rules.']],
    { cities: ['nairobi', 'kigali', 'johannesburg'] }),
  C('occupational-health-and-safety-management', 'Occupational Health and Safety Management', 'health-safety-environment',
    'Build a safe workplace with practical risk assessment and safety systems.',
    ['Identify hazards and assess risks', 'Apply ISO 45001 principles', 'Investigate incidents', 'Plan emergency response', 'Build a safety culture'],
    ['Safety officers', 'Facility managers', 'Supervisors', 'HR staff'],
    [['OSH law and standards', 'Legal duties and ISO 45001.'], ['Risk assessment', 'Hazard identification and controls.'], ['Incident investigation', 'Root cause analysis.'], ['Emergency planning', 'Fire, evacuation and first response.'], ['Safety culture', 'Leadership and behaviour.'], ['Audits', 'Inspections and audits.']],
    { cities: ['mombasa', 'nairobi', 'dubai'] }),
  C('agricultural-value-chain-development', 'Agricultural Value Chain Development', 'agriculture-food-rural',
    'Analyse and upgrade agricultural value chains so farmers and businesses earn more.',
    ['Map value chains and actors', 'Identify upgrading opportunities', 'Design market systems interventions', 'Link farmers to finance and markets', 'Measure value chain results'],
    ['Agribusiness staff', 'Programme officers', 'Extension officers', 'Cooperative managers'],
    [['Value chain analysis', 'Mapping actors and margins.'], ['Market systems', 'M4P approach.'], ['Upgrading', 'Quality, processing and certification.'], ['Finance', 'Agri-finance and insurance.'], ['Partnerships', 'Working with the private sector.'], ['Measuring results', 'Indicators and learning.']],
    { cities: ['nairobi', 'kigali', 'addis-ababa'] }),
  C('data-protection-and-privacy-compliance', 'Data Protection and Privacy Compliance', 'ict-digital-ai',
    'Comply with the Kenya Data Protection Act, GDPR and other privacy laws in day-to-day operations.',
    ['Explain data protection principles and rights', 'Map personal data and lawful bases', 'Run data protection impact assessments', 'Handle breaches and data subject requests', 'Build a privacy programme'],
    ['Data protection officers', 'ICT staff', 'Legal and compliance teams'],
    [['The law', 'Kenya DPA, GDPR and regional laws.'], ['Data mapping', 'Records of processing and lawful bases.'], ['DPIAs', 'Assessing high-risk processing.'], ['Rights and requests', 'Handling data subject requests.'], ['Breaches', 'Response and notification.'], ['Privacy programme', 'Policies, training and audits.']],
    { cities: ['nairobi', 'kigali', 'dubai'] }),
  C('ai-for-managers-and-professionals', 'Artificial Intelligence for Managers and Professionals', 'ict-digital-ai',
    'Use AI tools safely and productively at work and lead AI adoption in your team.',
    ['Explain what AI can and cannot do', 'Use AI assistants for everyday work', 'Write effective prompts', 'Manage AI risks and policies', 'Plan AI adoption in your unit'],
    ['Managers', 'Professionals in any field', 'ICT and innovation staff'],
    [['AI basics', 'How modern AI works, in plain language.'], ['AI at work', 'Writing, analysis and research with AI.'], ['Prompting', 'Techniques that get better results.'], ['Risk and ethics', 'Privacy, bias and accuracy.'], ['Policy', 'Acceptable-use policies.'], ['Adoption', 'Picking use cases and measuring value.']],
    { popular: true, cities: ['nairobi', 'dubai', 'kigali'] }),
  C('health-supply-chain-management', 'Health Supply Chain Management', 'health-systems',
    'Keep essential medicines and health products available through better supply chain management.',
    ['Quantify and forecast health commodity needs', 'Manage procurement of health products', 'Run stores and distribution', 'Use LMIS data', 'Reduce stock-outs and expiries'],
    ['Pharmacists', 'Health programme managers', 'Supply chain officers'],
    [['Health supply chains', 'The cycle and key actors.'], ['Quantification', 'Forecasting and supply planning.'], ['Procurement', 'Quality assurance and tenders.'], ['Storage and distribution', 'Cold chain and last mile.'], ['LMIS', 'Data for decisions.'], ['Performance', 'KPIs and improvement.']],
    { cities: ['nairobi', 'kampala', 'addis-ababa'] }),
]

// ---------- sessions (SAMPLE schedule: Mondays from Nov 2026 to Mar 2027)
const MONDAYS = []
for (let d = new Date(Date.UTC(2026, 10, 23)); d < Date.UTC(2027, 3, 1); d.setUTCDate(d.getUTCDate() + 7)) MONDAYS.push(new Date(d))
const iso = (d) => d.toISOString().slice(0, 10)
const addDays = (d, n) => { const x = new Date(d); x.setUTCDate(x.getUTCDate() + n); return x }

// SAMPLE fees per participant
const FEES = {
  online: { 5: { currency: 'KES', amount: 80000 }, 10: { currency: 'KES', amount: 160000 } },
  KE: { 5: { currency: 'KES', amount: 95000 }, 10: { currency: 'KES', amount: 190000 } },
  INT: { 5: { currency: 'USD', amount: 2500 }, 10: { currency: 'USD', amount: 4500 } },
  premium: { 5: { currency: 'USD', amount: 4200 }, 10: { currency: 'USD', amount: 7800 } },
}
const PREMIUM = new Set(['dubai', 'cairo'])

function sessionsFor(course, idx) {
  const out = []
  MONDAYS.forEach((mon, w) => {
    const start = iso(mon)
    // live online roughly every second week
    if ((w + idx) % 2 === 0) out.push({ format: 'online', city: null, start })
    // classroom roughly every third week, rotating cities
    if ((w + idx) % 3 === 1) {
      const city = course.classroomCities[(w + idx) % course.classroomCities.length]
      out.push({ format: 'classroom', city, start })
    }
  })
  return out.map((s, i) => {
    const city = s.city ? cityBySlug(s.city) : null
    const key = s.format === 'online' ? 'online' : PREMIUM.has(s.city) ? 'premium' : city.region
    const start = new Date(s.start + 'T00:00:00Z')
    return {
      id: `${course.slug}-${s.start}-${s.city || 'online'}`,
      format: s.format,
      city: s.city,
      start: s.start,
      end5: iso(addDays(start, 4)),
      end10: iso(addDays(start, 11)),
      fee5: FEES[key][5],
      fee10: FEES[key][10],
      n: i,
    }
  })
}

export const COURSES = RAW.map((c, i) => ({ ...c, sessions: sessionsFor(c, i) }))
export const courseBySlug = (s) => COURSES.find((c) => c.slug === s)
