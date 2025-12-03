export interface Speaker {
  name: string;
  bio: string;
  image: string;
  linkedin?: string;
  twitter?: string;
  website?: string;
  bluesky?: string;
}

export const speakers: Speaker[] = [
  {
    name: "Lionel Sapp",
    bio: "Lionel Sapp is a Hampton Roads–based software engineer, community builder, and founder of The Digital Builders, a studio and mentorship network empowering others to turn their ideas into real-world products. A self-taught developer, Lionel has worked for two Techstars-backed startups, serving as CTO for one. Through Digital Builders, he leads mentorship programs and community events that teach aspiring creators how to build, launch, and grow their own tech ventures—right here in the 757.",
    image: "lionel-sapp.jpeg",
    linkedin: "https://www.linkedin.com/in/lionelthebldr/",
  },
  {
    name: "Ryan Castillo",
    bio: "Ryan is an author, developer and data-scientist with a passion for helping and teaching others. His deep expertise in large scale systems, data visualization and AI has helped Fortune 500 companies, the US Navy and startups of all sizes.",
    image: "ryan-castillo.jpeg",
    linkedin: "https://www.linkedin.com/in/rmcastil/",
    twitter: "https://twitter.com/rmcastil",
    website: "https://knowatoa.com",
  },
  {
    name: "Katie Novotny",
    bio: "Katie Novotny, AI Apps and Agents GBB at Microsoft. Software dev background but also manager, architect, and DevOps wrangler fluent in .NET, Python, and at least 10 other languages (some human, most not). Believes the best code - and life - comes from collaboration and curiosity. Loves: Functional fitness, skiing, and books that make her forget time. Hates: green peppers and chores that don't scale (looking at you, dusting).",
    image: "katie-novotny.jpeg",
    linkedin: "https://www.linkedin.com/in/katie-novotny/",
  },
  {
    name: "Tim Banks",
    bio: "Tim's tech career spans over 25 years through large corporate environments and in small startups, honing their skills in systems administration, automation, architecture, and operations for large cloud-based datastores. Today, Tim leverages their years in data, DevOps, and Site Reliability Engineering to advise and consult the open source and cloud computing communities on modernizing workloads, safe and efficient DevOps practices, and the effective use of AI in their current role. Tim is also a competitive Brazilian Jiu-Jitsu practitioner, having won over 10 international championships.",
    image: "tim-banks.jpeg",
    linkedin: "https://www.linkedin.com/in/timjb/",
    twitter: "https://x.com/elchefe",
    bluesky: "https://bsky.app/profile/elchefe.me",
  },
];
