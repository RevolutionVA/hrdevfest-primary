export type SponsorTier = 'platinum' | 'gold' | 'silver' | 'logo';

export interface Sponsor {
  name: string;
  logo: string;
  url: string;
  tier: SponsorTier;
}

export const sponsors: Sponsor[] = [
  {
    name: "City of Virginia Beach",
    logo: "cvb.png",
    url: "https://yesvirginiabeach.com",
    tier: "platinum",
  },
  {
    name: "Progress",
    logo: "progress.png",
    url: "https://www.telerik.com/",
    tier: "gold",
  },
  {
    name: "Stigian Consulting",
    logo: "stigian.png",
    url: "https://stigian.com/",
    tier: "gold",
  },
  {
    name: "Decisions",
    logo: "decisions.png",
    url: "https://decisions.com/",
    tier: "gold",
  },
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
    name: "Noteable",
    logo: "noteable.png",
    url: "https://mynoteable.com/",
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
  {
    name: "Land Records",
    logo: "landrecords.png",
    url: "https://landrecords.us",
    tier: "logo",
  },
  {
    name: "Techead",
    logo: "TECHEAD.png",
    url: "https://www.techead.com",
    tier: "logo",
  },
];
