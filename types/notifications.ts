export type NotificationType = "follow" | "milestone";

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  actor_id: string;
  data: Record<string, unknown>;
  read: boolean;
  created_at: string;
  actor?: {
    username: string;
    avatar_url: string | null;
    display_name: string | null;
  };
}
