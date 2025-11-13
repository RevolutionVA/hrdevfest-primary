export type SponsorTier = 'platinum' | 'gold' | 'silver' | 'logo';

export interface Sponsor {
  name: string;
  logo: string;
  url: string;
  tier: SponsorTier;
}

export const sponsors: Sponsor[] = [
  {
    name: "Marathon Consulting",
    logo: "marathon.png",
    url: "https://marathonus.com/",
    tier: "silver",
  },
  {
    name: "Issuetrak",
    logo: "issuetrak.png",
    url: "https://www.issuetrak.com/",
    tier: "silver",
  },
  {
    name: "OpenSearch",
    logo: "opensearch.png",
    url: "https://opensearch.org/",
    tier: "logo",
  },
  {
    name: "Swift Kick",
    logo: "swiftkick.png",
    url: "https://consultwithgriff.com",
    tier: "logo",
  },
];
