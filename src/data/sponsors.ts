export type SponsorTier = 'platinum' | 'gold' | 'silver' | 'logo';

export interface Sponsor {
  name: string;
  logo: string;
  url: string;
  tier: SponsorTier;
}

export const sponsors: Sponsor[] = [
  {
    name: "OpenSearch",
    logo: "opensearch.png",
    url: "https://opensearch.org/",
    tier: "logo",
  },
];
