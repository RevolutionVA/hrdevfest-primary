export interface Testimonial {
  name: string;
  quote: string;
  image: string;
  linkedin?: string;
  twitter?: string;
  bluesky?: string;
}

export const testimonials: Testimonial[] = [
  {
    name: "Paul Chin Jr.",
    quote: "Hampton Roads DevFest is everything you'd want in a community event, truly local and truly impactful on your career and skills.",
    image: "paul-chin-jr.jpeg",
    linkedin: "https://www.linkedin.com/in/paulchinjr/",
    twitter: "https://x.com/paulchinjr",
    bluesky: "https://bsky.app/profile/paulchinjr.bsky.social",
  },
  {
    name: "Michael Buckbee",
    quote: "As soon as I heard DevFest was coming back for a sixth year I scrambled to get a ticket. I was amazed at the depth of talent and expertise the area has—every person I spoke with was working on interesting things. Great venue, amazing speakers, and 100% worth it.",
    image: "https://sessionize.com/image/b0c4-400o400o1-L8qnWhL2upTUZo5aZ2zsVC.jpg",
    linkedin: "https://www.linkedin.com/in/michaelbuckbee/",
  },
];
