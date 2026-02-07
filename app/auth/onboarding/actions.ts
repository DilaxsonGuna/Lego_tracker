"use server";

import { createClient } from "@/lib/supabase/server";
import { isUsernameAvailable } from "@/lib/queries/profile";
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
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  // Validate username format
  const username = data.username.trim().toLowerCase();

  if (username.length < 3 || username.length > 20) {
    return {
      error: "Username must be 3-20 characters",
      fieldErrors: { username: "Username must be 3-20 characters" },
    };
  }

  if (!/^[a-z0-9_]+$/.test(username)) {
    return {
      error: "Username can only contain letters, numbers, and underscores",
      fieldErrors: {
        username: "Username can only contain letters, numbers, and underscores",
      },
    };
  }

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
      full_name: data.fullName?.trim() || null,
      avatar_url: data.avatarUrl || null,
      bio: data.bio?.trim() || null,
      location: data.location?.trim() || null,
      date_of_birth: data.dateOfBirth || null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" }
  );

  if (error) {
    return { error: error.message };
  }

  // Save theme preferences if provided
  if (data.themeIds && data.themeIds.length > 0) {
    const { setUserThemes } = await import("@/lib/commands/user-themes");
    const themeResult = await setUserThemes(data.themeIds);
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
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const trimmed = username.trim().toLowerCase();

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
