// 2027 sponsors shown on the homepage. Tier names match the 2027 prospectus in sponsor.ts.

export type Sponsor2027Tier =
  | 'presenting'
  | 'main-stage'
  | 'featured'
  | 'community'
  | 'reception-partner'
  | 'lunch-partner'
  | 'scholarship-partner'
  | 'popup-series-partner'
  | 'coffee-partner'
  | 'lanyard-partner';

export const sponsor2027TierLabels: Record<Sponsor2027Tier, string> = {
  presenting: 'Presenting Sponsor',
  'main-stage': 'Main Stage Sponsor',
  featured: 'Featured Sponsor',
  community: 'Community Sponsor',
  'reception-partner': 'Post-Event Reception Partner',
  'lunch-partner': 'Lunch Partner',
  'scholarship-partner': 'Scholarship Partner',
  'popup-series-partner': 'Pop-up Series Partner',
  'coffee-partner': 'Coffee Partner',
  'lanyard-partner': 'Lanyard Partner',
};

// Render order on the homepage. Exclusive partnerships come before packages.
export const sponsor2027TierOrder: Sponsor2027Tier[] = [
  'presenting',
  'reception-partner',
  'main-stage',
  'lunch-partner',
  'scholarship-partner',
  'popup-series-partner',
  'coffee-partner',
  'lanyard-partner',
  'featured',
  'community',
];

export interface Sponsor2027 {
  name: string;
  logo: string;
  url: string;
  tier: Sponsor2027Tier;
  /** Show the name as text next to the logo, for icon-only logos. */
  showName?: boolean;
}

export const sponsors2027: Sponsor2027[] = [
  {
    name: 'Stigian',
    logo: 'stigian.png',
    url: 'https://stigian.com/',
    tier: 'reception-partner',
  },
  {
    name: 'Landstats',
    logo: 'landstats.svg',
    url: 'https://www.landstats.com/',
    tier: 'featured',
    showName: true,
  },
];
