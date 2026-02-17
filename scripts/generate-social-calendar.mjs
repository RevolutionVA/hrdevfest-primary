/**
 * Generate a structured social media content calendar for HRDevFest.
 * Reads speaker and sponsor data, produces a day-by-day posting schedule
 * covering Feb 17-27, 2026 (11 days) with 2-3 posts per day.
 *
 * Usage:
 *   yarn generate:social-calendar
 *   yarn generate:social-calendar -- --combined
 *   yarn generate:social-calendar -- --start-date 2026-02-17 --end-date 2026-02-27
 *
 * No API key or network connection required.
 */

import { existsSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

// ---------------------------------------------------------------------------
// Resolve project root and import .ts data files (tsx loaded via --import flag)
// ---------------------------------------------------------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, "..");

const { speakers } = await import(
  pathToFileURL(resolve(projectRoot, "src/data/speakers.ts")).href
);
const { sponsors } = await import(
  pathToFileURL(resolve(projectRoot, "src/data/sponsors.ts")).href
);

// ---------------------------------------------------------------------------
// CLI argument parsing
// ---------------------------------------------------------------------------
const args = process.argv.slice(2);
function hasFlag(name) {
  return args.includes(`--${name}`);
}
function getFlagValue(name) {
  const idx = args.indexOf(`--${name}`);
  if (idx === -1 || idx + 1 >= args.length) return null;
  return args[idx + 1];
}

const startDateArg = getFlagValue("start-date") || "2026-02-17";
const endDateArg = getFlagValue("end-date") || "2026-02-27";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const EVENT_DATE = "2026-02-27";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function parseLocalDate(dateStr) {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function formatDateISO(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function daysBetween(dateStr, eventDateStr) {
  const d1 = parseLocalDate(dateStr);
  const d2 = parseLocalDate(eventDateStr);
  return Math.round((d2 - d1) / (1000 * 60 * 60 * 24));
}

function getCountdownImagePath(daysRemaining) {
  if (daysRemaining >= 8) return "speaker-social/2026/backgrounds/countdown-2weeks-square.png";
  if (daysRemaining >= 4) return "speaker-social/2026/backgrounds/countdown-1week-square.png";
  return "speaker-social/2026/backgrounds/countdown-tomorrow-square.png";
}

function getSpeakerImagePath(speaker) {
  const slug = slugify(speaker.name);
  return `speaker-social/2026/generated/speakers/${slug}.png`;
}

function getSponsorImagePath(sponsor) {
  const slug = slugify(sponsor.name);
  return `speaker-social/2026/generated/sponsors/${slug}.png`;
}

function warnIfMissing(imagePath) {
  const fullPath = resolve(projectRoot, imagePath);
  if (!existsSync(fullPath)) {
    console.warn(`  WARNING: Image not found on disk: ${imagePath}`);
  }
}

// ---------------------------------------------------------------------------
// Filter data per PRD requirements
// ---------------------------------------------------------------------------
// Exclude Lauren Pryor (no session topic yet)
const eligibleSpeakers = speakers.filter(
  (s) => s.sessionTitle && s.name !== "Lauren Pryor"
);

// Exclude City of Virginia Beach (already posted)
const eligibleSponsors = sponsors.filter(
  (s) => s.name !== "City of Virginia Beach"
);

// Categorize sponsors by tier
const platinumGoldSponsors = eligibleSponsors.filter(
  (s) => s.tier === "platinum" || s.tier === "gold"
);
const silverLogoSponsors = eligibleSponsors.filter(
  (s) => s.tier === "silver" || s.tier === "logo"
);

// ---------------------------------------------------------------------------
// Generate date range
// ---------------------------------------------------------------------------
function generateDateRange(start, end) {
  const dates = [];
  const current = parseLocalDate(start);
  const endDate = parseLocalDate(end);
  while (current <= endDate) {
    dates.push(formatDateISO(current));
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

// ---------------------------------------------------------------------------
// Build the content calendar
// ---------------------------------------------------------------------------
function buildCalendar(startDate, endDate) {
  const dates = generateDateRange(startDate, endDate);
  const calendar = [];

  // Build sponsor groups: platinum/gold get dedicated posts, silver/logo are paired
  const sponsorGroups = [];
  for (const s of platinumGoldSponsors) {
    sponsorGroups.push({ sponsors: [s] });
  }
  for (let i = 0; i < silverLogoSponsors.length; i += 2) {
    const group = [silverLogoSponsors[i]];
    if (i + 1 < silverLogoSponsors.length) {
      group.push(silverLogoSponsors[i + 1]);
    }
    sponsorGroups.push({ sponsors: group });
  }

  // Pre-plan content distribution across all days.
  // Strategy:
  //   - 5 speakers spread across days 1-9 (every other day roughly)
  //   - 7 sponsor groups spread across days 1-10
  //   - Countdown posts fill morning slots, plus any remaining slots
  //   - Final 3 days (Feb 25-27) always get at least one countdown
  //   - Each day gets 2-3 posts total

  // Pre-assign content to specific days for even distribution.
  // With 11 days, 5 speakers, and 7 sponsor groups, we want to spread
  // content so every day (especially early ones) has variety, and the
  // final days lean toward countdowns for urgency.
  //
  // Layout plan (days 0-10, i.e. Feb 17-27):
  //   Days 0-8: speaker + sponsor content mixed with countdowns
  //   Days 9-10: countdown-heavy (final push)
  //
  // Speakers on days: 0, 2, 4, 6, 8  (every other day)
  // Sponsors on days: 0, 1, 2, 3, 4, 5, 6  (one per day)
  const speakerDayIndices = [0, 2, 4, 6, 8];

  const sponsorDayIndices = [];
  for (let i = 0; i < sponsorGroups.length; i++) {
    sponsorDayIndices.push(Math.min(i, dates.length - 1));
  }

  // Build day-by-day plan
  const dayPlans = dates.map((date, idx) => {
    const daysRemaining = daysBetween(date, EVENT_DATE);
    const isFinal3Days = daysRemaining <= 2;
    return {
      date,
      dayIndex: idx,
      daysRemaining,
      isFinal3Days,
      posts: [],
    };
  });

  // Place speaker posts
  for (let i = 0; i < eligibleSpeakers.length; i++) {
    const dayIdx = speakerDayIndices[i];
    dayPlans[dayIdx].posts.push({
      contentType: "speaker",
      speaker: eligibleSpeakers[i],
    });
  }

  // Place sponsor posts
  for (let i = 0; i < sponsorGroups.length; i++) {
    const dayIdx = sponsorDayIndices[i];
    dayPlans[dayIdx].posts.push({
      contentType: "sponsor",
      sponsorGroup: sponsorGroups[i],
    });
  }

  // Now build the actual calendar entries with time slots
  for (const plan of dayPlans) {
    const { date, daysRemaining, isFinal3Days, posts: plannedContent } = plan;
    const dayEntries = [];

    // Determine if we need a morning countdown
    // Morning slot: countdown for every day (builds urgency throughout campaign)
    const countdownImage = getCountdownImagePath(daysRemaining);
    dayEntries.push({
      date,
      timeSlot: "morning",
      contentType: "countdown",
      speakerOrSponsorName: null,
      imagePath: countdownImage,
    });

    // Afternoon and evening slots: place planned content
    const slots = ["afternoon", "evening"];
    let slotIdx = 0;

    for (const content of plannedContent) {
      if (slotIdx >= slots.length) break;
      const slot = slots[slotIdx];
      slotIdx++;

      if (content.contentType === "speaker") {
        dayEntries.push({
          date,
          timeSlot: slot,
          contentType: "speaker",
          speakerOrSponsorName: content.speaker.name,
          imagePath: getSpeakerImagePath(content.speaker),
        });
      } else if (content.contentType === "sponsor") {
        const group = content.sponsorGroup;
        const primary = group.sponsors[0];
        const name =
          group.sponsors.length > 1
            ? group.sponsors.map((s) => s.name).join(" & ")
            : primary.name;
        dayEntries.push({
          date,
          timeSlot: slot,
          contentType: "sponsor",
          speakerOrSponsorName: name,
          imagePath: getSponsorImagePath(primary),
        });
      }
    }

    // If day only has 1 entry (countdown) and we have no planned content,
    // add a second countdown slot to reach minimum of 2 posts
    if (dayEntries.length < 2) {
      dayEntries.push({
        date,
        timeSlot: "afternoon",
        contentType: "countdown",
        speakerOrSponsorName: null,
        imagePath: countdownImage,
      });
    }

    calendar.push(...dayEntries);
  }

  // Verify all speakers appear at least once
  const assignedSpeakers = new Set(
    calendar
      .filter((e) => e.contentType === "speaker")
      .map((e) => e.speakerOrSponsorName)
  );
  for (const speaker of eligibleSpeakers) {
    if (!assignedSpeakers.has(speaker.name)) {
      console.warn(`  WARNING: Speaker ${speaker.name} not assigned to any post`);
    }
  }

  // Verify all sponsors appear at least once
  const assignedSponsorNames = new Set();
  for (const entry of calendar) {
    if (entry.contentType === "sponsor" && entry.speakerOrSponsorName) {
      for (const name of entry.speakerOrSponsorName.split(" & ")) {
        assignedSponsorNames.add(name.trim());
      }
    }
  }
  for (const sponsor of eligibleSponsors) {
    if (!assignedSponsorNames.has(sponsor.name)) {
      console.warn(`  WARNING: Sponsor ${sponsor.name} not assigned to any post`);
    }
  }

  return calendar;
}

// ---------------------------------------------------------------------------
// Validate image paths
// ---------------------------------------------------------------------------
function validateImages(calendar) {
  for (const entry of calendar) {
    warnIfMissing(entry.imagePath);
  }
}

// ---------------------------------------------------------------------------
// Output
// ---------------------------------------------------------------------------
const outDir = resolve(projectRoot, "speaker-social/2026");
mkdirSync(outDir, { recursive: true });

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
function main() {
  console.log("HRDevFest Social Media Calendar Generator");
  console.log("==========================================\n");

  console.log(`Date range: ${startDateArg} to ${endDateArg}`);
  console.log(
    `Speakers: ${eligibleSpeakers.length} (excluding Lauren Pryor - no session topic)`
  );
  console.log(
    `Sponsors: ${eligibleSponsors.length} (excluding City of Virginia Beach - already posted)`
  );
  console.log();

  const calendar = buildCalendar(startDateArg, endDateArg);

  console.log("Validating image paths...");
  validateImages(calendar);
  console.log();

  // Write JSON output
  const jsonPath = resolve(outDir, "social-calendar.json");
  writeFileSync(jsonPath, JSON.stringify(calendar, null, 2));
  console.log(`Calendar JSON written to: speaker-social/2026/social-calendar.json`);

  // Summary
  const countdownPosts = calendar.filter((e) => e.contentType === "countdown").length;
  const speakerPosts = calendar.filter((e) => e.contentType === "speaker").length;
  const sponsorPosts = calendar.filter((e) => e.contentType === "sponsor").length;

  console.log(`\nSUMMARY:`);
  console.log(`  Total posts:     ${calendar.length}`);
  console.log(`  Countdown posts: ${countdownPosts}`);
  console.log(`  Speaker posts:   ${speakerPosts}`);
  console.log(`  Sponsor posts:   ${sponsorPosts}`);
  console.log(`  Days covered:    ${new Set(calendar.map((e) => e.date)).size}`);

  // Show daily breakdown
  console.log(`\nDAILY BREAKDOWN:`);
  const byDate = {};
  for (const entry of calendar) {
    if (!byDate[entry.date]) byDate[entry.date] = [];
    byDate[entry.date].push(entry);
  }
  for (const [date, posts] of Object.entries(byDate)) {
    const daysLeft = daysBetween(date, EVENT_DATE);
    const types = posts.map(
      (p) =>
        `${p.timeSlot}:${p.contentType}${p.speakerOrSponsorName ? `(${p.speakerOrSponsorName})` : ""}`
    );
    console.log(`  ${date} (${daysLeft}d left): ${types.join(", ")}`);
  }

  console.log(`\nOutput: speaker-social/2026/social-calendar.json`);

  return calendar;
}

main();

export { buildCalendar, slugify, daysBetween, getCountdownImagePath };
