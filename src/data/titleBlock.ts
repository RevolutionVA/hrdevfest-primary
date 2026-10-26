// Fixed sheet order for every page that renders the footer title block.
// The row label is "Sheet", so the value reads "N of M" (shown as "N OF M").
export const sheetOrder = [
  "/",
  "/sponsor",
  "/faq",
  "/code-of-conduct",
  "/thank-you",
  "/events",
  "/2026",
  "/2024",
  "/2018",
  "/2017",
  "/2016",
  "/2015",
];

export function normalizePath(pathname: string): string {
  return pathname.replace(/\/+$/, "") || "/";
}

export function sheetFor(pathname: string): string | undefined {
  const index = sheetOrder.indexOf(normalizePath(pathname));
  return index === -1 ? undefined : `${index + 1} of ${sheetOrder.length}`;
}

// "2018-11-16" -> "11.16.2018", matching the 2027 title block date style.
export function titleBlockDate(isoDate?: string): string | undefined {
  const match = isoDate?.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return match ? `${match[2]}.${match[3]}.${match[1]}` : undefined;
}
