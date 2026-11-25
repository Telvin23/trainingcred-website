// COURSE CATALOGUE
// Course titles and URL slugs are taken from the current trainingcred.com (so old Google links can be
// redirected to the same course). Outlines are written for this site; dates follow the monthly pattern
// of the live site (5 or 10 days, Monday start). Fees: live online KSh 70,000 / 140,000 and Cairo/Dubai
// USD 4,200 come from the live site; other classroom fees are estimates to confirm (see FEES below).
import { cityBySlug } from './catalog.js'
import WESKILL from './weskill-courses.json'
import TC from './tc-index.json'

// Course photos: drop a file named <course-slug>.jpg (or .png/.webp) into src/assets/courses/
// and it is used automatically on that course's cards and page. Courses without a photo keep the
// generated cover art for their focus area.
const PHOTOS = import.meta.glob('../assets/courses/*.{jpg,jpeg,png,webp}', { eager: true, query: '?url', import: 'default' })
const fileKey = (path) => path.split('/').pop().replace(/\.[a-z]+$/, '')
const PHOTO_BY_SLUG = Object.fromEntries(Object.entries(PHOTOS).map(([p, u]) => [fileKey(p), u]))
const photoFor = (slug) => PHOTO_BY_SLUG[slug] || null

// Topic photos (shared library): src/assets/topics/<topic-slug>.jpg, or several per topic as
// <topic-slug>--1.jpg, <topic-slug>--2.jpg ... Courses imported from trainingcred.com without their
// own photo use the photo of their topic (picked by course so neighbours differ), then the focus-area cover.
const TOPIC_PHOTOS = import.meta.glob('../assets/topics/*.{jpg,jpeg,png,webp}', { eager: true, query: '?url', import: 'default' })
const BY_TOPIC = {}
for (const [p, u] of Object.entries(TOPIC_PHOTOS)) { const k = fileKey(p).split('--')[0]; (BY_TOPIC[k] = BY_TOPIC[k] || []).push(u) }
export const topicSlug = (t) => String(t).toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const hash = (s) => { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h }
const topicPhoto = (topic, slug) => { const list = BY_TOPIC[topicSlug(topic)]; return list ? list[hash(slug) % list.length] : null }

const C = (slug, title, category, summary, outcomes, audience, modules, opts = {}) => ({
  slug, title, category, summary, outcomes, audience,
  modules: modules.map(([t, d]) => ({ title: t, text: d })),
  durations: opts.durations || [5, 10],
  popular: !!opts.popular,
  classroomCities: opts.cities || ['nairobi', 'kigali', 'dubai'],
  firstClassroom: opts.first || null,
})

const RAW = [
  // ---------- Energy, Water, Climate & Environment
  C('role-of-ipcc-in-climate-science-and-policy', 'The Role of IPCC in Climate Science and Policy', 'energy-water-climate-environment',
    'Understand how IPCC assessments are produced, how to read them, and how to turn their findings into policy, programme design and funding proposals.',
    ['Explain how IPCC working groups, assessment reports and summaries for policymakers are produced and approved', 'Read IPCC scenarios, confidence language and regional findings for Africa', 'Use IPCC evidence in policy briefs, NDC updates and national adaptation plans', 'Strengthen climate finance proposals with credible, cited science', 'Communicate climate risk clearly to decision makers'],
    ['Climate and environment officers', 'Policy analysts', 'NGO programme staff', 'Researchers', 'Government planners', 'Climate finance teams'],
    [['How the IPCC works', 'Mandate, working groups, the assessment cycle and approval of the summaries.'], ['The physical science basis', 'Warming, emissions pathways and what the scenarios mean.'], ['Impacts, adaptation and vulnerability', 'Regional risks for Africa: water, agriculture, health, cities and ecosystems.'], ['Mitigation pathways', 'Energy, land use and sector options, and what net zero requires.'], ['From science to policy', 'Using IPCC evidence in NDCs, national plans and negotiation positions.'], ['Climate finance and communication', 'Fundable proposals and explaining climate risk to non-specialists.']],
    { popular: true, cities: ['cairo', 'nairobi', 'kigali', 'dubai'], first: '2026-11-23' }),
  C('renewable-energy-solutions-training', 'Renewable Energy Solutions', 'energy-water-climate-environment',
    'Plan, size and finance solar, wind and hybrid energy solutions for institutions, businesses and communities.',
    ['Compare solar, wind, hydro and hybrid options for a site', 'Size a solar PV and storage system', 'Build a simple financial case: costs, savings and payback', 'Plan procurement, installation and maintenance', 'Understand regulation, incentives and carbon benefits'],
    ['Energy officers', 'Facility managers', 'Engineers and technicians', 'Project developers', 'County and government planners'],
    [['Energy basics and demand', 'Load profiles, energy audits and efficiency first.'], ['Solar PV and storage', 'System design, components and sizing.'], ['Wind, hydro and hybrid systems', 'When each technology makes sense.'], ['Financing and business models', 'PPAs, leasing, grants and payback.'], ['Delivery and maintenance', 'Procurement, quality, operation and monitoring.']],
    { popular: true, cities: ['kigali', 'nairobi', 'mombasa'] }),
  C('environmental-recovery-and-ecosystem-restoration-training', 'Environmental Recovery and Ecosystem Restoration', 'energy-water-climate-environment',
    'Design and manage restoration of degraded land, forests, wetlands and watersheds, with communities at the centre.',
    ['Assess degradation and set restoration goals', 'Choose nature-based restoration approaches', 'Engage communities and secure land-use agreements', 'Monitor ecological and social results', 'Access restoration and carbon finance'],
    ['Environment officers', 'Conservation NGOs', 'Forestry and water staff', 'County planners'],
    [['Restoration principles', 'Degradation, baselines and goals.'], ['Approaches that work', 'Forests, rangelands, wetlands and watersheds.'], ['Communities and land use', 'Participation, tenure and benefit sharing.'], ['Monitoring', 'Indicators, remote sensing and field data.'], ['Finance', 'Grants, carbon markets and blended finance.']],
    { cities: ['nairobi', 'naivasha', 'kigali'] }),

  // ---------- Finance
  C('financial-analysis-modelling-and-forecasting-training', 'Financial Analysis, Modelling and Forecasting', 'finance-accounting-treasury',
    'Build robust Excel financial models, analyse performance and produce forecasts managers can trust.',
    ['Analyse financial statements with ratios and trends', 'Build a structured three-statement model in Excel', 'Forecast revenue, costs and cash flow', 'Run scenarios and sensitivity analysis', 'Present results clearly to decision makers'],
    ['Finance officers and accountants', 'Financial analysts', 'Budget and planning staff', 'Business managers'],
    [['Financial analysis', 'Ratios, trends and benchmarking.'], ['Modelling standards', 'Structure, checks and good Excel practice.'], ['Three-statement model', 'Linking income statement, balance sheet and cash flow.'], ['Forecasting', 'Drivers, assumptions and rolling forecasts.'], ['Scenarios and reporting', 'Sensitivity, scenarios and dashboards.']],
    { popular: true, cities: ['nairobi', 'dubai', 'kigali'], first: '2026-11-23' }),
  C('investment-analysis-financial-modelling-training', 'Investment Analysis and Financial Modelling', 'finance-accounting-treasury',
    'Appraise investments and projects with discounted cash flow, risk analysis and practical valuation models.',
    ['Apply NPV, IRR and payback correctly', 'Estimate the cost of capital', 'Model project cash flows and financing', 'Value a business with DCF and multiples', 'Account for risk with scenarios and simulation'],
    ['Investment officers', 'Finance managers', 'Pension and fund staff', 'Project appraisal teams'],
    [['Investment appraisal', 'Time value of money, NPV and IRR.'], ['Cost of capital', 'WACC and hurdle rates.'], ['Project finance models', 'Cash flows, debt and returns.'], ['Valuation', 'DCF, multiples and comparables.'], ['Risk analysis', 'Sensitivity, scenarios and Monte Carlo basics.']],
    { cities: ['nairobi', 'dubai', 'johannesburg'] }),
  C('advanced-financial-management-for-world-bank-funded-projects-training', 'Advanced Financial Management for World Bank Funded Projects', 'finance-accounting-treasury',
    'Manage the finances of World Bank funded projects: disbursement, reporting, internal controls and audit, in line with Bank requirements.',
    ['Apply World Bank financial management requirements', 'Manage designated accounts and disbursement methods', 'Prepare interim financial reports (IFRs)', 'Strengthen internal controls and fraud prevention', 'Prepare for and respond to project audits'],
    ['Project accountants', 'Finance managers of PIUs', 'Government finance staff', 'Auditors'],
    [['Bank FM framework', 'Policies, assessments and the legal agreement.'], ['Budgeting and disbursement', 'Designated accounts, advances and SOEs.'], ['Accounting and reporting', 'IFRs and annual financial statements.'], ['Internal controls', 'Procedures, segregation of duties and fraud risk.'], ['Audit', 'Terms of reference, audit process and follow-up.']],
    { popular: true, cities: ['nairobi', 'kigali', 'addis-ababa'] }),

  // ---------- Banking
  C('international-banking-and-finance', 'International Banking and Finance', 'banking-credit-regulation',
    'Understand how international banking works: trade finance, foreign exchange, correspondent banking and cross-border regulation.',
    ['Explain the structure of international banking and finance', 'Use trade finance instruments correctly', 'Manage foreign exchange exposure', 'Apply cross-border compliance and AML rules', 'Assess country and counterparty risk'],
    ['Bank staff', 'Treasury officers', 'Trade finance teams', 'Regulators'],
    [['International financial system', 'Institutions, markets and flows.'], ['Trade finance', 'Letters of credit, guarantees and collections.'], ['Foreign exchange', 'Markets, pricing and hedging.'], ['Correspondent banking and compliance', 'Payments, sanctions and AML.'], ['Risk management', 'Country, credit and liquidity risk.']],
    { cities: ['dubai', 'nairobi', 'lagos'] }),
  C('islamic-banking-and-finance-training', 'Islamic (Shariah Compliance) Banking and Finance', 'banking-credit-regulation',
    'Learn the principles and products of Islamic finance and how to keep operations Shariah compliant.',
    ['Explain the principles of Islamic finance', 'Structure murabaha, ijara, mudaraba and musharaka products', 'Understand sukuk and Islamic capital markets', 'Apply Shariah governance and compliance', 'Compare Islamic and conventional risk management'],
    ['Bank and SACCO staff', 'Product developers', 'Compliance officers', 'Regulators'],
    [['Foundations', 'Principles, prohibitions and contracts.'], ['Financing products', 'Murabaha, ijara, mudaraba and musharaka.'], ['Deposits and investment', 'Profit-sharing accounts and takaful.'], ['Sukuk and markets', 'Structures and issuance.'], ['Shariah governance', 'Boards, audit and compliance.']],
    { cities: ['dubai', 'nairobi', 'mombasa'] }),
  C('digital-payments-wallets-and-merchant-operations', 'Digital Payments, Wallets and Merchant Operations', 'banking-credit-regulation',
    'Design and run digital payment and wallet services, from merchant onboarding to reconciliation, fraud control and regulation.',
    ['Explain payment systems, rails and the players involved', 'Design wallet and merchant products', 'Run onboarding, KYC and settlement', 'Control fraud and operational risk', 'Meet payment regulation and data rules'],
    ['Fintech and bank staff', 'Payments product managers', 'Operations and risk teams'],
    [['Payments landscape', 'Mobile money, cards, APIs and switches.'], ['Wallet and merchant products', 'Design, pricing and partnerships.'], ['Operations', 'Onboarding, settlement and reconciliation.'], ['Fraud and risk', 'Controls, monitoring and disputes.'], ['Regulation', 'Licensing, KYC and data protection.']],
    { cities: ['nairobi', 'kigali', 'lagos'] }),

  // ---------- Health, Safety, Security & Environment
  C('first-response-and-medical-assistance-in-crises-training', 'First Response and Medical Assistance in Crises', 'health-safety-environment',
    'Give staff the skills to respond to medical emergencies and crises until professional help arrives.',
    ['Assess a scene and stay safe', 'Provide first aid for common emergencies', 'Manage bleeding, burns, fractures and shock', 'Support people in a mass-casualty or crisis setting', 'Plan workplace emergency response'],
    ['Safety officers', 'Field and humanitarian staff', 'Security teams', 'Facility managers'],
    [['Scene safety and assessment', 'Primary survey and calling for help.'], ['Life support', 'CPR, choking and recovery position.'], ['Injuries', 'Bleeding, burns, fractures and shock.'], ['Crisis settings', 'Triage and psychological first aid.'], ['Emergency planning', 'Kits, roles and drills.']],
    { cities: ['mombasa', 'nairobi', 'kampala'] }),
  C('cctv-surveillance-and-access-control-systems-management-training', 'CCTV Surveillance and Access Control Systems Management', 'health-safety-environment',
    'Plan, operate and manage CCTV and access control systems that actually improve security.',
    ['Assess security risks and set system requirements', 'Specify CCTV and access control components', 'Operate monitoring rooms effectively', 'Manage data, privacy and evidence', 'Maintain and audit systems'],
    ['Security managers', 'Facility managers', 'ICT and systems staff', 'Control room operators'],
    [['Risk and requirements', 'Security surveys and design goals.'], ['CCTV systems', 'Cameras, storage, analytics and networks.'], ['Access control', 'Cards, biometrics and integration.'], ['Operations', 'Monitoring, incident response and evidence.'], ['Governance', 'Privacy, maintenance and audit.']],
    { cities: ['nairobi', 'dubai', 'johannesburg'] }),
  C('mental-health-and-wellbeing-training', 'Mental Health and Wellbeing in the Workplace', 'health-safety-environment',
    'Build a workplace that supports mental health: spot early signs, start supportive conversations and put the right policies in place.',
    ['Understand common mental health conditions at work', 'Recognise early warning signs of stress and burnout', 'Hold supportive and confidential conversations', 'Design wellbeing policies and programmes', 'Look after your own wellbeing'],
    ['HR teams', 'Managers and supervisors', 'Wellness champions', 'Staff welfare officers'],
    [['Mental health at work', 'Facts, myths and the business case.'], ['Early signs', 'Stress, burnout, anxiety and depression.'], ['Supportive conversations', 'Listening, signposting and confidentiality.'], ['Policies and programmes', 'Prevention, adjustments and EAPs.'], ['Self-care', 'Resilience and boundaries.']],
    { cities: ['kigali', 'nairobi', 'zanzibar'] }),
  C('disaster-relief-and-emergency-response-training', 'Disaster Relief and Emergency Response', 'health-safety-environment',
    'Plan and coordinate effective humanitarian response, from needs assessment to logistics and accountability.',
    ['Apply humanitarian principles and standards', 'Run rapid needs assessments', 'Plan and coordinate a response', 'Manage relief logistics and distributions', 'Stay accountable to affected people'],
    ['Humanitarian staff', 'Disaster management officers', 'NGO programme teams', 'County and government responders'],
    [['Humanitarian system', 'Principles, Sphere standards and coordination.'], ['Assessment', 'Rapid needs assessment and targeting.'], ['Response planning', 'Sectors, budgets and partners.'], ['Relief logistics', 'Procurement, warehousing and distribution.'], ['Accountability', 'Feedback, protection and reporting.']],
    { cities: ['nairobi', 'kampala', 'addis-ababa'] }),

  // ---------- Agriculture
  C('agricultural-extension-services-training', 'Agricultural Extension Services', 'agriculture-food-rural',
    'Deliver extension services that farmers adopt: participatory methods, digital tools and links to markets.',
    ['Apply modern extension approaches', 'Use participatory and farmer-to-farmer methods', 'Use digital and mobile extension tools', 'Link farmers to inputs, finance and markets', 'Measure adoption and results'],
    ['Extension officers', 'Agricultural NGOs', 'Cooperative staff', 'County agriculture departments'],
    [['Extension today', 'Pluralistic, demand-led extension.'], ['Participatory methods', 'Farmer field schools and demonstrations.'], ['Digital extension', 'SMS, radio, video and apps.'], ['Market linkages', 'Inputs, finance and buyers.'], ['Results', 'Adoption tracking and learning.']],
    { cities: ['kisumu', 'nairobi', 'kigali'], first: '2026-11-30' }),
  C('rural-finance-and-credit-for-agriculture-for-ngos-training', 'Rural Finance and Credit for Agriculture', 'agriculture-food-rural',
    'Design and manage agricultural finance products and programmes that reach smallholder farmers sustainably.',
    ['Understand demand for rural and agricultural finance', 'Design credit, savings and insurance products', 'Assess agricultural credit risk', 'Use digital channels to reach farmers', 'Partner with banks, SACCOs and value chain actors'],
    ['NGO programme staff', 'SACCO and MFI staff', 'Agricultural lenders', 'Development partners'],
    [['Rural finance landscape', 'Providers, gaps and policy.'], ['Products', 'Credit, savings, leasing and insurance.'], ['Credit risk', 'Cash-flow based lending for farms.'], ['Digital finance', 'Mobile money and data.'], ['Partnerships', 'Value chain finance and guarantees.']],
    { cities: ['nairobi', 'kampala', 'kisumu'] }),

  // ---------- Facilities & property
  C('real-estate-development-investment-management-training', 'Real Estate Development, Investment and Management', 'facilities-assets-property',
    'Take property projects from feasibility to management: market studies, financial appraisal, development and asset management.',
    ['Run a property market and feasibility study', 'Appraise developments financially', 'Structure finance and partnerships', 'Manage the development process and risks', 'Manage properties for value'],
    ['Property developers', 'Real estate investors', 'Asset and estate managers', 'Pension and REIT staff'],
    [['Market and feasibility', 'Demand, supply and site analysis.'], ['Development appraisal', 'Residual valuation and cash flows.'], ['Finance', 'Debt, equity, JVs and REITs.'], ['Development management', 'Approvals, contracts and delivery.'], ['Asset management', 'Leasing, operations and value.']],
    { cities: ['nairobi', 'dubai', 'kigali'] }),
  C('integrating-smart-home-solutions-training', 'Integrating Smart Home and Smart Building Solutions', 'facilities-assets-property',
    'Plan and integrate smart home and building systems: lighting, security, energy and comfort controls on one platform.',
    ['Explain smart home and building architectures', 'Select devices, protocols and platforms', 'Integrate security, energy and comfort systems', 'Secure connected devices', 'Plan installation, handover and support'],
    ['Facility managers', 'Electrical and ICT technicians', 'Property developers', 'Building services engineers'],
    [['Smart building basics', 'Architectures, protocols and platforms.'], ['Devices and sensors', 'Lighting, HVAC, metering and access.'], ['Integration', 'Automation rules and dashboards.'], ['Cyber security', 'Securing connected devices.'], ['Delivery', 'Installation, commissioning and support.']],
    { cities: ['nairobi', 'dubai', 'johannesburg'] }),

  // ---------- Health systems
  C('dhis2-health-information-system-management-training', 'DHIS2 Health Information System Management', 'health-systems',
    'Configure, manage and use DHIS2 for routine health data, from data entry design to dashboards and data quality.',
    ['Navigate DHIS2 and its data model', 'Configure data sets, programmes and indicators', 'Build dashboards, pivot tables and maps', 'Run data quality checks', 'Use data for planning and decisions'],
    ['Health records and information officers', 'M&E officers', 'Health programme managers', 'County health teams'],
    [['DHIS2 essentials', 'Navigation, data model and metadata.'], ['Configuration', 'Data sets, tracker programmes and indicators.'], ['Analytics', 'Pivot tables, charts, maps and dashboards.'], ['Data quality', 'Validation rules and quality tools.'], ['Data use', 'Reviews, reporting and decision making.']],
    { popular: true, cities: ['naivasha', 'nairobi', 'kigali'], first: '2026-11-23' }),

  // ---------- Procurement & logistics
  C('procurement-and-supply-chain-management-training', 'Procurement and Supply Chain Management', 'procurement-supply-chain',
    'Run procurement and supply chains that deliver value for money, on time and in compliance with the rules.',
    ['Plan procurement in line with budgets and needs', 'Run compliant tenders and evaluations', 'Manage contracts and supplier performance', 'Control inventory and logistics', 'Reduce risk, fraud and waste'],
    ['Procurement officers', 'Supply chain managers', 'Stores and logistics staff', 'User departments'],
    [['Procurement planning', 'Needs, specifications and plans.'], ['Tendering and evaluation', 'Methods, documents and fair evaluation.'], ['Contract management', 'KPIs, variations and disputes.'], ['Inventory and logistics', 'Stores, transport and distribution.'], ['Risk and ethics', 'Fraud red flags and controls.']],
    { popular: true, cities: ['nairobi', 'mombasa', 'dubai'] }),
  C('sustainable-procurement-and-iso-20400-training', 'Sustainable Procurement and ISO 20400', 'procurement-supply-chain',
    'Build environmental, social and economic sustainability into procurement, using the ISO 20400 guidance.',
    ['Explain ISO 20400 and sustainable procurement', 'Set a sustainable procurement policy', 'Prioritise categories and suppliers by sustainability risk', 'Use sustainability criteria in tenders', 'Measure and report results'],
    ['Procurement managers', 'Sustainability and ESG officers', 'Supply chain staff', 'Public procurement officers'],
    [['Why sustainable procurement', 'Risks, opportunities and ISO 20400.'], ['Policy and strategy', 'Commitments, governance and targets.'], ['Prioritisation', 'Category and supplier risk mapping.'], ['Tenders and contracts', 'Criteria, life-cycle costing and clauses.'], ['Measurement', 'KPIs, supplier engagement and reporting.']],
    { cities: ['nairobi', 'kigali', 'cape-town'] }),
  C('strategic-sourcing-and-category-management-training', 'Strategic Sourcing and Category Management', 'procurement-supply-chain',
    'Use spend analysis, category strategies and supplier negotiation to cut costs and improve supply.',
    ['Analyse spend and find savings opportunities', 'Develop category strategies', 'Run strategic sourcing projects', 'Negotiate with suppliers', 'Manage supplier relationships'],
    ['Procurement managers', 'Category managers', 'Buyers', 'Finance business partners'],
    [['Spend analysis', 'Data, cubes and opportunity sizing.'], ['Category strategy', 'Portfolio tools and market analysis.'], ['Sourcing process', 'RFx design and evaluation.'], ['Negotiation', 'Preparation, tactics and closing.'], ['Supplier management', 'Performance and development.']],
    { cities: ['nairobi', 'dubai', 'johannesburg'] }),
  C('transport-and-logistics-management-training', 'Transport and Logistics Management', 'procurement-supply-chain',
    'Plan and run transport and logistics operations efficiently, safely and at the right cost.',
    ['Design logistics networks and flows', 'Choose transport modes and carriers', 'Manage freight, customs and documentation', 'Use KPIs to control cost and service', 'Apply technology in logistics'],
    ['Logistics officers', 'Transport managers', 'Supply chain staff', 'Freight and clearing agents'],
    [['Logistics strategy', 'Networks, service levels and costs.'], ['Transport management', 'Modes, routing and carriers.'], ['Freight and customs', 'Incoterms, documents and clearing.'], ['Performance', 'KPIs and continuous improvement.'], ['Technology', 'TMS, tracking and data.']],
    { cities: ['mombasa', 'nairobi', 'dar-es-salaam'] }),
  C('fleet-management-transportation-and-distribution-training', 'Fleet Management, Transportation and Distribution', 'procurement-supply-chain',
    'Manage vehicle fleets for lower cost, better safety and reliable distribution.',
    ['Plan fleet size and vehicle acquisition', 'Control fuel, maintenance and running costs', 'Use telematics and fleet data', 'Improve driver safety and compliance', 'Plan efficient distribution routes'],
    ['Fleet managers', 'Transport officers', 'Logistics staff', 'Administration managers'],
    [['Fleet planning', 'Sizing, buy or lease, replacement.'], ['Running costs', 'Fuel, maintenance and tyres.'], ['Telematics', 'Tracking, data and reports.'], ['Safety and compliance', 'Drivers, policies and regulation.'], ['Distribution', 'Routing and scheduling.']],
    { cities: ['nairobi', 'mombasa', 'kampala'] }),

  // ---------- MEAL & project
  C('monitoring-and-evaluation-of-projects', 'Monitoring, Evaluation, Accountability and Learning (MEAL)', 'monitoring-evaluation-accountability-and-learning',
    'Design and run a MEAL system that produces data managers use and communities trust.',
    ['Design results frameworks and SMART indicators', 'Develop MEAL plans and data collection tools', 'Collect data with mobile tools', 'Analyse, visualise and report results', 'Set up accountability and learning loops'],
    ['M&E officers', 'Programme managers', 'Researchers', 'Donor-funded project staff'],
    [['MEAL foundations', 'Theory of change and results chains.'], ['Indicators and plans', 'Indicator reference sheets and MEAL plans.'], ['Data collection', 'Sampling and mobile tools.'], ['Analysis and reporting', 'Excel, dashboards and data quality.'], ['Accountability and learning', 'Feedback mechanisms and reviews.']],
    { popular: true, cities: ['nairobi', 'kigali', 'kampala', 'zanzibar'] }),
  C('human-centered-knowledge-design-training', 'Human-Centered Knowledge Design', 'monitoring-evaluation-accountability-and-learning',
    'Capture, organise and share organisational knowledge in ways people actually use.',
    ['Map knowledge needs and users', 'Design knowledge products people use', 'Capture lessons and tacit knowledge', 'Organise knowledge platforms', 'Measure knowledge use'],
    ['Knowledge managers', 'MEAL and learning staff', 'Communications officers', 'Programme managers'],
    [['Knowledge and users', 'Personas, journeys and needs.'], ['Design methods', 'Human-centred design for knowledge.'], ['Capturing knowledge', 'After-action reviews and storytelling.'], ['Platforms', 'Taxonomies, search and intranets.'], ['Measuring use', 'Analytics and feedback.']],
    { cities: ['nairobi', 'kigali', 'accra'] }),
  C('grant-management-and-donor-compliance', 'Grant Management and Donor Compliance', 'project-programme-management',
    'Manage donor-funded grants from award to close-out while staying compliant with USAID, EU, FCDO and UN rules.',
    ['Interpret grant agreements and donor regulations', 'Set up grant budgets and cost allocation', 'Manage sub-grants and partner compliance', 'Prepare donor financial and narrative reports', 'Get ready for audits and close-out'],
    ['Grant managers', 'Finance officers', 'Programme managers', 'Compliance officers'],
    [['The grant lifecycle', 'From award to close-out.'], ['Donor rules', 'USAID, EU, FCDO and UN requirements.'], ['Budget management', 'Cost allocation and realignment.'], ['Sub-grants', 'Partner assessment and monitoring.'], ['Reporting and audit', 'Reports donors accept and audit readiness.']],
    { popular: true, cities: ['nairobi', 'kigali', 'addis-ababa'] }),
  C('project-management-for-development-programmes', 'Project Management for Development Programmes', 'project-programme-management',
    'Plan, deliver and control projects and donor-funded programmes on time, on budget and to the expected quality.',
    ['Define scope, deliverables and work plans', 'Build schedules and budgets', 'Manage risks, issues and changes', 'Lead project teams and stakeholders', 'Report progress and close projects'],
    ['Project managers', 'Programme officers', 'Team leads', 'Engineers and consultants'],
    [['Project initiation', 'Charters, logframes and stakeholders.'], ['Planning', 'Scope, schedule and budget.'], ['Risk and change', 'Registers, controls and decisions.'], ['Leading delivery', 'Teams, partners and communication.'], ['Monitoring and closure', 'Reporting, handover and lessons.']],
    { cities: ['nairobi', 'dubai', 'lagos'] }),

  // ---------- Leadership
  C('visionary-leadership-for-executives-training', 'Visionary Leadership for Executives', 'leadership-management',
    'Sharpen executive leadership: set direction, lead change and build high-performing leadership teams.',
    ['Set and communicate a compelling vision', 'Make strategic decisions under uncertainty', 'Lead transformation and change', 'Build trust and high-performing teams', 'Lead with integrity and influence'],
    ['Directors and CEOs', 'Senior managers', 'Board members', 'Heads of department'],
    [['The executive role', 'Purpose, vision and values.'], ['Strategic thinking', 'Foresight and decision making.'], ['Leading change', 'Transformation and resistance.'], ['Leadership teams', 'Trust, accountability and performance.'], ['Influence', 'Stakeholders, communication and ethics.']],
    { popular: true, cities: ['nairobi', 'dubai', 'zanzibar'] }),
  C('leading-regional-operations-and-cross-border-teams-in-east-and-sub-saharan-africa', 'Leading Regional Operations and Cross-Border Teams in Africa', 'leadership-management',
    'Lead teams and operations across several African countries: culture, regulation, virtual collaboration and performance.',
    ['Design regional operating models', 'Lead across cultures and languages', 'Manage virtual and hybrid teams', 'Navigate regulation across countries', 'Drive consistent performance regionally'],
    ['Regional managers', 'Country directors', 'Operations heads', 'HR business partners'],
    [['Regional strategy', 'Operating models and governance.'], ['Culture', 'Working across cultures and languages.'], ['Virtual teams', 'Hybrid collaboration and tools.'], ['Regulation', 'Labour, tax and compliance across borders.'], ['Performance', 'Targets, reviews and engagement.']],
    { cities: ['pretoria', 'nairobi', 'kigali'] }),
  C('building-a-positive-organizational-culture', 'Building a Positive Organizational Culture', 'leadership-management',
    'Shape a culture of trust, accountability and engagement that supports your strategy.',
    ['Diagnose your current culture', 'Define the culture your strategy needs', 'Use leadership behaviours to shape culture', 'Embed values in systems and processes', 'Measure engagement and culture change'],
    ['Leaders and managers', 'HR and OD teams', 'Culture champions'],
    [['Culture and performance', 'Why culture matters.'], ['Diagnosis', 'Surveys, interviews and artefacts.'], ['Leadership behaviours', 'Role modelling and rituals.'], ['Systems', 'Recognition, performance and hiring.'], ['Measuring change', 'Engagement and culture metrics.']],
    { cities: ['nairobi', 'dubai', 'cape-town'] }),
  C('corporate-social-responsibility-csr-training', 'Corporate Social Responsibility (CSR) and Governance', 'leadership-management',
    'Design CSR and sustainability programmes that create value for communities and the organisation, with sound governance and reporting.',
    ['Link CSR to strategy and stakeholders', 'Design and manage CSR programmes', 'Apply ESG and sustainability frameworks', 'Govern CSR spending and partnerships', 'Report impact credibly'],
    ['CSR and foundation managers', 'Sustainability officers', 'Communications teams', 'Board members'],
    [['CSR and strategy', 'Shared value and materiality.'], ['Programme design', 'Partners, budgets and results.'], ['ESG frameworks', 'GRI, SDGs and standards.'], ['Governance', 'Policies, oversight and risk.'], ['Reporting', 'Impact measurement and disclosure.']],
    { cities: ['kigali', 'nairobi', 'johannesburg'] }),

  // ---------- People & personal effectiveness
  C('communication-and-presentation-skills-training', 'Communication and Presentation Skills', 'people-hr-talent',
    'Communicate clearly and present with confidence to colleagues, managers, boards and the public.',
    ['Structure clear messages for any audience', 'Write concise reports and emails', 'Design simple, effective slides', 'Present with confidence and handle questions', 'Communicate in difficult conversations'],
    ['Professionals at all levels', 'Team leaders', 'Technical experts', 'Communications staff'],
    [['Communication foundations', 'Audience, purpose and message.'], ['Business writing', 'Reports, briefs and emails.'], ['Presentation design', 'Story, structure and slides.'], ['Delivery', 'Voice, body language and nerves.'], ['Hard conversations', 'Feedback, conflict and questions.']],
    { cities: ['nairobi', 'mombasa', 'kigali'] }),
  C('goal-setting-training', 'Motivation and Goal Setting', 'people-hr-talent',
    'Set meaningful goals, stay motivated and help your team do the same.',
    ['Understand what drives motivation', 'Set SMART and stretch goals', 'Plan and track progress', 'Overcome procrastination and setbacks', 'Motivate and coach others'],
    ['Professionals at all levels', 'Supervisors and team leaders', 'HR and L&D staff'],
    [['Motivation', 'What drives people.'], ['Goal setting', 'SMART goals, OKRs and priorities.'], ['Planning and habits', 'Routines, tracking and focus.'], ['Resilience', 'Setbacks and self-management.'], ['Motivating others', 'Coaching and recognition.']],
    { cities: ['nairobi', 'kigali', 'dubai'], first: '2026-11-30' }),
  C('developing-and-retaining-top-talent', 'Developing and Retaining Top Talent', 'people-hr-talent',
    'Find, grow and keep the people your organisation depends on.',
    ['Identify high-potential employees', 'Design development and succession plans', 'Use coaching and mentoring effectively', 'Reduce unwanted turnover', 'Measure talent outcomes'],
    ['HR managers', 'Line managers', 'Talent and L&D teams'],
    [['Talent strategy', 'Critical roles and talent pools.'], ['Identifying potential', 'Assessment and calibration.'], ['Development', 'Experiences, coaching and mentoring.'], ['Retention', 'Engagement, reward and careers.'], ['Measurement', 'Talent metrics and reviews.']],
    { cities: ['nairobi', 'dubai', 'johannesburg'] }),

  // ---------- Public sector, law & governance
  C('commercial-law-training', 'Commercial Law', 'public-sector-law-governance',
    'Understand the commercial law that shapes everyday business: contracts, companies, sale of goods, securities and disputes.',
    ['Draft and review commercial contracts', 'Understand company law and directors\' duties', 'Apply sale of goods and agency rules', 'Manage securities, guarantees and insolvency risk', 'Choose the right dispute resolution route'],
    ['Legal officers', 'Company secretaries', 'Procurement and contract managers', 'Business owners and managers'],
    [['Contract law', 'Formation, terms and remedies.'], ['Company law', 'Incorporation, governance and directors.'], ['Commercial transactions', 'Sale of goods, agency and distribution.'], ['Securities and insolvency', 'Guarantees, charges and restructuring.'], ['Disputes', 'Negotiation, arbitration and litigation.']],
    { cities: ['nairobi', 'kigali', 'dubai'] }),
  C('corporate-governance-and-board-competence-training', 'Corporate Governance and Board Competence', 'public-sector-law-governance',
    'Strengthen boards: roles, governance codes, risk oversight and effective board meetings.',
    ['Explain governance principles and codes', 'Clarify board, committee and management roles', 'Oversee strategy, risk and performance', 'Run effective board meetings', 'Evaluate and develop the board'],
    ['Board members', 'Company secretaries', 'Senior executives', 'Governance and compliance officers'],
    [['Governance foundations', 'Principles, codes and law.'], ['Roles', 'Board, committees and management.'], ['Oversight', 'Strategy, risk and internal control.'], ['Board effectiveness', 'Meetings, papers and decisions.'], ['Evaluation', 'Board evaluation and development.']],
    { cities: ['nairobi', 'zanzibar', 'dubai'] }),
  C('intensive-communications-and-pr-for-public-sector-training', 'Intensive Communications and PR for the Public Sector', 'public-sector-law-governance',
    'Plan public communications, work with the media and manage reputation and crises for public institutions.',
    ['Develop a public communications strategy', 'Work effectively with the media', 'Use digital and social media channels', 'Manage crises and reputation', 'Measure communication impact'],
    ['Public communications officers', 'PR and media teams', 'Spokespersons', 'Senior public officials'],
    [['Strategy', 'Audiences, messages and channels.'], ['Media relations', 'Releases, interviews and briefings.'], ['Digital channels', 'Social media and content.'], ['Crisis communication', 'Preparation and response.'], ['Measurement', 'Monitoring and evaluation.']],
    { cities: ['nairobi', 'accra', 'kigali'] }),

  // ---------- ICT, data, AI
  C('ai-powered-knowledge-discovery-systems-training', 'AI-Powered Knowledge Discovery Systems', 'ict-digital-ai',
    'Use AI to search, summarise and analyse your organisation\'s documents and data safely.',
    ['Explain how AI search and retrieval systems work', 'Prepare documents and data for AI', 'Choose tools and platforms', 'Manage accuracy, privacy and security risks', 'Plan a pilot and measure value'],
    ['ICT and data teams', 'Knowledge managers', 'Researchers', 'Managers leading digital work'],
    [['AI basics', 'Language models and retrieval.'], ['Preparing knowledge', 'Documents, metadata and quality.'], ['Tools', 'Platforms, search and assistants.'], ['Risk', 'Accuracy, privacy and governance.'], ['Pilots', 'Use cases, rollout and measurement.']],
    { popular: true, cities: ['mombasa', 'nairobi', 'dubai'] }),
  C('blockchain-technology-and-cryptocurrencies-workshop', 'Blockchain Technology and Cryptocurrencies', 'ict-digital-ai',
    'Understand blockchain, digital assets and their real uses, risks and regulation.',
    ['Explain how blockchains and consensus work', 'Understand cryptocurrencies, stablecoins and tokens', 'Evaluate business use cases', 'Assess risks, fraud and security', 'Follow regulation and policy trends'],
    ['Bank and fintech staff', 'Regulators', 'ICT professionals', 'Auditors and compliance officers'],
    [['Blockchain basics', 'Ledgers, consensus and smart contracts.'], ['Digital assets', 'Cryptocurrencies, stablecoins and tokens.'], ['Use cases', 'Payments, supply chains and records.'], ['Risk', 'Security, fraud and volatility.'], ['Regulation', 'Global and African developments.']],
    { cities: ['nairobi', 'dubai', 'lagos'] }),
  C('oracle-erp-cloud-training-and-certification', 'Oracle ERP Cloud', 'ict-digital-ai',
    'Use and administer Oracle ERP Cloud for finance and procurement processes, and prepare for certification.',
    ['Navigate Oracle ERP Cloud', 'Run core financials processes', 'Run procure-to-pay processes', 'Set up and administer key configurations', 'Prepare for Oracle certification'],
    ['Finance and procurement users', 'ERP administrators', 'Implementation consultants'],
    [['Oracle ERP Cloud overview', 'Navigation, structures and security.'], ['Financials', 'GL, payables and receivables.'], ['Procurement', 'Requisitions, purchasing and suppliers.'], ['Configuration', 'Setups and reporting.'], ['Certification prep', 'Exam scope and practice.']],
    { cities: ['dubai', 'nairobi', 'johannesburg'] }),
  C('productivity-software-microsoft-office-suite-training', 'Productivity with Microsoft Office Suite', 'ict-digital-ai',
    'Work faster and better with Excel, Word, PowerPoint, Outlook and Teams.',
    ['Analyse data with Excel formulas and pivot tables', 'Produce professional documents in Word', 'Build clear presentations in PowerPoint', 'Manage email, calendars and Teams', 'Use Copilot and automation safely'],
    ['Administrative staff', 'Professionals in any field', 'Managers and assistants'],
    [['Excel', 'Formulas, tables, pivots and charts.'], ['Word', 'Styles, long documents and templates.'], ['PowerPoint', 'Design and presenting.'], ['Outlook and Teams', 'Email, calendars and collaboration.'], ['Automation', 'Copilot, macros and shortcuts.']],
    { cities: ['nairobi', 'mombasa', 'kampala'] }),
  C('data-protection-and-privacy-compliance', 'Data Protection and Privacy Compliance', 'ict-digital-ai',
    'Comply with the Kenya Data Protection Act, GDPR and other privacy laws in day-to-day operations.',
    ['Explain data protection principles and rights', 'Map personal data and lawful bases', 'Run data protection impact assessments', 'Handle breaches and data subject requests', 'Build a privacy programme'],
    ['Data protection officers', 'ICT staff', 'Legal and compliance teams'],
    [['The law', 'Kenya DPA, GDPR and regional laws.'], ['Data mapping', 'Records of processing and lawful bases.'], ['DPIAs', 'Assessing high-risk processing.'], ['Breaches and requests', 'Response and notification.'], ['Privacy programme', 'Policies, training and audits.']],
    { cities: ['nairobi', 'kigali', 'dubai'] }),

  // ---------- Hospitality, tourism & travel
  C('online-travel-agencies-and-distribution-systems-training', 'Online Travel Agencies and Distribution Systems', 'hospitality-tourism-travel',
    'Sell more rooms and travel products through OTAs, channel managers and global distribution systems.',
    ['Understand OTAs, GDS and channel managers', 'Optimise listings and content', 'Manage rates, parity and inventory', 'Use reviews and ratings to win bookings', 'Track distribution costs and performance'],
    ['Hotel revenue and reservations staff', 'Tour operators', 'Travel agents', 'Marketing managers'],
    [['Distribution landscape', 'OTAs, GDS, metasearch and direct.'], ['Listings and content', 'Photos, descriptions and rankings.'], ['Rates and inventory', 'Parity, restrictions and channel managers.'], ['Reputation', 'Reviews and responses.'], ['Performance', 'Costs, conversion and reports.']],
    { cities: ['nairobi', 'mombasa', 'zanzibar'] }),
  C('housekeeping-management-and-best-practices-training', 'Housekeeping Management and Best Practices', 'hospitality-tourism-travel',
    'Run housekeeping departments to high standards of cleanliness, guest satisfaction and cost control.',
    ['Set housekeeping standards and checklists', 'Plan staffing and schedules', 'Control linen, chemicals and inventory', 'Apply hygiene and safety practices', 'Train and supervise teams'],
    ['Executive housekeepers', 'Housekeeping supervisors', 'Hotel and lodge managers'],
    [['Standards', 'Room and public area standards.'], ['Planning', 'Staffing, rotas and productivity.'], ['Inventory', 'Linen, amenities and chemicals.'], ['Hygiene and safety', 'Infection control and safe chemicals.'], ['Leadership', 'Training, inspection and motivation.']],
    { cities: ['mombasa', 'nairobi', 'zanzibar'] }),
  C('front-office-management-and-customer-service-training', 'Front Office Management and Customer Service', 'hospitality-tourism-travel',
    'Deliver excellent guest service at the front office, from reservations to check-out and complaint handling.',
    ['Manage reservations and room allocation', 'Run smooth check-in and check-out', 'Deliver consistent service standards', 'Handle complaints and recover service', 'Use PMS reports to improve performance'],
    ['Front office managers', 'Receptionists and reservations staff', 'Guest relations teams'],
    [['Front office operations', 'Roles, systems and standards.'], ['Reservations', 'Booking, allocation and overbooking.'], ['Guest experience', 'Check-in, stay and check-out.'], ['Complaints', 'Service recovery.'], ['Performance', 'Occupancy, ADR and reports.']],
    { cities: ['nairobi', 'mombasa', 'kigali'] }),
  C('corporate-travel-management-training', 'Corporate Travel Management', 'hospitality-tourism-travel',
    'Manage business travel for cost, duty of care and traveller satisfaction.',
    ['Write and apply a travel policy', 'Negotiate with airlines, hotels and agencies', 'Manage travel risk and duty of care', 'Control travel spend with data', 'Use booking and expense tools'],
    ['Travel managers', 'Administration and procurement staff', 'Executive assistants'],
    [['Travel programmes', 'Policy and approval flows.'], ['Suppliers', 'Airlines, hotels and TMCs.'], ['Duty of care', 'Risk assessment and tracking.'], ['Spend control', 'Data, reports and savings.'], ['Tools', 'Booking and expense platforms.']],
    { cities: ['nairobi', 'dubai', 'johannesburg'] }),

  // ---------- Sales & customer
  C('customer-experience-training', 'Customer Experience Excellence', 'sales-marketing-customer',
    'Design and deliver customer experiences that build loyalty, across every channel.',
    ['Map customer journeys and pain points', 'Set service standards and promises', 'Use customer feedback and NPS', 'Handle complaints and recover service', 'Build a customer-centred culture'],
    ['Customer service managers', 'Front-line teams', 'Marketing and CX teams'],
    [['Customer experience', 'Expectations and loyalty.'], ['Journey mapping', 'Touchpoints and moments of truth.'], ['Standards', 'Service design across channels.'], ['Feedback', 'NPS, CSAT and complaints.'], ['Culture', 'Leadership and empowerment.']],
    { cities: ['nairobi', 'dubai', 'kigali'] }),
  C('closing-the-deal-proven-sales-closing-techniques-training', 'Closing the Deal: Proven Sales Closing Techniques', 'sales-marketing-customer',
    'Win more business with consultative selling, objection handling and confident closing.',
    ['Qualify prospects and needs', 'Present value clearly', 'Handle objections confidently', 'Use proven closing techniques', 'Manage the pipeline to forecast accurately'],
    ['Sales executives', 'Business development staff', 'Account managers', 'Entrepreneurs'],
    [['Consultative selling', 'Questions and needs.'], ['Value presentation', 'Benefits and proof.'], ['Objections', 'Techniques and practice.'], ['Closing', 'Signals, techniques and follow-up.'], ['Pipeline', 'CRM, forecasting and targets.']],
    { cities: ['kigali', 'nairobi', 'lagos'] }),
]

// ---------- sessions: a Monday-start pattern from late Nov 2026 to mid 2027 (past dates drop off at each build)
const MONDAYS = []
for (let d = new Date(Date.UTC(2026, 10, 23)); d < Date.UTC(2027, 6, 1); d.setUTCDate(d.getUTCDate() + 7)) MONDAYS.push(new Date(d))
const iso = (d) => d.toISOString().slice(0, 10)
const addDays = (d, n) => { const x = new Date(d); x.setUTCDate(x.getUTCDate() + n); return x }

// Fees per participant. online + premium(USD 4,200) seen on the live site; KE and INT classroom fees: CONFIRM
const FEES = {
  online: { 5: { currency: 'KES', amount: 70000 }, 10: { currency: 'KES', amount: 140000 } },
  KE: { 5: { currency: 'KES', amount: 85000 }, 10: { currency: 'KES', amount: 170000 } },
  INT: { 5: { currency: 'USD', amount: 2500 }, 10: { currency: 'USD', amount: 4500 } },
  premium: { 5: { currency: 'USD', amount: 4200 }, 10: { currency: 'USD', amount: 7800 } },
}
const PREMIUM = new Set(['dubai', 'cairo'])

function sessionsFor(course, idx, sparse = false) {
  const out = []
  if (course.firstClassroom) out.push({ format: 'classroom', city: course.classroomCities[0], start: course.firstClassroom })
  MONDAYS.forEach((mon, w) => {
    const start = iso(mon)
    if (start === course.firstClassroom) return
    // live online roughly every second week (imported courses: every fourth)
    if ((w + idx) % (sparse ? 4 : 2) === 0) out.push({ format: 'online', city: null, start })
    // classroom roughly every third week, rotating cities (imported courses: every sixth)
    if ((w + idx) % (sparse ? 6 : 3) === 1) {
      const city = course.classroomCities[(w + idx) % course.classroomCities.length]
      out.push({ format: 'classroom', city, start })
    }
  })
  out.sort((a, b) => (a.start < b.start ? -1 : a.start > b.start ? 1 : 0))
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

// Courses merged from WeSkill Training Institute (weskill-courses.json). Fees and dates follow the Trainingcred rules above.
const ALL = [...RAW, ...WESKILL.map((w) => C(w.slug, w.title, w.category, w.summary, w.outcomes, w.audience, w.modules, { cities: w.cities }))]

// Courses imported from trainingcred.com (tc-index.json, built by the import script). Only the list fields
// live in the app; outlines, outcomes and audience load from /course-data/<slug>.json on the course page.
const KE_CITIES = ['nairobi', 'mombasa', 'naivasha', 'kisumu']
const INT_CITIES = ['kigali', 'kampala', 'zanzibar', 'dubai', 'accra', 'lagos', 'johannesburg', 'cairo']
// A topic with no photo yet borrows one from another topic in the same focus area, so every course has a picture.
const BY_CATEGORY = {}
for (const [, , cat, t] of TC.courses) {
  const list = BY_TOPIC[topicSlug(TC.topics[t])]
  if (list) for (const u of list) { const s = (BY_CATEGORY[cat] = BY_CATEGORY[cat] || new Set()); s.add(u) }
}
const categoryPhoto = (cat, slug) => { const list = BY_CATEGORY[cat] ? [...BY_CATEGORY[cat]] : null; return list && list.length ? list[hash(slug) % list.length] : null }
const IMPORTED = TC.courses.map(([slug, title, category, t, long]) => {
  const h = hash(slug)
  return {
    slug, title, category, summary: '', topic: TC.topics[t], outcomes: [], audience: [], modules: [],
    durations: long ? [10] : [5, 10], popular: false, imported: true,
    classroomCities: [KE_CITIES[h % 4], INT_CITIES[(h >>> 3) % 8], INT_CITIES[(h >>> 7) % 8]].filter((c, i, a) => a.indexOf(c) === i),
    firstClassroom: null,
  }
})

// sessions are worked out the first time something asks for them (4,000+ courses)
const withSessions = (c, i, sparse) => {
  let cache
  return Object.defineProperty(c, 'sessions', {
    enumerable: true,
    get() { return cache || (cache = sessionsFor(c, i, sparse)) },
  })
}
export const COURSES = [
  ...ALL.map((c, i) => withSessions({ ...c, image: photoFor(c.slug) }, i, false)),
  ...IMPORTED.map((c, i) => withSessions({ ...c, image: photoFor(c.slug) || topicPhoto(c.topic, c.slug) || categoryPhoto(c.category, c.slug) }, ALL.length + i, true)),
]
const BY_SLUG = new Map(COURSES.map((c) => [c.slug, c]))
export const courseBySlug = (s) => BY_SLUG.get(s)
