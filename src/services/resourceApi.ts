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

// ═══════════════════════════════════════════════════════════
// Transit / Transportation
// GTFS feeds: standardized bus routes/schedules (per transit agency)
// Medicaid NEMT: Non-Emergency Medical Transport (state brokers)
// Perplexity AI crawl: used vehicles, car donations, ride vouchers
// ═══════════════════════════════════════════════════════════

export interface TransitRoute {
  id: string;
  routeName: string;
  agency: string;
  nearestStop: string;
  distanceToStop: string;
  frequency: string;
  fare: string;
  operatingHours: string;
}

export interface TransportService {
  id: string;
  name: string;
  type: 'medical_transport' | 'bus_pass' | 'ride_voucher' | 'vehicle_assistance' | 'volunteer_driver';
  provider: string;
  phone: string;
  description: string;
  eligibility: string;
  cost: string;
  howToAccess: string;
}

export async function searchTransportation(address: string, zip: string): Promise<{ routes: TransitRoute[]; services: TransportService[] }> {
  await new Promise(r => setTimeout(r, 800));
  return {
    routes: [
      { id: 'tr-001', routeName: 'Route 44 — Florida Blvd', agency: 'CATS (Capital Area Transit)', nearestStop: 'Florida & Magnolia', distanceToStop: '0.3 mi walk', frequency: 'Every 30 min', fare: '$1.75 / $0.85 reduced', operatingHours: '5:30 AM - 10:00 PM' },
      { id: 'tr-002', routeName: 'Route 12 — Plank Road', agency: 'CATS (Capital Area Transit)', nearestStop: 'Plank & Harding', distanceToStop: '0.7 mi walk', frequency: 'Every 45 min', fare: '$1.75 / $0.85 reduced', operatingHours: '6:00 AM - 9:00 PM' },
      { id: 'tr-003', routeName: 'Route 8 — Government St', agency: 'CATS (Capital Area Transit)', nearestStop: 'Government & Foster', distanceToStop: '0.5 mi walk', frequency: 'Every 20 min', fare: '$1.75 / $0.85 reduced', operatingHours: '5:00 AM - 11:00 PM' },
    ],
    services: [
      { id: 'ts-001', name: 'Medicaid Non-Emergency Transport (NEMT)', type: 'medical_transport', provider: 'Modivcare (Louisiana broker)', phone: '1-866-384-0989', description: 'Free rides to medical appointments for Medicaid recipients. Covers doctor visits, pharmacy, dialysis, therapy. Must schedule 48 hours in advance.', eligibility: 'Active Medicaid coverage', cost: 'Free', howToAccess: 'Call 48 hours before appointment. Provide Medicaid ID, appointment details, pickup address.' },
      { id: 'ts-002', name: 'Emergency Bus Pass Program', type: 'bus_pass', provider: 'Capital Area United Way', phone: '(225) 555-7001', description: '7-day unlimited bus passes for disaster-affected individuals. Available at United Way office and partner locations.', eligibility: 'Disaster-affected, show FEMA registration or ID from affected area', cost: 'Free (normally $14/week)', howToAccess: 'Walk in to United Way office with disaster documentation. Same-day issuance.' },
      { id: 'ts-003', name: 'Volunteer Driver Network', type: 'volunteer_driver', provider: 'Interfaith Volunteer Caregivers', phone: '(225) 555-7002', description: 'Volunteer drivers for medical appointments, grocery trips, pharmacy runs. Priority for elderly and disabled disaster survivors.', eligibility: 'Elderly, disabled, or no other transportation', cost: 'Free', howToAccess: 'Call 24-48 hours in advance. Rides available Mon-Sat 8am-5pm.' },
      { id: 'ts-004', name: 'Vehicle Repair Assistance', type: 'vehicle_assistance', provider: 'Salvation Army Disaster Services', phone: '(225) 555-7003', description: 'Up to $500 toward vehicle repair for disaster-affected families. Covers essential repairs to make a vehicle drivable.', eligibility: 'Disaster-affected, vehicle is primary transportation, income-qualified', cost: 'Up to $500 grant', howToAccess: 'Apply at Salvation Army disaster office. Bring: vehicle title, repair estimate, FEMA registration.' },
      { id: 'ts-005', name: 'Ride-Share Voucher Program', type: 'ride_voucher', provider: 'Catholic Charities', phone: '(225) 555-7004', description: '$50 in Lyft/Uber credits for disaster survivors needing immediate transport to critical appointments (medical, legal, FEMA).', eligibility: 'Disaster-affected with critical appointment', cost: '$50 credit (free to recipient)', howToAccess: 'Request through your Refugium navigator or call directly. Same-day available.' },
    ],
  };
}

// ═══════════════════════════════════════════════════════════
// Medical Care / Health Services
// HRSA Health Center Finder: https://findahealthcenter.hrsa.gov/
// Real endpoint: https://findahealthcenter.hrsa.gov/api
// Auth: None required
// Also: NeedyMeds, Prescription Assistance, Crisis Lines
// ═══════════════════════════════════════════════════════════

export interface HealthCenter {
  id: string;
  name: string;
  address: string;
  phone: string;
  distance: string;
  services: string[];
  acceptsUninsured: boolean;
  slidingScale: boolean;
  languages: string[];
  hours: string;
  walkInsAccepted: boolean;
}

export interface MedicationProgram {
  id: string;
  name: string;
  provider: string;
  phone: string;
  description: string;
  type: 'discount' | 'free' | 'manufacturer_pap' | 'pharmacy_program';
  eligibility: string;
  howToAccess: string;
}

export interface CrisisLine {
  id: string;
  name: string;
  phone: string;
  textOption?: string;
  hours: string;
  description: string;
}

export async function searchHealthServices(zip: string): Promise<{
  healthCenters: HealthCenter[];
  medicationPrograms: MedicationProgram[];
  crisisLines: CrisisLine[];
}> {
  await new Promise(r => setTimeout(r, 900));
  return {
    healthCenters: [
      { id: 'hc-001', name: 'Capital Area Community Health Center', address: '3700 Florida Blvd, Baton Rouge, LA 70806', phone: '(225) 555-6001', distance: '2.7 mi', services: ['Primary care', 'Dental', 'Behavioral health', 'Pharmacy', 'Pediatrics'], acceptsUninsured: true, slidingScale: true, languages: ['English', 'Spanish', 'Vietnamese'], hours: 'Mon-Fri 8am-6pm, Sat 9am-1pm', walkInsAccepted: true },
      { id: 'hc-002', name: "Children's Health Services", address: '1020 N Foster Dr, Baton Rouge, LA 70806', phone: '(225) 555-6002', distance: '3.1 mi', services: ['Pediatrics', 'Immunizations', 'WIC', 'Developmental screening'], acceptsUninsured: true, slidingScale: true, languages: ['English', 'Spanish'], hours: 'Mon-Fri 8am-5pm', walkInsAccepted: true },
      { id: 'hc-003', name: 'St. Francis Medical Outreach', address: '1250 Nicholson Dr, Baton Rouge, LA 70802', phone: '(225) 555-6003', distance: '1.8 mi', services: ['Primary care', 'Prescription assistance', 'Chronic disease management', 'Mental health counseling'], acceptsUninsured: true, slidingScale: true, languages: ['English', 'Spanish', 'French'], hours: 'Mon-Sat 7am-7pm', walkInsAccepted: true },
    ],
    medicationPrograms: [
      { id: 'mp-001', name: 'Disaster Prescription Assistance', provider: 'LA Dept of Health', phone: '(800) 555-6010', description: 'Emergency prescription refills for disaster survivors who lost medications. Up to 30-day supply of most common medications at no cost.', type: 'free', eligibility: 'Disaster-affected, lost medications', howToAccess: 'Visit any participating pharmacy with ID and disaster documentation. No prescription needed for refills of existing medications.' },
      { id: 'mp-002', name: '$4 Generic Program', provider: 'Walmart Pharmacy', phone: '(225) 555-6011', description: 'Over 300 generic medications for $4/30-day or $10/90-day supply. Includes diabetes, blood pressure, cholesterol, antibiotics, and mental health medications.', type: 'discount', eligibility: 'No income requirement — available to everyone', howToAccess: 'Bring prescription to any Walmart pharmacy. Ask for the $4 generic list.' },
      { id: 'mp-003', name: 'NeedyMeds Patient Assistance', provider: 'NeedyMeds.org', phone: '1-800-503-6897', description: 'Database of manufacturer Patient Assistance Programs (PAPs). Most brand-name medications available free for qualifying patients.', type: 'manufacturer_pap', eligibility: 'Varies by manufacturer — typically uninsured and income under 300% FPL', howToAccess: 'Search medications at needymeds.org. Download application. Doctor signature required. 2-4 week processing.' },
      { id: 'mp-004', name: 'GoodRx Discount Card', provider: 'GoodRx', phone: 'N/A', description: 'Free discount card accepted at 70,000+ pharmacies. Average savings of 80% on prescriptions. No insurance required.', type: 'discount', eligibility: 'No requirements — free for everyone', howToAccess: 'Download app or print card from goodrx.com. Show at pharmacy checkout.' },
    ],
    crisisLines: [
      { id: 'cl-001', name: '988 Suicide & Crisis Lifeline', phone: '988', textOption: 'Text 988', hours: '24/7', description: 'Free, confidential support for people in distress. Veterans press 1.' },
      { id: 'cl-002', name: 'Disaster Distress Helpline', phone: '1-800-985-5990', textOption: 'Text "TalkWithUs" to 66746', hours: '24/7', description: 'Crisis counseling specifically for disaster survivors. Multilingual. Free and confidential.' },
      { id: 'cl-003', name: 'SAMHSA National Helpline', phone: '1-800-662-4357', hours: '24/7', description: 'Treatment referrals for substance abuse and mental health. Free, confidential. English and Spanish.' },
    ],
  };
}

// ═══════════════════════════════════════════════════════════
// Navigation Cards — the "next step" for a specific need
// Combines resource + transport + instructions into one action
// ═══════════════════════════════════════════════════════════

export interface NavigationStep {
  id: string;
  needCategory: string;
  title: string;
  destination: string;
  address: string;
  phone: string;
  distance: string;
  transitOption: string;
  transitDetails: string;
  whatToBring: string[];
  cost: string;
  hours: string;
  urgency: 'today' | 'this_week' | 'soon';
}

export async function getNavigationSteps(householdId: string, zip: string): Promise<NavigationStep[]> {
  await new Promise(r => setTimeout(r, 600));
  // In production, this would analyze the household's specific needs
  // and match them with nearby resources + transit routes
  return [
    { id: 'nav-001', needCategory: 'medical_care', title: 'Get Elena\'s medication refilled', destination: 'St. Francis Medical Outreach', address: '1250 Nicholson Dr, Baton Rouge', phone: '(225) 555-6003', distance: '1.8 mi', transitOption: 'Bus #44 from Magnolia & 3rd → Nicholson & River, 18 min', transitDetails: 'OR call Medicaid transport: 1-866-384-0989 (48hr advance)', whatToBring: ['Medicaid card or ID', 'Current prescription list', 'Proof of disaster impact'], cost: 'Free (sliding scale)', hours: 'Mon-Sat 7am-7pm', urgency: 'today' },
    { id: 'nav-002', needCategory: 'employment', title: 'Get Terrence to the tool lending program', destination: "Lowe's Hardware — Disaster Partner", address: '7979 Airline Hwy, Baton Rouge', phone: '(225) 555-1100', distance: '4.2 mi', transitOption: 'Bus #12 from Plank & Harding → Airline & Cortana, 35 min', transitDetails: 'OR volunteer driver: (225) 555-7002 (24hr advance)', whatToBring: ['Photo ID', 'Proof of disaster impact', 'List of needed tools'], cost: 'Free lending (return within 30 days)', hours: 'Mon-Sat 6am-9pm', urgency: 'this_week' },
    { id: 'nav-003', needCategory: 'food_assistance', title: 'Apply for D-SNAP benefits', destination: 'LA Dept of Children & Family Services', address: '627 N 4th St, Baton Rouge', phone: '(225) 555-8002', distance: '1.1 mi', transitOption: 'Bus #8 from Government & Foster → 4th & Main, 12 min', transitDetails: 'Walk-in, same-day processing for disaster survivors', whatToBring: ['Photo ID for all adults', 'Proof of address', 'Proof of disaster-related loss', 'Pay stubs or proof of income'], cost: 'Free', hours: 'Mon-Fri 7:30am-5pm', urgency: 'this_week' },
    { id: 'nav-004', needCategory: 'housing_repair', title: 'Schedule FEMA home inspection', destination: 'FEMA Disaster Recovery Center', address: '1885 Wooddale Blvd, Baton Rouge', phone: '1-800-621-3362', distance: '3.1 mi', transitOption: 'Bus #44 → transfer Bus #8 at Government & Florida, 40 min total', transitDetails: 'OR call for phone inspection: 1-800-621-3362', whatToBring: ['FEMA registration number', 'Photo ID', 'Proof of address', 'Insurance documents'], cost: 'Free', hours: 'Mon-Sat 8am-6pm', urgency: 'this_week' },
  ];
}


export interface NearbyResources {
  disasters: FemaDisaster[];
  alerts: WeatherAlert[];
  jobs: JobListing[];
  snapRetailers: SnapRetailer[];
  shelters: EmergencyShelter[];
  services: SocialService[];
  fairMarketRent: FairMarketRent;
  transit: { routes: TransitRoute[]; services: TransportService[] };
  health: { healthCenters: HealthCenter[]; medicationPrograms: MedicationProgram[]; crisisLines: CrisisLine[] };
  navigationSteps: NavigationStep[];
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

  const [disasters, alerts, jobs, snapRetailers, shelters, services, fairMarketRent, transit, health, navigationSteps] = await Promise.all([
    searchFemaDisasters(state),
    getActiveAlerts(state),
    searchJobs(address, keywords),
    searchSnapRetailers(zip),
    searchShelters(city, state),
    search211Services(zip),
    getFairMarketRent(zip),
    searchTransportation(address, zip),
    searchHealthServices(zip),
    getNavigationSteps('demo', zip),
  ]);

  return {
    disasters,
    alerts,
    jobs,
    snapRetailers,
    shelters,
    services,
    fairMarketRent,
    transit,
    health,
    navigationSteps,
    searchedLocation: address,
    searchedAt: new Date().toISOString(),
  };
}
