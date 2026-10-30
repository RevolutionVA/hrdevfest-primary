// Sponsor page data, shared by /sponsor and the printable sponsor sheet (/sponsor/print)

export const SPONSOR_SHEET_PDF_HREF = "/sponsor/hrdevfest-2027-sponsor-sheet-2026-10-30.pdf";

export interface ScheduleItem {
  time: string;
  what: string;
  sponsorTime?: boolean; // a moment sponsors are on, at a table, or being named
}

export const schedule: ScheduleItem[] = [
  { time: "7:30", what: "Building opens, sponsor setup", sponsorTime: true },
  { time: "8:00", what: "Registration and networking at the sponsor tables", sponsorTime: true },
  { time: "9:00", what: "Opening, with the Presenting sponsor's 15 minutes of Sponsor Stage Time", sponsorTime: true },
  { time: "9:30", what: "Talk" },
  { time: "10:15", what: "Talk" },
  { time: "11:00", what: "Networking break at the sponsor tables", sponsorTime: true },
  { time: "11:30", what: "Talk" },
  { time: "12:15", what: "Lunch in the Studio", sponsorTime: true },
  { time: "1:30", what: "Main Stage sponsor's 15 minutes of Sponsor Stage Time", sponsorTime: true },
  { time: "1:45", what: "Talk" },
  { time: "2:30", what: "Networking break at the sponsor tables", sponsorTime: true },
  { time: "3:00", what: "Talk" },
  { time: "3:45", what: "Talk" },
  { time: "4:30", what: "Closing, then networking and sponsor teardown (building closes at 6:00)", sponsorTime: true },
  { time: "After conference closing", what: "Official DevFest Reception: venue and exact timing to be announced", sponsorTime: true },
];

export const COMMUNITY_CHECKOUT_HREF = "https://buy.stripe.com/cNi3cv4eG6CpcnP1b44AU06";
export const COMMUNITY_CALLOUT_BULLETS = [
  "1 conference ticket",
  "Your logo on the website and event slides",
  "A group thank-you",
  "The post-event report",
];

export interface GlanceRow {
  package: string;
  price: string;
  available: string;
  tickets: string;
  benefits: string[];
  checkoutHref?: string;
}

export const glance: GlanceRow[] = [
  {
    package: "Presenting Sponsor",
    price: "$10,000",
    available: "1",
    tickets: "12",
    benefits: [
      '"DevFest presented by [Company]" naming',
      "Top branding on the website, event emails and signage",
      "15 min of Sponsor Stage Time at opening",
      "Newsletter feature",
      "4 dedicated social posts",
      "1 post-event email to opted-in attendees",
    ],
  },
  {
    package: "Main Stage Sponsor",
    price: "$5,000",
    available: "1",
    tickets: "10",
    benefits: [
      '"[Company] Main Stage" naming on signage and schedule',
      "15 min of Sponsor Stage Time in the afternoon",
      "Newsletter feature",
      "3 dedicated social posts",
      "1 post-event email to opted-in attendees",
    ],
  },
  {
    package: "Featured Sponsor",
    price: "$2,500",
    available: "5",
    tickets: "4",
    benefits: [
      "Larger logo",
      "Newsletter mention",
      "2 dedicated social posts",
    ],
  },
  {
    package: "Community Sponsor",
    price: "$500",
    available: "Unlimited",
    tickets: "1",
    benefits: [
      "Logo on the website and event slides",
      "Group thank-you",
    ],
    checkoutHref: COMMUNITY_CHECKOUT_HREF,
  },
];

export interface Partnership {
  id: string;
  name: string;
  price: string;
  available: string;
  tickets: string;
  benefits: string[];
  linkLabel?: string;
  linkHref?: string;
}

export const partnerships: Partnership[] = [
  {
    id: "reception-partner",
    name: "Post-Event Reception Partner",
    price: "$5,000",
    available: "1 exclusive",
    tickets: "10",
    benefits: [
      '"DevFest Reception presented by [Company]" naming',
      "Reception signage",
      "Recognition in reception announcements",
      "Thank-you at conference closing",
      "Welcome of up to 2 min at the reception",
      "1 post-event email to opted-in attendees",
    ],
  },
  {
    id: "lunch-partner",
    name: "Lunch Partner",
    price: "$2,000",
    available: "1 exclusive",
    tickets: "2",
    benefits: [
      "Lunch area branding",
      "Thank-you before lunch",
    ],
  },
  {
    id: "scholarship-partner",
    name: "Scholarship Partner",
    price: "$1,000",
    available: "1 exclusive",
    tickets: "1",
    benefits: [
      "Funds 20 tickets for students and veterans",
      "Recognition as scholarship supporter",
    ],
  },
  {
    id: "popup-series-partner",
    name: "Pop-up Series Partner",
    price: "$1,000",
    available: "1 exclusive",
    tickets: "1",
    benefits: [
      '"Pop-up Meetup presented by [Company]" naming',
      "On all 4 Pop-up Meetups",
    ],
    linkLabel: "Pop-up Meetups",
    linkHref: "https://revolutionva.org/programs/pop-up-meetups/",
  },
  {
    id: "coffee-partner",
    name: "Coffee Partner",
    price: "$1,000",
    available: "1 exclusive",
    tickets: "1",
    benefits: [
      "Coffee station branding",
      "Thank-you during opening remarks",
    ],
  },
  {
    id: "lanyard-partner",
    name: "Lanyard Partner",
    price: "$1,000",
    available: "1 exclusive",
    tickets: "1",
    benefits: [
      "Your logo on attendee lanyards, with DevFest branding",
    ],
  },
];

// A bullet can carry a nested list (for example, what the report covers)
export type FaqBullet = string | { text: string; items: string[] };

export interface FaqItem {
  title: string;
  bullets: FaqBullet[];
  open?: boolean;
}

export const faqItems: FaqItem[] = [
  {
    title: "Commit now. Pay in 2027 if needed.",
    open: true,
    bullets: [
      "Reserve with the form above or email team@revolutionva.org.",
      "Using your 2027 budget? Tell us when you book.",
      "We confirm your payment date with your reservation.",
      "Payment is due within 30 days of invoicing unless we agree on a 2027 payment date when you book.",
      "Community ($500) is paid at checkout.",
      "We hold your package for 30 days after you reserve. Need longer for approvals? Ask and we'll extend it.",
      "Sign and logo files are due by Apr 1, 2027.",
    ],
  },
  {
    title: "Payment",
    bullets: [
      "Community checkout is a flat $500 by card or bank transfer.",
      "Checkout asks for your company name, contact emails and a logo link (or we follow up).",
      "Paying an invoice by card adds 3%. Check and ACH have no fee.",
      "In-kind support, such as venue or Pop-up Meetup hosting, counts toward Community recognition once we agree on a written value. It's itemized separately.",
      "We accept purchase orders and can send a quote.",
    ],
  },
  {
    title: "Do you work with supplier portals?",
    bullets: [
      "Yes, for Presenting, Main Stage and Reception sponsorships.",
    ],
  },
  {
    title: "Attendee privacy",
    open: true,
    bullets: [
      "Sponsor email opt-in is off by default.",
      "Presenting, Main Stage and Reception each include one post-event email. DevFest sends it to attendees who opt in.",
      "One email per qualifying offering.",
      "We never share attendee contacts with sponsors.",
      "We never sell attendee lists, and we never scan badges.",
    ],
  },
  {
    title: "Post-event report",
    bullets: [
      "Every sponsor receives the post-event report.",
      "The report lists companies present, when attendees provide them.",
      {
        text: "It includes photos of sponsor tables or signage, plus aggregate audience data:",
        items: [
          "Attendance and check-ins",
          "Roles and seniority",
          "Hiring, looking for work, internship, and open-to-contract ribbons",
          "Regions, students, veterans, and tech stacks",
          "Military or transitioning from the military (optional at registration)",
          "Scholars who attended versus scholars funded",
          "Newsletter and social reach",
        ],
      },
      "It never includes attendee names or contact details.",
    ],
  },
  {
    title: "Hiring board and ribbons",
    bullets: [
      "Featured, Main Stage and Presenting include a hiring-board listing near registration and on the DevFest site.",
      "Standalone partnerships do not include a hiring-board listing.",
      "Sponsors write their own listings. Every role must include an expected salary range.",
      "We don't collect resumes.",
      "Attendees can wear Hiring, Looking for work, Internship, or Open to contract work ribbons.",
    ],
  },
  {
    title: "Speakers and Sponsor Stage Time",
    bullets: [
      "We invite speakers from community recommendations. There's no open call.",
      "Anyone can be recommended, including sponsor staff. That's separate from sponsorship.",
      "Presenting and Main Stage each include 15 minutes of Sponsor Stage Time, clearly labeled as sponsor presentations.",
      "The Reception Partner gives a welcome of up to two minutes at the reception, separate from conference talks.",
    ],
  },
  {
    title: "Logo files",
    bullets: [
      "SVG, EPS or PDF preferred. We print signs from it.",
      "PNG only? Use a transparent background, at least 1,000 px wide.",
      "Send one version for light backgrounds and one for dark, such as all-white.",
      "A horizontal logo works best. We'll resize it for the site.",
      "Send files to team@revolutionva.org by Apr 1, 2027.",
    ],
  },
  {
    title: "Paperwork",
    bullets: [
      "Our W-9 and 501(c)(3) letter are available on request.",
      "Sponsorships are invoiced as sponsorships, not donations.",
      "Please consult your tax advisor on how to treat them.",
      "Sponsorship doesn't include access to officials, including elected, government and military officials who attend.",
    ],
  },
];

export const devfest2026Employers = [
  'AI Collective',
  'City of Chesapeake',
  'City of Virginia Beach',
  'Cognizant',
  'Decisions',
  'ECPI University',
  'HII (Newport News Shipbuilding)',
  'ICMicro',
  'Issuetrak',
  'LifeNet Health',
  'Marathon Consulting',
  'MI Technical Solutions',
  'Norfolk State University',
  'Noteable',
  'Old Dominion University',
  'Port Solution Integrators',
  'Rowan Source',
  'Stigian Consulting',
  'STIHL',
  'TECHEAD',
  'The GBS Group',
  'Tidewater Community College',
  'Virginia Community College System',
];

export const email = "team@revolutionva.org";

// "Why sponsor DevFest": Kevin's copy, verbatim
export const whySponsorIntro =
  "Hampton Roads DevFest started with a simple idea. The 757 has some of the best tech talent and tech companies in the country. We put the people doing that work on display and show what they bring to the region. Real tech companies back DevFest, and sponsoring shows your commitment to a strong, growing 757 tech community.";

export const whySponsorBullets = [
  "Your sponsorship funds DevFest and our 2027 workshops and meetups.",
  "Developers, engineers, veterans and students come to learn, connect and meet local tech companies.",
];

export const for2027 = [
  { label: "Local talent on stage.", text: "One track in one room, so everyone sees every talk." },
  { label: "The Studio.", text: "An open room for lunch and conversation." },
  { label: "Real time with attendees.", text: "Registration networking, two 30-minute breaks at the sponsor tables, and a 75-minute lunch." },
  { label: "Scholarship seats.", text: "Our Scholarship Partner funds seats for students and veterans." },
];

// Short lists under the package and partnership tables
export const packageIncludes = {
  every: { title: "Every package includes:", items: ["Website and slide recognition", "A group thank-you", "The post-event report"] },
  tableTiers: { title: "Featured, Main Stage and Presenting also include:", items: ["A sponsor table", "A hiring-board listing"] },
};
export const partnershipIncludes = {
  every: { title: "Every partnership includes:", items: ["Website and slide recognition", "The post-event report", "The tickets shown"] },
  notes: {
    title: "Good to know:",
    items: [
      "Buy alone or add to a package",
      "One partner per offering",
      "Tickets add to any package tickets",
      "Standalone partnerships don't include a table",
      "Only the Pop-up Series Partner names the Pop-up Meetups",
      "Hosts are thanked at the meetup they host",
    ],
  },
};
export const scheduleNote = "Sponsor time means sponsors are speaking, at their tables, or hosting a room. Schedule subject to change.";
