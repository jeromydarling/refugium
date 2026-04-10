export type NeedCategory = 'housing_repair' | 'temporary_shelter' | 'food_assistance' | 'medical_care' | 'mental_health' | 'legal_aid' | 'employment' | 'transportation' | 'childcare' | 'utilities' | 'documentation' | 'clothing';

export const NEED_CATEGORIES: Record<NeedCategory, { label: string; color: string }> = {
  housing_repair: { label: 'Housing Repair', color: 'bg-blue-100 text-blue-800' },
  temporary_shelter: { label: 'Temporary Shelter', color: 'bg-indigo-100 text-indigo-800' },
  food_assistance: { label: 'Food', color: 'bg-green-100 text-green-800' },
  medical_care: { label: 'Medical', color: 'bg-red-100 text-red-800' },
  mental_health: { label: 'Mental Health', color: 'bg-purple-100 text-purple-800' },
  legal_aid: { label: 'Legal', color: 'bg-amber-100 text-amber-800' },
  employment: { label: 'Employment', color: 'bg-orange-100 text-orange-800' },
  transportation: { label: 'Transportation', color: 'bg-cyan-100 text-cyan-800' },
  childcare: { label: 'Childcare', color: 'bg-pink-100 text-pink-800' },
  utilities: { label: 'Utilities', color: 'bg-yellow-100 text-yellow-800' },
  documentation: { label: 'Documentation', color: 'bg-slate-100 text-slate-800' },
  clothing: { label: 'Clothing', color: 'bg-teal-100 text-teal-800' },
};

export interface NeedInstance {
  id: string;
  householdId: string;
  category: NeedCategory;
  title: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'unmet' | 'in_progress' | 'met';
  referredTo?: string;
  createdAt: string;
  updatedAt: string;
}

export const needs: NeedInstance[] = [
  { id: 'n-001', householdId: 'hh-001', category: 'housing_repair', title: 'Roof and water damage repair', description: 'Roof has multiple leaks. Three rooms with water intrusion and drywall damage.', priority: 'critical', status: 'in_progress', referredTo: 'Habitat for Humanity', createdAt: '2024-09-15', updatedAt: '2024-10-01' },
  { id: 'n-002', householdId: 'hh-001', category: 'medical_care', title: 'Medication for Elena Reyes', description: 'Diabetes medication supply disrupted. Needs reliable pharmacy access.', priority: 'high', status: 'in_progress', referredTo: 'St. Francis Pharmacy', createdAt: '2024-09-15', updatedAt: '2024-10-05' },
  { id: 'n-003', householdId: 'hh-001', category: 'transportation', title: 'Transport to medical appointments', description: 'Elena needs rides to doctor and pharmacy. Family has one working car.', priority: 'medium', status: 'unmet', createdAt: '2024-10-05', updatedAt: '2024-10-05' },
  { id: 'n-004', householdId: 'hh-002', category: 'legal_aid', title: 'Insurance claim dispute', description: 'Insurance company undervaluing restaurant damage. Need legal assistance.', priority: 'high', status: 'in_progress', referredTo: 'Legal Aid Society', createdAt: '2024-09-20', updatedAt: '2024-10-10' },
  { id: 'n-005', householdId: 'hh-002', category: 'documentation', title: 'SBA loan application assistance', description: 'Need help navigating SBA disaster loan paperwork. Language barrier.', priority: 'high', status: 'in_progress', createdAt: '2024-10-01', updatedAt: '2024-10-15' },
  { id: 'n-006', householdId: 'hh-003', category: 'housing_repair', title: 'Mold remediation', description: 'Mold growing in flooded first floor. Health hazard for children.', priority: 'critical', status: 'unmet', createdAt: '2024-04-22', updatedAt: '2024-04-22' },
  { id: 'n-007', householdId: 'hh-003', category: 'medical_care', title: 'Respiratory care for children', description: 'Both kids showing respiratory symptoms from mold exposure.', priority: 'critical', status: 'unmet', createdAt: '2024-04-22', updatedAt: '2024-04-22' },
  { id: 'n-008', householdId: 'hh-003', category: 'employment', title: 'Tool replacement for contractor work', description: 'Terrence lost all contracting tools in flood. Cannot work without them.', priority: 'high', status: 'unmet', createdAt: '2024-04-15', updatedAt: '2024-04-15' },
  { id: 'n-009', householdId: 'hh-003', category: 'documentation', title: 'FEMA assistance application', description: 'No flood insurance. Need help filing FEMA individual assistance claim.', priority: 'high', status: 'in_progress', createdAt: '2024-04-15', updatedAt: '2024-04-20' },
  { id: 'n-010', householdId: 'hh-004', category: 'housing_repair', title: 'Permanent roof repair', description: 'Tornado damaged roof. Currently tarped. Needs permanent fix before rainy season.', priority: 'high', status: 'in_progress', referredTo: 'Samaritan\'s Purse', createdAt: '2024-04-10', updatedAt: '2024-04-25' },
  { id: 'n-011', householdId: 'hh-004', category: 'transportation', title: 'Pharmacy and doctor transport', description: 'Dorothy cannot drive. Lives 2 hours from daughter. Needs local transport to pharmacy.', priority: 'medium', status: 'unmet', createdAt: '2024-04-10', updatedAt: '2024-04-25' },
  { id: 'n-012', householdId: 'hh-005', category: 'temporary_shelter', title: 'Stable housing for family of 5', description: 'Currently in church shelter. Need transition to temporary rental or host home.', priority: 'critical', status: 'unmet', createdAt: '2024-09-18', updatedAt: '2024-10-01' },
  { id: 'n-013', householdId: 'hh-005', category: 'childcare', title: 'Childcare for 2 young children', description: 'Mai cannot work while caring for 2 toddlers and elderly mother.', priority: 'high', status: 'unmet', createdAt: '2024-10-01', updatedAt: '2024-10-01' },
  { id: 'n-014', householdId: 'hh-005', category: 'food_assistance', title: 'SNAP benefits application', description: 'Family needs food assistance. Application in progress.', priority: 'high', status: 'in_progress', createdAt: '2024-10-01', updatedAt: '2024-10-01' },
  { id: 'n-015', householdId: 'hh-006', category: 'clothing', title: 'Furniture and household items', description: 'New apartment but no furniture. Kids need beds, family needs basic household items.', priority: 'medium', status: 'in_progress', referredTo: 'St. Vincent de Paul', createdAt: '2024-05-10', updatedAt: '2024-05-10' },
  { id: 'n-016', householdId: 'hh-008', category: 'mental_health', title: 'Counseling for Michael', description: 'Michael\'s anxiety worsening after tornado. Needs regular counseling sessions.', priority: 'high', status: 'in_progress', referredTo: 'Catholic Charities Counseling', createdAt: '2024-05-15', updatedAt: '2024-05-15' },
  { id: 'n-017', householdId: 'hh-008', category: 'housing_repair', title: 'Permanent housing plan', description: 'Home was total loss. Family in FEMA trailer. Need long-term housing solution.', priority: 'critical', status: 'in_progress', createdAt: '2024-04-12', updatedAt: '2024-05-15' },
  { id: 'n-018', householdId: 'hh-010', category: 'housing_repair', title: 'Roof repair for veteran', description: 'Roof damage from hurricane. VA home loan may help but needs navigation.', priority: 'high', status: 'in_progress', createdAt: '2024-09-19', updatedAt: '2024-10-03' },
  { id: 'n-019', householdId: 'hh-010', category: 'mental_health', title: 'PTSD support', description: 'Storm triggered severe PTSD episode. Connected with VA social worker but needs ongoing support.', priority: 'critical', status: 'in_progress', referredTo: 'VA Medical Center', createdAt: '2024-09-19', updatedAt: '2024-10-03' },
  { id: 'n-020', householdId: 'hh-011', category: 'employment', title: 'Job placement', description: 'Lisa lost daycare job when center flooded. Needs employment with flexible hours for childcare.', priority: 'high', status: 'unmet', createdAt: '2024-04-16', updatedAt: '2024-04-16' },
  { id: 'n-021', householdId: 'hh-011', category: 'childcare', title: 'Childcare for 3 children', description: 'Cannot work without childcare. No family support nearby. Noah (4) not yet school age.', priority: 'high', status: 'unmet', createdAt: '2024-04-16', updatedAt: '2024-04-16' },
  { id: 'n-022', householdId: 'hh-011', category: 'housing_repair', title: 'Rental property repairs', description: 'Landlord unresponsive about flood damage repairs. May need tenant rights assistance.', priority: 'medium', status: 'unmet', createdAt: '2024-04-16', updatedAt: '2024-04-16' },
  { id: 'n-023', householdId: 'hh-012', category: 'employment', title: 'Business rebuilding support', description: 'Dry cleaning business partially covered by insurance. Need guidance on SBA programs.', priority: 'medium', status: 'in_progress', createdAt: '2024-06-15', updatedAt: '2024-06-15' },
  { id: 'n-024', householdId: 'hh-013', category: 'housing_repair', title: 'Roof repair and mold remediation', description: 'Roof still tarped after 5 months. Mold was remediated in kitchen but may return without permanent roof fix.', priority: 'high', status: 'in_progress', referredTo: 'Habitat for Humanity', createdAt: '2024-09-18', updatedAt: '2025-02-20' },
  { id: 'n-025', householdId: 'hh-013', category: 'mental_health', title: 'Caregiver support for Claire', description: 'Claire is sole caregiver for mother with dementia and young child. Showing signs of caregiver burnout. Needs respite care and counseling.', priority: 'high', status: 'in_progress', referredTo: 'Catholic Charities Counseling', createdAt: '2024-12-05', updatedAt: '2025-02-20' },
  { id: 'n-026', householdId: 'hh-014', category: 'medical_care', title: 'Dialysis transportation for Walter', description: 'Walter Robinson needs reliable transportation to dialysis center 3x/week. Has already missed appointments.', priority: 'critical', status: 'in_progress', referredTo: 'Community Health Center', createdAt: '2024-10-10', updatedAt: '2025-01-15' },
  { id: 'n-027', householdId: 'hh-014', category: 'housing_repair', title: 'Home repair — $45K insurance gap', description: 'Repair estimate $85K, insurance offering $40K. Need to bridge the gap through FEMA, SBA, or nonprofit partners.', priority: 'high', status: 'unmet', createdAt: '2025-01-15', updatedAt: '2025-01-15' },
  { id: 'n-028', householdId: 'hh-014', category: 'temporary_shelter', title: 'Accessible temporary housing', description: 'FEMA trailer is not wheelchair-accessible for Walter. Need accessible temporary housing while home is repaired.', priority: 'high', status: 'unmet', createdAt: '2024-10-10', updatedAt: '2024-10-10' },
  { id: 'n-029', householdId: 'hh-005', category: 'employment', title: 'Job placement for Thanh', description: 'Thanh found temporary warehouse work but needs stable employment. Fishing boat destroyed — may need career transition support.', priority: 'medium', status: 'in_progress', createdAt: '2024-10-01', updatedAt: '2024-10-01' },
  { id: 'n-030', householdId: 'hh-001', category: 'childcare', title: 'After-school care for Diego', description: 'Diego (8) needs after-school supervision while Carlos works double shifts and Maria handles Elena\'s medical appointments.', priority: 'medium', status: 'unmet', createdAt: '2024-10-05', updatedAt: '2024-10-05' },
];

export function getNeedsForHousehold(householdId: string): NeedInstance[] {
  return needs.filter(n => n.householdId === householdId);
}
