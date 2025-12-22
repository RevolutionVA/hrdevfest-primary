# 2025 Mock Image Catalog

Reference guide for all images in the 2025-mock folder for the Hampton Roads DevFest rebrand.

---

## Design Handoff Documents

| File | Description |
|------|-------------|
| `HR DevFest - dev handoff.pdf` | Original design mockup PDF (full size) |
| `HR DevFest - dev handoff-compressed.pdf` | Compressed version of design mockup |

---

## Homepage Backgrounds

### Desktop (`/website images/images/homepage/desktop/`)

| File | Description | Key Features |
|------|-------------|--------------|
| `hero_bkgd.png` | **Hero section background** | Dark teal overlay on crowd photo, includes CONNECT/DISCOVER/GROW tagline with colored O's (blue, yellow, green), decorative lines and dots |
| `hero_bkgd@2x.png` | Hero background (2x retina) | Same as above, higher resolution |
| `about_bkgd.png` | About section background | Grayscale/faded photo of conference attendees networking in hallway |
| `about_bkgd@2x.png` | About background (2x retina) | Same as above, higher resolution |
| `sponsor_bkgd.png` | Sponsor section background | Dark teal overlay on presenter/stage photo |
| `sponsor_bkgd@2x.png` | Sponsor background (2x retina) | Same as above, higher resolution |
| `venue_pic.png` | Venue section image | Dark teal overlay on Zeiders American Dream Theater building exterior, includes CONNECT/DISCOVER/GROW tagline |
| `venue_pic@2x.png` | Venue image (2x retina) | Same as above, higher resolution |
| `scholarship_pic.png` | Scholarship section image | Dark teal overlay, person walking near building entrance |
| `scholarship_pic@2x.png` | Scholarship image (2x retina) | Same as above, higher resolution |

### Tablet (`/website images/images/homepage/tablet/`)

| File | Description | Key Features |
|------|-------------|--------------|
| `hero.png` | Tablet hero background | Dark teal overlay on crowd photo, NO tagline text (plain background) |
| `hero@2x.png` | Tablet hero (2x retina) | Same as above, higher resolution |

### Phone (`/website images/images/homepage/phone/`)

| File | Description | Key Features |
|------|-------------|--------------|
| `hero.png` | Mobile hero background | Dark teal overlay on crowd photo, portrait orientation, NO tagline text |
| `hero@2x.png` | Mobile hero (2x retina) | Same as above, higher resolution |

---

## Decorative SVG Elements

### Dots (`/website images/images/dots/`)

| File | Description | Key Features |
|------|-------------|--------------|
| `header_dots.svg` | Header decorative element | Gray connecting lines with colorful dots (green, pink, blue, yellow, orange, red) - for light backgrounds |
| `hero_dots.svg` | Hero decorative element | Teal connecting lines and dots, includes full CONNECT/DISCOVER/GROW text with colored O's - for dark backgrounds |

---

## Logos

### HR DevFest Logos (`/website images/images/logos/`)

| File | Description | Use Case |
|------|-------------|----------|
| `hrdevfest-logo.png` | Main logo (teal/dark) | Use on light backgrounds |
| `hrdevfest-logo-white.png` | White version of logo | Use on dark/teal backgrounds (hero section) |
| `Inline_logo_no_tagline.png` | **Swift Kick** sponsor logo | Red heart-shaped foot logo with "Swift Kick" text |

### Sponsor Logos (`/website images/images/logos/`)

| File | Description | Format |
|------|-------------|--------|
| `marathon-consulting-logo.svg` | Marathon Consulting | Blue text SVG with orange underline |
| `opensearch_logo_default.svg` | OpenSearch | Blue logo SVG |
| `progress-telerik-seeklogo.png` | Progress Telerik | PNG format |
| `progress-telerik-seeklogo.svg` | Progress Telerik | SVG format |
| `Issuetrak-logo-small-1.webp` | Issuetrak | WebP format |
| `stigian.C4cYuYUx_1Nfqlj.webp` | Stigian | WebP format |
| `landrecords.Birb1g3t_Z2mcOn0.webp` | Land Records | WebP format |
| `landrecords.Birb1g3t_Z2mcOn0 copy.jpg` | Land Records | JPG format |
| `Screen Shot 2025-11-21 at 8.53.05 AM copy 3.png` | Unknown sponsor | PNG screenshot |

### Payment Icons (`/website images/images/logos/`)

| File | Description |
|------|-------------|
| `creditcards.png` | Payment method icons (Visa, Mastercard, Amex) - grayscale |

---

## Speaker Photos

### Speakers (`/website images/images/speakers/`)

All speaker photos are circular cropped PNGs.

| File | Person | Description |
|------|--------|-------------|
| `ian.png` | Ian | Male, gray beard, blue shirt, purple flowers background |
| `katie.png` | Katie | Female, long brown hair, green shirt, holding decorated egg |
| `lionel.png` | Lionel | Male, braids, blue patterned shirt, light background |
| `ryan.png` | Ryan | Male, dark hair with beard, brick wall background |
| `tim.png` | Tim | Male, gray curly hair and beard, warm-toned background |

---

## Testimonials

### Testimonials (`/website images/images/testimonials/`)

| File | Person | Description |
|------|--------|-------------|
| `paul.png` | Paul | Circular photo, purple/blue lighting background |

---

## Year Headers

### Years (`/website images/images/years/`)

Photo-masked year numbers showing conference crowd photos inside the numerals.

| File | Year | Description |
|------|------|-------------|
| `header_2022.png` | 2022 | Crowd photo masked into "2022" text shape |
| `header_2023.png` | 2023 | Crowd photo masked into "2023" text shape |
| `header_2024.png` | 2024 | Crowd photo masked into "2024" text shape |

---

## Brand Colors (extracted from images)

| Color | Hex | Usage |
|-------|-----|-------|
| Brand Teal | `#2B5F6D` | Hero backgrounds, overlays |
| Blue (O in CONNECT) | `#267BD9` | Decorative dots |
| Yellow (O in DISCOVER) | `#F4B00F` | Decorative dots |
| Green (O in GROW) | `#27B738` | Decorative dots |
| Pink/Magenta | `#CA2EAA` | Decorative dots |
| Red | `#DD4327` | Decorative dots |
| Orange | `#C97650` | Decorative dots |

---

## Important Notes

1. **Hero backgrounds differ by breakpoint:**
   - Desktop: Includes CONNECT/DISCOVER/GROW tagline baked into image
   - Tablet/Phone: Plain dark teal overlay (no tagline) - tagline must be added via HTML/CSS

2. **Venue image also has tagline:** The `venue_pic.png` includes the CONNECT/DISCOVER/GROW text

3. **Retina versions:** Most images have `@2x` versions for high-DPI displays

4. **SVG decorative elements:**
   - `header_dots.svg` - colorful, for light backgrounds
   - `hero_dots.svg` - teal/monochrome with text, for dark backgrounds
