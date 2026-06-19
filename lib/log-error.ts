import * as Sentry from "@sentry/nextjs";

/**
 * Log a query/command error with context.
 * Centralised so every read/write failure is recorded consistently and
 * forwarded to Sentry (when a DSN is configured) for production monitoring.
 */
export function logError(context: string, error: unknown): void {
  const message = error instanceof Error ? error.message : String(error);
  const code = (error as { code?: string })?.code;

  console.error(`[${context}]`, message, code ? `(code: ${code})` : "");

  Sentry.captureException(error, {
    tags: { context },
    extra: code ? { code } : undefined,
  });
}
