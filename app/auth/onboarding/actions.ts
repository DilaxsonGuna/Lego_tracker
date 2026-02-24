"use server";

import { createClient } from "@/lib/supabase/server";
import { isUsernameAvailable } from "@/lib/queries/profile";
import { createProfileSchema, checkUsernameSchema } from "@/lib/schemas";
import type { ThemeCategory } from "@/types/explore";

export interface OnboardingResult {
  success?: boolean;
  error?: string;
  fieldErrors?: {
    username?: string;
  };
}

export async function createProfile(data: {
  username: string;
  fullName?: string;
  avatarUrl?: string;
  bio?: string;
  location?: string;
  dateOfBirth?: string;
  themeIds?: number[];
}): Promise<OnboardingResult> {
  const parsed = createProfileSchema.safeParse(data);
  if (!parsed.success) {
    const usernameError = parsed.error.issues.find((i) => i.path[0] === "username");
    return {
      error: parsed.error.issues[0].message,
      fieldErrors: usernameError ? { username: usernameError.message } : undefined,
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const username = parsed.data.username;

  // Check username availability
  const available = await isUsernameAvailable(username, user.id);
  if (!available) {
    return {
      error: "Username already taken",
      fieldErrors: { username: "Username already taken" },
    };
  }

  // Upsert profile (INSERT or UPDATE if exists)
  const { error } = await supabase.from("profiles").upsert(
    {
      id: user.id,
      username,
      full_name: parsed.data.fullName?.trim() || null,
      avatar_url: parsed.data.avatarUrl || null,
      bio: parsed.data.bio?.trim() || null,
      location: parsed.data.location?.trim() || null,
      date_of_birth: parsed.data.dateOfBirth || null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" }
  );

  if (error) {
    return { error: error.message };
  }

  // Save theme preferences if provided
  if (parsed.data.themeIds && parsed.data.themeIds.length > 0) {
    const { setUserThemes } = await import("@/lib/commands/user-themes");
    const themeResult = await setUserThemes(parsed.data.themeIds);
    if (themeResult.error) {
      // Theme save failed but profile was created - don't block onboarding
      console.error("Failed to save themes:", themeResult.error);
    }
  }

  return { success: true };
}

export async function checkUsernameAvailability(
  username: string
): Promise<{ available: boolean }> {
  const parsed = checkUsernameSchema.safeParse({ username });
  if (!parsed.success) {
    return { available: false };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const trimmed = parsed.data.username.trim().toLowerCase();

  // Basic validation
  if (trimmed.length < 3) {
    return { available: false };
  }

  const available = await isUsernameAvailable(trimmed, user?.id);
  return { available };
}

export async function getAvailableThemes(): Promise<ThemeCategory[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("themes")
    .select("id, name")
    .is("parent_id", null)
    .order("name", { ascending: true });

  if (error || !data) return [];

  return data.map((theme) => ({
    id: theme.id,
    label: theme.name,
  }));
}

export async function getPopularThemesAction(): Promise<ThemeCategory[]> {
  const { getPopularThemes } = await import("@/lib/queries/user-themes");
  return getPopularThemes(10);
}
