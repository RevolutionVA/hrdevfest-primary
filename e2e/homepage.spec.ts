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

  test("2027 sponsors heading sits over the logos", async ({ page }) => {
    await expect(
      page.locator("#sponsors").getByRole("heading", { level: 2, name: "2027 Sponsors" })
    ).toBeVisible();
    await expect(page.getByRole("heading", { name: "Sponsor DevFest 2027" })).toHaveCount(0);
  });

  test("Become a sponsor band has one button to the prospectus", async ({ page }) => {
    const band = page.getByTestId("become-a-sponsor");
    await expect(band.getByRole("heading", { name: "Become a sponsor" })).toBeVisible();
    await expect(band.getByRole("link")).toHaveCount(1);
    await expect(band.getByRole("link", { name: "View the prospectus" })).toHaveAttribute("href", "/sponsor");
  });

  test("sponsors section has no pitch paragraph and no 2026 sponsors link", async ({ page }) => {
    const sponsors = page.locator("#sponsors");
    await expect(sponsors).not.toContainText("Sponsors make DevFest possible");
    await expect(sponsors.getByRole("link", { name: /See our 2026 sponsors/ })).toHaveCount(0);
    await expect(sponsors.locator('a[href="/2026#sponsors"]')).toHaveCount(0);
  });

  test("lists the 2027 sponsors by tier", async ({ page }) => {
    const sponsors = page.locator("#sponsors");
    const reception = sponsors.locator('[data-tier="reception-partner"]');
    const receptionLabel = reception.getByRole("heading", { level: 3, name: "Post-Event Reception Partner" });
    await expect(receptionLabel).toBeVisible();
    await expect(receptionLabel).toHaveClass(/bp-tier-label/);
    await expect(reception.getByRole("link", { name: "Stigian Consulting", exact: true })).toHaveAttribute(
      "href",
      "https://stigian.com/"
    );
    await expect(reception.getByText("DevFest Reception presented by Stigian Consulting")).toBeVisible();

    const featured = sponsors.locator('[data-tier="featured"]');
    await expect(featured.getByRole("heading", { level: 3, name: "Featured Sponsor" })).toBeVisible();
    const landstats = featured.getByRole("link", { name: "Landstats", exact: true });
    await expect(landstats).toHaveAttribute("href", "https://www.landstats.com/");
    await expect(landstats.locator("img")).toBeVisible();

    await expect(sponsors.locator("[data-tier]")).toHaveCount(2);
    await expect(sponsors).not.toContainText(/Marathon|TECHEAD/i);
  });

  test("tier labels are larger and in full ink, not the small muted label", async ({ page }) => {
    const label = page.locator("#sponsors .bp-tier-label").first();
    const style = await label.evaluate((el) => {
      const cs = getComputedStyle(el);
      return { size: parseFloat(cs.fontSize), weight: Number(cs.fontWeight), color: cs.color };
    });
    expect(style.size).toBeGreaterThan(12);
    expect(style.weight).toBeGreaterThanOrEqual(700);
    expect(style.color).toBe("rgb(244, 248, 252)");
  });

  test("Reception and Featured sit side by side on desktop and stack on phones", async ({ page, isMobile }) => {
    const reception = await page.locator('#sponsors [data-tier="reception-partner"]').boundingBox();
    const featured = await page.locator('#sponsors [data-tier="featured"]').boundingBox();
    if (isMobile) {
      expect(featured!.y).toBeGreaterThan(reception!.y + reception!.height - 1);
    } else {
      expect(Math.abs(featured!.y - reception!.y)).toBeLessThan(2);
      expect(featured!.x).toBeGreaterThan(reception!.x + reception!.width - 1);
    }
  });

  test("signup section has no 2026 sponsor logo row", async ({ page }) => {
    const signup = page.locator("#signup");
    await expect(signup.getByText("DevFest 2026 sponsors")).toHaveCount(0);
    await expect(signup.locator("img")).toHaveCount(0);
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
