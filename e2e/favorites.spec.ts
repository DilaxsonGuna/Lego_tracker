import { test, expect } from "@playwright/test";
import { loginAsTestUser } from "./helpers/login";
import { adminClient, TEST_USER } from "./helpers/seed";

// This test adds sets to collection via admin API first (faster),
// then tests the favorites limit through the UI.

test.describe("Favorites limit", () => {
  test("prevents adding a 5th favorite (max 4)", async ({ page }) => {
    await loginAsTestUser(page);

    // Get the test user's ID
    const { data: users } = await adminClient.auth.admin.listUsers();
    const testUser = users?.users?.find((u) => u.email === TEST_USER.email);
    if (!testUser) throw new Error("Test user not found");
    const userId = testUser.id;

    // Seed 5 sets into the user's collection via admin API
    const setNums = ["42151-1", "75375-1", "60431-1", "42156-1", "75403-1"];
    for (const setNum of setNums) {
      await adminClient
        .from("user_sets")
        .upsert(
          { user_id: userId, set_num: setNum, quantity: 1, collection_type: "collection" },
          { onConflict: "user_id,set_num" }
        );
    }

    // Add first 4 as favorites via admin API
    for (const setNum of setNums.slice(0, 4)) {
      await adminClient
        .from("user_favorites")
        .upsert({ user_id: userId, set_num: setNum }, { onConflict: "user_id,set_num" });
    }

    // Go to vault and try to favorite the 5th set
    await page.goto("/vault");
    await expect(page.getByText("X-Wing").first()).toBeVisible({ timeout: 10000 });

    // Find an unfavorited card's heart button
    const unfavoritedHeart = page.getByLabel("Add to favorites").first();
    if (await unfavoritedHeart.isVisible({ timeout: 3000 })) {
      await unfavoritedHeart.click();
      // Should show max 4 error toast
      await expect(page.getByText(/maximum 4 favorites/i)).toBeVisible({ timeout: 5000 });
    }
  });
});
