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
    await expect(hero.getByText("Hampton Roads DevFest 2027")).toBeVisible();
    await expect(hero.getByText(/Dates coming soon/)).toBeVisible();
  });

  test("hero has Notify Me button", async ({ page }) => {
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
});
