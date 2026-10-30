export function normalizePath(pathname: string): string {
  return pathname.replace(/\/+$/, "") || "/";
}

// "2018-11-16" -> "11.16.2018", matching the 2027 title block date style.
export function titleBlockDate(isoDate?: string): string | undefined {
  const match = isoDate?.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return match ? `${match[2]}.${match[3]}.${match[1]}` : undefined;
}
