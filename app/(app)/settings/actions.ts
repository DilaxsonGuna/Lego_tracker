"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type ProfileSettings = {
  profile_visible: boolean;
  default_grid_view: boolean;
  email_notifications: boolean;
};

export async function getSettings(): Promise<ProfileSettings | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("profile_visible, default_grid_view, email_notifications")
    .eq("id", user.id)
    .single();

  if (!profile) {
    return null;
  }

  return {
    profile_visible: profile.profile_visible ?? true,
    default_grid_view: profile.default_grid_view ?? true,
    email_notifications: profile.email_notifications ?? true,
  };
}

export async function updateProfileSetting(
  data: Partial<ProfileSettings>
): Promise<{ error?: string; success?: boolean }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/settings");
  return { success: true };
}

export async function sendPasswordResetEmail(): Promise<{
  error?: string;
  success?: boolean;
}> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return { error: "No email found" };
  }

  const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/auth/update-password`,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}
