/**
 * Runs once before all E2E tests.
 * Creates both test users + seeds test data in the local Supabase.
 */

import {
  createTestUser,
  createSecondTestUser,
  seedTestData,
  cleanupTestData,
} from "./helpers/seed";

export default async function globalSetup() {
  await cleanupTestData();
  await seedTestData();
  await createTestUser();
  await createSecondTestUser();

  console.log("[E2E Setup] Test users and seed data created.");
}
