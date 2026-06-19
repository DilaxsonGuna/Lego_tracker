import { test, expect } from "@playwright/test";
import { loginAsTestUser } from "./helpers/login";

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
    await loginAsTestUser(page);
    // If we get here without error, login succeeded
    await expect(page).not.toHaveURL(/\/auth\/login/);
  });

  test("shows error for invalid credentials", async ({ page }) => {
    await page.goto("/auth/login");
    await page.getByLabel(/email/i).fill("wrong@example.com");
    await page.getByLabel(/password/i).fill("WrongPassword123!");
    await page.getByRole("button", { name: /login/i }).click();

    await expect(page.getByText(/invalid|error|incorrect/i)).toBeVisible({ timeout: 5000 });
  });
});
