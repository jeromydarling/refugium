export interface Resource {
  id: string;
  name: string;
  provider: string;
  category: 'housing' | 'food' | 'medical' | 'legal' | 'financial' | 'employment' | 'mental_health';
  address: string;
  phone: string;
  hours: string;
  description: string;
  url?: string;
  availability: 'available' | 'limited' | 'waitlist';
}

export const resources: Resource[] = [
  { id: 'r-001', name: 'Emergency Shelter Network', provider: '211 Louisiana', category: 'housing', address: 'Multiple locations', phone: '211', hours: '24/7', description: 'Statewide shelter locator. Call 211 for nearest available bed. Accepts families with children and pets at select locations.', availability: 'limited' },
  { id: 'r-002', name: 'Second Harvest Food Bank', provider: 'Second Harvest', category: 'food', address: '700 Edwards Ave, New Orleans, LA 70123', phone: '(504) 555-2002', hours: 'Mon-Fri 8am-4pm', description: 'Emergency food boxes available same-day. Mobile pantry visits disaster-affected areas weekly. No ID required.', availability: 'available' },
  { id: 'r-003', name: 'FEMA Individual Assistance', provider: 'Federal Emergency Management Agency', category: 'financial', address: 'Online or Disaster Recovery Centers', phone: '(800) 621-3362', hours: '24/7 phone, Centers Mon-Sat 8am-6pm', description: 'Grants for temporary housing, home repairs, personal property, medical/dental, funeral, and other disaster-related expenses.', availability: 'available' },
  { id: 'r-004', name: 'SBA Disaster Loans', provider: 'Small Business Administration', category: 'financial', address: 'Online or at Disaster Recovery Centers', phone: '(800) 659-2955', hours: 'Mon-Fri 8am-6pm', description: 'Low-interest loans up to $200K for homeowners and $2M for businesses to repair disaster damage.', availability: 'available' },
  { id: 'r-005', name: 'Community Health Center Sliding Scale', provider: 'LA Primary Care Association', category: 'medical', address: 'Multiple locations statewide', phone: '(225) 555-2005', hours: 'Mon-Fri 8am-5pm', description: 'Primary care, prescriptions, and dental on sliding fee scale. No one turned away for inability to pay.', availability: 'available' },
  { id: 'r-006', name: 'Crisis Counseling Program', provider: 'LA Dept of Health', category: 'mental_health', address: 'Mobile teams + office locations', phone: '(800) 555-2006', hours: 'Mon-Fri 8am-8pm, Sat 9am-5pm', description: 'Free short-term crisis counseling for disaster survivors. Individual, group, and family sessions. No insurance needed.', availability: 'available' },
  { id: 'r-007', name: 'Louisiana Legal Services', provider: 'Southeast Louisiana Legal Services', category: 'legal', address: '1010 Common St, New Orleans, LA 70112', phone: '(504) 555-2007', hours: 'Mon-Fri 9am-5pm', description: 'Free legal help for disaster survivors: insurance disputes, landlord issues, FEMA appeals, document replacement, contractor fraud.', availability: 'limited' },
  { id: 'r-008', name: 'Louisiana Workforce Commission', provider: 'State of Louisiana', category: 'employment', address: 'American Job Centers statewide', phone: '(866) 555-2008', hours: 'Mon-Fri 8am-4:30pm', description: 'Job search assistance, resume help, Disaster Unemployment Assistance (DUA), skills training referrals.', availability: 'available' },
  { id: 'r-009', name: 'Red Cross Shelter & Aid', provider: 'American Red Cross', category: 'housing', address: 'Activated shelters', phone: '(800) 733-2767', hours: '24/7 during activations', description: 'Emergency shelters, cots, meals, health services, and mental health support. Pet-friendly at designated sites.', availability: 'limited' },
  { id: 'r-010', name: 'Disaster SNAP (D-SNAP)', provider: 'LA Dept of Children & Family Services', category: 'food', address: 'Distribution sites announced per event', phone: '(888) 555-2010', hours: 'Event-specific hours', description: 'Emergency food benefits for disaster-affected households not already receiving SNAP. Typically activated 2-4 weeks after major disaster.', availability: 'waitlist' },
  { id: 'r-011', name: 'LIHEAP Utility Assistance', provider: 'LA Housing Corporation', category: 'financial', address: 'Community Action Agencies statewide', phone: '(225) 555-2011', hours: 'Mon-Fri 8am-4:30pm', description: 'Help paying electric, gas, and water bills after disaster. Priority for elderly, disabled, and families with young children.', availability: 'available' },
  { id: 'r-012', name: 'Findhelp Resource Directory', provider: 'Findhelp', category: 'housing', address: 'Online directory', phone: 'N/A', hours: '24/7 online', description: 'Comprehensive directory of local social services including housing, food, health, financial, and legal resources. Search by ZIP code.', url: 'https://findhelp.org', availability: 'available' },
  { id: 'r-013', name: 'Disaster Distress Helpline', provider: 'SAMHSA', category: 'mental_health', address: 'Phone/text hotline', phone: '(800) 985-5990', hours: '24/7', description: 'Free, confidential crisis counseling for disaster survivors. Multilingual support available. Text "TalkWithUs" to 66746.', availability: 'available' },
  { id: 'r-014', name: 'Volunteer Louisiana', provider: 'Governor\'s Office of Homeland Security', category: 'employment', address: 'Online portal', phone: '(225) 555-2014', hours: 'Mon-Fri 8am-5pm', description: 'Connects disaster survivors with volunteer groups for cleanup, repair, and rebuilding. Also lists paid temporary disaster recovery positions.', url: 'https://volunteerlouisiana.gov', availability: 'available' },
  { id: 'r-015', name: 'Catholic Charities Emergency Assistance', provider: 'Catholic Charities USA', category: 'financial', address: 'Regional offices throughout Gulf Coast', phone: '(800) 555-2015', hours: 'Mon-Fri 8:30am-4:30pm', description: 'Emergency financial assistance for rent, utilities, and prescriptions. No religious affiliation required. Walk-ins welcome.', availability: 'limited' },
];

export function getResource(id: string): Resource | undefined {
  return resources.find(r => r.id === id);
}
