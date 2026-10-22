import { test, expect } from "@playwright/test";

test.describe("Site Navigation", () => {
  test("speakers route redirects to 2026 page", async ({ page }) => {
    await page.goto("/speakers");
    await expect(page).toHaveURL(/\/2026\/?$/);
    await expect(page).toHaveTitle(/Hampton Roads DevFest 2026/);
    await expect(
      page.getByRole("heading", { name: "2026 Speakers" })
    ).toBeVisible();
  });

  test("schedule route redirects to 2026 page", async ({ page }) => {
    await page.goto("/schedule");
    await expect(page).toHaveURL(/\/2026\/?$/);
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

  test("2024 archive page loads via redirect", async ({ page }) => {
    await page.goto("/years/2024");
    await expect(page).toHaveURL(/\/2024\/?$/);
    await expect(page).toHaveTitle(/Hampton Roads DevFest.*2024/);
  });

  test("2024 page loads directly", async ({ page }) => {
    await page.goto("/2024");
    await expect(page).toHaveTitle(/Hampton Roads DevFest.*2024/);
  });

  test("archive years are accessible", async ({ page }) => {
    await page.goto("/2015");
    await expect(page).toHaveTitle(/Hampton Roads DevFest 2015/);
    
    await page.goto("/2016");
    await expect(page).toHaveTitle(/Hampton Roads DevFest 2016/);
    
    await page.goto("/2017");
    await expect(page).toHaveTitle(/Hampton Roads DevFest 2017/);
    
    await page.goto("/2018");
    await expect(page).toHaveTitle(/Hampton Roads DevFest 2018/);
  });

  test("past events index page loads", async ({ page }) => {
    await page.goto("/events");
    await expect(page).toHaveTitle(/Past Events/);
    await expect(
      page.getByRole("heading", { name: "Past Events" })
    ).toBeVisible();
  });
});
