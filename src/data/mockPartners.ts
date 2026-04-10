export interface Partner {
  id: string;
  name: string;
  type: 'church' | 'nonprofit' | 'government' | 'host_family' | 'business';
  services: string[];
  address: string;
  phone: string;
  contactPerson: string;
  capacity: 'available' | 'limited' | 'full';
  trustLevel: 'verified' | 'established' | 'new';
  notes?: string;
  lat: number;
  lng: number;
}

export const partners: Partner[] = [
  { id: 'p-001', name: 'First Baptist Church of Baton Rouge', type: 'church', services: ['Emergency shelter', 'Meal service', 'Clothing closet', 'Spiritual care'], address: '529 Convention St, Baton Rouge, LA 70802', phone: '(225) 555-0100', contactPerson: 'Pastor David Mitchell', capacity: 'available', trustLevel: 'verified', notes: 'Call Pastor David directly — he opens the fellowship hall within hours of any disaster. Kitchen can serve 200 meals.', lat: 30.4507, lng: -91.1874 },
  { id: 'p-002', name: 'Catholic Charities of Acadiana', type: 'nonprofit', services: ['Case management', 'Housing assistance', 'Financial counseling', 'Immigration services'], address: '1408 Carmel Dr, Lafayette, LA 70501', phone: '(337) 555-0200', contactPerson: 'Maria Gonzalez', capacity: 'limited', trustLevel: 'verified', notes: 'Best partner for long-term case management. Maria works closely with FEMA and local agencies.', lat: 30.2241, lng: -92.0198 },
  { id: 'p-003', name: 'Habitat for Humanity Greater Baton Rouge', type: 'nonprofit', services: ['Home repair', 'Debris removal', 'Volunteer coordination', 'Building materials'], address: '4359 Government St, Baton Rouge, LA 70806', phone: '(225) 555-0300', contactPerson: 'Tom Anderson', capacity: 'limited', trustLevel: 'verified', lat: 30.4468, lng: -91.1571 },
  { id: 'p-004', name: "Samaritan's Purse - Gulf Response", type: 'nonprofit', services: ['Debris removal', 'Roof tarping', 'Chainsaw teams', 'Mud-out crews'], address: 'Mobile deployment unit', phone: '(800) 555-0400', contactPerson: 'Regional Coordinator', capacity: 'available', trustLevel: 'established', notes: 'Deploys within 48 hours of major events. Strong volunteer base. Request through official channels.', lat: 30.4000, lng: -91.2000 },
  { id: 'p-005', name: 'The Rodriguez Family', type: 'host_family', services: ['Temporary housing', 'Meals', 'Childcare support'], address: '2341 Perkins Rd, Baton Rouge, LA 70808', phone: '(225) 555-0500', contactPerson: 'Ana & Miguel Rodriguez', capacity: 'available', trustLevel: 'verified', notes: 'Spare bedroom and finished basement. Bilingual (Spanish/English). Have hosted 3 families previously. Kids love helping.', lat: 30.4134, lng: -91.1494 },
  { id: 'p-006', name: 'FEMA Disaster Recovery Center', type: 'government', services: ['Individual assistance', 'Hazard mitigation', 'Public assistance', 'SBA loan referrals'], address: '1885 Wooddale Blvd, Baton Rouge, LA 70806', phone: '(800) 555-0600', contactPerson: 'Federal Coordinating Officer', capacity: 'available', trustLevel: 'verified', lat: 30.4399, lng: -91.1356 },
  { id: 'p-007', name: 'St. Vincent de Paul Society', type: 'church', services: ['Furniture donations', 'Household supplies', 'Utility assistance', 'Food pantry'], address: '3600 Magazine St, New Orleans, LA 70115', phone: '(504) 555-0700', contactPerson: 'Brother Thomas', capacity: 'available', trustLevel: 'verified', notes: 'Furniture warehouse restocked weekly. Call ahead for large items. Pantry stays open late after storms.', lat: 29.9211, lng: -90.0932 },
  { id: 'p-008', name: 'Legal Aid Society of Louisiana', type: 'nonprofit', services: ['Insurance disputes', 'Tenant rights', 'FEMA appeals', 'Document replacement'], address: '1010 Common St, New Orleans, LA 70112', phone: '(504) 555-0800', contactPerson: 'Attorney Lisa Park', capacity: 'limited', trustLevel: 'established', lat: 29.9479, lng: -90.0711 },
  { id: 'p-009', name: 'Community Health Center', type: 'nonprofit', services: ['Primary care', 'Prescription assistance', 'Mental health counseling', 'Sliding scale fees'], address: '3700 Florida Blvd, Baton Rouge, LA 70806', phone: '(225) 555-0900', contactPerson: 'Dr. Rachel Kim', capacity: 'available', trustLevel: 'verified', lat: 30.4496, lng: -91.1443 },
  { id: 'p-010', name: 'The Henderson Family', type: 'host_family', services: ['Temporary housing', 'Transportation'], address: '456 Elm St, Slidell, LA 70458', phone: '(985) 555-1000', contactPerson: 'Joe & Sarah Henderson', capacity: 'limited', trustLevel: 'established', notes: 'One guest room available. Joe has a truck for moving furniture. Prefer families with children — their kids are 8 and 10.', lat: 30.2752, lng: -89.7812 },
  { id: 'p-011', name: "Lowes Hardware - Disaster Partner", type: 'business', services: ['Building materials discount', 'Tool lending', 'Delivery service'], address: '7979 Airline Hwy, Baton Rouge, LA 70815', phone: '(225) 555-1100', contactPerson: 'Store Manager', capacity: 'available', trustLevel: 'established', lat: 30.4722, lng: -91.1135 },
  { id: 'p-012', name: 'Volunteers of America Southeast Louisiana', type: 'nonprofit', services: ['Veteran services', 'Housing programs', 'Workforce development', 'Youth services'], address: '4152 Canal St, New Orleans, LA 70119', phone: '(504) 555-1200', contactPerson: 'Director of Programs', capacity: 'available', trustLevel: 'verified', lat: 29.9635, lng: -90.1014 },
  { id: 'p-013', name: 'Grace Community Church', type: 'church', services: ['Hot meals', 'Clothing closet', 'Respite childcare', 'Prayer teams'], address: '1200 Pass Rd, Biloxi, MS 39530', phone: '(228) 555-1300', contactPerson: 'Pastor Ruth Williams', capacity: 'available', trustLevel: 'established', notes: 'Opens late after storms — Pastor Ruth lives on-site. Kitchen can handle 100 meals. Good with kids.', lat: 30.3988, lng: -88.8901 },
  { id: 'p-014', name: 'Gulf Coast Kidney Center', type: 'nonprofit', services: ['Dialysis', 'Nephrology', 'Patient transportation', 'Chronic disease management'], address: '750 Reynoir St, Biloxi, MS 39530', phone: '(228) 555-1400', contactPerson: 'Dr. Amara Singh', capacity: 'limited', trustLevel: 'verified', notes: 'Priority scheduling for disaster-displaced dialysis patients. Call Dr. Singh\'s direct line for urgent placement.', lat: 30.3932, lng: -88.8871 },
  { id: 'p-015', name: 'The Thibodaux Family', type: 'host_family', services: ['Temporary housing', 'Meals', 'Local knowledge'], address: '322 Bayou Rd, Slidell, LA 70460', phone: '(985) 555-1500', contactPerson: 'Jean & Marie Thibodaux', capacity: 'available', trustLevel: 'new', notes: 'Retired couple. Two spare bedrooms. Jean is a former contractor — can help with small repairs. First time hosting.', lat: 30.2901, lng: -89.7652 },
];

export function getPartner(id: string): Partner | undefined {
  return partners.find(p => p.id === id);
}
