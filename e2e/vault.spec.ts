import { test, expect, type Page } from "@playwright/test";
import { TEST_USER } from "./helpers/seed";

// Setup/cleanup handled by global-setup.ts and global-teardown.ts

async function loginAsTestUser(page: Page) {
  await page.goto("/auth/login");
  await page.getByLabel(/email/i).fill(TEST_USER.email);
  await page.getByLabel(/password/i).fill(TEST_USER.password);
  await page.getByRole("button", { name: /login/i }).click();

  // Wait to leave login page
  await expect(page).not.toHaveURL(/\/auth\/login/, { timeout: 10000 });

  // If redirected to onboarding (no username yet), complete it
  if (page.url().includes("/auth/onboarding")) {
    await page.getByLabel(/username/i).fill(TEST_USER.username);
    // Wait for 500ms debounce + availability check before button enables
    const submitBtn = page.getByRole("button", { name: /get started/i });
    await expect(submitBtn).toBeEnabled({ timeout: 5000 });
    await submitBtn.click();
    // Onboarding does window.location.href = "/" (hard navigation)
    await expect(page).not.toHaveURL(/\/auth\/onboarding/, { timeout: 10000 });
  }
}

test.describe("Vault flow", () => {
  test("can access set detail page after login", async ({ page }) => {
    await loginAsTestUser(page);

    await page.goto("/set/42151-1");
    await expect(page.getByRole("heading", { name: "Bugatti Bolide" })).toBeVisible({
      timeout: 10000,
    });
  });
});
