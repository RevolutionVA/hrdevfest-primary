---
name: Hampton Roads DevFest 2027
description: Built in the 757. A blueprint construction set for a local developer conference.
colors:
  paper: "#0b3d6e"
  paper-deep: "#08305a"
  surface: "#0b3d6e"
  row-alt: "#1a4977"
  ink: "#f4f8fc"
  ink-muted: "#c6d6e8"
  line: "#dbe6f1"
  line-soft: "rgb(255 255 255 / 0.4)"
  line-faint: "rgb(255 255 255 / 0.35)"
  grid: "rgb(255 255 255 / 0.025)"
  grid-major: "rgb(255 255 255 / 0.045)"
  redline: "#d33b32"
  plate: "#ffffff"
typography:
  display:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif"
    fontSize: "48px"
    fontWeight: 700
    lineHeight: 1.25
  headline:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif"
    fontSize: "32px"
    fontWeight: 700
    lineHeight: "40px"
  display-sm:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif"
    fontSize: "32px"
    fontWeight: 700
    lineHeight: 1.08
  headline-sm:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif"
    fontSize: "24px"
    fontWeight: 700
    lineHeight: "32px"
  title:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif"
    fontSize: "20px"
    fontWeight: 700
    lineHeight: 1.35
  body:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "ui-monospace, SFMono-Regular, Cascadia Mono, Roboto Mono, Menlo, Consolas, Liberation Mono, monospace"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.12em"
  button:
    fontFamily: "ui-monospace, SFMono-Regular, Cascadia Mono, Roboto Mono, Menlo, Consolas, Liberation Mono, monospace"
    fontSize: "16px"
    fontWeight: 700
    letterSpacing: "0.08em"
rounded:
  none: "0"
  mark: "9999px"
spacing:
  frame-sm: "10px"
  frame-md: "20px"
  grid-minor: "24px"
  grid-major: "120px"
components:
  button-primary:
    backgroundColor: "{colors.redline}"
    textColor: "{colors.plate}"
    rounded: "{rounded.none}"
    typography: "{typography.button}"
    padding: "12px 32px"
  button-primary-hover:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    typography: "{typography.button}"
    padding: "12px 32px"
  button-secondary-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  button-filled:
    backgroundColor: "{colors.plate}"
    textColor: "{colors.paper}"
    rounded: "{rounded.none}"
    typography: "{typography.button}"
    padding: "12px 32px"
  button-filled-hover:
    backgroundColor: "{colors.paper-deep}"
    textColor: "{colors.ink}"
  box:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.none}"
  callout:
    backgroundColor: "{colors.plate}"
    textColor: "{colors.paper}"
    rounded: "{rounded.none}"
    padding: "24px"
  input:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
  mark:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.mark}"
    size: "36px"
---

# Design System: Hampton Roads DevFest 2027

## Overview

**Creative North Star: "The Construction Set"**

The 2027 theme is "Built in the 757," and the site reads as the drawing set for building it. Every page is a sheet in a permit set: blue paper with a faint drafting grid, near-white ink line work, a double-ruled frame, sheet references on section headings, schedules (tables) ruled like drawing schedules, round callout marks that key a detail to its schedule, dashed "proposed" rooms on plan diagrams, and an engineering title block that signs every sheet in the footer. Norfolk and Hampton Roads landmarks appear as line art, drawn in the same ink.

The governing rule is "less is more": one paper, one ink, one accent. Depth, color, and decoration come from line weight and drafting conventions, not from fills or effects. The one accent, redline red, behaves like a markup on a drawing. It marks the action, never decoration. Density is moderate. Text always sits on solid paper-colored panels so the grid never runs behind words.

**Key Characteristics:**

- Blue paper, faint two-scale drafting grid (24px minor, 120px major).
- Near-white ink for all text and line work, with a muted ink for labels.
- Square corners everywhere. The only round shape is the callout mark.
- Monospace uppercase for drafting labels, sheet refs, buttons, and the title block. System sans for reading.
- Every convention means something: dashed means proposed, a circle is a callout, redline means act.

## Colors

One blue paper, one near-white ink, one red accent, plus white plates for full-color art.

### Primary

- **Redline Red** (`redline`): Fills `.btn-primary` only, the single primary action on a view. White text clears AA (~4.7:1). Against the paper it's only ~2.3:1, so the button keeps a 1px near-white border for a 3:1 component boundary.

### Neutral

- **Blueprint Paper** (`paper`): The page background and the solid `surface` behind text. Same value, so a text panel reads as cleared grid, not as a card.
- **Deep Paper** (`paper-deep`): Hover state for filled buttons only.
- **Schedule Stripe** (`row-alt`): Zebra rows in tables (~6% white into paper; ink ~8.7:1).
- **Drafting Ink** (`ink`): All body text, headings, links, line work, and focus rings (~10.3:1).
- **Muted Ink** (`ink-muted`): Secondary text, labels, column headings, sheet refs (~7.4:1).
- **Hard Line** (`line`): Page frame, section rules, title block, form fields, photo borders.
- **Soft Line / Faint Line** (`line-soft`, `line-faint`): Box borders (≥3:1 non-text) and table cell rules.
- **Grid / Major Grid** (`grid`, `grid-major`): The drafting grid only. Never used for anything else.
- **White Plate** (`plate`): Backing for full-color sponsor logos and the light callout panel.

### Named Rules

**The One Accent Rule.** Red appears only as the fill of the primary action. No red text, icons, borders, or highlights. If a second action competes, it becomes `.btn-secondary` (outline) or `.btn-filled` (white).

**The Less Is More Rule.** One paper, one ink, one accent. No gradients (beyond the grid itself), shadows, glows, or blobs. This is a strong default: justified exceptions exist (white plates for sponsor logos, the white callout panel), but each one needs a stated reason.

## Typography

**Body Font:** System sans (`ui-sans-serif, system-ui, …`)
**Label/Mono Font:** System mono (`ui-monospace, SFMono-Regular, Cascadia Mono, …`)

**Character:** Plain, legible sans for anything you read. Mono uppercase for anything that annotates the drawing: labels, sheet numbers, buttons, title block. No webfonts.

### Hierarchy

- **Display** (700, 32px mobile → 48px desktop, ~1.25): The hero tagline "Built in the 757." The logo carries the event name.
- **Headline** (700, 24px → 32px, 32px/40px line): Section headings, usually preceded by a sheet ref.
- **Title** (700, 20px → 24px, ~1.35): Sub-sections, tier and card names, callout titles.
- **Body** (400, 16px, 1.65): Running text. Tables drop to 1.5.
- **Label** (400 mono, 12px, 0.12em, uppercase, muted ink): Drafting labels and table column headings (14px).
- **Sheet ref** (mono, 14px, 0.08em, muted ink): "2.4" before a heading.

### Named Rules

**The Annotation Rule.** Mono uppercase annotates and sans communicates. Names people read (tiers, tickets, row headers) stay in sans even inside schedules.

## Layout

- The whole page sits inside `.bp-frame`, a double rule (1px border plus a 1px outline offset 4px, or 6px from md) inset 10px on mobile and 20px from md.
- Content runs in `max-w-7xl` with 16px gutters on mobile and 32px from md. Reading sections narrow to `max-w-4xl`.
- Sections are separated by full-width 1px `line` rules, not by background bands.
- The drafting grid (24px / 120px) is fixed to the body and visible in the gaps between solid panels.
- The hero reserves bottom padding for the landmark line-art row from md up. On mobile the art sits under the CTA.
- Breakpoints are Tailwind defaults (`sm` 640, `md` 768, `lg` 1024) plus a 90rem hero adjustment.

## Elevation & Depth

Flat. No shadows anywhere. Depth comes from line hierarchy (hard line > soft line > faint line > grid) and from solid paper panels that clear the grid. The only layered effect is the double rule (border plus offset outline) on the page frame and the callout panel.

**The Line Weight Rule.** To raise importance, use a harder line or a double rule, never a shadow or a fill color.

## Shapes

Square corners (0 radius) on every box, button, input, table, and plate. The callout mark (`.bp-mark`, a 36px circle) is the only round shape, because a drawing callout is a circle. Dashed borders mean "proposed" and are reserved for rooms on plan diagrams.

## Components

### Buttons

- **Shape:** Square (0), 1px hard-line border, mono 700 uppercase at 0.08em.
- **Primary (redline):** Red fill, white text. Hover drops the fill and becomes an outline in ink. One per view.
- **Secondary (outline):** Transparent with ink text. Hover inverts to an ink fill with paper text.
- **Filled (white):** White fill with paper text (~11:1), for strong actions that must not be red. Hover goes to deep paper. Inside the light callout panel it inverts to paper fill and white text.
- **Focus:** 2px ink outline, 2–3px offset.

### Cards / Containers

- **Box (`.bp-box`):** Solid surface, 1px soft-line border, square. Used for tiers, cards, and panels.
- **Surface (`.bp-surface`):** The same solid paper with no border, for text that sits on the open grid.
- **Callout (`.bp-callout` / `Callout.astro`):** A white panel with paper-colored text, a 2px border, and a 1px white outline offset 4px. It stacks on mobile and sits in a row from md. It's the one inverted panel, used for a single focused ask such as the Community sponsorship.

### Inputs / Fields

- **Style:** Transparent, 1px hard-line border, square, ink text, muted-ink placeholder.
- **Focus:** The global 2px ink focus ring.

### Tables (Schedules)

- Ruled like a drawing schedule: a soft outer border, faint cell rules, mono uppercase muted column headings, sans 600 row headers, and zebra rows in `row-alt`.

### Navigation

- Bold sans ink links with a 4px-offset underline on hover. On mobile a fixed square menu button (opaque paper, hard-line border) opens a full-screen paper overlay.

### Callout Mark (signature)

- A 36px circle with a hard line and mono 700 13px text. It keys a detail (a tier card, a room on the plan) to its row in a schedule or legend. As a link, it inverts to an ink fill on hover.

### Title Block (signature)

- The engineering title block in the footer: a mono uppercase key/value grid (Project, Location, Date, Sheet, Drawn by, Tagline), ruled in hard line, with the REVOLUTIONVA mark below. It signs every sheet.

### Landmark Line Art (signature)

- Norfolk and Hampton Roads skyline drawn in ink line work, the local proof that this is "Built in the 757."

## Do's and Don'ts

### Do:

- **Do** keep text on solid `surface` panels so the grid stops at the box edge.
- **Do** use drafting conventions with their real meanings: sheet refs on headings, callout marks keying to schedules, dashed for proposed.
- **Do** put full-color art (sponsor logos) on white plates with a hard-line border.
- **Do** keep contrast at AA or better. The ratios are documented in `src/styles/global.css`.
- **Do** draw local landmarks in ink line work, not photos or illustration styles.

### Don't:

- **Don't** use rounded corners on anything except the callout mark.
- **Don't** add shadows, gradients, glows, or decorative blobs.
- **Don't** use red for anything except the primary button fill, or put two red buttons in one view.
- **Don't** introduce webfonts or a third type family.
- **Don't** use dashed borders except for proposed rooms.
