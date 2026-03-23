import { test, expect } from "@playwright/test";
import { TEST_USER } from "./helpers/seed";

// Setup/cleanup handled by global-setup.ts and global-teardown.ts

test.describe("Auth redirect", () => {
  test("redirects unauthenticated users from / to /auth/login", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test("redirects unauthenticated users from /vault to /auth/login", async ({ page }) => {
    await page.goto("/vault");
    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test("redirects unauthenticated users from /explore to /auth/login", async ({ page }) => {
    await page.goto("/explore");
    await expect(page).toHaveURL(/\/auth\/login/);
  });
});

test.describe("Login flow", () => {
  test("logs in with valid credentials", async ({ page }) => {
    await page.goto("/auth/login");
    await page.getByLabel(/email/i).fill(TEST_USER.email);
    await page.getByLabel(/password/i).fill(TEST_USER.password);
    await page.getByRole("button", { name: /login/i }).click();

    // Should leave the login page (goes to / or /auth/onboarding)
    await expect(page).not.toHaveURL(/\/auth\/login/, { timeout: 10000 });
  });

  test("shows error for invalid credentials", async ({ page }) => {
    await page.goto("/auth/login");
    await page.getByLabel(/email/i).fill("wrong@example.com");
    await page.getByLabel(/password/i).fill("WrongPassword123!");
    await page.getByRole("button", { name: /login/i }).click();

    await expect(page.getByText(/invalid|error|incorrect/i)).toBeVisible({ timeout: 5000 });
  });
});
