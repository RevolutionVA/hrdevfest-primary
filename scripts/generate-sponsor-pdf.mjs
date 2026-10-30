// Renders /sponsor/print from the built site (dist/) to the sponsor sheet PDF linked on /sponsor.
// Run with `yarn sponsor-pdf` (builds first). The output path comes from SPONSOR_SHEET_PDF_HREF.
import { createServer } from "node:http";
import { readFile, readdir, unlink } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { chromium } from "@playwright/test";

const DIST = "dist";
const source = await readFile("src/data/sponsor.ts", "utf8");
const href = source.match(/SPONSOR_SHEET_PDF_HREF = "([^"]+)"/)?.[1];
if (!href) throw new Error("SPONSOR_SHEET_PDF_HREF not found in src/data/sponsor.ts");
const out = join("public", href);

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
  const footerTemplate = await page.$eval("#pdf-footer", (el) => el.innerHTML);
  await page.pdf({
    path: out,
    format: "Letter",
    printBackground: true,
    preferCSSPageSize: true,
    displayHeaderFooter: true,
    headerTemplate: "<span></span>",
    footerTemplate,
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
console.log(`wrote ${out}`);
