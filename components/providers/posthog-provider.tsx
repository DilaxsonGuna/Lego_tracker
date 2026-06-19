"use client";

import { useEffect } from "react";
import posthog from "posthog-js";
import { createClient } from "@/lib/supabase/client";

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";

/** localStorage key holding the visitor's analytics consent choice. */
export const CONSENT_KEY = "bm_analytics_consent";

/**
 * Initialises PostHog on the client and keeps the analytics identity in sync
 * with the Supabase auth session.
 *
 * Privacy: capturing is opted OUT by default. Nothing is sent until the user
 * accepts via the cookie-consent banner, which flips PostHog to opt-in. This
 * keeps us GDPR-compliant (no analytics cookies before consent).
 */
export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (!POSTHOG_KEY) return;

    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      // Auto-capture App Router navigations without a manual pageview component.
      capture_pageview: "history_change",
      capture_pageleave: true,
      // Only create person profiles for identified (signed-in) users.
      person_profiles: "identified_only",
      // GDPR: wait for explicit consent before capturing anything.
      opt_out_capturing_by_default: true,
    });

    // Restore a returning visitor's prior consent. This MUST run here, after
    // init() — doing it from the consent banner instead races with init (child
    // effects run before parent effects), and init's opt-out default would
    // clobber an opt-in set beforehand.
    const stored = window.localStorage.getItem(CONSENT_KEY);
    if (stored === "accepted") {
      posthog.opt_in_capturing();
    } else if (stored === "declined") {
      posthog.opt_out_capturing();
    }
  }, []);

  // Keep the PostHog identity tied to the authenticated Supabase user.
  useEffect(() => {
    if (!POSTHOG_KEY) return;

    const supabase = createClient();

    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        posthog.reset();
        return;
      }

      const user = session?.user;
      // GDPR: identify (which sends the email as a person property) only after
      // the user has consented. Before consent we send nothing to PostHog.
      if (user && posthog.has_opted_in_capturing()) {
        posthog.identify(user.id, {
          email: user.email,
        });
      }
    });

    return () => data.subscription.unsubscribe();
  }, []);

  return <>{children}</>;
}
