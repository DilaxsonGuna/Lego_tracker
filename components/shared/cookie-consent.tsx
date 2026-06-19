"use client";

import { useEffect, useState } from "react";
import posthog from "posthog-js";
import { Button } from "@/components/ui/button";
import { CONSENT_KEY } from "@/components/providers/posthog-provider";

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;

/**
 * GDPR cookie-consent banner. Analytics start opted-out (see PostHogProvider);
 * this banner is the only thing that flips PostHog to opt-in. The choice is
 * persisted so the banner shows once per visitor.
 */
export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // No analytics configured → never show the banner.
    if (!POSTHOG_KEY) return;

    // Restoring a prior choice is owned by PostHogProvider (it must happen
    // after posthog.init). Here we only decide whether to prompt: show the
    // banner unless the visitor has already chosen.
    const stored = window.localStorage.getItem(CONSENT_KEY);
    if (stored === "accepted" || stored === "declined") return;

    setVisible(true);
  }, []);

  const decide = (accepted: boolean) => {
    window.localStorage.setItem(CONSENT_KEY, accepted ? "accepted" : "declined");
    if (accepted) {
      posthog.opt_in_capturing();
    } else {
      posthog.opt_out_capturing();
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/80"
    >
      <div className="mx-auto flex max-w-3xl flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          We use privacy-friendly analytics to understand how collectors use BrickMaster and make it
          better. No ads, no selling your data.
        </p>
        <div className="flex shrink-0 gap-2">
          <Button variant="ghost" size="sm" onClick={() => decide(false)}>
            Decline
          </Button>
          <Button size="sm" onClick={() => decide(true)}>
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
}
