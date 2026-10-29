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
    await expect(form.locator('input[name="redirect"]')).toHaveValue("https://hrdevfest.org/sponsor/thank-you");
    await expect(page.getByRole("button", { name: "Hold my package" })).toBeVisible();
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
