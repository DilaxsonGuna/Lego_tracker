import posthog from "posthog-js";

/**
 * Analytics event taxonomy.
 *
 * Follows PostHog's `category:object_action` naming convention. Event names are
 * FIXED strings — never interpolate values into them; pass dynamic data as
 * properties instead, so events stay filterable.
 *
 * These map directly to the BrickMaster MVP success metrics (see
 * agent_docs/mvp_brickmaster.md §4): does the social graph form, do people
 * return, is the loop alive, does the viral mechanic fire.
 */
export const AnalyticsEvent = {
  // Activation — the social graph can only form once a profile exists.
  OnboardingComplete: "signup_flow:onboarding_complete",

  // Adoption — collection building.
  SetAdd: "vault:set_add",
  SetRemove: "vault:set_remove",
  SetMoveToCollection: "vault:set_move_to_collection",
  SetFavoriteToggle: "vault:set_favorite_toggle",

  // The moat — social interactions.
  UserFollow: "social:user_follow",
  UserUnfollow: "social:user_unfollow",
  OverlapView: "social:overlap_view",

  // Virality — the "tell a friend" surfaces.
  ProfileShare: "profile:profile_share",
  CollectionShare: "collection:collection_share",
  ThemeCompletionShare: "theme:completion_share",
} as const;

export type AnalyticsEventName = (typeof AnalyticsEvent)[keyof typeof AnalyticsEvent];

type AnalyticsProperties = Record<string, string | number | boolean | null>;

/**
 * Capture a product-analytics event. Safe to call anywhere on the client:
 * it no-ops on the server, before PostHog initialises, and while the user has
 * not consented (PostHog respects the opt-out state internally).
 */
export function capture(event: AnalyticsEventName, properties?: AnalyticsProperties): void {
  if (typeof window === "undefined") return;
  if (!posthog.__loaded) return;

  posthog.capture(event, properties);
}
