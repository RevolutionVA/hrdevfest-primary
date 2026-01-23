# HRDevFest 2026 Speaker Social Media Assets

## Directory Structure

```
2026/
├── templates/           # Base images for generating social cards
├── headshots/           # Speaker photos (inputs)
├── posts/               # Social media copy for each platform
├── generated/           # Final output social images
├── content-calendar.md  # Publishing schedule
└── README.md            # This catalog
```

## Speakers Catalog

| Speaker | Headshot | Posts | Social Handles | Topics |
|---------|----------|-------|----------------|--------|
| Ian Taylor | `IanTaylor.jpeg` | `ian-taylor.md` | X: @itsEcon | EdTech, AI, Entrepreneurship |
| Katie Novotny | `KatieNovotny.jpeg` | `katie-novotny.md` | LinkedIn: katie-novotny | AI, Microsoft, .NET, Python |
| Lauren Pryor | `LaurenPryor.jpeg` | `lauren-pryor.md` | LinkedIn: laurenepryor | Cybersecurity, Leadership, Entrepreneurship |
| Lionel Sapp | `LionelSapp.jpeg` | `lionel-sapp.md` | - | Community, Mentorship, Startups |
| Ryan Castillo | `RyanCastillo.jpeg` | `ryan-castillo.md` | X: @rmcastil, LinkedIn: rmcastil | Data Science, AI, Large-scale Systems |
| Tim Banks | `TimBanks.jpeg` | `tim-banks.md` | X: @elchefe, Bluesky: @elchefe.me, LinkedIn: timjb | DevOps, SRE, Cloud Architecture |

---

## Speaker Details

### Ian Taylor
- **Role:** Economics Department Chair at Virginia Peninsula Community College
- **Background:** Serial entrepreneur - founded Carry Norfolk (bicycle courier), Carry Logistics (acquired by Saatva), Question Foundry (AI edtech startup)
- **Current Venture:** Question Foundry - individualized college textbooks with AI teaching assistant "Aita"
- **Platforms:** X, LinkedIn, Mastodon, Bluesky

### Katie Novotny
- **Role:** AI Apps and Agents GBB at Microsoft
- **Background:** Software dev, management, architecture, DevOps
- **Skills:** .NET, Python, 10+ other languages
- **Interests:** Functional fitness, skiing, reading
- **Platforms:** X, LinkedIn, Mastodon, Bluesky

### Lauren Pryor
- **Role:** Tech leader, co-owner of MSP and cybersecurity company
- **Background:** Architectural engineering (2010-2016), founded software company (acquired)
- **Current:** Serves financial/legal firms, board member, STEM mentor, cybersecurity training program, freelance CTO, angel investor
- **Platforms:** X, LinkedIn, Mastodon, Bluesky

### Lionel Sapp
- **Role:** Founder of The Digital Builders
- **Background:** Self-taught developer, CTO of Techstars-backed startup
- **Current:** Mentorship network empowering tech creators in the 757
- **Platforms:** X, LinkedIn, Mastodon, Bluesky

### Ryan Castillo
- **Role:** Author, developer, data scientist
- **Background:** Large-scale systems, data visualization, AI
- **Clients:** Fortune 500 companies, US Navy, startups
- **Platforms:** X, LinkedIn, Mastodon, Bluesky

### Tim Banks
- **Role:** DevOps/SRE consultant and advisor
- **Background:** 25+ years in tech - systems administration, automation, architecture, cloud operations
- **Current:** Advises on modernizing workloads, DevOps practices, AI use
- **Fun Fact:** 10x international Brazilian Jiu-Jitsu champion
- **Platforms:** X, LinkedIn, Mastodon, Bluesky

---

## Event Details (for reference)
- **Event:** Hampton Roads DevFest 2026
- **Date:** February 27, 2026
- **Location:** Virginia Beach, VA
- **Website:** hrdevfest.org
- **Hashtags:** #HRDevFest #HamptonRoadsDevFest #DevFest #HamptonRoads

---

## Post Platforms per Speaker

Each speaker's markdown file contains posts formatted for:
- X (Twitter) - ~280 char limit
- LinkedIn - Long form with bullet points
- Mastodon - Mid-length with hashtags
- Bluesky - Short form (~300 char)

---

## Content Calendar

See [`content-calendar.md`](content-calendar.md) for the full publishing schedule.

**Campaign:** Feb 1-26, 2026 (26 posts total)

| Category | Count |
|----------|-------|
| 🏢 Sponsor | 4 |
| 🎤 Speaker | 6 |
| 📸 Throwback | 6 |
| 🛍️ Swag | 4 |
| 📢 General/Countdown | 6 |

---

## Generation Workflow

1. Place speaker headshot in `headshots/`
2. Create social copy in `posts/{speaker-name}.md`
3. Use `templates/base.png` to generate social card
4. Output final image to `generated/`
5. Update `content-calendar.md` with scheduled post dates
