import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  // Plugins:
  // - react(): lets Vitest understand JSX
  // - tsconfigPaths(): makes @/ imports work (reads your tsconfig.json)
  plugins: [tsconfigPaths(), react()],

  test: {
    // Makes describe/it/expect available without importing them
    globals: true,

    // Fake browser environment (no real Chrome needed)
    environment: "jsdom",

    // Runs before every test file — sets up custom matchers
    setupFiles: ["./test/setup.ts"],

    // Which files are tests
    include: ["**/*.{test,spec}.{ts,tsx}"],

    // Skip these folders
    exclude: ["**/node_modules/**", "**/e2e/**", "**/.next/**"],

    // Coverage configuration
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      // Only measure coverage for your code, not tests or UI primitives
      include: ["lib/**/*.ts", "components/**/*.tsx"],
      exclude: [
        "**/*.test.ts",
        "**/*.test.tsx",
        "components/ui/**", // shadcn primitives — already tested by the library
      ],
    },

    // Reset mocks between tests so they don't leak
    clearMocks: true,
    restoreMocks: true,
  },
});
