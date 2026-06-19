import "server-only";
import { PostHog } from "posthog-node";
import type { AnalyticsEventName } from "@/lib/analytics/events";

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";

/**
 * Server-side PostHog client for capturing events from server actions and
 * route handlers. Configured for serverless: events flush immediately rather
 * than being batched, since the process may be frozen after the response.
 *
 * Returns null when no key is configured, so callers can no-op safely.
 * IMPORTANT: call `await client.shutdown()` after capturing to flush events
 * before the function returns.
 */
export function getPostHogServer(): PostHog | null {
  if (!POSTHOG_KEY) return null;

  return new PostHog(POSTHOG_KEY, {
    host: POSTHOG_HOST,
    flushAt: 1,
    flushInterval: 0,
  });
}

/**
 * Capture a single server-side event and flush before returning. Bundling the
 * mandatory `shutdown()` here makes the flush-before-freeze contract impossible
 * to forget — prefer this over calling `getPostHogServer()` directly. No-ops
 * when no key is configured.
 */
export async function captureServerEvent(
  distinctId: string,
  event: AnalyticsEventName,
  properties?: Record<string, string | number | boolean | null>
): Promise<void> {
  const client = getPostHogServer();
  if (!client) return;

  client.capture({ distinctId, event, properties });
  await client.shutdown();
}
