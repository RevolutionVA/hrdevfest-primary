/**
 * Generate AI social media images for HRDevFest speakers and sponsors.
 *
 * Usage:
 *   yarn generate:social                          # Generate all images
 *   yarn generate:social -- --speakers-only       # Only speakers
 *   yarn generate:social -- --sponsors-only       # Only sponsors
 *   yarn generate:social -- --speaker "Lionel Sapp"
 *   yarn generate:social -- --sponsor "Progress"
 *   yarn generate:social -- --force               # Regenerate existing
 *   yarn generate:social -- --format square       # Only 1080x1080
 *   yarn generate:social -- --format landscape    # Only 1200x675
 *
 * Requires NANOBANANA_APIKEY environment variable.
 */

import { GoogleGenAI } from "@google/genai";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { resolve, dirname, extname } from "node:path";
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

const speakersOnly = hasFlag("speakers-only");
const sponsorsOnly = hasFlag("sponsors-only");
const force = hasFlag("force");
const formatFilter = getFlagValue("format"); // "square" | "landscape" | null
const singleSpeaker = getFlagValue("speaker");
const singleSponsor = getFlagValue("sponsor");

// ---------------------------------------------------------------------------
// Gemini client setup
// ---------------------------------------------------------------------------
const apiKey = process.env.NANOBANANA_APIKEY;
if (!apiKey) {
  console.error("ERROR: NANOBANANA_APIKEY environment variable is required.");
  console.error("Get one at https://aistudio.google.com/apikey");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });
const MODEL = "gemini-2.5-flash-image";

// ---------------------------------------------------------------------------
// Image formats
// ---------------------------------------------------------------------------
const FORMATS = {
  square: { width: 1080, height: 1080, label: "1:1 square" },
  landscape: { width: 1200, height: 675, label: "16:9 landscape" },
};

// ---------------------------------------------------------------------------
// Output directories
// ---------------------------------------------------------------------------
const outBase = resolve(projectRoot, "speaker-social/2026/generated-ai");
const speakersOutDir = resolve(outBase, "speakers");
const sponsorsOutDir = resolve(outBase, "sponsors");
mkdirSync(speakersOutDir, { recursive: true });
mkdirSync(sponsorsOutDir, { recursive: true });

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function loadImageAsBase64(filePath) {
  if (!existsSync(filePath)) return null;
  return readFileSync(filePath).toString("base64");
}

function mimeForExt(ext) {
  const map = {
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".svg": "image/png", // fallback
    ".webp": "image/webp",
  };
  return map[ext.toLowerCase()] || "image/png";
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// ---------------------------------------------------------------------------
// Load shared reference images
// ---------------------------------------------------------------------------
const logoPath = resolve(projectRoot, "src/assets/logo-2025.png");

const logoBase64 = loadImageAsBase64(logoPath);

if (!logoBase64) {
  console.error("ERROR: Could not load logo at src/assets/logo-2025.png");
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Generate a single image via Gemini
// ---------------------------------------------------------------------------
async function generateImage(prompt, referenceImages, outputPath, retries = 1) {
  const imageParts = referenceImages.map((img) => ({
    inlineData: { mimeType: img.mime, data: img.data },
  }));

  try {
    const response = await ai.models.generateContent({
      model: MODEL,
      contents: [
        {
          role: "user",
          parts: [...imageParts, { text: prompt }],
        },
      ],
      config: {
        responseModalities: ["TEXT", "IMAGE"],
      },
    });

    // Extract image from response
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const imageBuffer = Buffer.from(part.inlineData.data, "base64");
          writeFileSync(outputPath, imageBuffer);
          return true;
        }
      }
    }

    console.warn(`  WARNING: No image returned for ${outputPath}`);
    return false;
  } catch (err) {
    if (retries > 0 && err.status === 429) {
      console.log("  Rate limited, waiting 10 seconds...");
      await sleep(10000);
      return generateImage(prompt, referenceImages, outputPath, retries - 1);
    }
    console.error(`  ERROR generating ${outputPath}: ${err.message}`);
    return false;
  }
}

// ---------------------------------------------------------------------------
// Shared background description for ALL images (consistency is critical)
// ---------------------------------------------------------------------------
const BACKGROUND_DESC = `BACKGROUND (must be IDENTICAL across every image in this series):
- Solid white (#FFFFFF) fill for the entire canvas.
- In the bottom-right corner, add a subtle decorative pattern of thin teal (#2B5F6D) lines at 12% opacity that connect small teal dots (4-6px circles). The lines should form geometric angles (not curves), like a network/constellation diagram. This pattern should occupy roughly the bottom-right 30% of the image and fade out toward the center. Think of connected nodes in a circuit or network graph.
- NO other background elements. No gradients, no textures, no stock imagery.`;

// ---------------------------------------------------------------------------
// Speaker prompt builder
// ---------------------------------------------------------------------------
function buildSpeakerPrompt(speaker, format) {
  const { width, height } = FORMATS[format];
  const title = speaker.sessionTitle || "Speaker at HRDevFest 2026";

  const layoutSquare = `
EXACT LAYOUT for ${width}x${height} image (every element centered horizontally unless noted):

1. TOP-LEFT (x:40, y:40): The Hampton Roads DevFest conference logo (IMAGE 1 provided). Render at approximately 160px wide. Do NOT redraw or recreate this logo - use the exact provided image.

2. CENTER-TOP (centered, y:180 to y:480): The speaker's headshot (IMAGE 2 provided) cropped into a perfect CIRCLE, 300px diameter, with a 4px solid teal (#00B4D8) border around the circle. Center the face in the circle crop. The circular headshot must be the same size for every speaker.

3. BADGE (centered, y:510): A small rounded rectangle (140px x 36px) with solid orange (#D9531E) fill containing "SPEAKER" in white, bold, uppercase, 14px sans-serif text. Centered inside the badge.

4. NAME (centered, y:570): "${speaker.name}" in dark charcoal (#1A1A2E), bold, 44px sans-serif font. Centered.

5. TALK TITLE (centered, y:630): "${title}" in teal (#00B4D8), regular weight, 18px sans-serif font. Maximum 2 lines, centered. If longer, truncate with ellipsis.

6. EVENT INFO (centered, y:780): "Feb 27, 2026" in dark charcoal (#1A1A2E), 16px. Below it: "Virginia Beach, VA" in medium gray (#666666), 14px.

7. WEBSITE (centered, y:860): "hrdevfest.org" in teal (#00B4D8), 16px sans-serif.`;

  const layoutLandscape = `
EXACT LAYOUT for ${width}x${height} image:

LEFT COLUMN (x:40 to x:420, full height):
1. The speaker's headshot (IMAGE 2 provided) cropped into a perfect CIRCLE, 280px diameter, with a 4px solid teal (#00B4D8) border. Vertically centered in the left column. The circular headshot must be the same size for every speaker.

RIGHT COLUMN (x:460 to x:1160), elements stacked top to bottom, left-aligned:
2. TOP-RIGHT (x:460, y:40): The Hampton Roads DevFest conference logo (IMAGE 1 provided). Render at approximately 140px wide. Use the exact provided image.
3. BADGE (x:460, y:200): Small rounded rectangle (140px x 36px) with solid orange (#D9531E) fill, "SPEAKER" in white bold uppercase 14px.
4. NAME (x:460, y:260): "${speaker.name}" in dark charcoal (#1A1A2E), bold, 40px sans-serif.
5. TALK TITLE (x:460, y:330): "${title}" in teal (#00B4D8), 16px, max 2 lines.
6. EVENT INFO (x:460, y:520): "Feb 27, 2026 | Virginia Beach, VA" in medium gray (#666666), 14px.
7. WEBSITE (x:460, y:560): "hrdevfest.org" in teal (#00B4D8), 14px.`;

  const layout = format === "square" ? layoutSquare : layoutLandscape;

  return `Generate an image that is exactly ${width}x${height} pixels.

${BACKGROUND_DESC}

${layout}

STRICT RULES:
- Use ONLY the provided images. IMAGE 1 = conference logo, IMAGE 2 = speaker headshot. Do NOT add any other photos, icons, or illustrations.
- The headshot MUST be cropped to a circle with teal border. Never a rectangle, cutout, or irregular shape.
- All text must be spelled EXACTLY as specified above - no variations or abbreviations.
- Use a clean sans-serif font family throughout.
- This is a TEMPLATE - every speaker image must look identical in layout, only differing in the headshot photo, name, and talk title.`;
}

// ---------------------------------------------------------------------------
// Sponsor prompt builder
// ---------------------------------------------------------------------------
function buildSponsorPrompt(sponsor, format) {
  const { width, height } = FORMATS[format];
  const tierLabel =
    sponsor.tier.charAt(0).toUpperCase() + sponsor.tier.slice(1);

  const tierBg =
    sponsor.tier === "platinum"
      ? "#2B5F6D"
      : sponsor.tier === "gold"
        ? "#D9531E"
        : sponsor.tier === "silver"
          ? "#666666"
          : "#2B5F6D";
  const tierTextColor = "#FFFFFF";

  const layoutSquare = `
EXACT LAYOUT for ${width}x${height} image (every element centered horizontally unless noted):

1. TOP-LEFT (x:40, y:40): The Hampton Roads DevFest conference logo (IMAGE 1 provided). Render at approximately 160px wide. Use the exact provided image.

2. HEADING (centered, y:220): "THANK YOU" in teal (#00B4D8), bold, uppercase, 48px sans-serif.

3. SPONSOR LOGO (centered, y:320 to y:560): The sponsor's logo (IMAGE 2 provided) displayed inside a white (#FFFFFF) rounded rectangle card with a 1px light gray (#E0E0E0) border and subtle shadow. Card size: 360px wide x 220px tall, 16px border-radius. The sponsor logo should be centered within this card and sized to fit with padding.

4. SPONSOR NAME (centered, y:610): "${sponsor.name}" in dark charcoal (#1A1A2E), medium weight, 26px sans-serif.

5. TIER BADGE (centered, y:670): A small rounded rectangle (180px x 36px) with ${tierBg} fill containing "${tierLabel} Sponsor" in ${tierTextColor}, bold, 14px uppercase sans-serif.

6. EVENT INFO (centered, y:780): "Feb 27, 2026" in dark charcoal (#1A1A2E), 16px. Below it: "Virginia Beach, VA" in medium gray (#666666), 14px.

7. WEBSITE (centered, y:860): "hrdevfest.org" in teal (#00B4D8), 16px sans-serif.`;

  const layoutLandscape = `
EXACT LAYOUT for ${width}x${height} image (centered approach):

TOP ROW (y:30):
1. LEFT (x:40, y:30): The Hampton Roads DevFest conference logo (IMAGE 1 provided), approximately 130px wide. Use the exact provided image.
2. RIGHT (x:1020, y:30): A rounded rectangle (180px x 32px) with ${tierBg} fill, "${tierLabel} Sponsor" in ${tierTextColor} bold uppercase 12px.

CENTER (everything centered horizontally):
3. HEADING (centered, y:140): "THANK YOU" in teal (#00B4D8), bold, uppercase, 40px sans-serif.
4. SPONSOR LOGO (centered, y:200 to y:400): The sponsor's logo (IMAGE 2 provided) on a white rounded rectangle card with 1px #E0E0E0 border. Card: 300px wide x 180px tall, 12px radius. Logo centered inside with padding.
5. SPONSOR NAME (centered, y:440): "${sponsor.name}" in dark charcoal (#1A1A2E), 22px sans-serif.

BOTTOM (centered, y:560):
6. "Feb 27, 2026 | Virginia Beach, VA" in gray (#666666), 13px, and "hrdevfest.org" in teal (#00B4D8), 13px.`;

  const layout = format === "square" ? layoutSquare : layoutLandscape;

  return `Generate an image that is exactly ${width}x${height} pixels.

${BACKGROUND_DESC}

${layout}

STRICT RULES:
- Use ONLY the provided images. IMAGE 1 = conference logo, IMAGE 2 = sponsor logo. Do NOT add any other photos, icons, or illustrations.
- The sponsor logo MUST be displayed inside a white card with light border. Not floating directly on the background.
- All text must be spelled EXACTLY as specified above - no variations.
- Use a clean sans-serif font family throughout.
- This is a TEMPLATE - every sponsor image must look identical in layout, only differing in the sponsor logo, name, and tier.`;
}

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
    const headshotBase64 = loadImageAsBase64(headshotPath);

    if (!headshotBase64) {
      console.warn(`  WARNING: Missing headshot for ${speaker.name}, skipping`);
      failed++;
      continue;
    }

    const headshotMime = mimeForExt(extname(speaker.image));

    const formats = formatFilter ? [formatFilter] : ["square", "landscape"];
    for (const format of formats) {
      const outPath = resolve(speakersOutDir, `${slug}-${format}.png`);

      if (existsSync(outPath) && !force) {
        console.log(`  SKIP ${slug}-${format}.png (exists, use --force)`);
        skipped++;
        continue;
      }

      console.log(
        `  Generating ${slug}-${format}.png (${FORMATS[format].label})...`
      );

      const prompt = buildSpeakerPrompt(speaker, format);
      const refs = [
        { data: logoBase64, mime: "image/png" },
        { data: headshotBase64, mime: headshotMime },
      ];

      const ok = await generateImage(prompt, refs, outPath);
      if (ok) {
        generated++;
        console.log(`  OK ${slug}-${format}.png`);
      } else {
        failed++;
      }

      // Rate-limit delay
      await sleep(1000);
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
    const logoFilePath = resolve(
      projectRoot,
      "src/assets/sponsors",
      sponsor.logo
    );
    const sponsorLogoBase64 = loadImageAsBase64(logoFilePath);

    if (!sponsorLogoBase64) {
      console.warn(
        `  WARNING: Missing logo for ${sponsor.name} (${sponsor.logo}), skipping`
      );
      failed++;
      continue;
    }

    const sponsorLogoMime = mimeForExt(extname(sponsor.logo));

    const formats = formatFilter ? [formatFilter] : ["square", "landscape"];
    for (const format of formats) {
      const outPath = resolve(sponsorsOutDir, `${slug}-${format}.png`);

      if (existsSync(outPath) && !force) {
        console.log(`  SKIP ${slug}-${format}.png (exists, use --force)`);
        skipped++;
        continue;
      }

      console.log(
        `  Generating ${slug}-${format}.png (${FORMATS[format].label})...`
      );

      const prompt = buildSponsorPrompt(sponsor, format);
      const refs = [
        { data: logoBase64, mime: "image/png" },
        { data: sponsorLogoBase64, mime: sponsorLogoMime },
      ];

      const ok = await generateImage(prompt, refs, outPath);
      if (ok) {
        generated++;
        console.log(`  OK ${slug}-${format}.png`);
      } else {
        failed++;
      }

      // Rate-limit delay
      await sleep(1000);
    }
  }

  return { generated, skipped, failed };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  console.log("HRDevFest Social Image Generator");
  console.log("=================================\n");

  let speakerStats = { generated: 0, skipped: 0, failed: 0 };
  let sponsorStats = { generated: 0, skipped: 0, failed: 0 };

  if (!sponsorsOnly && !singleSponsor) {
    console.log("SPEAKERS:");
    speakerStats = await processSpeakers();
    console.log();
  }

  if (!speakersOnly && !singleSpeaker) {
    console.log("SPONSORS:");
    sponsorStats = await processSponsors();
    console.log();
  }

  const total = {
    generated: speakerStats.generated + sponsorStats.generated,
    skipped: speakerStats.skipped + sponsorStats.skipped,
    failed: speakerStats.failed + sponsorStats.failed,
  };

  console.log("SUMMARY:");
  console.log(`  Generated: ${total.generated}`);
  console.log(`  Skipped:   ${total.skipped}`);
  console.log(`  Failed:    ${total.failed}`);
  console.log(`\nOutput: speaker-social/2026/generated-ai/`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
