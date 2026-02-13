import { test, expect } from "@playwright/test";

test.describe("Responsive Layout", () => {
  test.describe("mobile viewport", () => {
    test.use({ viewport: { width: 375, height: 667 } });

    test("mobile menu button is visible", async ({ page }) => {
      await page.goto("/");
      const menuBtn = page.locator("#mobile-menu-btn");
      await expect(menuBtn).toBeVisible();
    });

    test("desktop nav links are hidden on mobile", async ({ page }) => {
      await page.goto("/");
      // The desktop nav container should be hidden
      const desktopNav = page.locator("nav .hidden.md\\:flex");
      await expect(desktopNav).toBeHidden();
    });

    test("mobile menu opens and closes", async ({ page }) => {
      await page.goto("/");
      const menuBtn = page.locator("#mobile-menu-btn");
      const mobileMenu = page.locator("#mobile-menu");

      // Menu should start hidden
      await expect(mobileMenu).toBeHidden();

      // Open menu
      await menuBtn.click();
      await expect(mobileMenu).toBeVisible();

      // Close menu
      await menuBtn.click();
      await expect(mobileMenu).toBeHidden();
    });
  });

  test.describe("desktop viewport", () => {
    test.use({ viewport: { width: 1280, height: 720 } });

    test("desktop nav links are visible", async ({ page }) => {
      await page.goto("/");
      const nav = page.locator("nav");
      await expect(nav.getByRole("link", { name: "Speakers" })).toBeVisible();
      await expect(nav.getByRole("link", { name: "Schedule" })).toBeVisible();
    });

    test("mobile menu button is hidden on desktop", async ({ page }) => {
      await page.goto("/");
      const menuBtn = page.locator("#mobile-menu-btn");
      await expect(menuBtn).toBeHidden();
    });
  });
});
