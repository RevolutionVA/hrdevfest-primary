// 2027 sponsors. One record drives the homepage credits and the prospectus availability,
// so adding a paid commitment here updates both. Tier names match the 2027 prospectus in sponsor.ts.
import { glance, partnerships } from './sponsor';

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

// Homepage render order, top down by level
export const sponsor2027TierOrder: Sponsor2027Tier[] = [
  'presenting',
  'main-stage',
  'reception-partner',
  'featured',
  'lunch-partner',
  'scholarship-partner',
  'popup-series-partner',
  'coffee-partner',
  'lanyard-partner',
  'community',
];

// Naming credits offered in the prospectus, shown with the sponsor's card
const sponsor2027TierCredits: Partial<Record<Sponsor2027Tier, (name: string) => string>> = {
  presenting: (name) => `DevFest presented by ${name}`,
  'main-stage': (name) => `${name} Main Stage`,
  'reception-partner': (name) => `DevFest Reception presented by ${name}`,
  'popup-series-partner': (name) => `Pop-up Meetup presented by ${name}`,
};

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
    name: 'Stigian Consulting',
    logo: 'stigian-2027.png',
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

export function sponsorCredit(sponsor: Sponsor2027): string | undefined {
  return sponsor2027TierCredits[sponsor.tier]?.(sponsor.name);
}

// Prospectus package names ("Featured Sponsor") and partnership ids map onto tier slugs
const packageTiers: Record<string, Sponsor2027Tier> = {
  'Presenting Sponsor': 'presenting',
  'Main Stage Sponsor': 'main-stage',
  'Featured Sponsor': 'featured',
  'Community Sponsor': 'community',
};

export function tierForPackage(packageName: string): Sponsor2027Tier | undefined {
  return packageTiers[packageName];
}

export function tierForPartnership(partnershipId: string): Sponsor2027Tier | undefined {
  return partnershipId in sponsor2027TierLabels ? (partnershipId as Sponsor2027Tier) : undefined;
}

/** How many slots an offering has, read from its prospectus "available" text ("1 exclusive", "5", "Unlimited"). */
function capacity(available: string): number {
  const count = parseInt(available, 10);
  return Number.isNaN(count) ? Infinity : count;
}

export function sponsorsInTier(tier: Sponsor2027Tier): Sponsor2027[] {
  return sponsors2027.filter((sponsor) => sponsor.tier === tier);
}

export function isOfferingClaimed(tier: Sponsor2027Tier | undefined, available: string): boolean {
  return tier !== undefined && sponsorsInTier(tier).length >= capacity(available);
}

export function claimedByName(tier: Sponsor2027Tier | undefined): string | undefined {
  if (!tier) return undefined;
  const names = sponsorsInTier(tier).map((sponsor) => sponsor.name);
  return names.length > 0 ? names.join(', ') : undefined;
}

/** Availability text for the prospectus: "Claimed by [Company]" once sold, else the default from sponsor.ts. */
export function offeringAvailability(tier: Sponsor2027Tier | undefined, available: string): string {
  return isOfferingClaimed(tier, available) ? `Claimed by ${claimedByName(tier)}` : available;
}

/** Reservation form choices that are still open. Community is left out: it has its own checkout. */
export function openPackageOptions(): string[] {
  return [
    ...glance
      .filter((row) => !row.checkoutHref && !isOfferingClaimed(tierForPackage(row.package), row.available))
      .map((row) => `${row.package} (${row.price})`),
    ...partnerships
      .filter((partner) => !isOfferingClaimed(tierForPartnership(partner.id), partner.available))
      .map((partner) => `${partner.name} (${partner.price})`),
  ];
}
