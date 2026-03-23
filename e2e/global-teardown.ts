import { cleanupTestData } from "./helpers/seed";

export default async function globalTeardown() {
  await cleanupTestData();
  console.log("[E2E Teardown] Test data cleaned up.");
}
