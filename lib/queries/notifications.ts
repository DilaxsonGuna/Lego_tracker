import { createClient } from "@/lib/supabase/server";
import type { Notification } from "@/types/notifications";

/**
 * Fetch notifications for a user with actor profile data joined
 */
export async function getNotifications(
  userId: string,
  limit: number = 20
): Promise<Notification[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("notifications")
    .select(
      "id, user_id, type, actor_id, data, read, created_at, profiles!notifications_actor_id_fkey(username, avatar_url, full_name)"
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) return [];

  return data.map((row) => {
    const actor = row.profiles as unknown as {
      username: string | null;
      avatar_url: string | null;
      full_name: string | null;
    } | null;
    return {
      id: row.id,
      user_id: row.user_id,
      type: row.type as Notification["type"],
      actor_id: row.actor_id,
      data: (row.data as Record<string, unknown>) ?? {},
      read: row.read,
      created_at: row.created_at,
      actor: actor
        ? {
            username: actor.username ?? "Anonymous",
            avatar_url: actor.avatar_url,
            display_name: actor.full_name,
          }
        : undefined,
    };
  });
}

/**
 * Get the count of unread notifications for a user
 */
export async function getUnreadCount(userId: string): Promise<number> {
  const supabase = await createClient();

  const { count, error } = await supabase
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("read", false);

  if (error) return 0;
  return count ?? 0;
}
