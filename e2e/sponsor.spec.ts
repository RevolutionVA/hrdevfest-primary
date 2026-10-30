import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";

test.describe("Sponsor Page", () => {
  test("sponsor page loads with the heading and Community callout", async ({ page }) => {
    await page.goto("/sponsor");
    await expect(page).toHaveTitle(/Sponsor.*Hampton Roads DevFest 2027/);
    await expect(
      page.getByRole("heading", { level: 1, name: "Sponsor Hampton Roads DevFest 2027" })
    ).toBeVisible();
    await expect(page.getByText("NOT FINAL: draft prospectus, details may change.")).toHaveCount(0);
    await expect(
      page.getByRole("heading", { name: "Small team? Sponsor for $500." }).first()
    ).toBeVisible();
    // Full label on desktop, short label on narrow viewports
    await expect(
      page.getByRole("link", { name: /Community \(\$500\)/ }).first()
    ).toBeVisible();
  });

  test("Become a Sponsor goes to the reservation form, which posts to Bento", async ({ page }) => {
    await page.goto("/sponsor");
    await page.getByRole("link", { name: "Become a Sponsor" }).first().click();
    await expect(page).toHaveURL(/#reserve$/);
    const form = page.locator("#reserve form");
    await expect(form).toHaveAttribute("action", /track\.bentonow\.com\/forms\/.+\/\$sponsorHoldHRDevFest/);
    const origin = new URL(page.url()).origin;
    await expect(form.locator('input[name="redirect"]')).toHaveValue(`${origin}/sponsor/thank-you`);
    await expect(page.getByRole("button", { name: "Hold my package" })).toBeVisible();
  });

  test("a real submit posts the form fields to Bento with a same-host redirect", async ({ page }) => {
    let posted: { url: string; method: string; body: string } | undefined;
    await page.route("**/track.bentonow.com/forms/**", (route) => {
      const request = route.request();
      posted = { url: request.url(), method: request.method(), body: request.postData() ?? "" };
      return route.abort();
    });
    await page.goto("/sponsor#reserve");
    const origin = new URL(page.url()).origin;
    const form = page.locator("#reserve form");
    await form.locator('[name="fields_first_name"]').fill("Test");
    await form.locator('[name="fields_last_name"]').fill("Person");
    await form.locator('[name="email"]').fill("test@example.com");
    await form.locator('[name="fields_company"]').fill("Example");
    await form.locator('[name="fields_package"]').selectOption({ index: 1 });
    await page.getByRole("button", { name: "Hold my package" }).click();
    await expect.poll(() => posted).toBeDefined();
    expect(posted!.method).toBe("POST");
    expect(posted!.url).toContain("/forms/57d9b8196b2b704a30da5ac245bf2cfe/$sponsorHoldHRDevFest?hardened=true");
    for (const field of ["email", "fields_first_name", "fields_last_name", "fields_company", "fields_package", "redirect"]) {
      expect(posted!.body).toContain(`name="${field}"`);
    }
    expect(posted!.body).toContain(`${origin}/sponsor/thank-you`);
    expect(posted!.body).not.toContain('name="website"');
    expect(posted!.body.match(/name="fields_newsletter_opt_in"\r\n\r\n(\w+)/g)).toEqual([
      'name="fields_newsletter_opt_in"\r\n\r\nno',
    ]);
  });

  test("newsletter opt-in is unchecked by default and sends yes when checked", async ({ page }) => {
    let body = "";
    await page.route("**/track.bentonow.com/forms/**", (route) => {
      body = route.request().postData() ?? "";
      return route.abort();
    });
    await page.goto("/sponsor#reserve");
    const form = page.locator("#reserve form");
    const optIn = form.getByRole("checkbox", { name: "Add me to the 757tech newsletter" });
    await expect(optIn).not.toBeChecked();
    const link = form.getByRole("link", { name: "757tech" });
    await expect(link).toHaveAttribute("href", "https://757tech.org");
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", /noopener/);
    await form.locator('[name="fields_first_name"]').fill("Test");
    await form.locator('[name="fields_last_name"]').fill("Person");
    await form.locator('[name="email"]').fill("test@example.com");
    await form.locator('[name="fields_company"]').fill("Example");
    await form.locator('[name="fields_package"]').selectOption({ index: 1 });
    await optIn.check();
    await page.getByRole("button", { name: "Hold my package" }).click();
    await expect.poll(() => body).not.toBe("");
    expect(body.match(/name="fields_newsletter_opt_in"\r\n\r\n(\w+)/g)).toEqual([
      'name="fields_newsletter_opt_in"\r\n\r\nyes',
    ]);
  });

  test("the $1,500 Exhibitor package is gone and tables start at $2,500", async ({ page }) => {
    await page.goto("/sponsor");
    await expect(page.locator("body")).not.toContainText("Exhibitor");
    const tableGroup = page.locator("#at-a-glance div").filter({
      has: page.getByRole("heading", { name: "Featured, Main Stage and Presenting also include:" }),
    }).last();
    await expect(tableGroup.locator("li").filter({ hasText: /^A sponsor table$/ })).toHaveCount(1);
    const options = await page.locator('#reserve select[name="fields_package"] option').allTextContents();
    expect(options).toContain("Featured Sponsor ($2,500)");
    expect(options.some((o) => o.includes("Exhibitor"))).toBe(false);
  });

  test("the Pop-up Series Partner is $1,500 on the page, the form and the print sheet", async ({ page }) => {
    await page.goto("/sponsor");
    const options = await page.locator('#reserve select[name="fields_package"] option').allTextContents();
    expect(options).toContain("Pop-up Series Partner ($1,500)");
    expect(options.filter((o) => o.includes("1,500"))).toEqual(["Pop-up Series Partner ($1,500)"]);
    const row = page.locator("#partnerships tr").filter({ hasText: "Pop-up Series Partner" });
    await expect(row).toContainText("$1,500");
    await page.goto("/sponsor/print");
    await expect(page.locator("table:not(.layout) tr").filter({ hasText: "Pop-up Series" })).toContainText("$1,500");
  });

  test("additional benefits are a bulleted list, one benefit per bullet", async ({ page }) => {
    await page.goto("/sponsor");
    const lists = page.locator("#at-a-glance ul.list-disc:visible").filter({ hasText: "Newsletter feature" });
    const list = lists.first();
    await expect(list).toHaveCSS("list-style-type", "disc");
    await expect(list.locator("> li").filter({ hasText: /^Newsletter feature$/ })).toHaveCount(1);
    await expect(list.locator("> li").filter({ hasText: /^4 dedicated social posts$/ })).toHaveCount(1);
  });

  test("package and partnership notes are bulleted lists under their tables", async ({ page }) => {
    await page.goto("/sponsor");
    for (const [section, heading, item] of [
      ["#at-a-glance", "Every package includes:", "The post-event report"],
      ["#partnerships", "Every partnership includes:", "The tickets shown"],
    ]) {
      const h = page.locator(section).getByRole("heading", { name: heading });
      await expect(h).toBeVisible();
      const list = h.locator("xpath=following-sibling::ul[1]");
      await expect(list).toHaveCSS("list-style-type", "disc");
      await expect(list.locator("li").filter({ hasText: new RegExp(`^${item}$`) })).toHaveCount(1);
      // notes sit below the table, not above it
      const table = page.locator(`${section} table`);
      const tableBox = await table.boundingBox();
      const hBox = await h.boundingBox();
      if (tableBox) expect(hBox!.y).toBeGreaterThan(tableBox.y);
    }
    const partnerList = page.locator("#partnerships ul:visible").filter({ hasText: "Reception signage" }).first();
    await expect(partnerList).toHaveCSS("list-style-type", "disc");
  });

  test("one Download PDF link, pointing at the printer-friendly sheet", async ({ page, request }) => {
    await page.goto("/sponsor");
    const pdfLinks = page.locator('a[href$=".pdf"]');
    await expect(pdfLinks).toHaveCount(1);
    await expect(pdfLinks).toHaveText("Download PDF");
    await expect(page.getByText(/Printer-friendly version|Download the Prospectus/)).toHaveCount(0);
    const href = await pdfLinks.getAttribute("href");
    expect(href).toMatch(/^\/sponsor\/hrdevfest-2027-sponsor-sheet-\d{4}-\d{2}-\d{2}\.pdf$/);
    const res = await request.get(href!);
    expect(res.ok()).toBe(true);
    expect(res.headers()["content-type"]).toContain("pdf");
  });

  test("old sponsor PDF URLs redirect to the current sheet", async ({ page, request }) => {
    await page.goto("/sponsor");
    const href = await page.locator('a[href$=".pdf"]').getAttribute("href");
    const config = await (await request.get("/staticwebapp.config.json")).json();
    for (const old of [
      "/sponsor/hrdevfest-2027-sponsor-sheet-2026-10-28.pdf",
      "/sponsor/hrdevfest-2027-sponsor-sheet-print-2026-10-28.pdf",
    ]) {
      const route = config.routes.find((r: { route: string }) => r.route === old);
      expect(route).toMatchObject({ redirect: href, statusCode: 302 });
    }
  });

  test("the sponsor PDF is up to date with the printable sheet page", async ({ page }) => {
    await page.goto("/sponsor/print");
    const text = await page.evaluate(() => document.querySelector("table.layout")!.textContent!.replace(/\s+/g, " ").trim());
    const expected = readFileSync("e2e/sponsor-sheet.hash", "utf8").trim();
    expect(
      createHash("sha256").update(text).digest("hex"),
      "Sponsor copy changed: run `yarn generate:sponsor-pdf` and commit the new PDF"
    ).toBe(expected);
  });

  test("printable sheet page matches the site copy and stays out of search", async ({ page }) => {
    await page.goto("/sponsor/print");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex");
    const body = page.locator("body");
    await expect(body).toContainText("Hampton Roads DevFest started with a simple idea.");
    await expect(body).toContainText("The day (tentative schedule)");
    await expect(body).toContainText("Every package includes:");
    await expect(body).not.toContainText("Exhibitor");
    await expect(body).not.toContainText("Stripe");
    await expect(body).not.toContainText("Who the Reception Partner hosts");
  });

  test("why sponsor leads with Kevin's copy", async ({ page }) => {
    await page.goto("/sponsor");
    await expect(page.locator("#why-sponsor")).toContainText(
      "Real tech companies back DevFest, and sponsoring shows your commitment to a strong, growing 757 tech community."
    );
  });

  test("sponsor FAQ answers are plain paragraphs with Kevin's payment answer", async ({ page }) => {
    for (const path of ["/sponsor", "/sponsor/print"]) {
      await page.goto(path);
      const faq = path === "/sponsor" ? page.locator("#sponsor-faq") : page.locator(".faq");
      await expect(faq.locator("li li, details li, .box li")).toHaveCount(0);
      await expect(faq).toContainText(
        "All sponsors can pay by credit card, check, or ACH. We will hold your sponsorship for 30 days unless we agree on a future payment date. Logos and promotion won't start until payment is received in full."
      );
      await expect(faq).not.toContainText("Community checkout is a flat $500");
      await expect(faq).not.toContainText("In-kind support");
    }
  });

  test("the FAQ explains the Who's hiring board in one paragraph", async ({ page }) => {
    await page.goto("/sponsor");
    const entry = page.locator("#sponsor-faq details").filter({ hasText: "What is the Who's hiring board?" });
    await expect(entry.locator("p")).toHaveCount(1);
    await expect(entry).toContainText("Every package at $2,500 and up includes a listing");
    await expect(entry).toContainText("every role must include an expected salary range");
  });

  test("reservation form has no budget-year or PO fields", async ({ page }) => {
    await page.goto("/sponsor");
    const form = page.locator("#reserve form");
    await expect(form.locator('[name="fields_pay_year"], [name="fields_po_required"]')).toHaveCount(0);
    await expect(form.getByRole("link", { name: "Privacy Policy" })).toHaveAttribute("href", "https://revolutionva.org/privacy/");
  });

  test("a filled honeypot skips Bento and goes to the thank-you page", async ({ page }) => {
    let bentoPosted = false;
    await page.route("**/track.bentonow.com/forms/**", (route) => {
      bentoPosted = true;
      return route.abort();
    });
    await page.goto("/sponsor#reserve");
    const form = page.locator("#reserve form");
    await form.locator('[name="fields_first_name"]').fill("Test");
    await form.locator('[name="fields_last_name"]').fill("Bot");
    await form.locator('[name="email"]').fill("bot@example.com");
    await form.locator('[name="fields_company"]').fill("Example");
    await form.locator('[name="fields_package"]').selectOption({ index: 1 });
    await form.locator("[data-honeypot]").fill("spam", { force: true });
    await page.getByRole("button", { name: "Hold my package" }).click();
    await expect(page).toHaveURL(/\/sponsor\/thank-you\/?$/);
    expect(bentoPosted).toBe(false);
  });

  test("schedule shows sponsor time without horizontal scrolling", async ({ page }) => {
    await page.goto("/sponsor#the-day");
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
    await expect(page.locator("#the-day :text(\"Sponsor time\"):visible").first()).toBeVisible();
  });

  test("sponsor thank-you page loads", async ({ page }) => {
    await page.goto("/sponsor/thank-you");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });
});
