/**
 * Generate deterministic social media images for HRDevFest speakers and sponsors.
 * Uses Satori (HTML/CSS → SVG) + resvg-js (SVG → PNG) for pixel-perfect rendering.
 *
 * Usage:
 *   yarn generate:social                          # Generate all images
 *   yarn generate:social -- --speakers-only       # Only speakers
 *   yarn generate:social -- --sponsors-only       # Only sponsors
 *   yarn generate:social -- --speaker "Lionel Sapp"
 *   yarn generate:social -- --sponsor "Progress"
 *   yarn generate:social -- --force               # Regenerate existing
 *   yarn generate:social -- --format square       # Only 1080x1080
 *   yarn generate:social -- --format landscape    # Only 1200x630
 *
 * No API key or network connection required.
 */

import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
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
const FORMATS = {
  square: { width: 1080, height: 1080, label: "1:1 square" },
  landscape: { width: 1200, height: 630, label: "landscape" },
};

// ---------------------------------------------------------------------------
// Output directories
// ---------------------------------------------------------------------------
const outBase = resolve(projectRoot, "speaker-social/2026/generated");
const speakersOutDir = resolve(outBase, "speakers");
const sponsorsOutDir = resolve(outBase, "sponsors");
mkdirSync(speakersOutDir, { recursive: true });
mkdirSync(sponsorsOutDir, { recursive: true });

// ---------------------------------------------------------------------------
// Brand colors
// ---------------------------------------------------------------------------
const COLORS = {
  teal: "#00B4D8",
  darkTeal: "#2B5F6D",
  charcoal: "#1A1A2E",
  orange: "#D9531E",
  gray: "#666666",
  white: "#FFFFFF",
  lightGray: "#E0E0E0",
};

const TIER_COLORS = {
  platinum: "#2B5F6D",
  gold: "#D9531E",
  silver: "#666666",
  logo: "#2B5F6D",
};

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

function truncateText(text, maxLen) {
  if (!text || text.length <= maxLen) return text;
  return text.slice(0, maxLen - 1) + "…";
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
// Speaker card template — Square (1080x1080)
// ---------------------------------------------------------------------------
function speakerSquareTemplate(speaker, headshotUri) {
  const title = speaker.sessionTitle || "Speaker at HRDevFest 2026";
  const displayTitle = truncateText(title, 120);

  return {
    type: "div",
    props: {
      style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        height: "100%",
        backgroundColor: COLORS.white,
        fontFamily: "Inter",
        padding: "40px",
      },
      children: [
        // Logo top-left
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              width: "100%",
              justifyContent: "flex-start",
            },
            children: {
              type: "img",
              props: {
                src: logoDataUri,
                width: 160,
                style: { objectFit: "contain" },
              },
            },
          },
        },
        // Speaker badge top-right area (positioned after logo row)
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              width: "100%",
              justifyContent: "flex-end",
              marginTop: "-50px",
            },
            children: {
              type: "div",
              props: {
                style: {
                  backgroundColor: COLORS.orange,
                  color: COLORS.white,
                  fontSize: 14,
                  fontWeight: 700,
                  padding: "8px 24px",
                  borderRadius: 8,
                  textTransform: "uppercase",
                  letterSpacing: 2,
                },
                children: "SPEAKER",
              },
            },
          },
        },
        // Circular headshot
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              justifyContent: "center",
              marginTop: 40,
            },
            children: {
              type: "div",
              props: {
                style: {
                  width: 300,
                  height: 300,
                  borderRadius: 150,
                  border: `4px solid ${COLORS.teal}`,
                  overflow: "hidden",
                  display: "flex",
                },
                children: {
                  type: "img",
                  props: {
                    src: headshotUri,
                    width: 300,
                    height: 300,
                    style: { objectFit: "cover" },
                  },
                },
              },
            },
          },
        },
        // Speaker name
        {
          type: "div",
          props: {
            style: {
              fontSize: 44,
              fontWeight: 700,
              color: COLORS.charcoal,
              marginTop: 30,
              textAlign: "center",
            },
            children: speaker.name,
          },
        },
        // Session title
        {
          type: "div",
          props: {
            style: {
              fontSize: 22,
              color: COLORS.teal,
              marginTop: 12,
              textAlign: "center",
              maxWidth: "85%",
              lineHeight: 1.4,
              display: "flex",
            },
            children: displayTitle,
          },
        },
        // Spacer
        { type: "div", props: { style: { flex: 1 } } },
        // Event info
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
            },
            children: [
              {
                type: "div",
                props: {
                  style: { fontSize: 18, color: COLORS.charcoal },
                  children: "Feb 27, 2026",
                },
              },
              {
                type: "div",
                props: {
                  style: { fontSize: 16, color: COLORS.gray },
                  children: "Virginia Beach, VA",
                },
              },
            ],
          },
        },
        // Website
        {
          type: "div",
          props: {
            style: {
              fontSize: 18,
              color: COLORS.teal,
              marginTop: 12,
            },
            children: "hrdevfest.org",
          },
        },
      ],
    },
  };
}

// ---------------------------------------------------------------------------
// Speaker card template — Landscape (1200x630)
// ---------------------------------------------------------------------------
function speakerLandscapeTemplate(speaker, headshotUri) {
  const title = speaker.sessionTitle || "Speaker at HRDevFest 2026";
  const displayTitle = truncateText(title, 100);

  return {
    type: "div",
    props: {
      style: {
        display: "flex",
        width: "100%",
        height: "100%",
        backgroundColor: COLORS.white,
        fontFamily: "Inter",
        padding: "40px",
      },
      children: [
        // Left column — headshot
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: 380,
              minWidth: 380,
            },
            children: {
              type: "div",
              props: {
                style: {
                  width: 280,
                  height: 280,
                  borderRadius: 140,
                  border: `4px solid ${COLORS.teal}`,
                  overflow: "hidden",
                  display: "flex",
                },
                children: {
                  type: "img",
                  props: {
                    src: headshotUri,
                    width: 280,
                    height: 280,
                    style: { objectFit: "cover" },
                  },
                },
              },
            },
          },
        },
        // Right column — text
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              flexDirection: "column",
              flex: 1,
              paddingLeft: 20,
            },
            children: [
              // Logo
              {
                type: "img",
                props: {
                  src: logoDataUri,
                  width: 140,
                  style: { objectFit: "contain" },
                },
              },
              // Badge
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    marginTop: 20,
                  },
                  children: {
                    type: "div",
                    props: {
                      style: {
                        backgroundColor: COLORS.orange,
                        color: COLORS.white,
                        fontSize: 12,
                        fontWeight: 700,
                        padding: "6px 20px",
                        borderRadius: 6,
                        textTransform: "uppercase",
                        letterSpacing: 2,
                      },
                      children: "SPEAKER",
                    },
                  },
                },
              },
              // Name
              {
                type: "div",
                props: {
                  style: {
                    fontSize: 36,
                    fontWeight: 700,
                    color: COLORS.charcoal,
                    marginTop: 12,
                  },
                  children: speaker.name,
                },
              },
              // Talk title
              {
                type: "div",
                props: {
                  style: {
                    fontSize: 18,
                    color: COLORS.teal,
                    marginTop: 8,
                    lineHeight: 1.4,
                    display: "flex",
                  },
                  children: displayTitle,
                },
              },
              // Spacer
              { type: "div", props: { style: { flex: 1 } } },
              // Event info
              {
                type: "div",
                props: {
                  style: { fontSize: 14, color: COLORS.gray },
                  children: "Feb 27, 2026 | Virginia Beach, VA",
                },
              },
              // Website
              {
                type: "div",
                props: {
                  style: {
                    fontSize: 14,
                    color: COLORS.teal,
                    marginTop: 4,
                  },
                  children: "hrdevfest.org",
                },
              },
            ],
          },
        },
      ],
    },
  };
}

// ---------------------------------------------------------------------------
// Sponsor card template — Square (1080x1080)
// ---------------------------------------------------------------------------
function sponsorSquareTemplate(sponsor, sponsorLogoUri) {
  const tierLabel =
    sponsor.tier.charAt(0).toUpperCase() + sponsor.tier.slice(1);
  const tierColor = TIER_COLORS[sponsor.tier] || TIER_COLORS.logo;

  return {
    type: "div",
    props: {
      style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        height: "100%",
        backgroundColor: COLORS.white,
        fontFamily: "Inter",
        padding: "40px",
      },
      children: [
        // Logo top-left
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              width: "100%",
              justifyContent: "flex-start",
            },
            children: {
              type: "img",
              props: {
                src: logoDataUri,
                width: 160,
                style: { objectFit: "contain" },
              },
            },
          },
        },
        // "THANK YOU" heading
        {
          type: "div",
          props: {
            style: {
              fontSize: 48,
              fontWeight: 700,
              color: COLORS.teal,
              marginTop: 40,
              textTransform: "uppercase",
              letterSpacing: 4,
            },
            children: "THANK YOU",
          },
        },
        // Sponsor logo card
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: 360,
              height: 220,
              backgroundColor: COLORS.white,
              border: `1px solid ${COLORS.lightGray}`,
              borderRadius: 16,
              marginTop: 40,
              padding: 30,
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            },
            children: {
              type: "img",
              props: {
                src: sponsorLogoUri,
                style: {
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                },
              },
            },
          },
        },
        // Sponsor name
        {
          type: "div",
          props: {
            style: {
              fontSize: 28,
              fontWeight: 700,
              color: COLORS.charcoal,
              marginTop: 24,
              textAlign: "center",
            },
            children: sponsor.name,
          },
        },
        // Tier badge
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              marginTop: 16,
            },
            children: {
              type: "div",
              props: {
                style: {
                  backgroundColor: tierColor,
                  color: COLORS.white,
                  fontSize: 14,
                  fontWeight: 700,
                  padding: "8px 28px",
                  borderRadius: 8,
                  textTransform: "uppercase",
                  letterSpacing: 2,
                },
                children: `${tierLabel} Sponsor`,
              },
            },
          },
        },
        // Spacer
        { type: "div", props: { style: { flex: 1 } } },
        // Event info
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
            },
            children: [
              {
                type: "div",
                props: {
                  style: { fontSize: 18, color: COLORS.charcoal },
                  children: "Feb 27, 2026",
                },
              },
              {
                type: "div",
                props: {
                  style: { fontSize: 16, color: COLORS.gray },
                  children: "Virginia Beach, VA",
                },
              },
            ],
          },
        },
        // Website
        {
          type: "div",
          props: {
            style: {
              fontSize: 18,
              color: COLORS.teal,
              marginTop: 12,
            },
            children: "hrdevfest.org",
          },
        },
      ],
    },
  };
}

// ---------------------------------------------------------------------------
// Sponsor card template — Landscape (1200x630)
// ---------------------------------------------------------------------------
function sponsorLandscapeTemplate(sponsor, sponsorLogoUri) {
  const tierLabel =
    sponsor.tier.charAt(0).toUpperCase() + sponsor.tier.slice(1);
  const tierColor = TIER_COLORS[sponsor.tier] || TIER_COLORS.logo;

  return {
    type: "div",
    props: {
      style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        height: "100%",
        backgroundColor: COLORS.white,
        fontFamily: "Inter",
        padding: "30px 40px",
      },
      children: [
        // Top row: logo + tier badge
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
              alignItems: "flex-start",
            },
            children: [
              {
                type: "img",
                props: {
                  src: logoDataUri,
                  width: 130,
                  style: { objectFit: "contain" },
                },
              },
              {
                type: "div",
                props: {
                  style: {
                    backgroundColor: tierColor,
                    color: COLORS.white,
                    fontSize: 12,
                    fontWeight: 700,
                    padding: "6px 20px",
                    borderRadius: 6,
                    textTransform: "uppercase",
                    letterSpacing: 2,
                  },
                  children: `${tierLabel} Sponsor`,
                },
              },
            ],
          },
        },
        // "THANK YOU" heading
        {
          type: "div",
          props: {
            style: {
              fontSize: 40,
              fontWeight: 700,
              color: COLORS.teal,
              marginTop: 20,
              textTransform: "uppercase",
              letterSpacing: 4,
            },
            children: "THANK YOU",
          },
        },
        // Sponsor logo card
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: 300,
              height: 180,
              backgroundColor: COLORS.white,
              border: `1px solid ${COLORS.lightGray}`,
              borderRadius: 12,
              marginTop: 20,
              padding: 24,
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            },
            children: {
              type: "img",
              props: {
                src: sponsorLogoUri,
                style: {
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                },
              },
            },
          },
        },
        // Sponsor name
        {
          type: "div",
          props: {
            style: {
              fontSize: 24,
              fontWeight: 700,
              color: COLORS.charcoal,
              marginTop: 16,
              textAlign: "center",
            },
            children: sponsor.name,
          },
        },
        // Spacer
        { type: "div", props: { style: { flex: 1 } } },
        // Bottom bar: event info + website
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              gap: 24,
              alignItems: "center",
            },
            children: [
              {
                type: "div",
                props: {
                  style: { fontSize: 14, color: COLORS.gray },
                  children: "Feb 27, 2026 | Virginia Beach, VA",
                },
              },
              {
                type: "div",
                props: {
                  style: { fontSize: 14, color: COLORS.teal },
                  children: "hrdevfest.org",
                },
              },
            ],
          },
        },
      ],
    },
  };
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
    const headshotUri = loadImageAsDataUri(headshotPath);

    if (!headshotUri) {
      console.warn(`  WARNING: Missing headshot for ${speaker.name}, skipping`);
      failed++;
      continue;
    }

    const formats = formatFilter ? [formatFilter] : ["square", "landscape"];
    for (const format of formats) {
      const outPath = resolve(speakersOutDir, `${slug}-${format}.png`);
      const { width, height } = FORMATS[format];

      if (existsSync(outPath) && !force) {
        console.log(`  SKIP ${slug}-${format}.png (exists, use --force)`);
        skipped++;
        continue;
      }

      console.log(`  Generating ${slug}-${format}.png (${FORMATS[format].label})...`);

      try {
        const template =
          format === "square"
            ? speakerSquareTemplate(speaker, headshotUri)
            : speakerLandscapeTemplate(speaker, headshotUri);

        const png = await renderToPng(template, width, height);
        writeFileSync(outPath, png);
        generated++;
        console.log(`  OK ${slug}-${format}.png`);
      } catch (err) {
        console.error(`  ERROR generating ${slug}-${format}.png: ${err.message}`);
        failed++;
      }
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
    const sponsorLogoUri = loadImageAsDataUri(logoFilePath);

    if (!sponsorLogoUri) {
      console.warn(
        `  WARNING: Missing logo for ${sponsor.name} (${sponsor.logo}), skipping`
      );
      failed++;
      continue;
    }

    const formats = formatFilter ? [formatFilter] : ["square", "landscape"];
    for (const format of formats) {
      const outPath = resolve(sponsorsOutDir, `${slug}-${format}.png`);
      const { width, height } = FORMATS[format];

      if (existsSync(outPath) && !force) {
        console.log(`  SKIP ${slug}-${format}.png (exists, use --force)`);
        skipped++;
        continue;
      }

      console.log(`  Generating ${slug}-${format}.png (${FORMATS[format].label})...`);

      try {
        const template =
          format === "square"
            ? sponsorSquareTemplate(sponsor, sponsorLogoUri)
            : sponsorLandscapeTemplate(sponsor, sponsorLogoUri);

        const png = await renderToPng(template, width, height);
        writeFileSync(outPath, png);
        generated++;
        console.log(`  OK ${slug}-${format}.png`);
      } catch (err) {
        console.error(`  ERROR generating ${slug}-${format}.png: ${err.message}`);
        failed++;
      }
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

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

  const total = {
    generated: speakerStats.generated + sponsorStats.generated,
    skipped: speakerStats.skipped + sponsorStats.skipped,
    failed: speakerStats.failed + sponsorStats.failed,
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
