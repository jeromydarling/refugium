// Refugium Brand Constants

export const brand = {
  appName: 'Refugium',
  fullName: 'Survivor-Centered Disaster Recovery',
  assistantName: 'NRI',
  assistantFullName: 'NRI — Narrative Relationship Intelligence',
  tagline: 'See the person. Discern the need. Strengthen the refuge.',
  positioning: 'Refugium is a survivor-centered disaster recovery platform for the long tail — helping small humanitarian organizations see people, track unmet needs, and strengthen the refuge of community.',
  domain: 'refugium.app',
} as const;

export const modules = {
  people: { label: 'People', description: 'Household recovery records & case profiles' },
  refuge: { label: 'Refuge', description: 'Trusted partner directory & resource network' },
  flow: { label: 'Flow', description: 'Volunteer operations & coordination' },
  nri: { label: 'NRI', description: 'Narrative Relationship Intelligence — pattern detection for disaster recovery' },
} as const;

export type ModuleKey = keyof typeof modules;
