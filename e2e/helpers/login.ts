import { expect, type Page } from "@playwright/test";
import { TEST_USER, TEST_USER_2 } from "./seed";

/**
 * Log in as the primary test user. Handles onboarding if needed.
 */
export async function loginAsTestUser(page: Page) {
  await loginAs(page, TEST_USER);
}

/**
 * Log in as the secondary test user. Handles onboarding if needed.
 */
export async function loginAsSecondUser(page: Page) {
  await loginAs(page, TEST_USER_2);
}

async function loginAs(page: Page, user: { email: string; password: string; username: string }) {
  await page.goto("/auth/login");
  await page.getByLabel(/email/i).fill(user.email);
  await page.getByLabel(/password/i).fill(user.password);
  await page.getByRole("button", { name: /login/i }).click();

  await expect(page).not.toHaveURL(/\/auth\/login/, { timeout: 10000 });

  // Complete onboarding if redirected there
  if (page.url().includes("/auth/onboarding")) {
    await page.getByLabel(/username/i).fill(user.username);
    const submitBtn = page.getByRole("button", { name: /get started/i });
    await expect(submitBtn).toBeEnabled({ timeout: 5000 });
    await submitBtn.click();
    await expect(page).not.toHaveURL(/\/auth\/onboarding/, { timeout: 10000 });
  }
}
