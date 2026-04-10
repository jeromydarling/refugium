export interface SharedNote {
  id: string;
  householdId: string;
  orgName: string;
  authorName: string;
  content: string;
  date: string;
  visibility: 'shared'; // always shared between orgs
}

export const sharedNotes: SharedNote[] = [
  {
    id: 'sn-001',
    householdId: 'hh-001',
    orgName: 'Catholic Charities of Acadiana',
    authorName: 'Maria Gonzalez',
    content: 'Martinez family approved for emergency housing assistance through our Francine recovery program. Disbursement of $2,400 for first/last month rent on temporary unit processed 10/1. Elena Reyes enrolled in our medication assistance program — prescriptions will be delivered monthly.',
    date: '2024-10-02',
    visibility: 'shared',
  },
  {
    id: 'sn-002',
    householdId: 'hh-003',
    orgName: 'Red Cross - Greater New Orleans',
    authorName: 'Daniel Foster',
    content: 'Johnson family received emergency supplies kit and financial assistance of $800. Mold assessment referral submitted to our environmental health partner. Children cleared for temporary school enrollment at nearby district through our education liaison.',
    date: '2024-04-20',
    visibility: 'shared',
  },
  {
    id: 'sn-003',
    householdId: 'hh-005',
    orgName: 'Catholic Charities of Acadiana',
    authorName: 'Maria Gonzalez',
    content: 'Nguyen family connected with Vietnamese community liaison for cultural support. Childcare vouchers approved for Linh and Bao through Head Start partnership. Mai Nguyen expressed interest in ESL classes — will coordinate enrollment once housing stabilizes.',
    date: '2024-10-05',
    visibility: 'shared',
  },
  {
    id: 'sn-004',
    householdId: 'hh-008',
    orgName: 'Habitat for Humanity Greater Baton Rouge',
    authorName: 'Tom Anderson',
    content: 'Davis property assessed — confirmed total loss. Family qualifies for our Disaster ReBuilt program. Construction timeline estimated at 8-10 months. We can begin foundation work once FEMA lot clearance is approved. Volunteer crews scheduled for demolition phase.',
    date: '2024-06-01',
    visibility: 'shared',
  },
  {
    id: 'sn-005',
    householdId: 'hh-010',
    orgName: 'Red Cross - Greater New Orleans',
    authorName: 'Patricia Simmons',
    content: 'Washington case flagged for veteran-specific support pathway. Coordinating with VA social worker on integrated care plan. Emergency supplies delivered. Neighbor contact established for daily wellness checks. Mr. Washington is resistant to group shelter — prefers to remain in home.',
    date: '2024-09-22',
    visibility: 'shared',
  },
  {
    id: 'sn-006',
    householdId: 'hh-014',
    orgName: 'Red Cross - Greater New Orleans',
    authorName: 'Daniel Foster',
    content: 'Robinson family receiving emergency financial assistance for infant supplies and Walter\'s medical transportation. Coordinating with Gulf Coast Kidney Center to ensure uninterrupted dialysis schedule. Family needs wheelchair-accessible housing — current FEMA trailer is inadequate.',
    date: '2024-10-15',
    visibility: 'shared',
  },
  {
    id: 'sn-007',
    householdId: 'hh-001',
    orgName: 'Habitat for Humanity Greater Baton Rouge',
    authorName: 'Tom Anderson',
    content: 'Roof repair crew scheduled for Martinez home — November 15 start date. Carlos expressed interest in participating with construction (experienced with tools). We\'ll integrate him into the build team. Materials donated by Lowes partner program.',
    date: '2024-10-28',
    visibility: 'shared',
  },
  {
    id: 'sn-008',
    householdId: 'hh-013',
    orgName: 'Catholic Charities of Acadiana',
    authorName: 'Maria Gonzalez',
    content: 'Broussard family: Claire enrolled in our caregiver respite program. 8 hours/week of in-home aide for Louise starting Jan 6. Claire tearful but grateful. We are also connecting her with our counseling services — she is showing signs of caregiver burnout and needs support for herself.',
    date: '2025-01-03',
    visibility: 'shared',
  },
];

export function getSharedNotesForHousehold(householdId: string): SharedNote[] {
  return sharedNotes.filter(n => n.householdId === householdId);
}
