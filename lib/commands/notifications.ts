"use server";

import { createClient } from "@/lib/supabase/server";
import type { NotificationType } from "@/types/notifications";

/**
 * Create a new notification
 */
export async function createNotification(params: {
  userId: string;
  type: NotificationType;
  actorId: string;
  data?: Record<string, unknown>;
}) {
  const supabase = await createClient();

  // Don't notify yourself
  if (params.userId === params.actorId) return;

  const { error } = await supabase.from("notifications").insert({
    user_id: params.userId,
    type: params.type,
    actor_id: params.actorId,
    data: params.data ?? {},
  });

  if (error) {
    console.error("Failed to create notification:", error.message);
  }
}

/**
 * Mark a single notification as read
 */
export async function markAsRead(notificationId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("id", notificationId);

  if (error) return { error: error.message };
  return { success: true };
}

/**
 * Mark all notifications as read for a user
 */
export async function markAllAsRead(userId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("user_id", userId)
    .eq("read", false);

  if (error) return { error: error.message };
  return { success: true };
}
