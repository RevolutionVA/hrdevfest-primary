import { test, expect } from "@playwright/test";

test.describe("Site Navigation", () => {
  test("speakers page loads with speaker cards", async ({ page }) => {
    await page.goto("/speakers");
    await expect(page).toHaveTitle(/Speakers.*Hampton Roads DevFest/);
    await expect(
      page.getByRole("heading", { name: "Featured Speakers" })
    ).toBeVisible();
    const speakerCards = page.locator(".card-asymmetric");
    expect(await speakerCards.count()).toBeGreaterThan(0);
  });

  test("schedule page loads with schedule items", async ({ page }) => {
    await page.goto("/schedule");
    await expect(page).toHaveTitle(/Schedule.*Hampton Roads DevFest/);
    await expect(
      page.getByRole("heading", { name: "Schedule" })
    ).toBeVisible();
    await expect(page.getByText("8:00 AM")).toBeVisible();
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
