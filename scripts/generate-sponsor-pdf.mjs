// Renders /sponsor/print from the built site (dist/) to the sponsor sheet PDF linked on /sponsor.
// Run with `yarn generate:sponsor-pdf` (builds first). The output path comes from SPONSOR_SHEET_PDF_HREF.
import { createServer } from "node:http";
import { readFile, readdir, unlink, writeFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { createHash } from "node:crypto";
import { chromium } from "@playwright/test";

const DIST = "dist";
const source = await readFile("src/data/sponsor.ts", "utf8");
const href = source.match(/SPONSOR_SHEET_PDF_HREF = "([^"]+)"/)?.[1];
if (!href) throw new Error("SPONSOR_SHEET_PDF_HREF not found in src/data/sponsor.ts");
const out = join("public", href);
const SOURCE_HASH = "e2e/sponsor-sheet.hash";

const types = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".png": "image/png", ".webp": "image/webp", ".svg": "image/svg+xml", ".jpg": "image/jpeg" };
const server = createServer(async (req, res) => {
  let path = normalize(decodeURIComponent(new URL(req.url, "http://x").pathname)).replace(/^([/\\])+/, "");
  if (!extname(path)) path = join(path, "index.html");
  try {
    res.writeHead(200, { "content-type": types[extname(path)] ?? "application/octet-stream" });
    res.end(await readFile(join(DIST, path)));
  } catch {
    res.writeHead(404).end();
  }
}).listen(0);
const port = server.address().port;

const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  await page.goto(`http://localhost:${port}/sponsor/print`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  // e2e/sponsor.spec.ts compares this hash with the live print page to catch a stale PDF.
  // The footer is left out: its "Updated" date changes daily.
  const text = await page.evaluate(() => document.querySelector("table.layout").textContent.replace(/\s+/g, " ").trim());
  await writeFile(SOURCE_HASH, createHash("sha256").update(text).digest("hex") + "\n");
  await page.pdf({
    path: out,
    format: "Letter",
    printBackground: true,
    preferCSSPageSize: true,
  });
} finally {
  await browser.close();
  server.close();
}

// Only one sponsor sheet ships: remove older dated copies
const dir = join("public", "sponsor");
for (const file of await readdir(dir)) {
  if (file.endsWith(".pdf") && join(dir, file) !== out) await unlink(join(dir, file));
}

// Old sponsor sheet URLs redirect to the current file (Azure Static Web Apps routes)
const swaConfig = join("public", "staticwebapp.config.json");
const config = JSON.parse(await readFile(swaConfig, "utf8"));
for (const route of config.routes ?? []) {
  if (route.route?.startsWith("/sponsor/") && route.route.endsWith(".pdf")) route.redirect = href;
}
await writeFile(swaConfig, JSON.stringify(config, null, 2) + "\n");

console.log(`wrote ${out}`);
