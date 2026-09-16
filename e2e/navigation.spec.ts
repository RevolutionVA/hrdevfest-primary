import { test, expect } from "@playwright/test";

test.describe("Site Navigation", () => {
  test("speakers route loads the 2026 archive", async ({ page }) => {
    await page.goto("/speakers");
    await expect(page).toHaveURL(/\/years\/2026\/?$/);
    await expect(page).toHaveTitle(/Hampton Roads DevFest 2026/);
    await expect(
      page.getByRole("heading", { name: "2026 Speakers" })
    ).toBeVisible();
  });

  test("schedule route loads the 2026 archive", async ({ page }) => {
    await page.goto("/schedule");
    await expect(page).toHaveURL(/\/years\/2026\/?$/);
    await expect(page).toHaveTitle(/Hampton Roads DevFest 2026/);
    await expect(
      page.getByRole("heading", { name: "2026 Schedule" })
    ).toBeVisible();
  });

  test("FAQ page loads with FAQ categories", async ({ page }) => {
    await page.goto("/faq");
    await expect(page).toHaveTitle(/FAQ.*Hampton Roads DevFest/);
    await expect(
      page.getByRole("heading", { name: "General" })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Tickets" })
    ).toBeVisible();
  });

  test("2024 archive page loads", async ({ page }) => {
    await page.goto("/years/2024");
    await expect(page).toHaveTitle(/Hampton Roads DevFest.*2024/);
  });
});

