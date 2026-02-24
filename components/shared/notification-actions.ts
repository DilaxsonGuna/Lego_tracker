"use server";

import { createClient } from "@/lib/supabase/server";
import { markAsRead, markAllAsRead } from "@/lib/commands/notifications";
import { revalidatePath } from "next/cache";

export async function handleMarkAsRead(notificationId: string) {
  const result = await markAsRead(notificationId);
  revalidatePath("/");
  return result;
}

export async function handleMarkAllAsRead() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const result = await markAllAsRead(user.id);
  revalidatePath("/");
  return result;
}
