import { test, expect } from "@playwright/test";

test.describe("Sponsor Page", () => {
  test("sponsor page loads with the heading and draft banner", async ({ page }) => {
    await page.goto("/sponsor");
    await expect(page).toHaveTitle(/Sponsor.*Hampton Roads DevFest 2027/);
    await expect(
      page.getByRole("heading", { level: 1, name: "Sponsor Hampton Roads DevFest 2027" })
    ).toBeVisible();
    await expect(
      page.getByText("NOT FINAL: draft prospectus, details may change.")
    ).toBeVisible();
  });
});
