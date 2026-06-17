/**
 * Log a query/command error with context.
 * Centralised so we can swap to Sentry or another provider later.
 */
export function logError(context: string, error: unknown): void {
  const message = error instanceof Error ? error.message : String(error);
  const code = (error as { code?: string })?.code;
  console.error(`[${context}]`, message, code ? `(code: ${code})` : "");
}
