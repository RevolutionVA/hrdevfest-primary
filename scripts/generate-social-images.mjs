/**
 * Generate deterministic social media images for HRDevFest speakers and sponsors.
 * Uses Satori (HTML/CSS → SVG) + resvg-js (SVG → PNG) for pixel-perfect rendering.
 *
 * Usage:
 *   yarn generate:social                          # Generate all images
 *   yarn generate:social -- --speakers-only       # Only speakers
 *   yarn generate:social -- --sponsors-only       # Only sponsors
 *   yarn generate:social -- --countdown-only      # Only countdown
 *   yarn generate:social -- --speaker "Lionel Sapp"
 *   yarn generate:social -- --sponsor "Progress"
 *   yarn generate:social -- --force               # Regenerate existing
 *
 * No API key or network connection required.
 */

import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { resolve, dirname, extname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { speakerSquareTemplate } from "./templates/speaker-square.mjs";
import { sponsorSquareTemplate } from "./templates/sponsor-square.mjs";
import { countdownSquareTemplate } from "./templates/countdown-square.mjs";

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

const speakersOnly = hasFlag("speakers-only");
const sponsorsOnly = hasFlag("sponsors-only");
const countdownOnly = hasFlag("countdown-only");
const force = hasFlag("force");
const singleSpeaker = getFlagValue("speaker");
const singleSponsor = getFlagValue("sponsor");

// ---------------------------------------------------------------------------
// Load fonts
// ---------------------------------------------------------------------------
const fontsDir = resolve(projectRoot, "fonts");
const interBold = readFileSync(resolve(fontsDir, "Inter-Bold.ttf"));
const interRegular = readFileSync(resolve(fontsDir, "Inter-Regular.ttf"));

const fonts = [
  { name: "Inter", data: interRegular, weight: 400, style: "normal" },
  { name: "Inter", data: interBold, weight: 700, style: "normal" },
];

// ---------------------------------------------------------------------------
// Image formats
// ---------------------------------------------------------------------------
const FORMAT = { width: 1080, height: 1080, label: "1:1 square" };

// ---------------------------------------------------------------------------
// Output directories
// ---------------------------------------------------------------------------
const outBase = resolve(projectRoot, "speaker-social/2026/generated");
const speakersOutDir = resolve(outBase, "speakers");
const sponsorsOutDir = resolve(outBase, "sponsors");
const countdownOutDir = resolve(projectRoot, "speaker-social/2026/backgrounds");
mkdirSync(speakersOutDir, { recursive: true });
mkdirSync(sponsorsOutDir, { recursive: true });
mkdirSync(countdownOutDir, { recursive: true });

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function loadImageAsDataUri(filePath) {
  if (!existsSync(filePath)) return null;
  const ext = extname(filePath).toLowerCase();
  const mimeMap = {
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
    ".svg": "image/svg+xml",
  };
  const mime = mimeMap[ext] || "image/png";
  const data = readFileSync(filePath).toString("base64");
  return `data:${mime};base64,${data}`;
}

/**
 * Resolve a sponsor logo variant path. Given a logo filename like "foo.png",
 * returns the path to "foo_white.png" if variant is "white" and the file exists,
 * otherwise falls back to the original logo path.
 */
function resolveSponsorLogoPath(logoFilename, variant) {
  const baseLogoPath = resolve(projectRoot, "src/assets/sponsors", logoFilename);
  if (!variant) return baseLogoPath;

  const ext = extname(logoFilename);
  const baseName = logoFilename.slice(0, -ext.length);
  const variantFilename = `${baseName}_${variant}${ext}`;
  const variantPath = resolve(projectRoot, "src/assets/sponsors", variantFilename);

  return existsSync(variantPath) ? variantPath : baseLogoPath;
}

// ---------------------------------------------------------------------------
// Load shared logo
// ---------------------------------------------------------------------------
const logoPath = resolve(projectRoot, "src/assets/logo-2025.png");
const logoDataUri = loadImageAsDataUri(logoPath);

if (!logoDataUri) {
  console.error("ERROR: Could not load logo at src/assets/logo-2025.png");
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Render a Satori JSX template to PNG
// ---------------------------------------------------------------------------
async function renderToPng(template, width, height) {
  const svg = await satori(template, { width, height, fonts });
  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: width },
  });
  const pngData = resvg.render();
  return pngData.asPng();
}

// ---------------------------------------------------------------------------
// Templates imported from scripts/templates/
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Process speakers
// ---------------------------------------------------------------------------
async function processSpeakers() {
  const list = singleSpeaker
    ? speakers.filter(
        (s) => s.name.toLowerCase() === singleSpeaker.toLowerCase()
      )
    : speakers;

  if (singleSpeaker && list.length === 0) {
    console.error(`Speaker "${singleSpeaker}" not found.`);
    return { generated: 0, skipped: 0, failed: 0 };
  }

  let generated = 0,
    skipped = 0,
    failed = 0;

  for (const speaker of list) {
    const slug = slugify(speaker.name);
    const headshotPath = resolve(
      projectRoot,
      "src/assets/speakers",
      speaker.image
    );
    const headshotUri = loadImageAsDataUri(headshotPath);

    if (!headshotUri) {
      console.warn(`  WARNING: Missing headshot for ${speaker.name}, skipping`);
      failed++;
      continue;
    }

    const outPath = resolve(speakersOutDir, `${slug}.png`);

    if (existsSync(outPath) && !force) {
      console.log(`  SKIP ${slug}.png (exists, use --force)`);
      skipped++;
      continue;
    }

    console.log(`  Generating ${slug}.png (${FORMAT.label})...`);

    try {
      const template = speakerSquareTemplate({ speaker, headshotUri, logoDataUri });
      const png = await renderToPng(template, FORMAT.width, FORMAT.height);
      writeFileSync(outPath, png);
      generated++;
      console.log(`  OK ${slug}.png`);
    } catch (err) {
      console.error(`  ERROR generating ${slug}.png: ${err.message}`);
      failed++;
    }
  }

  return { generated, skipped, failed };
}

// ---------------------------------------------------------------------------
// Process sponsors
// ---------------------------------------------------------------------------
async function processSponsors() {
  const list = singleSponsor
    ? sponsors.filter(
        (s) => s.name.toLowerCase() === singleSponsor.toLowerCase()
      )
    : sponsors;

  if (singleSponsor && list.length === 0) {
    console.error(`Sponsor "${singleSponsor}" not found.`);
    return { generated: 0, skipped: 0, failed: 0 };
  }

  let generated = 0,
    skipped = 0,
    failed = 0;

  for (const sponsor of list) {
    const slug = slugify(sponsor.name);

    // Resolve standard logo and white variant (for dark backgrounds)
    const standardLogoPath = resolveSponsorLogoPath(sponsor.logo, null);
    const whiteLogoPath = resolveSponsorLogoPath(sponsor.logo, "white");
    const sponsorLogoUri = loadImageAsDataUri(standardLogoPath);
    const sponsorLogoWhiteUri = loadImageAsDataUri(whiteLogoPath);

    if (!sponsorLogoUri) {
      console.warn(
        `  WARNING: Missing logo for ${sponsor.name} (${sponsor.logo}), skipping`
      );
      failed++;
      continue;
    }

    const outPath = resolve(sponsorsOutDir, `${slug}.png`);

    if (existsSync(outPath) && !force) {
      console.log(`  SKIP ${slug}.png (exists, use --force)`);
      skipped++;
      continue;
    }

    console.log(`  Generating ${slug}.png (${FORMAT.label})...`);

    try {
      const template = sponsorSquareTemplate({ sponsor, sponsorLogoUri, sponsorLogoWhiteUri, logoDataUri });
      const png = await renderToPng(template, FORMAT.width, FORMAT.height);
      writeFileSync(outPath, png);
      generated++;
      console.log(`  OK ${slug}.png`);
    } catch (err) {
      console.error(`  ERROR generating ${slug}.png: ${err.message}`);
      failed++;
    }
  }

  return { generated, skipped, failed };
}

// ---------------------------------------------------------------------------
// Process countdown images (one per day, 10 down to 0)
// ---------------------------------------------------------------------------
async function processCountdown() {
  let generated = 0,
    skipped = 0,
    failed = 0;

  for (let days = 10; days >= 0; days--) {
    const filename = `countdown-${days}-days-square.png`;
    const outPath = resolve(countdownOutDir, filename);

    if (existsSync(outPath) && !force) {
      console.log(`  SKIP ${filename} (exists, use --force)`);
      skipped++;
      continue;
    }

    console.log(`  Generating ${filename} (${FORMAT.label})...`);

    try {
      const template = countdownSquareTemplate({ daysLeft: days, logoDataUri });
      const png = await renderToPng(template, FORMAT.width, FORMAT.height);
      writeFileSync(outPath, png);
      generated++;
      console.log(`  OK ${filename}`);
    } catch (err) {
      console.error(`  ERROR generating ${filename}: ${err.message}`);
      failed++;
    }
  }

  return { generated, skipped, failed };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  console.log("HRDevFest Social Image Generator (Satori)");
  console.log("==========================================\n");

  const startTime = Date.now();

  let speakerStats = { generated: 0, skipped: 0, failed: 0 };
  let sponsorStats = { generated: 0, skipped: 0, failed: 0 };
  let countdownStats = { generated: 0, skipped: 0, failed: 0 };

  if (!sponsorsOnly && !countdownOnly && !singleSponsor) {
    console.log("SPEAKERS:");
    speakerStats = await processSpeakers();
    console.log();
  }

  if (!speakersOnly && !countdownOnly && !singleSpeaker) {
    console.log("SPONSORS:");
    sponsorStats = await processSponsors();
    console.log();
  }

  if (!speakersOnly && !sponsorsOnly && !singleSpeaker && !singleSponsor) {
    console.log("COUNTDOWN:");
    countdownStats = await processCountdown();
    console.log();
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

  const total = {
    generated: speakerStats.generated + sponsorStats.generated + countdownStats.generated,
    skipped: speakerStats.skipped + sponsorStats.skipped + countdownStats.skipped,
    failed: speakerStats.failed + sponsorStats.failed + countdownStats.failed,
  };

  console.log("SUMMARY:");
  console.log(`  Generated: ${total.generated}`);
  console.log(`  Skipped:   ${total.skipped}`);
  console.log(`  Failed:    ${total.failed}`);
  console.log(`  Time:      ${elapsed}s`);
  console.log(`\nOutput: speaker-social/2026/generated/`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
