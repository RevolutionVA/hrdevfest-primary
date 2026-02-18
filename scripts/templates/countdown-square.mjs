/**
 * Countdown Card Template — Square (1080x1080)
 *
 * Fixed layout zones:
 *   - Conference logo top-left (~220px wide)
 *   - Teal "COUNTDOWN" badge top-right
 *   - Large countdown number centered (bold, teal)
 *   - "DAYS TO GO" label below number
 *   - Event name and date below
 *   - Event info bar at bottom
 *   - Website URL in teal
 *
 * Special cases:
 *   - 1 day: "DAY TO GO" (singular) + "TOMORROW!" accent
 *   - 0 days: "IT'S TODAY!" instead of number
 */

const COLORS = {
  teal: "#00B4D8",
  charcoal: "#1A1A2E",
  orange: "#D9531E",
  gray: "#666666",
  white: "#FFFFFF",
};

/**
 * Build the square countdown card template.
 *
 * @param {object} params
 * @param {number} params.daysLeft    - Number of days until the event
 * @param {string} params.logoDataUri - base64 data URI for the conference logo
 * @returns Satori JSX-style object
 */
export function countdownSquareTemplate({ daysLeft, logoDataUri }) {
  const isToday = daysLeft === 0;
  const isTomorrow = daysLeft === 1;

  // Badge text
  const badgeText = isToday ? "TODAY" : "COUNTDOWN";
  const badgeColor = isToday ? COLORS.orange : COLORS.teal;

  // Main number or text
  const mainText = isToday ? "IT'S" : String(daysLeft);
  const mainSize = isToday ? 120 : 220;

  // Subtitle
  const subtitle = isToday
    ? "DEVFEST DAY!"
    : isTomorrow
      ? "DAY TO GO"
      : "DAYS TO GO";

  // Accent line (optional)
  const accentText = isTomorrow ? "SEE YOU TOMORROW!" : null;

  const children = [
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
              width: 220,
              style: { objectFit: "contain" },
            },
          },
          {
            type: "div",
            props: {
              style: {
                backgroundColor: badgeColor,
                color: COLORS.white,
                fontSize: 20,
                fontWeight: 700,
                padding: "12px 32px",
                borderRadius: 8,
                textTransform: "uppercase",
                letterSpacing: 2,
              },
              children: badgeText,
            },
          },
        ],
      },
    },
    // Spacer (top)
    { type: "div", props: { style: { flex: 1 } } },
    // Big countdown number
    {
      type: "div",
      props: {
        style: {
          fontSize: mainSize,
          fontWeight: 700,
          color: COLORS.teal,
          lineHeight: 1,
        },
        children: mainText,
      },
    },
    // "DAYS TO GO" label
    {
      type: "div",
      props: {
        style: {
          fontSize: 48,
          fontWeight: 700,
          color: COLORS.charcoal,
          marginTop: 8,
          textTransform: "uppercase",
          letterSpacing: 4,
        },
        children: subtitle,
      },
    },
  ];

  // Accent line if applicable
  if (accentText) {
    children.push({
      type: "div",
      props: {
        style: {
          fontSize: 28,
          fontWeight: 700,
          color: COLORS.orange,
          marginTop: 20,
          letterSpacing: 2,
        },
        children: accentText,
      },
    });
  }

  // Event name
  children.push({
    type: "div",
    props: {
      style: {
        fontSize: 28,
        color: COLORS.gray,
        marginTop: accentText ? 16 : 32,
      },
      children: "Hampton Roads DevFest",
    },
  });

  // Spacer (bottom)
  children.push({ type: "div", props: { style: { flex: 1 } } });

  // Event info bar
  children.push({
    type: "div",
    props: {
      style: {
        fontSize: 18,
        color: COLORS.charcoal,
      },
      children: "Feb 27, 2026 | Virginia Beach, VA",
    },
  });

  // Website URL
  children.push({
    type: "div",
    props: {
      style: {
        fontSize: 18,
        color: COLORS.teal,
        marginTop: 8,
      },
      children: "hrdevfest.org",
    },
  });

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
      children,
    },
  };
}
