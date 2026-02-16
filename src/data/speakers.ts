export interface Speaker {
  name: string;
  bio: string;
  image: string;
  linkedin?: string;
  twitter?: string;
  website?: string;
  bluesky?: string;
  sessionTitle?: string;
  sessionAbstract?: string;
}

export const speakers: Speaker[] = [
  {
    name: "Lionel Sapp",
    bio: "Lionel Sapp is a Hampton Roads–based software engineer, community builder, and founder of The Digital Builders, a studio and mentorship network empowering others to turn their ideas into real-world products. A self-taught developer, Lionel has worked for two Techstars-backed startups, serving as CTO for one. Through Digital Builders, he leads mentorship programs and community events that teach aspiring creators how to build, launch, and grow their own tech ventures—right here in the 757.",
    image: "lionel-sapp.jpeg",
    linkedin: "https://www.linkedin.com/in/lionelthebldr/",
    sessionTitle: "The 1-Person DevOps Stack: How I Keep Client Apps Alive Without a Big Team",
    sessionAbstract: "When you're a solo builder, \"DevOps\" isn't a department — it's whatever keeps production stable at 11pm when a client pings you and real users are stuck. In this TED-style talk, I'll share the minimal, battle-tested operations stack I use to ship and maintain client apps without a big team: preview deployments for safe releases, error tracking and logging that actually matter, and a calm incident loop for when something breaks. I'll also show how AI fits in practically (not hype): using v0 for rapid UI mockups and Cursor/MCP agents to speed up implementation while keeping quality guardrails in place. The stack is modern, simple, and repeatable — Next.js + Supabase + Vercel + Resend + Stripe — but the real value is the workflow: what to monitor (and what to ignore), how to deploy with confidence, and the \"stability rituals\" that keep apps alive long after launch.",
  },
  {
    name: "Ryan Castillo",
    bio: "Ryan is an author, developer and data-scientist with a passion for helping and teaching others. His deep expertise in large scale systems, data visualization and AI has helped Fortune 500 companies, the US Navy and startups of all sizes.",
    image: "ryan-castillo.jpeg",
    linkedin: "https://www.linkedin.com/in/rmcastil/",
    twitter: "https://twitter.com/rmcastil",
    website: "https://knowatoa.com",
    sessionTitle: "How to have a successful dev career in the 757*",
    sessionAbstract: "What if the biggest limiter on your developer career isn't your technical skill? In Hampton Roads, there are plenty of talented developers doing solid work. Yet opportunities often feel inconsistent. People get passed over for promotions. Job searches feel exhausting. Great ideas and side projects don't go anywhere. This talk explores why that happens and what actually drives opportunity. Whether you're looking for a new role, doing freelance work, or building something of your own. Through real examples, Ryan will share a practical mental model for creating more surface luck area for opportunity without pretending to be someone you're not. Midway through the talk, the real title will be revealed. Once you see it, you'll start noticing the pattern everywhere.",
  },
  {
    name: "Katie Novotny",
    bio: "Katie Novotny, AI Apps and Agents GBB at Microsoft. Software dev background but also manager, architect, and DevOps wrangler fluent in .NET, Python, and at least 10 other languages (some human, most not). Believes the best code - and life - comes from collaboration and curiosity. Loves: Functional fitness, skiing, and books that make her forget time. Hates: green peppers and chores that don't scale (looking at you, dusting).",
    image: "katie-novotny.jpeg",
    linkedin: "https://www.linkedin.com/in/katie-novotny/",
    sessionTitle: "Cool Demo, Bro. Now Ship It: Why Most GenAI Apps Fall Apart",
    sessionAbstract: "Everyone has a GenAI demo. Very few have a GenAI system. In this talk, we'll roast the most common GenAI anti-patterns - chatbots pretending to be apps, agents with no guardrails, and \"just add RAG\" architectures that collapse under real users. Then we'll rebuild them the right way. You'll learn how production GenAI actually works: tools over prompts, systems over models, and architectures that assume failure, hallucination, and chaos from day one. We'll cover when agents are useful (and when they're absolutely not), why observability matters more for AI than traditional services, and how to ship GenAI without lighting your cloud bill on fire. This is not a hype talk. This is a survival guide.",
  },
  {
    name: "Tim Banks",
    bio: "Tim's tech career spans over 25 years through large corporate environments and in small startups, honing their skills in systems administration, automation, architecture, and operations for large cloud-based datastores. Today, Tim leverages their years in data, DevOps, and Site Reliability Engineering to advise and consult the open source and cloud computing communities on modernizing workloads, safe and efficient DevOps practices, and the effective use of AI in their current role. Tim is also a competitive Brazilian Jiu-Jitsu practitioner, having won over 10 international championships.",
    image: "tim-banks.jpeg",
    linkedin: "https://www.linkedin.com/in/timjb/",
    twitter: "https://x.com/elchefe",
    bluesky: "https://bsky.app/profile/elchefe.me",
    sessionTitle: "AI Can't Teach You Jiu-Jitsu: Developing Your Craft in the Age of AI",
    sessionAbstract: "This talk uses Brazilian Jiu-Jitsu as a lens to explore the fundamental limitations of AI in teaching complex, embodied skills, and why the same principles apply to software development. Just as BJJ practitioners must master fundamentals through physical repetition, strategic thinking, and real-world testing on the mat, software engineers must develop deep understanding through hands-on experience rather than relying on AI-generated solutions. The presentation examines how BJJ's progression system, from white belt fundamentals to black belt mastery, mirrors the journey of becoming a skilled engineer. It challenges the notion that AI can shortcut genuine learning, drawing parallels between \"Instagram BJJ\" (flashy techniques that don't work in reality) and \"vibe coding\" (AI-generated code that lacks fundamental understanding). Through the metaphor of BJJ as chess rather than checkers, the talk illustrates why rote learning and pattern matching fail when faced with novel situations that require strategic adaptation. Ultimately, this session argues that while AI has its place as a tool, dependency on something you don't control is a mistake. True expertise, whether in martial arts or software engineering, comes from learning by doing, embracing failure, seeking mentorship, engaging with community, and focusing on getting good rather than just winning. There are no shortcuts to becoming a black belt in any craft.",
  },
  {
    name: "Ian Taylor",
    bio: "Ian Taylor is the Economics Department Chair at Virginia Peninsula Community College, where his innovative teaching has earned rave reviews from students, including: \"Awesome teacher. Y'all should let him teach all the courses. Clone him or something.\" and \"Me and all my classmates learned the lesson with pleasure.\" A serial entrepreneur, Ian founded Carry Norfolk, a bicycle courier service delivering food and beer in Norfolk, VA (2013-2015; sold to a rider), and Carry Logistics, enterprise software automating information flows for online retailers (2014-2018; sold to Saatva). He now leads Question Foundry, an edtech startup creating individualized college textbooks with thousands of practice question variations and step-by-step solutions. Each textbook is accompanied by Aita—an AI teaching assistant that aids faculty in lesson preparation and guides students through discovery-based learning. Beyond his professional pursuits, Ian is a fun-loving dad to his daughter, serving as the \"daddyman\".",
    image: "ian-taylor.jpeg",
    linkedin: "https://www.linkedin.com/in/ian-taylor-95626045/",
    twitter: "https://x.com/itsEcon",
    sessionTitle: "AI with AI with AI",
    sessionAbstract: "Awesome Interactions with Artificial Intelligence with An Ian 😀\n\n🎉 Have more fun!\n\nIan will showcase examples of interactions with AI like creating your own carved apple turtle the next time you're hungry or kids remind everyone it's snack time. Make a coloring book with your favorite characters or stuffed animals to print at home and enjoy. Discover what that beautiful flower or weird mushroom is that you keep seeing outside. Classify your friends and family into Lord of the Rings characters as if Tolkien came over for a dinner party.\n\n✅ Get work done!\n\nClone yourself with an AI agent digital replica 😮 Ok probably not the type of sci-fi cloning where poof another bearded Ian appears bounding about. Instead it only exists within machines and is accessible by web, phone, and text. But the training is just like how you train another human on a job, by guiding their behaviors and interactions within the workplace and among their coworkers. Ian will demonstrate how to create your own AI agent and learn more when you're in the mood.\n\n☀️Shine like the sun!\n\nRecent advances in AI bring many challenges along with its benefits. Ian will share some of the impacts from AI's creative destruction with a focus on the challenge of authenticity in academia, social media, and labor markets. Then he'll present some ideas of how these tools can help improve human relationships with an optimistic outlook.",
  },
  {
    name: "Lauren Pryor",
    bio: "Lauren is a tech leader with roots in architectural engineering (2010–2016). As the founder of a software development company that was later acquired, she went on to become the co-owner of an MSP and cybersecurity company serving financial and legal firms nationwide. Lauren sits on several boards, mentors youth in STEM, runs a cybersecurity training program, supports startups as a freelance CTO, and is an emerging angel investor and limited partner.",
    image: "lauren-pryor.jpg",
    linkedin: "https://www.linkedin.com/in/laurenepryor/",
  },
];
