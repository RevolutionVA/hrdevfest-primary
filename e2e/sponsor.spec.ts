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
});
