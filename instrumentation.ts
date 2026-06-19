import * as Sentry from "@sentry/nextjs";

/**
 * Loads the server/edge Sentry configs based on the active Next.js runtime.
 * Without this, the server and edge `Sentry.init` calls never run, so
 * server-component, middleware, and route-handler errors go uncaptured.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}

// Captures errors thrown in Server Components, middleware, and route handlers.
export const onRequestError = Sentry.captureRequestError;
