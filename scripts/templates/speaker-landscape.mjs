/**
 * Speaker Card Template — Landscape (1200x630)
 *
 * Two-column layout:
 *   - Left column: circular headshot (280px diameter, teal border)
 *   - Right column: logo, "SPEAKER" badge, name, session title, event info
 *   - Bottom bar with date, location, and website URL
 *
 * Visually cohesive with square template (same brand colors, fonts, spacing).
 */

const COLORS = {
  teal: "#00B4D8",
  charcoal: "#1A1A2E",
  orange: "#D9531E",
  gray: "#666666",
  white: "#FFFFFF",
};

/**
 * Pick a font size for the speaker name so long names don't overflow.
 * Landscape has less horizontal room than square, so thresholds are tighter.
 */
function nameFontSize(name) {
  if (name.length <= 18) return 36;
  if (name.length <= 24) return 30;
  if (name.length <= 30) return 26;
  return 22;
}

/**
 * Truncate text to a max character count with ellipsis.
 */
function truncateText(text, maxLen) {
  if (!text || text.length <= maxLen) return text;
  return text.slice(0, maxLen - 1) + "\u2026";
}

/**
 * Build the landscape speaker card template.
 *
 * @param {object} params
 * @param {object} params.speaker    - { name, sessionTitle }
 * @param {string} params.headshotUri - base64 data URI for the headshot
 * @param {string} params.logoDataUri - base64 data URI for the conference logo
 * @returns Satori JSX-style object
 */
export function speakerLandscapeTemplate({ speaker, headshotUri, logoDataUri }) {
  const title = speaker.sessionTitle || "Speaker at HRDevFest 2026";
  const displayTitle = truncateText(title, 100);
  const fontSize = nameFontSize(speaker.name);

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
        // Left column — circular headshot
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
        // Right column — text content
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
              // Top row: logo left, badge right
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
                        width: 140,
                        style: { objectFit: "contain" },
                      },
                    },
                    {
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
                  ],
                },
              },
              // Speaker name (auto-shrink for long names)
              {
                type: "div",
                props: {
                  style: {
                    fontSize,
                    fontWeight: 700,
                    color: COLORS.charcoal,
                    marginTop: 20,
                  },
                  children: speaker.name,
                },
              },
              // Session title (max 2 lines, teal, ellipsis overflow)
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
