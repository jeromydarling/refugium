export interface Volunteer {
  id: string;
  name: string;
  phone: string;
  email: string;
  skills: string[];
  availability: string;
  assignedHouseholdIds: string[];
  totalHours: number;
  status: 'active' | 'on_break' | 'new';
  zone: string;
}

export const volunteers: Volunteer[] = [
  { id: 'v-001', name: 'Sarah Thompson', phone: '(225) 555-3001', email: 'sarah.t@volunteer.org', skills: ['Case management', 'Intake', 'Spanish'], availability: 'Mon-Fri 9am-5pm', assignedHouseholdIds: ['hh-001', 'hh-004'], totalHours: 187, status: 'active', zone: 'Zone 1 - Baton Rouge' },
  { id: 'v-002', name: 'David Park', phone: '(504) 555-3002', email: 'dpark@volunteer.org', skills: ['Construction', 'Assessment', 'Korean'], availability: 'Weekdays flexible', assignedHouseholdIds: ['hh-003', 'hh-005', 'hh-012'], totalHours: 210, status: 'active', zone: 'Zone 2 - New Orleans' },
  { id: 'v-003', name: 'Maria Santos', phone: '(337) 555-3003', email: 'maria.s@volunteer.org', skills: ['Bilingual intake', 'Social work', 'Mandarin'], availability: 'Tue-Sat 10am-6pm', assignedHouseholdIds: ['hh-002', 'hh-006', 'hh-011'], totalHours: 156, status: 'active', zone: 'Zone 3 - Lafayette' },
  { id: 'v-004', name: 'James Wilson', phone: '(228) 555-3004', email: 'jwilson@volunteer.org', skills: ['Home assessment', 'Debris removal', 'CDL driver'], availability: 'Mon-Wed-Fri 7am-3pm', assignedHouseholdIds: ['hh-006', 'hh-007', 'hh-014'], totalHours: 134, status: 'active', zone: 'Zone 4 - Gulf Coast' },
  { id: 'v-005', name: 'Angela Roberts', phone: '(601) 555-3005', email: 'aroberts@volunteer.org', skills: ['Elder care', 'Medical transport', 'Meals'], availability: 'Mon-Fri 8am-4pm', assignedHouseholdIds: ['hh-004'], totalHours: 92, status: 'active', zone: 'Zone 5 - Mississippi' },
  { id: 'v-006', name: 'Marcus Brown', phone: '(318) 555-3006', email: 'mbrown@volunteer.org', skills: ['Construction', 'Electrical', 'Plumbing'], availability: 'Weekends only', assignedHouseholdIds: ['hh-008'], totalHours: 78, status: 'active', zone: 'Zone 1 - Baton Rouge' },
  { id: 'v-007', name: 'Patricia Long', phone: '(504) 555-3007', email: 'plong@volunteer.org', skills: ['VA benefits navigation', 'Mental health first aid', 'Companionship'], availability: 'Tue-Thu 10am-4pm', assignedHouseholdIds: ['hh-010'], totalHours: 64, status: 'active', zone: 'Zone 2 - New Orleans' },
  { id: 'v-008', name: 'Robert Kim', phone: '(337) 555-3008', email: 'rkim@volunteer.org', skills: ['Childcare', 'Youth programs', 'Tutoring'], availability: 'Mon-Wed-Fri afternoons', assignedHouseholdIds: ['hh-011', 'hh-013'], totalHours: 45, status: 'active', zone: 'Zone 3 - Lafayette' },
  { id: 'v-009', name: 'Jennifer Adams', phone: '(225) 555-3009', email: 'jadams@volunteer.org', skills: ['Grant writing', 'Fundraising', 'Admin'], availability: 'Remote, flexible hours', assignedHouseholdIds: [], totalHours: 120, status: 'on_break', zone: 'Zone 1 - Baton Rouge' },
  { id: 'v-010', name: 'Carlos Rivera', phone: '(409) 555-3010', email: 'crivera@volunteer.org', skills: ['Carpentry', 'Roofing', 'Spanish'], availability: 'Weekdays 7am-3pm', assignedHouseholdIds: [], totalHours: 22, status: 'new', zone: 'Zone 2 - New Orleans' },
  { id: 'v-011', name: 'Grace Lee', phone: '(504) 555-3011', email: 'glee@volunteer.org', skills: ['Nursing', 'First aid', 'Vietnamese'], availability: 'Sat-Sun 8am-4pm', assignedHouseholdIds: [], totalHours: 15, status: 'new', zone: 'Zone 2 - New Orleans' },
  { id: 'v-012', name: 'Thomas Wright', phone: '(985) 555-3012', email: 'twright@volunteer.org', skills: ['Heavy equipment', 'Chainsaw', 'Tree removal'], availability: 'Call anytime', assignedHouseholdIds: [], totalHours: 340, status: 'on_break', zone: 'Zone 4 - Gulf Coast' },
];

export function getVolunteer(id: string): Volunteer | undefined {
  return volunteers.find(v => v.id === id);
}
