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
  {
    name: "Ian Taylor",
    bio: "Ian Taylor is the Economics Department Chair at Virginia Peninsula Community College, where his innovative teaching has earned rave reviews from students, including: \"Awesome teacher. Y'all should let him teach all the courses. Clone him or something.\" and \"Me and all my classmates learned the lesson with pleasure.\" A serial entrepreneur, Ian founded Carry Norfolk, a bicycle courier service delivering food and beer in Norfolk, VA (2013-2015; sold to a rider), and Carry Logistics, enterprise software automating information flows for online retailers (2014-2018; sold to Saatva). He now leads Question Foundry, an edtech startup creating individualized college textbooks with thousands of practice question variations and step-by-step solutions. Each textbook is accompanied by Aita—an AI teaching assistant that aids faculty in lesson preparation and guides students through discovery-based learning. Beyond his professional pursuits, Ian is a fun-loving dad to his daughter, serving as the \"daddyman\".",
    image: "ian-taylor.jpeg",
    linkedin: "https://www.linkedin.com/in/ian-taylor-95626045/",
    twitter: "https://x.com/itsEcon",
  },
];
