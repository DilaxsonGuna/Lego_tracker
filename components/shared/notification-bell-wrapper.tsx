import { createClient } from "@/lib/supabase/server";
import { getNotifications, getUnreadCount } from "@/lib/queries/notifications";
import { NotificationBell } from "./notification-bell";
import { handleMarkAllAsRead, handleMarkAsRead } from "./notification-actions";

export async function NotificationBellWrapper() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const [notifications, unreadCount] = await Promise.all([
    getNotifications(user.id, 20),
    getUnreadCount(user.id),
  ]);

  return (
    <NotificationBell
      notifications={notifications}
      unreadCount={unreadCount}
      markAllAsReadAction={handleMarkAllAsRead}
      markAsReadAction={handleMarkAsRead}
    />
  );
}
