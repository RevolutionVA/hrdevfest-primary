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
const combinedFlag = hasFlag("combined");

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
    const { date, daysRemaining, posts: plannedContent } = plan;
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
// Platform-specific post copy generation (US-002)
// ---------------------------------------------------------------------------
const REG_LINK = "https://hrdevfest.org";
const HASHTAGS = "#HRDevFest #HamptonRoads #DevFest2026";
const EVENT_INFO = "Feb 27 in Virginia Beach";

function getCountdownText(daysRemaining) {
  if (daysRemaining >= 10) return `${daysRemaining} days until DevFest!`;
  if (daysRemaining === 7) return "1 week until DevFest!";
  if (daysRemaining >= 4) return `${daysRemaining} days until DevFest!`;
  if (daysRemaining === 3) return "3 days until DevFest!";
  if (daysRemaining === 2) return "2 days until DevFest!";
  if (daysRemaining === 1) return "DevFest is TOMORROW!";
  return "It's DevFest day! See you TODAY!";
}

function getCountdownUrgency(daysRemaining) {
  if (daysRemaining >= 8) return "early";
  if (daysRemaining >= 4) return "mid";
  if (daysRemaining >= 1) return "final";
  return "today";
}

function lookupSpeaker(name) {
  return eligibleSpeakers.find((s) => s.name === name) || null;
}

function lookupSponsors(nameField) {
  if (!nameField) return [];
  const names = nameField.split(" & ").map((n) => n.trim());
  return names
    .map((n) => eligibleSponsors.find((s) => s.name === n))
    .filter(Boolean);
}

function tierLabel(tier) {
  const labels = { platinum: "Platinum", gold: "Gold", silver: "Silver", logo: "Community" };
  return labels[tier] || tier;
}

/**
 * Ensure X copy fits within 280 characters.
 * Trimming order: drop hashtags first, then session title, keep name + link.
 */
function fitXCopy(parts) {
  // parts: { prefix, sessionLine, hashtags, link }
  const { prefix, sessionLine, hashtags, link } = parts;

  // Try full version: prefix + sessionLine + hashtags + link
  const full = [prefix, sessionLine, hashtags, link].filter(Boolean).join("\n\n");
  if (full.length <= 280) return full;

  // Drop hashtags
  const noHashtags = [prefix, sessionLine, link].filter(Boolean).join("\n\n");
  if (noHashtags.length <= 280) return noHashtags;

  // Drop session title
  const noSession = [prefix, link].filter(Boolean).join("\n\n");
  if (noSession.length <= 280) return noSession;

  // Last resort: truncate prefix to fit with link
  const maxPrefix = 280 - link.length - 2; // 2 for \n\n
  return prefix.slice(0, maxPrefix) + "\n\n" + link;
}

function generateSpeakerCopy(entry) {
  const speaker = lookupSpeaker(entry.speakerOrSponsorName);
  if (!speaker) return generateFallbackCopy(entry);

  const name = speaker.name;
  const session = speaker.sessionTitle || "";

  return {
    x: fitXCopy({
      prefix: `Speaker spotlight: ${name} at Hampton Roads DevFest, ${EVENT_INFO}!`,
      sessionLine: session ? `Presenting: "${session}"` : null,
      hashtags: HASHTAGS,
      link: REG_LINK,
    }),

    linkedin: [
      `We're excited to spotlight ${name} at Hampton Roads DevFest on ${EVENT_INFO}!`,
      session
        ? `${name} will be presenting "${session}" — a session you won't want to miss. This is a great opportunity to learn from one of our talented local speakers and connect with the Hampton Roads tech community.`
        : `${name} is one of our talented local speakers. This is a great opportunity to connect with the Hampton Roads tech community.`,
      `Register now and join us: ${REG_LINK}\n\n${HASHTAGS}`,
    ].join("\n\n"),

    instagram: [
      `🎤 Speaker spotlight: ${name}!`,
      session ? `💡 "${session}"` : "",
      `📅 ${EVENT_INFO}`,
      `🔗 Link in bio to register!`,
      ``,
      HASHTAGS,
    ]
      .filter(Boolean)
      .join("\n"),

    facebook: [
      `Meet ${name}, one of our amazing speakers at Hampton Roads DevFest on ${EVENT_INFO}! 🎉`,
      session
        ? `They'll be presenting "${session}" — come learn and connect with the local tech community.`
        : `Come learn and connect with the local tech community.`,
      `Grab your spot now: ${REG_LINK}\n\n${HASHTAGS}`,
    ].join("\n\n"),
  };
}

function generateSponsorCopy(entry) {
  const matchedSponsors = lookupSponsors(entry.speakerOrSponsorName);
  if (matchedSponsors.length === 0) return generateFallbackCopy(entry);

  const isGroup = matchedSponsors.length > 1;
  const primary = matchedSponsors[0];
  const tier = tierLabel(primary.tier);
  const nameDisplay = entry.speakerOrSponsorName;

  if (isGroup) {
    const tiers = matchedSponsors.map((s) => `${s.name} (${tierLabel(s.tier)})`).join(" and ");
    return {
      x: fitXCopy({
        prefix: `Thank you to our sponsors ${nameDisplay} for supporting Hampton Roads DevFest, ${EVENT_INFO}!`,
        sessionLine: null,
        hashtags: HASHTAGS,
        link: REG_LINK,
      }),

      linkedin: [
        `A huge thank you to our sponsors — ${tiers} — for supporting Hampton Roads DevFest on ${EVENT_INFO}!`,
        `Their support helps make this community event possible. We're proud to bring together local developers, and sponsors like these make it happen.`,
        `Join us: ${REG_LINK}\n\n${HASHTAGS}`,
      ].join("\n\n"),

      instagram: [
        `🙌 Sponsor shoutout!`,
        `Thanks to ${nameDisplay} for supporting DevFest!`,
        `📅 ${EVENT_INFO}`,
        `🔗 Link in bio to register!`,
        ``,
        HASHTAGS,
      ].join("\n"),

      facebook: [
        `Shoutout to our sponsors ${nameDisplay} for helping make Hampton Roads DevFest possible on ${EVENT_INFO}! 🎉`,
        `We're grateful for their support in bringing the local tech community together.`,
        `Register now: ${REG_LINK}\n\n${HASHTAGS}`,
      ].join("\n\n"),
    };
  }

  return {
    x: fitXCopy({
      prefix: `Thank you to our ${tier} sponsor ${nameDisplay} for supporting Hampton Roads DevFest, ${EVENT_INFO}!`,
      sessionLine: null,
      hashtags: HASHTAGS,
      link: REG_LINK,
    }),

    linkedin: [
      `We're grateful to have ${nameDisplay} as a ${tier} sponsor of Hampton Roads DevFest on ${EVENT_INFO}!`,
      `Their support helps bring together developers across Hampton Roads for a day of learning, networking, and community. Thank you, ${nameDisplay}!`,
      `Register now: ${REG_LINK}\n\n${HASHTAGS}`,
    ].join("\n\n"),

    instagram: [
      `🙌 ${tier} Sponsor spotlight: ${nameDisplay}!`,
      `Thank you for supporting DevFest! 💪`,
      `📅 ${EVENT_INFO}`,
      `🔗 Link in bio to register!`,
      ``,
      HASHTAGS,
    ].join("\n"),

    facebook: [
      `Big thanks to our ${tier} sponsor ${nameDisplay} for supporting Hampton Roads DevFest on ${EVENT_INFO}! 🎉`,
      `Their partnership helps make this community event possible. We appreciate the support!`,
      `Get your ticket: ${REG_LINK}\n\n${HASHTAGS}`,
    ].join("\n\n"),
  };
}

function generateCountdownCopy(entry) {
  const daysRemaining = daysBetween(entry.date, EVENT_DATE);
  const countdown = getCountdownText(daysRemaining);
  const urgency = getCountdownUrgency(daysRemaining);

  if (urgency === "today") {
    return {
      x: fitXCopy({
        prefix: `It's happening NOW! Hampton Roads DevFest is TODAY in Virginia Beach!`,
        sessionLine: `See you there!`,
        hashtags: HASHTAGS,
        link: REG_LINK,
      }),

      linkedin: [
        `It's here — Hampton Roads DevFest is happening TODAY in Virginia Beach!`,
        `We're thrilled to welcome developers from across the region for a day of incredible sessions, networking, and community. Whether you're joining us in person or following along online, today is going to be special.`,
        `See you there! ${REG_LINK}\n\n${HASHTAGS}`,
      ].join("\n\n"),

      instagram: [
        `🚀 IT'S DEVFEST DAY! 🎉`,
        `Hampton Roads DevFest is happening NOW in Virginia Beach!`,
        `See you there! 🙌`,
        `🔗 Link in bio`,
        ``,
        HASHTAGS,
      ].join("\n"),

      facebook: [
        `IT'S DEVFEST DAY! 🚀🎉 Hampton Roads DevFest is happening right now in Virginia Beach!`,
        `We can't wait to see everyone today. It's going to be an amazing day of talks, learning, and community.`,
        `Happening now: ${REG_LINK}\n\n${HASHTAGS}`,
      ].join("\n\n"),
    };
  }

  if (urgency === "final") {
    const urgencyPrefix = daysRemaining === 1 ? "TOMORROW" : `Just ${daysRemaining} days away`;
    return {
      x: fitXCopy({
        prefix: `${urgencyPrefix}! Hampton Roads DevFest, ${EVENT_INFO}. Don't miss out!`,
        sessionLine: null,
        hashtags: HASHTAGS,
        link: REG_LINK,
      }),

      linkedin: [
        `${countdown} Hampton Roads DevFest is almost here!`,
        `${EVENT_INFO} — join us for a day packed with sessions from talented local speakers, sponsor showcases, and networking with the Hampton Roads tech community. Last chance to register!`,
        `Secure your spot: ${REG_LINK}\n\n${HASHTAGS}`,
      ].join("\n\n"),

      instagram: [
        `⏰ ${countdown}`,
        `Hampton Roads DevFest is almost here!`,
        `📅 ${EVENT_INFO}`,
        `Don't miss out! 🔗 Link in bio`,
        ``,
        HASHTAGS,
      ].join("\n"),

      facebook: [
        `⏰ ${countdown} Hampton Roads DevFest is right around the corner!`,
        `Join us ${EVENT_INFO} for amazing talks, community, and networking. Spots are filling up — register now!`,
        `Register: ${REG_LINK}\n\n${HASHTAGS}`,
      ].join("\n\n"),
    };
  }

  // Early or mid urgency
  return {
    x: fitXCopy({
      prefix: `${countdown} Hampton Roads DevFest is coming ${EVENT_INFO}.`,
      sessionLine: `Local speakers, great sessions, and community networking await!`,
      hashtags: HASHTAGS,
      link: REG_LINK,
    }),

    linkedin: [
      `${countdown} We're counting down to Hampton Roads DevFest on ${EVENT_INFO}!`,
      `This is the premier local developer conference celebrating the Hampton Roads tech community. Join us for sessions from amazing local speakers, sponsor showcases, and opportunities to connect with fellow developers in the 757.`,
      `Register today: ${REG_LINK}\n\n${HASHTAGS}`,
    ].join("\n\n"),

    instagram: [
      `📣 ${countdown}`,
      `Hampton Roads DevFest is coming! 🎉`,
      `📅 ${EVENT_INFO}`,
      `Local speakers. Great sessions. Community vibes. ✨`,
      `🔗 Link in bio to register!`,
      ``,
      HASHTAGS,
    ].join("\n"),

    facebook: [
      `📣 ${countdown} Hampton Roads DevFest is coming to Virginia Beach on Feb 27!`,
      `Join us for a full day of sessions from talented local speakers, networking, and celebrating the tech community in Hampton Roads. It's going to be a great time!`,
      `Register now: ${REG_LINK}\n\n${HASHTAGS}`,
    ].join("\n\n"),
  };
}

function generateFallbackCopy() {
  return {
    x: fitXCopy({
      prefix: `Hampton Roads DevFest, ${EVENT_INFO}. Join the local tech community!`,
      sessionLine: null,
      hashtags: HASHTAGS,
      link: REG_LINK,
    }),
    linkedin: `Join us at Hampton Roads DevFest on ${EVENT_INFO}! Register: ${REG_LINK}\n\n${HASHTAGS}`,
    instagram: `🎉 Hampton Roads DevFest\n📅 ${EVENT_INFO}\n🔗 Link in bio!\n\n${HASHTAGS}`,
    facebook: `Join us at Hampton Roads DevFest on ${EVENT_INFO}! Register: ${REG_LINK}\n\n${HASHTAGS}`,
  };
}

function generatePlatformCopy(entry) {
  switch (entry.contentType) {
    case "speaker":
      return generateSpeakerCopy(entry);
    case "sponsor":
      return generateSponsorCopy(entry);
    case "countdown":
      return generateCountdownCopy(entry);
    default:
      return generateFallbackCopy(entry);
  }
}

function addPlatformCopyToCalendar(calendar) {
  for (const entry of calendar) {
    entry.platforms = generatePlatformCopy(entry);
  }
  return calendar;
}

// ---------------------------------------------------------------------------
// Markdown generation (US-004)
// ---------------------------------------------------------------------------
const PLATFORMS = ["x", "linkedin", "facebook", "instagram"];
const PLATFORM_LABELS = { x: "X (Twitter)", linkedin: "LinkedIn", facebook: "Facebook", instagram: "Instagram" };
const TIME_SLOT_LABELS = { morning: "Morning", afternoon: "Afternoon", evening: "Evening" };

function groupByDate(calendar) {
  const grouped = {};
  for (const entry of calendar) {
    if (!grouped[entry.date]) grouped[entry.date] = [];
    grouped[entry.date].push(entry);
  }
  return grouped;
}

function formatContentType(type) {
  return type.charAt(0).toUpperCase() + type.slice(1);
}

function generatePlatformMarkdown(calendar, platform) {
  const byDate = groupByDate(calendar);
  const label = PLATFORM_LABELS[platform];
  const lines = [`# HRDevFest Social Media Calendar — ${label}`, ""];

  for (const [date, posts] of Object.entries(byDate)) {
    const daysLeft = daysBetween(date, EVENT_DATE);
    lines.push(`## ${date} (${daysLeft} day${daysLeft !== 1 ? "s" : ""} until DevFest)`);
    lines.push("");

    for (const post of posts) {
      const slotLabel = TIME_SLOT_LABELS[post.timeSlot] || post.timeSlot;
      const typeLabel = formatContentType(post.contentType);
      const nameInfo = post.speakerOrSponsorName ? ` — ${post.speakerOrSponsorName}` : "";

      lines.push(`### ${slotLabel} · ${typeLabel}${nameInfo}`);
      lines.push("");
      lines.push(post.platforms[platform]);
      lines.push("");
      lines.push(`**Image:** \`${post.imagePath}\``);
      lines.push("");
      lines.push("---");
      lines.push("");
    }
  }

  return lines.join("\n");
}

function generateCombinedMarkdown(calendar) {
  const byDate = groupByDate(calendar);
  const lines = ["# HRDevFest Social Media Calendar — All Platforms", ""];

  for (const [date, posts] of Object.entries(byDate)) {
    const daysLeft = daysBetween(date, EVENT_DATE);
    lines.push(`## ${date} (${daysLeft} day${daysLeft !== 1 ? "s" : ""} until DevFest)`);
    lines.push("");

    for (const post of posts) {
      const slotLabel = TIME_SLOT_LABELS[post.timeSlot] || post.timeSlot;
      const typeLabel = formatContentType(post.contentType);
      const nameInfo = post.speakerOrSponsorName ? ` — ${post.speakerOrSponsorName}` : "";

      lines.push(`### ${slotLabel} · ${typeLabel}${nameInfo}`);
      lines.push("");
      lines.push(`**Image:** \`${post.imagePath}\``);
      lines.push("");

      for (const platform of PLATFORMS) {
        lines.push(`#### ${PLATFORM_LABELS[platform]}`);
        lines.push("");
        lines.push(post.platforms[platform]);
        lines.push("");
      }

      lines.push("---");
      lines.push("");
    }
  }

  return lines.join("\n");
}

function writeMarkdownFiles(calendar) {
  const files = [];

  // Always generate per-platform files
  for (const platform of PLATFORMS) {
    const filename = `social-calendar-${platform}.md`;
    const filePath = resolve(outDir, filename);
    const content = generatePlatformMarkdown(calendar, platform);
    writeFileSync(filePath, content);
    files.push(`speaker-social/2026/${filename}`);
  }

  // Generate combined file only with --combined flag
  if (combinedFlag) {
    const filename = "social-calendar.md";
    const filePath = resolve(outDir, filename);
    const content = generateCombinedMarkdown(calendar);
    writeFileSync(filePath, content);
    files.push(`speaker-social/2026/${filename}`);
  }

  return files;
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
  console.log(`Combined output: ${combinedFlag ? "yes" : "no (use --combined to include)"}`);
  console.log(
    `Speakers: ${eligibleSpeakers.length} (excluding Lauren Pryor - no session topic)`
  );
  console.log(
    `Sponsors: ${eligibleSponsors.length} (excluding City of Virginia Beach - already posted)`
  );
  console.log();

  const calendar = buildCalendar(startDateArg, endDateArg);

  console.log("Generating platform-specific post copy...");
  addPlatformCopyToCalendar(calendar);
  console.log();

  console.log("Validating image paths...");
  validateImages(calendar);
  console.log();

  // Write JSON output
  const jsonPath = resolve(outDir, "social-calendar.json");
  writeFileSync(jsonPath, JSON.stringify(calendar, null, 2));

  // Write markdown files (per-platform always, combined with --combined)
  console.log("Generating markdown files...");
  const mdFiles = writeMarkdownFiles(calendar);
  console.log();

  // Summary
  const countdownPosts = calendar.filter((e) => e.contentType === "countdown").length;
  const speakerPosts = calendar.filter((e) => e.contentType === "speaker").length;
  const sponsorPosts = calendar.filter((e) => e.contentType === "sponsor").length;

  console.log(`SUMMARY:`);
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

  console.log(`\nGenerated files:`);
  console.log(`  speaker-social/2026/social-calendar.json`);
  for (const f of mdFiles) {
    console.log(`  ${f}`);
  }

  return calendar;
}

main();

export { buildCalendar, slugify, daysBetween, getCountdownImagePath, combinedFlag };
