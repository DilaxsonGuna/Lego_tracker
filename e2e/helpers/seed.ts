/**
 * E2E test seed helpers.
 * Uses the Supabase service role key to bypass RLS and create test data.
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "http://127.0.0.1:54321";
const SERVICE_ROLE_KEY = "REMOVED_SUPABASE_SERVICE_ROLE_KEY";

// Admin client — bypasses RLS
export const adminClient = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

export const TEST_USER = {
  email: "testuser@example.com",
  password: "TestPassword123!",
  username: "testuser",
};

/**
 * Create a test user in Supabase Auth + profile.
 * Returns the user ID.
 */
export async function createTestUser(): Promise<string> {
  // Clean up any existing test user first
  const { data: existing } = await adminClient.auth.admin.listUsers();
  const existingUser = existing?.users?.find((u) => u.email === TEST_USER.email);
  if (existingUser) {
    await adminClient.auth.admin.deleteUser(existingUser.id);
  }

  // Create auth user
  const { data, error } = await adminClient.auth.admin.createUser({
    email: TEST_USER.email,
    password: TEST_USER.password,
    email_confirm: true,
  });

  if (error) throw new Error(`Failed to create test user: ${error.message}`);

  const userId = data.user.id;

  // Update profile with username
  await adminClient
    .from("profiles")
    .update({ username: TEST_USER.username, full_name: "Test User" })
    .eq("id", userId);

  return userId;
}

/**
 * Seed some LEGO themes and sets for tests.
 */
export async function seedTestData() {
  // Insert themes
  await adminClient.from("themes").upsert([
    { id: 1, name: "Technic", parent_id: null },
    { id: 2, name: "Star Wars", parent_id: null },
    { id: 3, name: "City", parent_id: null },
  ]);

  // Insert sets
  await adminClient.from("lego_sets").upsert([
    {
      set_num: "42151-1",
      name: "Bugatti Bolide",
      year: 2023,
      theme_id: 1,
      num_parts: 905,
      img_url: "",
    },
    {
      set_num: "75375-1",
      name: "Millennium Falcon",
      year: 2024,
      theme_id: 2,
      num_parts: 921,
      img_url: "",
    },
    {
      set_num: "60431-1",
      name: "Space Explorer Rover",
      year: 2024,
      theme_id: 3,
      num_parts: 311,
      img_url: "",
    },
  ]);
}

/**
 * Clean up all test data. Call in afterAll().
 */
export async function cleanupTestData() {
  // Delete test user (cascades to profile, user_sets, etc.)
  const { data: users } = await adminClient.auth.admin.listUsers();
  for (const user of users?.users ?? []) {
    if (user.email === TEST_USER.email) {
      await adminClient.auth.admin.deleteUser(user.id);
    }
  }
}
