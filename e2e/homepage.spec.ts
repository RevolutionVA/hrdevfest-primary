import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("has correct title", async ({ page }) => {
    await expect(page).toHaveTitle(/Hampton Roads DevFest/);
  });

  test("hero section is visible with event details", async ({ page }) => {
    const hero = page.locator(".hero-section");
    await expect(hero).toBeVisible();
    await expect(
      hero.getByRole("heading", { level: 1, name: "Hampton Roads DevFest 2027" })
    ).toBeVisible();
    await expect(hero.getByText(/Apr 23, 2027/)).toBeVisible();
    await expect(hero.getByText(/Zeiders American Dream Theater, Virginia Beach/)).toBeVisible();
  });

  test("shows the confirmed 2027 venue", async ({ page }) => {
    const venue = page.locator("#venue");
    await expect(venue.getByText("Zeiders American Dream Theater")).toBeVisible();
    await expect(
      venue.getByText("Our confirmed venue for Hampton Roads DevFest 2027.")
    ).toBeVisible();
  });

  test("hero has signup CTA button", async ({ page }) => {
    // Exclude mobile menu links which are hidden
    await expect(
      page.locator(".hero-section a.btn-primary:not(.mobile-menu-link)").first()
    ).toBeVisible();
  });

  test("sponsor 2027 CTA is visible", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "Sponsor DevFest 2027" })
    ).toBeVisible();
  });

  test("footer is visible with social links", async ({ page }) => {
    const footer = page.locator("footer");
    await expect(footer).toBeVisible();
    await expect(footer.getByText(/RevolutionVA/)).toBeVisible();
    await expect(footer.locator("a[href*='x.com/hrdevfest']")).toBeVisible();
  });

  test("testimonials show Paul, Kristina, Michael, then Travis, each with a photo", async ({ page }) => {
    await page.goto("/");
    const names = await page.locator("#testimonials .bp-label").allTextContents();
    expect(names).toEqual(["Paul Chin Jr.", "Kristina Krasnolobova", "Michael Buckbee", "Travis Webb"]);
    await expect(page.locator("#testimonials img")).toHaveCount(4);
    await expect(page.locator('#testimonials img[alt="Kristina Krasnolobova"]')).toBeVisible();
  });
});
