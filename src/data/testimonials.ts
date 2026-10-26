export interface Testimonial {
  name: string;
  role?: string;
  quote: string;
  image: string;
  linkedin?: string;
  twitter?: string;
  bluesky?: string;
}

export const testimonials: Testimonial[] = [
  {
    name: "Paul Chin Jr.",
    role: "Norfolk.JS Organizer",
    quote: "Hampton Roads DevFest is everything you'd want in a community event, truly local and truly impactful on your career and skills.",
    image: "paul-chin-jr.jpeg",
    linkedin: "https://www.linkedin.com/in/paulchinjr/",
    twitter: "https://x.com/paulchinjr",
    bluesky: "https://bsky.app/profile/paulchinjr.bsky.social",
  },
  {
    name: "Michael Buckbee",
    role: "Founder, Expedited Security",
    quote: "As soon as I heard DevFest was coming back for a sixth year I scrambled to get a ticket. I was amazed at the depth of talent and expertise the area has, and every person I spoke with was working on interesting things. Great venue, amazing speakers, and 100% worth it.",
    image: "michael-buckbee.jpg",
    linkedin: "https://www.linkedin.com/in/michaelbuckbee/",
  },
  {
    name: "Travis Webb",
    role: "Solutions Architect at Google",
    quote: "Hampton Roads DevFest is the center of the tech universe for this area. I've met many amazing people who I've been able to work with and partner with, and it's a great way to learn about the innovation happening in Norfolk and surrounding areas. Every company in the area with software engineers should send their teams here to bring back and implement the best ideas.",
    image: "travis-webb.png",
    linkedin: "https://www.linkedin.com/in/-traviswebb/",
  },
];
