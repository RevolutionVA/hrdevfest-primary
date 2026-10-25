import { test, expect } from "@playwright/test";

const pastYears = ["2026", "2024", "2018", "2017", "2016", "2015"];

// Editions rendered from src/data/archive/<year>.json by src/pages/years/[year].astro
const archiveEditions = [
  { year: "2018", title: "Hampton Roads DevFest 2018", venue: "Slover Library" },
  { year: "2017", title: "Hampton Roads DevFest 2017", venue: "Chesapeake Conference Center" },
  { year: "2016", title: "Hampton Roads DevFest 2016", venue: "Issuetrak" },
  { year: "2015", title: "Hampton Roads DevFest 2015", venue: "Issuetrak" },
];

const pagesWithDesktopNav = [
  "/",
  "/faq",
  "/code-of-conduct",
  "/sponsor",
  "/thank-you",
  "/years/2024",
  "/years/2026",
  ...archiveEditions.map((e) => `/years/${e.year}`),
];

// thank-you has no hamburger menu
const pagesWithMobileMenu = pagesWithDesktopNav.filter((p) => p !== "/thank-you");

test.describe("Past years nav menu", () => {
  test.describe("desktop viewport", () => {
    test.use({ viewport: { width: 1280, height: 720 } });

    for (const path of pagesWithDesktopNav) {
      test(`${path} shows a Past years dropdown with every past edition`, async ({ page }) => {
        await page.goto(path);
        const nav = page.locator("nav");
        const toggle = nav.locator("summary", { hasText: "Past years" });

        await expect(toggle).toBeVisible();
        for (const year of pastYears) {
          await expect(nav.getByRole("link", { name: year, exact: true })).toBeHidden();
        }

        await toggle.click();
        for (const year of pastYears) {
          const link = nav.getByRole("link", { name: year, exact: true });
          await expect(link).toBeVisible();
          await expect(link).toHaveAttribute("href", `/years/${year}`);
        }
      });
    }

    test("dropdown closes on Escape and on outside click", async ({ page }) => {
      await page.goto("/faq");
      const nav = page.locator("nav");
      const toggle = nav.locator("summary", { hasText: "Past years" });
      const link2024 = nav.getByRole("link", { name: "2024", exact: true });

      await toggle.click();
      await expect(link2024).toBeVisible();
      await page.keyboard.press("Escape");
      await expect(link2024).toBeHidden();
      await expect(toggle).toBeFocused();

      await toggle.click();
      await expect(link2024).toBeVisible();
      await page.locator("footer").click({ position: { x: 5, y: 5 } });
      await expect(link2024).toBeHidden();
    });

    test("dropdown link navigates to the archive page", async ({ page }) => {
      await page.goto("/");
      const nav = page.locator("nav");
      await nav.locator("summary", { hasText: "Past years" }).click();
      await nav.getByRole("link", { name: "2024", exact: true }).click();
      await expect(page).toHaveURL(/\/years\/2024\/?$/);

      // The current edition is marked in the dropdown
      await page.locator("nav summary", { hasText: "Past years" }).click();
      await expect(
        page.locator("nav").getByRole("link", { name: "2024", exact: true })
      ).toHaveAttribute("aria-current", "page");
    });
  });

  test.describe("mobile viewport", () => {
    test.use({ viewport: { width: 375, height: 667 } });

    for (const path of pagesWithMobileMenu) {
      test(`${path} hamburger menu lists past years under a label`, async ({ page }) => {
        await page.goto(path);
        await page.locator("#mobile-menu-btn").click();
        const mobileMenu = page.locator("#mobile-menu");
        await expect(mobileMenu).toBeVisible();

        await expect(mobileMenu.getByText("Past years", { exact: true })).toBeVisible();
        const yearList = mobileMenu.getByRole("list", { name: "Past years" });
        for (const year of pastYears) {
          const link = yearList.getByRole("link", { name: year, exact: true });
          await expect(link).toBeVisible();
          await expect(link).toHaveAttribute("href", `/years/${year}`);
        }
      });
    }

    test("tapping a year closes the menu and navigates", async ({ page }) => {
      await page.goto("/");
      await page.locator("#mobile-menu-btn").click();
      await page
        .locator("#mobile-menu")
        .getByRole("link", { name: "2026", exact: true })
        .click();
      await expect(page).toHaveURL(/\/years\/2026\/?$/);
    });
  });
});

test.describe("Archive edition pages", () => {
  for (const edition of archiveEditions) {
    test(`/years/${edition.year} loads with its title and venue`, async ({ page }) => {
      const response = await page.goto(`/years/${edition.year}`);
      expect(response?.ok()).toBe(true);

      await expect(page).toHaveTitle(new RegExp(edition.title));
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(edition.title);
      await expect(page.locator("#venue")).toContainText(edition.venue);
    });
  }

  test("/years/2018 does not show the talk count", async ({ page }) => {
    await page.goto("/years/2018");
    await expect(page.locator("body")).not.toContainText("9 talks");
  });
});
