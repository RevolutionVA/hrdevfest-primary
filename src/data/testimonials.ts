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
];
