export interface Donation {
  id: string;
  donorName: string;
  amount: number;
  date: string;
  householdId?: string; // undefined = general fund
  purpose: string;
  type: 'monetary' | 'in_kind' | 'service';
}

export const donations: Donation[] = [
  {
    id: 'don-001',
    donorName: 'First Baptist Church of Baton Rouge',
    amount: 5000,
    date: '2026-01-15',
    purpose: 'General disaster relief fund',
    type: 'monetary',
  },
  {
    id: 'don-002',
    donorName: 'Raj & Priya Patel',
    amount: 1200,
    date: '2026-02-03',
    householdId: 'hh-003',
    purpose: 'Johnson family rebuilding fund',
    type: 'monetary',
  },
  {
    id: 'don-003',
    donorName: "Lowes Hardware - Disaster Partner",
    amount: 3800,
    date: '2026-02-10',
    householdId: 'hh-001',
    purpose: 'Building materials for Martinez roof repair',
    type: 'in_kind',
  },
  {
    id: 'don-004',
    donorName: 'Grace Lee',
    amount: 0,
    date: '2026-02-18',
    householdId: 'hh-005',
    purpose: '12 hours nursing care for Hoa Tran',
    type: 'service',
  },
  {
    id: 'don-005',
    donorName: 'St. Vincent de Paul Society',
    amount: 0,
    date: '2026-03-01',
    householdId: 'hh-006',
    purpose: 'Furniture set and household essentials for Garcia apartment',
    type: 'in_kind',
  },
  {
    id: 'don-006',
    donorName: 'Anonymous Donor',
    amount: 10000,
    date: '2026-03-05',
    purpose: 'Hurricane Francine long-term recovery fund',
    type: 'monetary',
  },
  {
    id: 'don-007',
    donorName: 'VFW Post 3619',
    amount: 750,
    date: '2026-03-10',
    householdId: 'hh-010',
    purpose: 'Generator and supplies for James Washington',
    type: 'in_kind',
  },
  {
    id: 'don-008',
    donorName: 'Gulf Coast Community Foundation',
    amount: 15000,
    date: '2026-03-15',
    purpose: 'Q1 2026 operating grant for case management',
    type: 'monetary',
  },
  {
    id: 'don-009',
    donorName: 'Robert & Patricia Thompson',
    amount: 500,
    date: '2026-03-20',
    householdId: 'hh-014',
    purpose: 'Robinson family transportation assistance',
    type: 'monetary',
  },
  {
    id: 'don-010',
    donorName: 'Carlos Rivera',
    amount: 0,
    date: '2026-03-25',
    householdId: 'hh-008',
    purpose: '20 hours carpentry for Davis temporary housing repairs',
    type: 'service',
  },
];

export function getDonationsForHousehold(householdId: string): Donation[] {
  return donations.filter(d => d.householdId === householdId);
}

export function getTotalMonetaryDonations(): number {
  return donations.filter(d => d.type === 'monetary').reduce((sum, d) => sum + d.amount, 0);
}
