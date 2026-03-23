/**
 * Runs once before all E2E tests.
 * Creates test user + seeds test data in the local Supabase.
 */

import { createTestUser, seedTestData, cleanupTestData } from "./helpers/seed";

export default async function globalSetup() {
  // Clean slate
  await cleanupTestData();

  // Seed data + create user
  await seedTestData();
  await createTestUser();

  console.log("[E2E Setup] Test user and seed data created.");
}
