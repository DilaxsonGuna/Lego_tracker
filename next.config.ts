import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  cacheComponents: true,
  // Allow E2E test server to use a separate build directory
  distDir: process.env.NEXT_DIST_DIR || ".next",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "cdn.rebrickable.com",
      },
    ],
  },
};

export default withSentryConfig(nextConfig, {
  // Upload source maps for readable stack traces
  silent: !process.env.CI,

  // Automatically tree-shake Sentry logger in production
  disableLogger: true,

  // Hide source maps from the client bundle
  sourcemaps: {
    deleteSourcemapsAfterUpload: true,
  },
});
