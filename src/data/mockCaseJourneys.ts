export interface CaseJourney {
  id: string;
  householdId: string;
  stages: {
    stage: 'intake' | 'assessment' | 'stabilization' | 'repair_rebuild' | 'closure';
    status: 'completed' | 'active' | 'upcoming';
    date?: string;
    notes?: string;
  }[];
}

export const journeys: CaseJourney[] = [
  { id: 'j-001', householdId: 'hh-001', stages: [
    { stage: 'intake', status: 'completed', date: '2024-09-15', notes: 'Family of 5 displaced. Roof damage, water intrusion.' },
    { stage: 'assessment', status: 'completed', date: '2024-09-22', notes: 'Home structurally sound but needs major repair. FEMA application submitted.' },
    { stage: 'stabilization', status: 'active', date: '2024-10-05', notes: 'In temporary rental. Medication gap for Elena being addressed.' },
    { stage: 'repair_rebuild', status: 'upcoming' },
    { stage: 'closure', status: 'upcoming' },
  ]},
  { id: 'j-002', householdId: 'hh-002', stages: [
    { stage: 'intake', status: 'completed', date: '2024-09-20', notes: 'Small business owners. Restaurant and home damaged.' },
    { stage: 'assessment', status: 'completed', date: '2024-10-01', notes: 'Insurance claim filed. Language barrier identified.' },
    { stage: 'stabilization', status: 'completed', date: '2024-10-15', notes: 'Bilingual volunteer assigned. SBA loan in progress.' },
    { stage: 'repair_rebuild', status: 'active', notes: 'Business insurance partially paid. Home rebuild underway.' },
    { stage: 'closure', status: 'upcoming' },
  ]},
  { id: 'j-003', householdId: 'hh-003', stages: [
    { stage: 'intake', status: 'completed', date: '2024-04-15', notes: 'Entire first floor flooded. No flood insurance.' },
    { stage: 'assessment', status: 'completed', date: '2024-04-22', notes: 'Mold present. Children symptomatic. Tools lost.' },
    { stage: 'stabilization', status: 'active', notes: 'STALLED — no volunteer assigned, no contact since April 22.' },
    { stage: 'repair_rebuild', status: 'upcoming' },
    { stage: 'closure', status: 'upcoming' },
  ]},
  { id: 'j-004', householdId: 'hh-004', stages: [
    { stage: 'intake', status: 'completed', date: '2024-04-10', notes: 'Elderly widow. Tornado damaged roof and carport.' },
    { stage: 'assessment', status: 'completed', date: '2024-04-15', notes: 'Home structurally sound. Roof needs permanent repair.' },
    { stage: 'stabilization', status: 'active', date: '2024-04-25', notes: 'Roof tarped. Dorothy at daughter\'s house. Wants to return.' },
    { stage: 'repair_rebuild', status: 'upcoming' },
    { stage: 'closure', status: 'upcoming' },
  ]},
  { id: 'j-005', householdId: 'hh-005', stages: [
    { stage: 'intake', status: 'completed', date: '2024-09-18', notes: 'Fishing family. Boat destroyed. Family of 5 in shelter.' },
    { stage: 'assessment', status: 'active', date: '2024-10-01', notes: 'Need housing, childcare, food assistance. Multiple barriers.' },
    { stage: 'stabilization', status: 'upcoming' },
    { stage: 'repair_rebuild', status: 'upcoming' },
    { stage: 'closure', status: 'upcoming' },
  ]},
  { id: 'j-006', householdId: 'hh-006', stages: [
    { stage: 'intake', status: 'completed', date: '2024-04-18', notes: 'Single mother. Apartment flooded. Lost job.' },
    { stage: 'assessment', status: 'completed', date: '2024-04-25', notes: 'Total loss of belongings. No renter\'s insurance.' },
    { stage: 'stabilization', status: 'completed', date: '2024-05-05', notes: 'Catholic Charities providing support.' },
    { stage: 'repair_rebuild', status: 'active', date: '2024-05-10', notes: 'New apartment. New job. Kids in school. Still needs furniture.' },
    { stage: 'closure', status: 'upcoming' },
  ]},
  { id: 'j-007', householdId: 'hh-007', stages: [
    { stage: 'intake', status: 'completed', date: '2024-09-16', notes: 'Minor wind damage. Good insurance.' },
    { stage: 'assessment', status: 'completed', date: '2024-09-20', notes: 'Damage cosmetic. No displacement needed.' },
    { stage: 'stabilization', status: 'completed', date: '2024-09-25', notes: 'Insurance processing claim.' },
    { stage: 'repair_rebuild', status: 'completed', date: '2024-10-15', notes: 'All repairs complete.' },
    { stage: 'closure', status: 'completed', date: '2024-10-20', notes: 'Case closed. Robert volunteering with neighborhood cleanup.' },
  ]},
  { id: 'j-008', householdId: 'hh-008', stages: [
    { stage: 'intake', status: 'completed', date: '2024-04-12', notes: 'Home total loss from tornado. Family separated.' },
    { stage: 'assessment', status: 'completed', date: '2024-04-20', notes: 'FEMA assistance approved. Need long-term plan.' },
    { stage: 'stabilization', status: 'completed', date: '2024-05-01', notes: 'FEMA trailer. Family reunited.' },
    { stage: 'repair_rebuild', status: 'active', date: '2024-05-15', notes: 'Searching for permanent housing. Michael in counseling.' },
    { stage: 'closure', status: 'upcoming' },
  ]},
  { id: 'j-009', householdId: 'hh-009', stages: [
    { stage: 'intake', status: 'completed', date: '2024-04-20', notes: 'Moderate flooding. Good insurance and community support.' },
    { stage: 'assessment', status: 'completed', date: '2024-04-25', notes: 'Insurance covering repairs. Business also recovering.' },
    { stage: 'stabilization', status: 'completed', date: '2024-05-05' },
    { stage: 'repair_rebuild', status: 'completed', date: '2024-05-20', notes: 'Home and business restored.' },
    { stage: 'closure', status: 'completed', date: '2024-06-01', notes: 'Raj donating supplies to others. Case closed.' },
  ]},
  { id: 'j-010', householdId: 'hh-010', stages: [
    { stage: 'intake', status: 'completed', date: '2024-09-19', notes: 'Vietnam veteran. PTSD triggered by storm. Living alone.' },
    { stage: 'assessment', status: 'completed', date: '2024-09-25', notes: 'Roof damage. No power. VA benefits active but hard to navigate.' },
    { stage: 'stabilization', status: 'active', date: '2024-10-03', notes: 'Generator donated. VA social worker connected. Checking in 2x/week.' },
    { stage: 'repair_rebuild', status: 'upcoming' },
    { stage: 'closure', status: 'upcoming' },
  ]},
  { id: 'j-011', householdId: 'hh-011', stages: [
    { stage: 'intake', status: 'completed', date: '2024-04-16', notes: 'Single mother of 3. Rental flooded. Lost job.' },
    { stage: 'assessment', status: 'active', notes: 'STALLED — needs assessment but no follow-up since intake.' },
    { stage: 'stabilization', status: 'upcoming' },
    { stage: 'repair_rebuild', status: 'upcoming' },
    { stage: 'closure', status: 'upcoming' },
  ]},
  { id: 'j-012', householdId: 'hh-012', stages: [
    { stage: 'intake', status: 'completed', date: '2024-04-22', notes: 'Dry cleaning business destroyed. Home flooded.' },
    { stage: 'assessment', status: 'completed', date: '2024-05-01', notes: 'Insurance partial. SBA loan needed.' },
    { stage: 'stabilization', status: 'completed', date: '2024-05-15', notes: 'Jenny\'s parents helping. Sung doing rideshare work.' },
    { stage: 'repair_rebuild', status: 'active', date: '2024-06-15', notes: 'SBA loan approved. Home and business rebuilding.' },
    { stage: 'closure', status: 'upcoming' },
  ]},
  { id: 'j-013', householdId: 'hh-013', stages: [
    { stage: 'intake', status: 'completed', date: '2024-09-18', notes: 'Single mother with dementia-affected parent. Roof damage and mold.' },
    { stage: 'assessment', status: 'completed', date: '2024-10-01', notes: 'Mold remediation needed. Caregiver burnout risk identified.' },
    { stage: 'stabilization', status: 'completed', date: '2024-12-05', notes: 'Mold remediated. Roof tarped. Respite care connection in progress.' },
    { stage: 'repair_rebuild', status: 'active', date: '2025-02-20', notes: 'Permanent roof repair pending. Claire connected with caregiver support.' },
    { stage: 'closure', status: 'upcoming' },
  ]},
  { id: 'j-014', householdId: 'hh-014', stages: [
    { stage: 'intake', status: 'completed', date: '2024-09-15', notes: 'Family of 6 including infant and dialysis patient. Home severely damaged.' },
    { stage: 'assessment', status: 'completed', date: '2024-10-10', notes: 'Repair gap of $45K. FEMA trailer not wheelchair-accessible. Walter missing dialysis.' },
    { stage: 'stabilization', status: 'active', date: '2025-01-15', notes: 'Dialysis transport arranged through partner. Housing accessibility still unresolved.' },
    { stage: 'repair_rebuild', status: 'upcoming' },
    { stage: 'closure', status: 'upcoming' },
  ]},
  { id: 'j-015', householdId: 'hh-015', stages: [
    { stage: 'intake', status: 'completed', date: '2024-09-16', notes: 'Shrimper family. Boat and home damaged. Staying with family.' },
    { stage: 'assessment', status: 'completed', date: '2024-09-25', notes: 'Boat repairable. Home needs siding and windows. Insurance responsive.' },
    { stage: 'stabilization', status: 'completed', date: '2024-10-15', notes: 'Boat repair started. Kids enrolled in temporary school.' },
    { stage: 'repair_rebuild', status: 'completed', date: '2024-12-10', notes: 'Boat repaired. Home siding and windows replaced. Family moved back.' },
    { stage: 'closure', status: 'completed', date: '2025-03-05', notes: 'Full recovery. Paul helping other fishermen. Case closed.' },
  ]},
];

export function getJourneyForHousehold(householdId: string): CaseJourney | undefined {
  return journeys.find(j => j.householdId === householdId);
}
