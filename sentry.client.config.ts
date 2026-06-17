import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Only enable in production
  enabled: process.env.NODE_ENV === "production",

  // Sample 100% of errors, 10% of transactions
  tracesSampleRate: 0.1,

  // Capture unhandled promise rejections
  integrations: [Sentry.replayIntegration({ maskAllText: true, blockAllMedia: true })],

  // Session replay — capture 1% of sessions, 100% of error sessions
  replaysSessionSampleRate: 0.01,
  replaysOnErrorSampleRate: 1.0,
});
