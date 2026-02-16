/**
 * Sponsor Card Template — Square (1080x1080)
 *
 * Fixed layout zones:
 *   - Conference logo top-left (~160px wide)
 *   - "THANK YOU" header in teal
 *   - Sponsor logo centered in rounded card area
 *   - Sponsor name below logo (Inter Bold, charcoal)
 *   - Tier badge colored by tier level
 *   - Event info bar at bottom
 *   - Website URL in teal
 */

const COLORS = {
  teal: "#00B4D8",
  charcoal: "#1A1A2E",
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

/**
 * Build the square sponsor card template.
 *
 * @param {object} params
 * @param {object} params.sponsor             - { name, tier }
 * @param {string} params.sponsorLogoUri      - base64 data URI for the sponsor logo (standard/dark variant)
 * @param {string} [params.sponsorLogoWhiteUri] - base64 data URI for the white logo variant (for dark backgrounds)
 * @param {string} params.logoDataUri         - base64 data URI for the conference logo
 * @returns Satori JSX-style object
 */
export function sponsorSquareTemplate({ sponsor, sponsorLogoUri, sponsorLogoWhiteUri, logoDataUri }) {
  // Select logo variant based on template background color.
  // White/light background → standard logo; dark background → white variant (if available).
  const BACKGROUND = COLORS.white;
  const isDarkBackground = BACKGROUND !== COLORS.white;
  const effectiveLogoUri = isDarkBackground && sponsorLogoWhiteUri ? sponsorLogoWhiteUri : sponsorLogoUri;
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
        // Top row: logo left, tier badge right
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
            ],
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
                src: effectiveLogoUri,
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
