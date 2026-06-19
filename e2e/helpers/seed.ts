/**
 * E2E test seed helpers.
 * Uses the Supabase service role key to bypass RLS and create test data.
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "http://127.0.0.1:54321";
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SERVICE_ROLE_KEY) {
  throw new Error(
    "SUPABASE_SERVICE_ROLE_KEY is not set. E2E tests load it from .env.test — copy .env.example and fill in your local Supabase service role key."
  );
}

// Admin client — bypasses RLS
export const adminClient = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

export const TEST_USER = {
  email: "testuser@example.com",
  password: "TestPassword123!",
  username: "testuser",
};

export const TEST_USER_2 = {
  email: "testuser2@example.com",
  password: "TestPassword456!",
  username: "otheruser",
};

/**
 * Create a test user in Supabase Auth + profile.
 * Cleans up existing user first to avoid duplicates.
 */
export async function createTestUser(): Promise<string> {
  return createUser(TEST_USER);
}

export async function createSecondTestUser(): Promise<string> {
  return createUser(TEST_USER_2);
}

async function createUser(user: {
  email: string;
  password: string;
  username: string;
}): Promise<string> {
  // Clean up existing
  const { data: existing } = await adminClient.auth.admin.listUsers();
  const existingUser = existing?.users?.find((u) => u.email === user.email);
  if (existingUser) {
    await adminClient.auth.admin.deleteUser(existingUser.id);
  }

  const { data, error } = await adminClient.auth.admin.createUser({
    email: user.email,
    password: user.password,
    email_confirm: true,
  });

  if (error) throw new Error(`Failed to create user ${user.email}: ${error.message}`);

  const userId = data.user.id;

  // Upsert profile (trigger may not create it for admin-created users)
  await adminClient
    .from("profiles")
    .upsert(
      { id: userId, username: user.username, full_name: user.username, profile_visible: true },
      { onConflict: "id" }
    );

  return userId;
}

/**
 * Seed LEGO themes and sets for tests.
 * 6 sets — enough to test favorites limit (max 4) with extras.
 */
export async function seedTestData() {
  await adminClient.from("themes").upsert([
    { id: 1, name: "Technic", parent_id: null },
    { id: 2, name: "Star Wars", parent_id: null },
    { id: 3, name: "City", parent_id: null },
  ]);

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
    {
      set_num: "42156-1",
      name: "Peugeot 9X8",
      year: 2023,
      theme_id: 1,
      num_parts: 1775,
      img_url: "",
    },
    {
      set_num: "75403-1",
      name: "X-Wing Starfighter",
      year: 2025,
      theme_id: 2,
      num_parts: 1953,
      img_url: "",
    },
    {
      set_num: "60435-1",
      name: "Police Station",
      year: 2025,
      theme_id: 3,
      num_parts: 668,
      img_url: "",
    },
    {
      set_num: "42176-1",
      name: "Porsche GT4",
      year: 2025,
      theme_id: 1,
      num_parts: 1450,
      img_url: "",
    },
  ]);
}

/**
 * Clean up all test data.
 */
export async function cleanupTestData() {
  const { data: users } = await adminClient.auth.admin.listUsers();
  for (const user of users?.users ?? []) {
    if (user.email === TEST_USER.email || user.email === TEST_USER_2.email) {
      await adminClient.auth.admin.deleteUser(user.id);
    }
  }
}
