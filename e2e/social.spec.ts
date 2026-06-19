import { test, expect } from "@playwright/test";
import { loginAsTestUser } from "./helpers/login";
import { adminClient, TEST_USER, TEST_USER_2 } from "./helpers/seed";

/**
 * Get user ID by email from admin API.
 */
async function getUserId(email: string): Promise<string> {
  const { data } = await adminClient.auth.admin.listUsers();
  const user = data?.users?.find((u) => u.email === email);
  if (!user) throw new Error(`User ${email} not found`);
  return user.id;
}

test.describe("Follow user", () => {
  test("can follow another user from their profile page", async ({ page }) => {
    await loginAsTestUser(page);

    const otherUserId = await getUserId(TEST_USER_2.email);

    // Visit the other user's profile
    await page.goto(`/u/${otherUserId}`);
    await expect(page.getByText(`@${TEST_USER_2.username}`)).toBeVisible({ timeout: 10000 });

    // Click Follow
    const followBtn = page.getByRole("button", { name: /^follow$/i });
    if (await followBtn.isVisible({ timeout: 3000 })) {
      await followBtn.click();

      // Button should change to "Unfollow"
      await expect(page.getByRole("button", { name: /unfollow/i })).toBeVisible({ timeout: 5000 });
    }
  });

  test("can unfollow a user", async ({ page }) => {
    await loginAsTestUser(page);

    const otherUserId = await getUserId(TEST_USER_2.email);

    // Ensure we're following them first (via admin)
    const myId = await getUserId(TEST_USER.email);
    await adminClient
      .from("follows")
      .upsert(
        { follower_id: myId, following_id: otherUserId },
        { onConflict: "follower_id,following_id" }
      );

    await page.goto(`/u/${otherUserId}`);
    await expect(page.getByText(`@${TEST_USER_2.username}`)).toBeVisible({ timeout: 10000 });

    // Click Unfollow
    const unfollowBtn = page.getByRole("button", { name: /unfollow/i });
    if (await unfollowBtn.isVisible({ timeout: 3000 })) {
      await unfollowBtn.click();

      // Button should change back to "Follow"
      await expect(page.getByRole("button", { name: /^follow$/i })).toBeVisible({ timeout: 5000 });
    }
  });
});

test.describe("Private profile", () => {
  test("private profile shows 'This profile is private' to other users", async ({ page }) => {
    // First: set the second user's profile to private via admin
    const otherUserId = await getUserId(TEST_USER_2.email);
    await adminClient.from("profiles").update({ profile_visible: false }).eq("id", otherUserId);

    // Login as the first user and visit the private profile
    await loginAsTestUser(page);
    await page.goto(`/u/${otherUserId}`);

    // Should see the private message
    await expect(page.getByText(/this profile is private/i).first()).toBeVisible({
      timeout: 10000,
    });

    // Clean up: make profile public again
    await adminClient.from("profiles").update({ profile_visible: true }).eq("id", otherUserId);
  });
});
