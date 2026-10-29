# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Primary: attendees.** Developers and tech workers in Hampton Roads, Virginia. In the 2027 pre-sale phase they are deciding whether to join the mailing list. Once tickets open they are deciding whether to buy.
- **Secondary: sponsors.** Local and regional companies weighing a sponsorship. They read `/sponsor` and the downloadable sponsor sheets in `public/sponsor/`.

## Product Purpose

The marketing and information site for Hampton Roads DevFest, a one-day, single-track developer conference. The 2027 event is Friday, April 23, 2027, at Zeiders American Dream Theater in Virginia Beach. Right now success means mailing-list signups (Bento) and sponsor commitments. Later it means ticket sales. The site also keeps an archive of past years (2015–2018, 2024, 2026).

## Positioning

The only developer conference in Hampton Roads. Every speaker is local. It is run by RevolutionVA, a 501(c)(3) nonprofit that builds the Hampton Roads tech community all year. One day, one track.

## Operating Context

- Lifecycle phases change the site: pre-sale teaser (now), tickets on sale, event day, then post-conference wrap-up. Removed features waiting to come back for 2027 are tracked separately: ticket CTAs, countdown, scholarship section, sponsor placeholders.
- Integrations: Bento (mailing list + tracking), Humanitix (ticketing, not yet live for 2027), Sessionize (speakers/sessions), Stripe (one-click $500 Community sponsorship), Google Analytics, Google Maps.
- Sponsors also get the content as PDFs (screen and print versions), so the sponsor page and the PDFs must stay in sync.

## Capabilities and Constraints

- Astro static site, Tailwind, deployed to Azure Static Web Apps. Year pages are driven by `src/content/events/<year>/event.json` and per-year themes in `src/themes/`.
- Privacy commitments to sponsors: badges are never scanned, attendee lists are never shared, and only opt-in employer names are reported.
- Undecided: 2027 ticket pricing, the 2027 speaker lineup, and the post-event reception venue and timing.

## Brand Commitments

- Name: "Hampton Roads DevFest" (keep "Hampton Roads" together with a nonbreaking space). 2027 theme: "Built in the 757." The blueprint visual design (the `poc/blueprint-theme` branch) expresses that theme and is committed for 2027.
- Logo: `src/assets/logo-white.png`.
- Local identity: Norfolk/Hampton Roads landmark line art is part of the brand.
- Voice: plain, direct, community-first. No hype.

## Evidence on Hand

- Testimonials (real, attributed): `src/data/testimonials.ts` (Paul Chin Jr., Michael Buckbee, Travis Webb).
- Past events with speakers and sponsors: `src/content/events/*/event.json`, `src/assets/archive/`.
- 2026 sponsor logos: `src/assets/sponsors/`. 2026 attendee employer list on the sponsor page.
- Sponsor sheets: `public/sponsor/*.pdf`. Calendar file: `public/2027/hrdevfest-2027.ics`. OG image: `public/2027/og_promo_2027.jpg`.
- Absent, never fabricate: 2027 speakers, attendance numbers beyond what the sponsor page states, new testimonials, and any sponsor logos for 2027.

## Product Principles

1. Local first: every claim and image should reinforce that this event is by and for Hampton Roads.
2. Attendees first, sponsors close behind: the homepage serves attendees, and `/sponsor` serves sponsors fully, without leaking sponsor sales into the attendee path.
3. Honest about phase: show only what's real right now (no fake countdowns, placeholder speakers, or inactive ticket buttons).
4. Nonprofit trust: say plainly where money goes and what sponsors do and don't get.
