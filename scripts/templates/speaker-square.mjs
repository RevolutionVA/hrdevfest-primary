/**
 * Speaker Card Template — Square (1080x1080)
 *
 * Fixed layout zones:
 *   - Conference logo top-left (~160px wide)
 *   - Orange "SPEAKER" badge top-right
 *   - Circular headshot centered (300px diameter, teal border)
 *   - Speaker name centered below avatar (Inter Bold, charcoal)
 *   - Session title centered below name (Inter Regular, teal, max 2-3 lines)
 *   - Event info bar at bottom
 *   - Website URL in teal
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
 * Names ≤ 18 chars get the full 44px; longer names shrink down to 30px.
 */
function nameFontSize(name) {
  if (name.length <= 18) return 44;
  if (name.length <= 24) return 38;
  if (name.length <= 30) return 34;
  return 30;
}

/**
 * Truncate text to a max character count with ellipsis.
 */
function truncateText(text, maxLen) {
  if (!text || text.length <= maxLen) return text;
  return text.slice(0, maxLen - 1) + "\u2026";
}

/**
 * Build the square speaker card template.
 *
 * @param {object} params
 * @param {object} params.speaker    - { name, sessionTitle }
 * @param {string} params.headshotUri - base64 data URI for the headshot
 * @param {string} params.logoDataUri - base64 data URI for the conference logo
 * @returns Satori JSX-style object
 */
export function speakerSquareTemplate({ speaker, headshotUri, logoDataUri }) {
  const title = speaker.sessionTitle || "Speaker at HRDevFest 2026";
  const displayTitle = truncateText(title, 120);
  const fontSize = nameFontSize(speaker.name);

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
                  width: 160,
                  style: { objectFit: "contain" },
                },
              },
              {
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
            ],
          },
        },
        // Circular headshot (300px, teal border, objectFit cover)
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
        // Speaker name (auto-shrink for long names)
        {
          type: "div",
          props: {
            style: {
              fontSize,
              fontWeight: 700,
              color: COLORS.charcoal,
              marginTop: 30,
              textAlign: "center",
              maxWidth: "90%",
            },
            children: speaker.name,
          },
        },
        // Session title (max 2-3 lines, teal, ellipsis overflow)
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
        // Event info bar
        {
          type: "div",
          props: {
            style: {
              fontSize: 18,
              color: COLORS.charcoal,
            },
            children: "Feb 27, 2026 | Virginia Beach, VA",
          },
        },
        // Website URL
        {
          type: "div",
          props: {
            style: {
              fontSize: 18,
              color: COLORS.teal,
              marginTop: 8,
            },
            children: "hrdevfest.org",
          },
        },
      ],
    },
  };
}
