/**
 * Sponsor Card Template — Landscape (1200x630)
 *
 * Fixed layout zones:
 *   - Conference logo top-left (~130px wide)
 *   - Tier badge top-right
 *   - "THANK YOU" header in teal
 *   - Sponsor logo centered in rounded card area
 *   - Sponsor name below logo (Inter Bold, charcoal)
 *   - Bottom bar with date, location, and website URL
 *
 * Visually cohesive with square template (same brand colors, fonts, spacing).
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
 * Build the landscape sponsor card template.
 *
 * @param {object} params
 * @param {object} params.sponsor             - { name, tier }
 * @param {string} params.sponsorLogoUri      - base64 data URI for the sponsor logo (standard/dark variant)
 * @param {string} [params.sponsorLogoWhiteUri] - base64 data URI for the white logo variant (for dark backgrounds)
 * @param {string} params.logoDataUri         - base64 data URI for the conference logo
 * @returns Satori JSX-style object
 */
export function sponsorLandscapeTemplate({ sponsor, sponsorLogoUri, sponsorLogoWhiteUri, logoDataUri }) {
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
