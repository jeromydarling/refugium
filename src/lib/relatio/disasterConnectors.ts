/**
 * disasterConnectors — Integration definitions for disaster response platforms.
 *
 * WHAT: Defines how Refugium connects to crisis response tools that hand off families.
 * WHERE: Settings > Integrations, Onboarding Step 2, Relatio connector framework
 * WHY: "The state responds. The community recovers." These integrations bridge the gap.
 *
 * Each connector defines:
 * - What the platform does (crisis response phase)
 * - What data Refugium imports (recovery phase)
 * - API details for Lovable/Supabase integration
 * - Setup guide for coordinators
 */

export interface DisasterConnector {
  key: string;
  name: string;
  description: string;
  category: 'crisis_response' | 'resource_api' | 'crm_migration' | 'data_feed';
  logo?: string;
  website: string;
  apiType: 'rest' | 'graphql' | 'csv' | 'webhook' | 'manual';
  authType: 'api_key' | 'oauth2' | 'bearer' | 'none' | 'manual';
  status: 'available' | 'coming_soon' | 'auto_connected';

  /** What this platform does in the crisis response phase */
  crisisRole: string;

  /** What Refugium imports from this platform */
  dataImported: string[];

  /** What Refugium can send back */
  dataExported?: string[];

  /** The handoff story — why this integration matters */
  handoffStory: string;

  /** API endpoint base URL (for Lovable integration) */
  apiBaseUrl?: string;

  /** API documentation URL */
  apiDocsUrl?: string;

  /** Whether this requires coordinator action or runs automatically */
  setupType: 'automatic' | 'one_click' | 'guided' | 'manual_import';

  /** Estimated setup time */
  setupTime: string;

  /** Setup steps for the coordinator */
  setupSteps?: string[];
}

// ═══════════════════════════════════════════════════════════
// CRISIS RESPONSE PLATFORM CONNECTORS
// "They save lives in the first 72 hours. We serve the next 72 months."
// ═══════════════════════════════════════════════════════════

export const DISASTER_CONNECTORS: DisasterConnector[] = [
  // ── Crisis Response Platforms ──
  {
    key: 'pubsafe',
    name: 'PubSafe',
    description: 'Volunteer coordination and incident management for disaster response.',
    category: 'crisis_response',
    website: 'https://pubsafe.net',
    apiType: 'rest',
    authType: 'api_key',
    status: 'coming_soon',
    crisisRole: 'Coordinates volunteers, manages incidents, deploys resources during the acute response phase.',
    dataImported: [
      'Affected individuals and families',
      'Volunteer rosters with skills and availability',
      'Incident locations and severity',
      'Resource deployment records',
      'Geographic boundaries of affected areas',
    ],
    dataExported: [
      'Long-term recovery outcomes for their deployed volunteers',
      'Household stabilization rates',
      'Impact narratives for their funders',
    ],
    handoffStory: 'PubSafe deploys 200 volunteers in 48 hours. Six months later, the families those volunteers helped are still in FEMA trailers. Refugium picks up where PubSafe leaves off — tracking each family\'s journey from displacement to renewal.',
    apiDocsUrl: 'https://pubsafe.net/developers',
    setupType: 'guided',
    setupTime: '10 minutes',
    setupSteps: [
      'Sign in to your PubSafe account as an admin',
      'Navigate to Settings → API Access',
      'Generate an API key for Refugium',
      'Paste the key in Refugium Settings → Integrations → PubSafe',
      'Select which deployment to import from',
      'Review the dry-run import preview',
      'Confirm import — families appear as new refuges',
    ],
  },
  {
    key: 'ushahidi',
    name: 'Ushahidi',
    description: 'Open-source crisis mapping and crowdsourced incident reporting.',
    category: 'crisis_response',
    website: 'https://www.ushahidi.com',
    apiType: 'rest',
    authType: 'oauth2',
    status: 'coming_soon',
    crisisRole: 'Collects crowdsourced crisis reports with GPS coordinates, categories, photos, and descriptions.',
    dataImported: [
      'Crisis reports as potential refuges (person/family in need)',
      'GPS coordinates for household locations',
      'Incident categories mapped to need types',
      'Photos and descriptions as initial field notes',
      'Reporter contact info (if available)',
    ],
    handoffStory: 'Ushahidi maps the crisis in real time. Every pin is a person. Refugium turns those pins into people with names, needs, and a recovery journey that someone is walking beside them.',
    apiBaseUrl: 'https://api.ushahidi.io/api/v5',
    apiDocsUrl: 'https://docs.ushahidi.com/platform-developer-documentation',
    setupType: 'guided',
    setupTime: '15 minutes',
    setupSteps: [
      'Sign in to your Ushahidi deployment',
      'Go to Settings → API → Create OAuth Client',
      'Copy the Client ID and Secret',
      'In Refugium, go to Settings → Integrations → Ushahidi',
      'Paste credentials and authorize',
      'Select the deployment and survey to import from',
      'Map Ushahidi fields to Refugium household fields',
      'Review dry-run and confirm import',
    ],
  },
  {
    key: 'sahana',
    name: 'Sahana Eden',
    description: 'Emergency management platform for shelter registry, supply chain, and person tracking.',
    category: 'crisis_response',
    website: 'https://sahanafoundation.org/eden',
    apiType: 'rest',
    authType: 'api_key',
    status: 'coming_soon',
    crisisRole: 'Manages shelter registries, tracks displaced persons, coordinates supply distribution during emergencies.',
    dataImported: [
      'Person registry (displaced individuals and families)',
      'Shelter assignments and duration',
      'Supply distribution records',
      'Medical needs flagged during intake',
      'Family group linkages',
    ],
    handoffStory: 'Sahana tracks who\'s in the shelter. Refugium tracks what happens after the shelter closes — because displacement doesn\'t end when the cots are folded up.',
    apiBaseUrl: 'https://demo.eden.sahanafoundation.org/eden',
    apiDocsUrl: 'https://eden.sahanafoundation.org/wiki/S3',
    setupType: 'guided',
    setupTime: '15 minutes',
    setupSteps: [
      'Sign in to your Sahana Eden instance as admin',
      'Go to Admin → System Settings → API',
      'Enable REST API and generate credentials',
      'In Refugium, paste the instance URL and credentials',
      'Select modules to import from (Person Registry, Shelter)',
      'Map fields and review dry-run',
      'Confirm import',
    ],
  },
  {
    key: 'crisiscleanup',
    name: 'CrisisCleanup',
    description: 'Volunteer coordination platform for disaster cleanup work orders.',
    category: 'crisis_response',
    website: 'https://www.crisiscleanup.org',
    apiType: 'rest',
    authType: 'bearer',
    status: 'coming_soon',
    crisisRole: 'Coordinates volunteer cleanup crews with work orders — debris removal, mucking, tarping, tree removal.',
    dataImported: [
      'Work order addresses (households that needed cleanup)',
      'Damage types and severity',
      'Completion status',
      'Homeowner contact information',
      'Photos of damage',
    ],
    handoffStory: 'CrisisCleanup clears the debris. But the family still needs a roof, a job, and hope. Refugium imports cleanup cases and continues the journey — because clean doesn\'t mean recovered.',
    apiBaseUrl: 'https://api.crisiscleanup.org/api',
    apiDocsUrl: 'https://api.crisiscleanup.org/docs',
    setupType: 'guided',
    setupTime: '10 minutes',
    setupSteps: [
      'Log in to CrisisCleanup as an org admin',
      'Go to Profile → API Keys',
      'Generate a token for Refugium',
      'In Refugium, paste the token',
      'Select the incident to import from',
      'Review work orders that will become refuges',
      'Confirm import',
    ],
  },
  {
    key: 'd4h',
    name: 'D4H',
    description: 'Incident management and team readiness platform for emergency response.',
    category: 'crisis_response',
    website: 'https://d4h.com',
    apiType: 'rest',
    authType: 'bearer',
    status: 'coming_soon',
    crisisRole: 'Manages incident response teams, equipment deployment, and operational readiness.',
    dataImported: [
      'Incident details and affected areas',
      'Personnel deployment records',
      'Resource allocation data',
      'After-action reports',
    ],
    handoffStory: 'D4H demobilizes the response team. The incident is "closed." But for the families who were served, recovery is just beginning.',
    apiBaseUrl: 'https://api.d4h.com/v2',
    apiDocsUrl: 'https://api.d4h.com/docs',
    setupType: 'guided',
    setupTime: '10 minutes',
    setupSteps: [
      'Sign in to D4H as team admin',
      'Go to Admin → API → Generate Token',
      'In Refugium, paste the token and select your team',
      'Choose the incident to import from',
      'Review and confirm',
    ],
  },
  {
    key: 'rc_view',
    name: 'Red Cross',
    description: 'American Red Cross damage assessment and case management data.',
    category: 'crisis_response',
    website: 'https://www.redcross.org',
    apiType: 'csv',
    authType: 'manual',
    status: 'coming_soon',
    crisisRole: 'Conducts damage assessments, provides emergency financial assistance, operates shelters.',
    dataImported: [
      'Damage assessment records',
      'Financial assistance provided',
      'Shelter stay records',
      'Case file summaries',
    ],
    handoffStory: 'The Red Cross provides the first check and the first shelter. Refugium ensures someone is still there at month 6, month 12, month 36 — long after the Red Cross chapter has moved to the next disaster.',
    setupType: 'manual_import',
    setupTime: '15-30 minutes',
    setupSteps: [
      'Export case files from RC VIEW as CSV',
      'In Refugium, go to Settings → Import → Upload CSV',
      'Map CSV columns to Refugium household fields',
      'Review the dry-run preview',
      'Confirm import',
    ],
  },

  // ── Resource API Connectors (auto or one-click) ──
  {
    key: 'fema',
    name: 'FEMA OpenData',
    description: 'Federal disaster declarations, assistance programs, and geographic data.',
    category: 'data_feed',
    website: 'https://www.fema.gov/about/openfema',
    apiType: 'rest',
    authType: 'none',
    status: 'auto_connected',
    crisisRole: 'Declares disasters, activates assistance programs, defines eligible areas.',
    dataImported: [
      'Active disaster declarations',
      'Individual Assistance / Public Assistance program status',
      'Geographic boundaries of declared areas',
      'Historical disaster data for context',
    ],
    handoffStory: 'FEMA declares the disaster. Refugium auto-detects it and surfaces the right assistance programs for every family in the affected area.',
    apiBaseUrl: 'https://www.fema.gov/api/open/v2',
    apiDocsUrl: 'https://www.fema.gov/about/openfema/api',
    setupType: 'automatic',
    setupTime: 'Already connected',
  },
  {
    key: 'nws',
    name: 'National Weather Service',
    description: 'Real-time weather alerts, warnings, and forecasts.',
    category: 'data_feed',
    website: 'https://www.weather.gov',
    apiType: 'rest',
    authType: 'none',
    status: 'auto_connected',
    crisisRole: 'Issues weather watches, warnings, and advisories.',
    dataImported: ['Active alerts by state/area', 'Severity levels', 'Affected areas'],
    handoffStory: 'NWS issues the warning. Refugium surfaces it to every navigator with families in the affected area.',
    apiBaseUrl: 'https://api.weather.gov',
    apiDocsUrl: 'https://www.weather.gov/documentation/services-web-api',
    setupType: 'automatic',
    setupTime: 'Already connected',
  },
  {
    key: 'snap',
    name: 'USDA SNAP Retailers',
    description: 'All SNAP/EBT-accepting food retailers by location.',
    category: 'resource_api',
    website: 'https://www.fns.usda.gov/snap/retailer-locator',
    apiType: 'rest',
    authType: 'none',
    status: 'auto_connected',
    crisisRole: 'Locates food assistance retailers near any address.',
    dataImported: ['Store name, address, type', 'SNAP acceptance status', 'GPS coordinates'],
    setupType: 'automatic',
    setupTime: 'Already connected',
    handoffStory: 'Every family in recovery needs to eat. SNAP retailer data ensures navigators can point to the nearest food assistance within minutes.',
  },
  {
    key: 'usajobs',
    name: 'USAJOBS',
    description: 'Federal job listings including FEMA, SBA, and disaster recovery positions.',
    category: 'resource_api',
    website: 'https://developer.usajobs.gov',
    apiType: 'rest',
    authType: 'api_key',
    status: 'available',
    crisisRole: 'Lists federal jobs, especially disaster recovery specialist positions.',
    dataImported: ['Job listings filtered by location and disaster keywords', 'Salary ranges', 'Application URLs'],
    setupType: 'one_click',
    setupTime: '2 minutes',
    handoffStory: 'When someone loses their job to a disaster, USAJOBS surfaces opportunities — including disaster recovery positions that let survivors help others.',
    apiBaseUrl: 'https://data.usajobs.gov/api',
    apiDocsUrl: 'https://developer.usajobs.gov',
    setupSteps: [
      'Register at developer.usajobs.gov (free)',
      'Copy your API key and email',
      'Paste in Refugium Settings → Integrations → USAJOBS',
    ],
  },
  {
    key: '211',
    name: '211 National Data',
    description: 'Comprehensive social services directory — housing, food, health, employment, legal.',
    category: 'resource_api',
    website: 'https://www.211.org',
    apiType: 'rest',
    authType: 'api_key',
    status: 'available',
    crisisRole: 'The national referral service for social services.',
    dataImported: ['Service listings by category and ZIP', 'Provider details', 'Eligibility criteria', 'Hours and contact info'],
    setupType: 'one_click',
    setupTime: '5 minutes',
    handoffStory: '211 knows every social service in America. Refugium surfaces the ones that matter for each specific family, right now.',
    apiBaseUrl: 'https://apiportal.211.org',
    apiDocsUrl: 'https://apiportal.211.org/get-started-overview',
    setupSteps: [
      'Register at apiportal.211.org (free trial)',
      'Subscribe to the Query API product',
      'Copy your API key',
      'Paste in Refugium Settings → Integrations → 211',
    ],
  },
  {
    key: 'hrsa',
    name: 'HRSA Health Centers',
    description: 'Federally qualified health centers — free/sliding-scale care.',
    category: 'resource_api',
    website: 'https://findahealthcenter.hrsa.gov',
    apiType: 'rest',
    authType: 'none',
    status: 'auto_connected',
    crisisRole: 'Locates health centers that provide care regardless of ability to pay.',
    dataImported: ['Health center locations', 'Services offered', 'Languages', 'Walk-in availability'],
    setupType: 'automatic',
    setupTime: 'Already connected',
    handoffStory: 'When Elena needs her diabetes medication and has no insurance, HRSA data finds the nearest sliding-scale pharmacy. That\'s not a feature. That\'s a lifeline.',
  },

  // ── CRM Migration Connectors ──
  {
    key: 'charitytracker',
    name: 'CharityTracker',
    description: 'Case management platform used by many disaster recovery nonprofits.',
    category: 'crm_migration',
    website: 'https://www.charitytracker.com',
    apiType: 'csv',
    authType: 'manual',
    status: 'coming_soon',
    crisisRole: 'Tracks cases, services provided, and outcomes for nonprofits.',
    dataImported: ['Client records → households', 'Service history → field notes', 'Needs assessments → active needs', 'Referrals → partner connections'],
    setupType: 'manual_import',
    setupTime: '20-30 minutes',
    handoffStory: 'CharityTracker helped you track cases. Refugium helps you navigate recoveries. Import your history and keep the thread alive.',
    setupSteps: [
      'Export client data from CharityTracker as CSV',
      'In Refugium, go to Settings → Import → Upload CSV',
      'Use the Migration Assistant to map fields',
      'Review the dry-run preview',
      'Confirm import — cases become refuges with history intact',
    ],
  },
  {
    key: 'google_sheets',
    name: 'Google Sheets',
    description: 'For organizations tracking families in spreadsheets (the most common tool).',
    category: 'crm_migration',
    website: 'https://sheets.google.com',
    apiType: 'csv',
    authType: 'manual',
    status: 'available',
    crisisRole: 'The default "database" for most small disaster relief organizations.',
    dataImported: ['Any columns → mapped to household fields', 'Flexible import with column mapping wizard'],
    setupType: 'manual_import',
    setupTime: '10-15 minutes',
    handoffStory: 'Most organizations tracking disaster survivors are using a spreadsheet. That\'s not a criticism — it\'s a starting point. Refugium imports your sheet and gives every row a name, a journey, and a compass.',
    setupSteps: [
      'Download your Google Sheet as CSV',
      'In Refugium, go to Settings → Import → Upload CSV',
      'Map your columns to Refugium fields (name, address, phone, needs, etc.)',
      'Review the preview',
      'Confirm — your spreadsheet becomes a living recovery dashboard',
    ],
  },
];

// ── Helper functions ──

export function getConnectorsByCategory(category: DisasterConnector['category']): DisasterConnector[] {
  return DISASTER_CONNECTORS.filter(c => c.category === category);
}

export function getConnectorByKey(key: string): DisasterConnector | undefined {
  return DISASTER_CONNECTORS.find(c => c.key === key);
}

export function getAutoConnected(): DisasterConnector[] {
  return DISASTER_CONNECTORS.filter(c => c.status === 'auto_connected');
}

export function getAvailable(): DisasterConnector[] {
  return DISASTER_CONNECTORS.filter(c => c.status === 'available' || c.status === 'coming_soon');
}
