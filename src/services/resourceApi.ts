/**
 * Refugium API Service Layer
 *
 * Architecture for Lovable/Supabase handoff:
 * - Each function currently returns mock data shaped like real API responses
 * - When migrating to Supabase, replace the mock returns with:
 *   const { data } = await supabase.functions.invoke('api-name', { body: params })
 * - All TypeScript interfaces match the real API response shapes
 * - The components consuming these services don't need to change
 */

// ═══════════════════════════════════════════════════════════
// FEMA Disaster Declarations (OpenFEMA API)
// Real endpoint: https://www.fema.gov/api/open/v2/DisasterDeclarationsSummaries
// Auth: None required
// ═══════════════════════════════════════════════════════════

export interface FemaDisaster {
  disasterNumber: number;
  state: string;
  declarationDate: string;
  disasterType: string;
  incidentType: string;
  title: string;
  incidentBeginDate: string;
  incidentEndDate: string | null;
  designatedArea: string;
  ihProgramDeclared: boolean; // Individual & Households Program
  iaProgramDeclared: boolean; // Individual Assistance
  paProgramDeclared: boolean; // Public Assistance
  hmProgramDeclared: boolean; // Hazard Mitigation
}

export async function searchFemaDisasters(state: string): Promise<FemaDisaster[]> {
  // TODO: Replace with real API call
  // const res = await fetch(`https://www.fema.gov/api/open/v2/DisasterDeclarationsSummaries?$filter=state eq '${state}'&$orderby=declarationDate desc&$top=5`);
  await new Promise(r => setTimeout(r, 800));
  return [
    { disasterNumber: 4794, state, declarationDate: '2024-09-15', disasterType: 'DR', incidentType: 'Hurricane', title: 'HURRICANE FRANCINE', incidentBeginDate: '2024-09-10', incidentEndDate: '2024-09-14', designatedArea: 'Statewide', ihProgramDeclared: true, iaProgramDeclared: true, paProgramDeclared: true, hmProgramDeclared: true },
    { disasterNumber: 4768, state, declarationDate: '2024-04-15', disasterType: 'DR', incidentType: 'Flood', title: 'SEVERE STORMS AND FLOODING', incidentBeginDate: '2024-04-10', incidentEndDate: '2024-04-18', designatedArea: 'Multiple parishes', ihProgramDeclared: true, iaProgramDeclared: true, paProgramDeclared: true, hmProgramDeclared: false },
    { disasterNumber: 4757, state, declarationDate: '2024-04-08', disasterType: 'DR', incidentType: 'Tornado', title: 'SEVERE STORMS, TORNADOES', incidentBeginDate: '2024-04-05', incidentEndDate: '2024-04-07', designatedArea: 'Southern counties', ihProgramDeclared: true, iaProgramDeclared: true, paProgramDeclared: false, hmProgramDeclared: true },
  ];
}

// ═══════════════════════════════════════════════════════════
// National Weather Service Alerts (api.weather.gov)
// Real endpoint: https://api.weather.gov/alerts/active?area={state}
// Auth: User-Agent header only
// ═══════════════════════════════════════════════════════════

export interface WeatherAlert {
  id: string;
  event: string;
  severity: 'Extreme' | 'Severe' | 'Moderate' | 'Minor' | 'Unknown';
  headline: string;
  description: string;
  areaDesc: string;
  onset: string;
  expires: string;
}

export async function getActiveAlerts(state: string): Promise<WeatherAlert[]> {
  await new Promise(r => setTimeout(r, 600));
  return [
    { id: 'nws-001', event: 'Flood Watch', severity: 'Moderate', headline: 'Flood Watch in effect through Wednesday evening', description: 'Heavy rainfall expected. 2-4 inches possible in low-lying areas. Monitor local conditions.', areaDesc: 'Baton Rouge, Lafayette, Lake Charles', onset: new Date().toISOString(), expires: new Date(Date.now() + 48 * 3600000).toISOString() },
    { id: 'nws-002', event: 'Heat Advisory', severity: 'Minor', headline: 'Heat Advisory until 7 PM CDT', description: 'Heat index values up to 108°F. Drink plenty of fluids, stay in air-conditioned spaces.', areaDesc: 'Southern Louisiana', onset: new Date().toISOString(), expires: new Date(Date.now() + 8 * 3600000).toISOString() },
  ];
}

// ═══════════════════════════════════════════════════════════
// Jobs — USAJOBS + JSearch combined
// USAJOBS: https://data.usajobs.gov/api/search (free API key)
// JSearch: https://jsearch.p.rapidapi.com/search (RapidAPI free tier)
// ═══════════════════════════════════════════════════════════

export interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: 'full-time' | 'part-time' | 'temporary' | 'contract';
  posted: string;
  url: string;
  source: 'usajobs' | 'jsearch' | 'local';
  disasterRelated?: boolean;
  description: string;
}

export async function searchJobs(location: string, keywords?: string): Promise<JobListing[]> {
  await new Promise(r => setTimeout(r, 1200));
  const city = location.split(',')[0]?.trim() || 'Baton Rouge';
  return [
    { id: 'j-001', title: 'FEMA Disaster Recovery Specialist', company: 'Federal Emergency Management Agency', location: `${city}, LA`, salary: '$52,000 - $78,000/yr', type: 'temporary', posted: '2 days ago', url: '#', source: 'usajobs', disasterRelated: true, description: 'Support disaster survivors with individual assistance applications, housing inspections, and resource coordination.' },
    { id: 'j-002', title: 'Disaster Case Manager', company: 'Catholic Charities', location: `${city}, LA`, salary: '$38,000 - $48,000/yr', type: 'full-time', posted: '5 days ago', url: '#', source: 'jsearch', disasterRelated: true, description: 'Provide case management services to disaster-affected individuals and families. Coordinate with partner agencies.' },
    { id: 'j-003', title: 'Construction Laborer — Storm Recovery', company: 'Habitat for Humanity', location: `${city}, LA`, salary: '$18 - $25/hr', type: 'full-time', posted: '1 day ago', url: '#', source: 'jsearch', disasterRelated: true, description: 'Assist with home repairs, debris removal, and rebuilding for disaster-affected families.' },
    { id: 'j-004', title: 'Warehouse Associate', company: 'Amazon Fulfillment', location: `${city}, LA`, salary: '$17.50/hr', type: 'full-time', posted: '3 days ago', url: '#', source: 'jsearch', description: 'Pick, pack, and ship orders. Flexible scheduling available. No experience required.' },
    { id: 'j-005', title: 'CDL Truck Driver', company: 'Gulf Coast Logistics', location: `${city}, LA`, salary: '$22 - $28/hr', type: 'full-time', posted: '1 week ago', url: '#', source: 'jsearch', description: 'Local and regional routes. Must have valid CDL. Disaster supply chain routes available.' },
    { id: 'j-006', title: 'SBA Loan Officer (Disaster)', company: 'Small Business Administration', location: `${city}, LA`, salary: '$60,000 - $85,000/yr', type: 'temporary', posted: '4 days ago', url: '#', source: 'usajobs', disasterRelated: true, description: 'Process disaster loan applications for homeowners and businesses. Travel to Disaster Recovery Centers.' },
    { id: 'j-007', title: 'Home Health Aide', company: 'Amedisys Home Health', location: `${city}, LA`, salary: '$14 - $18/hr', type: 'part-time', posted: '2 days ago', url: '#', source: 'jsearch', description: 'Provide in-home care assistance. Flexible hours. CNA certification preferred but not required.' },
    { id: 'j-008', title: 'Restaurant Cook', company: `${city} Diner`, location: `${city}, LA`, salary: '$15 - $19/hr', type: 'full-time', posted: '6 days ago', url: '#', source: 'local', description: 'Line cook position. Experience preferred. Immediate start available.' },
  ];
}

// ═══════════════════════════════════════════════════════════
// SNAP Retailers (USDA ArcGIS Feature Service)
// Real endpoint: https://services2.arcgis.com/.../SNAP_Retailer_Locations/FeatureServer/0/query
// Auth: None required
// ═══════════════════════════════════════════════════════════

export interface SnapRetailer {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  storeType: string;
  lat: number;
  lng: number;
  distance?: string;
}

export async function searchSnapRetailers(zip: string): Promise<SnapRetailer[]> {
  await new Promise(r => setTimeout(r, 700));
  return [
    { id: 'snap-001', name: 'Walmart Supercenter', address: '3142 College Dr', city: 'Baton Rouge', state: 'LA', zip, storeType: 'Supermarket', lat: 30.4107, lng: -91.1357, distance: '1.2 mi' },
    { id: 'snap-002', name: "Rouse's Market", address: '7361 Jefferson Hwy', city: 'Baton Rouge', state: 'LA', zip, storeType: 'Supermarket', lat: 30.4233, lng: -91.1104, distance: '2.1 mi' },
    { id: 'snap-003', name: 'Dollar General', address: '1890 Plank Rd', city: 'Baton Rouge', state: 'LA', zip, storeType: 'Small Grocery', lat: 30.4651, lng: -91.1601, distance: '2.8 mi' },
    { id: 'snap-004', name: "Albertsons", address: '4861 Government St', city: 'Baton Rouge', state: 'LA', zip, storeType: 'Supermarket', lat: 30.4455, lng: -91.1411, distance: '3.4 mi' },
    { id: 'snap-005', name: 'Red Stick Farmers Market', address: '501 Main St', city: 'Baton Rouge', state: 'LA', zip, storeType: 'Farmers Market', lat: 30.4515, lng: -91.1871, distance: '4.0 mi' },
  ];
}

// ═══════════════════════════════════════════════════════════
// Emergency Shelters (Homeless Shelter API via RapidAPI)
// Real endpoint: https://homeless-shelter.p.rapidapi.com/search
// Auth: RapidAPI key required
// ═══════════════════════════════════════════════════════════

export interface EmergencyShelter {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  type: string;
  acceptsFamilies: boolean;
  acceptsPets: boolean;
  distance?: string;
}

export async function searchShelters(city: string, state: string): Promise<EmergencyShelter[]> {
  await new Promise(r => setTimeout(r, 900));
  return [
    { id: 'sh-001', name: 'Capital Area United Way Shelter', address: '700 Laurel St', city, state, zip: '70802', phone: '(225) 555-9001', type: 'Emergency', acceptsFamilies: true, acceptsPets: false, distance: '0.8 mi' },
    { id: 'sh-002', name: 'Salvation Army Emergency Lodge', address: '7361 Airline Hwy', city, state, zip: '70805', phone: '(225) 555-9002', type: 'Emergency', acceptsFamilies: true, acceptsPets: false, distance: '3.2 mi' },
    { id: 'sh-003', name: "St. Vincent de Paul Men's Shelter", address: '3900 Magazine St', city, state, zip: '70802', phone: '(225) 555-9003', type: 'Transitional', acceptsFamilies: false, acceptsPets: false, distance: '4.1 mi' },
    { id: 'sh-004', name: 'Volunteers of America Family Shelter', address: '4152 Canal St', city, state, zip: '70119', phone: '(504) 555-9004', type: 'Family', acceptsFamilies: true, acceptsPets: true, distance: '5.5 mi' },
  ];
}

// ═══════════════════════════════════════════════════════════
// Social Services via 211 (211 API Portal)
// Real endpoint: https://apiportal.211.org/api/search
// Auth: Free API key
// ═══════════════════════════════════════════════════════════

export interface SocialService {
  id: string;
  name: string;
  provider: string;
  category: string;
  description: string;
  address: string;
  phone: string;
  hours: string;
  eligibility: string;
  url?: string;
  distance?: string;
}

export async function search211Services(zip: string, category?: string): Promise<SocialService[]> {
  await new Promise(r => setTimeout(r, 1000));
  return [
    { id: '211-001', name: 'Emergency Rental Assistance Program', provider: 'LA Housing Corporation', category: 'housing', description: 'Up to 12 months of rental assistance for disaster-affected households. Covers rent and utilities arrears.', address: '2415 Quail Dr, Baton Rouge, LA 70808', phone: '(225) 555-8001', hours: 'Mon-Fri 8am-5pm', eligibility: 'Income below 80% AMI, disaster-affected', distance: '2.3 mi' },
    { id: '211-002', name: 'SNAP Application Assistance', provider: 'LA Dept of Children & Family Services', category: 'food', description: 'Walk-in assistance for SNAP/D-SNAP applications. Same-day processing for disaster survivors.', address: '627 N 4th St, Baton Rouge, LA 70802', phone: '(225) 555-8002', hours: 'Mon-Fri 7:30am-5pm', eligibility: 'Disaster-affected households', distance: '1.1 mi' },
    { id: '211-003', name: 'Free Legal Clinic — Disaster Issues', provider: 'Southeast LA Legal Services', category: 'legal', description: 'Free legal help: insurance disputes, landlord issues, FEMA appeals, contractor fraud. No appointment needed.', address: '1010 Common St, New Orleans, LA 70112', phone: '(504) 555-8003', hours: 'Tue & Thu 9am-3pm', eligibility: 'Disaster-affected, income-qualified', distance: '5.8 mi' },
    { id: '211-004', name: 'Crisis Counseling — Walk-In', provider: 'Capital Area Human Services', category: 'mental_health', description: 'Free short-term counseling for disaster stress, grief, anxiety. Individual and family sessions. No insurance required.', address: '4615 Government St, Baton Rouge, LA 70806', phone: '(225) 555-8004', hours: 'Mon-Sat 8am-8pm', eligibility: 'All disaster survivors', distance: '3.0 mi' },
    { id: '211-005', name: 'Disaster Unemployment Assistance', provider: 'LA Workforce Commission', category: 'employment', description: 'Temporary unemployment benefits for workers who lost jobs due to a federally declared disaster. Includes self-employed.', address: '1001 N 23rd St, Baton Rouge, LA 70802', phone: '(866) 555-8005', hours: 'Mon-Fri 8am-4:30pm', eligibility: 'Workers displaced by declared disaster', distance: '1.5 mi' },
    { id: '211-006', name: 'Medication Assistance Program', provider: 'Community Health Center', category: 'medical', description: 'Free or reduced-cost prescription medications for uninsured disaster survivors. 90-day supply available.', address: '3700 Florida Blvd, Baton Rouge, LA 70806', phone: '(225) 555-8006', hours: 'Mon-Fri 8am-5pm, Sat 9am-1pm', eligibility: 'Uninsured, disaster-affected', distance: '2.7 mi' },
  ];
}

// ═══════════════════════════════════════════════════════════
// HUD Fair Market Rents
// Real endpoint: https://www.huduser.gov/hudapi/public/fmr/data/{entityId}
// Auth: Free Bearer token
// ═══════════════════════════════════════════════════════════

export interface FairMarketRent {
  areaName: string;
  year: number;
  efficiency: number;
  oneBedroom: number;
  twoBedroom: number;
  threeBedroom: number;
  fourBedroom: number;
}

export async function getFairMarketRent(zip: string): Promise<FairMarketRent> {
  await new Promise(r => setTimeout(r, 500));
  return {
    areaName: 'Baton Rouge, LA MSA',
    year: 2025,
    efficiency: 748,
    oneBedroom: 843,
    twoBedroom: 1012,
    threeBedroom: 1345,
    fourBedroom: 1567,
  };
}

// ═══════════════════════════════════════════════════════════
// Combined resource search — the main function components call
// Searches all APIs in parallel and returns unified results
// ═══════════════════════════════════════════════════════════

export interface NearbyResources {
  disasters: FemaDisaster[];
  alerts: WeatherAlert[];
  jobs: JobListing[];
  snapRetailers: SnapRetailer[];
  shelters: EmergencyShelter[];
  services: SocialService[];
  fairMarketRent: FairMarketRent;
  searchedLocation: string;
  searchedAt: string;
}

export async function findNearbyResources(
  address: string,
  zip: string,
  state: string,
  needs?: string[]
): Promise<NearbyResources> {
  const city = address.split(',')[0]?.trim() || 'Baton Rouge';
  const keywords = needs?.includes('employment') ? 'disaster recovery' : undefined;

  const [disasters, alerts, jobs, snapRetailers, shelters, services, fairMarketRent] = await Promise.all([
    searchFemaDisasters(state),
    getActiveAlerts(state),
    searchJobs(address, keywords),
    searchSnapRetailers(zip),
    searchShelters(city, state),
    search211Services(zip),
    getFairMarketRent(zip),
  ]);

  return {
    disasters,
    alerts,
    jobs,
    snapRetailers,
    shelters,
    services,
    fairMarketRent,
    searchedLocation: address,
    searchedAt: new Date().toISOString(),
  };
}
