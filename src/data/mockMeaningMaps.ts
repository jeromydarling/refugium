/**
 * Meaning Maps — Viktor Frankl's three pathways to meaning, observed per household.
 *
 * Creative Values: meaning through what we give to the world (work, creation, contribution)
 * Experiential Values: meaning through what we receive (love, beauty, truth, encounter)
 * Attitudinal Values: meaning through how we face unavoidable suffering (courage, dignity, transcendence)
 */

export interface MeaningObservation {
  id: string;
  date: string;
  author: string;
  pathway: 'creative' | 'experiential' | 'attitudinal';
  observation: string;
}

export interface MeaningMap {
  householdId: string;
  observations: MeaningObservation[];
  summary?: string;
}

export const meaningMaps: MeaningMap[] = [
  {
    householdId: 'hh-001',
    summary: 'Maria draws deep meaning from her role as caretaker for Elena and the children. Carlos finds purpose in providing — even double shifts carry meaning when framed as sacrifice for family.',
    observations: [
      { id: 'mo-001', date: '2024-09-22', author: 'James Wilson', pathway: 'creative', observation: 'Carlos spoke about wanting to rebuild the kids\' bedrooms himself — "they should know their father built their home back." His work is meaning.' },
      { id: 'mo-002', date: '2024-10-05', author: 'Sarah Thompson', pathway: 'experiential', observation: 'Maria lit up talking about Sofia\'s school play next month. She said, "If we can get to that night, I\'ll know we\'re going to be okay." A future anchor.' },
      { id: 'mo-003', date: '2024-10-05', author: 'Sarah Thompson', pathway: 'attitudinal', observation: 'Elena told me, "I survived worse in Cuba. This is nothing." She models dignified endurance for the entire family. Her attitude IS the family\'s strength.' },
    ],
  },
  {
    householdId: 'hh-003',
    summary: 'Terrence\'s identity as a provider and skilled tradesman is under severe strain — losing his tools was losing part of himself. Keisha holds the family together through sheer will.',
    observations: [
      { id: 'mo-004', date: '2024-04-15', author: 'David Park', pathway: 'creative', observation: 'Terrence kept saying "I build things, that\'s what I do." Losing his tools isn\'t just financial — it\'s existential. He needs to create to feel whole.' },
      { id: 'mo-005', date: '2024-04-22', author: 'David Park', pathway: 'attitudinal', observation: 'Keisha said something striking: "I can\'t fall apart because they\'re watching." Her children\'s gaze gives her the will to face each day. Classic attitudinal meaning.' },
    ],
  },
  {
    householdId: 'hh-005',
    summary: 'Thanh\'s entire identity was the sea — fishing was creative meaning, family provision, and cultural continuity all at once. The boat\'s destruction shattered multiple meaning pathways simultaneously.',
    observations: [
      { id: 'mo-006', date: '2024-09-18', author: 'David Park', pathway: 'creative', observation: 'Thanh said his grandfather and father were fishermen. The boat wasn\'t property — it was legacy. "When I go out on the water, I am with them." This is deep creative and inherited meaning.' },
      { id: 'mo-007', date: '2024-10-01', author: 'Sarah Thompson', pathway: 'experiential', observation: 'Mai smiled for the first time when Linh drew a picture of their old house. "She remembers the garden," Mai said. The children\'s memories are a source of experiential meaning for the parents.' },
      { id: 'mo-008', date: '2024-10-01', author: 'Sarah Thompson', pathway: 'attitudinal', observation: 'Hoa Tran (grandmother) sits quietly but when I asked how she was, she said through Mai: "We have been refugees before. We know how to begin again." Attitudinal meaning forged through prior suffering.' },
    ],
  },
  {
    householdId: 'hh-008',
    summary: 'Angela\'s meaning is entirely relational — her children ARE her purpose. Michael is struggling because his sense of safety (and therefore meaning) was shattered when the family separated.',
    observations: [
      { id: 'mo-009', date: '2024-05-15', author: 'Sarah Thompson', pathway: 'experiential', observation: 'Angela said the worst part wasn\'t losing the house — it was the three weeks the kids were separated. "I didn\'t know who I was without them in the same room." Meaning through love and presence.' },
      { id: 'mo-010', date: '2024-05-15', author: 'Sarah Thompson', pathway: 'attitudinal', observation: 'Michael told the counselor he feels "like the ground could open up anytime." His anxiety is a meaning crisis — he lost the belief that the world is stable enough to build a life in. This is Frankl\'s existential vacuum.' },
    ],
  },
  {
    householdId: 'hh-010',
    summary: 'James\'s military service gave him a lifetime of meaning through duty and sacrifice. Now retired and alone, he struggles to accept help because his identity is "the one who serves, not the one who needs."',
    observations: [
      { id: 'mo-011', date: '2024-09-19', author: 'Sarah Thompson', pathway: 'creative', observation: 'James showed me his Vietnam photos — he was a medic. "I saved people. That was my job." His creative meaning was through service to others. Being the one who needs help inverts his entire self-concept.' },
      { id: 'mo-012', date: '2024-10-03', author: 'David Park', pathway: 'attitudinal', observation: '"Others need it more." James says this every visit. Frankl would recognize this as attitudinal meaning through self-sacrifice — but it\'s also a barrier to receiving help. The challenge is honoring his dignity while ensuring he accepts care.' },
    ],
  },
  {
    householdId: 'hh-013',
    summary: 'Claire\'s entire meaning structure is built around caregiving — for Ethan and for Louise. But caregiving without rest eventually hollows out the caregiver. Her breakdown was a meaning crisis: who cares for the one who cares?',
    observations: [
      { id: 'mo-013', date: '2025-02-20', author: 'James Wilson', pathway: 'creative', observation: 'Claire said through tears, "I\'m doing everything right and nothing is getting better." Her creative meaning (caregiving) is colliding with reality. She needs someone to affirm that her sacrifice has value even when outcomes are slow.' },
      { id: 'mo-014', date: '2025-02-20', author: 'James Wilson', pathway: 'experiential', observation: 'When I asked what brings her joy, she paused a long time and said, "Ethan laughed at a cartoon yesterday and I realized I hadn\'t heard him laugh in weeks." Small experiential moments are her lifeline.' },
    ],
  },
  {
    householdId: 'hh-015',
    summary: 'Paul\'s recovery is a textbook example of Frankl\'s tragic optimism — he found meaning in the suffering by turning it into service. Now he helps other fishermen rebuild.',
    observations: [
      { id: 'mo-015', date: '2025-03-05', author: 'Sarah Thompson', pathway: 'creative', observation: 'Paul is spending weekends helping other fishermen repair their boats. "I know what it feels like to look at the water and not be able to go out." He transformed his suffering into creative meaning for others.' },
      { id: 'mo-016', date: '2025-03-05', author: 'Sarah Thompson', pathway: 'attitudinal', observation: 'Anne said, "The storm showed us what we could survive." The family\'s attitude toward suffering has transformed — they see themselves as stronger, not broken. This is Frankl\'s tragic optimism fully realized.' },
    ],
  },
];

export function getMeaningMap(householdId: string): MeaningMap | undefined {
  return meaningMaps.find(m => m.householdId === householdId);
}
