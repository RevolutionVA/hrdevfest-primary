import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const speakerSchema = z.object({
  name: z.string(),
  bio: z.string(),
  image: z.string(),
  linkedin: z.string().optional(),
  twitter: z.string().optional(),
  website: z.string().optional(),
  bluesky: z.string().optional(),
  sessionTitle: z.string().optional(),
  sessionAbstract: z.string().optional(),
  role: z.string().optional(),
});

const sponsorSchema = z.object({
  name: z.string(),
  logo: z.string(),
  url: z.string(),
  tier: z.enum(['platinum', 'gold', 'silver', 'logo']),
});

const scheduleItemSchema = z.object({
  time: z.string(),
  title: z.string(),
  description: z.string().optional(),
  abstract: z.string().optional(),
  speakerName: z.string().optional(),
});

const testimonialSchema = z.object({
  name: z.string(),
  quote: z.string(),
  image: z.string(),
  linkedin: z.string().optional(),
  twitter: z.string().optional(),
  bluesky: z.string().optional(),
});

const faqItemSchema = z.object({
  question: z.string(),
  answer: z.string(),
  category: z.string().optional(),
});

const venueSchema = z.object({
  name: z.string(),
  address: z.string(),
  city: z.string(),
  state: z.string(),
  zip: z.string(),
  mapEmbedUrl: z.string().optional(),
  parkingInfo: z.string().optional(),
});

const photoSchema = z.object({
  src: z.string(),
  caption: z.string(),
});

const eventSchema = z.object({
  year: z.number(),
  theme: z.string(),
  title: z.string(),
  date: z.string().optional(),
  dateFormatted: z.string().optional(),
  tagline: z.string().optional(),
  description: z.string().optional(),
  venue: venueSchema.optional(),
  speakers: z.array(speakerSchema).default([]),
  sponsors: z.array(sponsorSchema).default([]),
  schedule: z.array(scheduleItemSchema).default([]),
  testimonials: z.array(testimonialSchema).default([]),
  faq: z.array(faqItemSchema).default([]),
  photos: z.array(photoSchema).default([]),
  isArchive: z.boolean().default(false),
  ogImage: z.string().optional(),
});

const eventsCollection = defineCollection({
  loader: glob({ pattern: '**/event.json', base: './src/content/events' }),
  schema: eventSchema,
});

export const collections = {
  events: eventsCollection,
};
