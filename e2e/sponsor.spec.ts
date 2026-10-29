import { test, expect } from "@playwright/test";

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
