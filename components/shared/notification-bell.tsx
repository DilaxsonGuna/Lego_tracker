"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Bell, Check, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Notification } from "@/types/notifications";

interface NotificationBellProps {
  notifications: Notification[];
  unreadCount: number;
  markAllAsReadAction: () => Promise<{ success?: boolean; error?: string }>;
  markAsReadAction: (notificationId: string) => Promise<{ success?: boolean; error?: string }>;
}

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const seconds = Math.floor((now - then) / 1000);

  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

function getNotificationIcon(type: string) {
  switch (type) {
    case "follow":
      return <UserPlus className="size-4 text-primary" />;
    default:
      return <Bell className="size-4 text-muted-foreground" />;
  }
}

function getNotificationMessage(notification: Notification): string {
  const username = notification.actor?.username ?? "Someone";
  switch (notification.type) {
    case "follow":
      return `${username} started following you`;
    case "milestone":
      return `${username} reached a milestone`;
    default:
      return "New notification";
  }
}

function NotificationItem({
  notification,
  markAsReadAction,
}: {
  notification: Notification;
  markAsReadAction: NotificationBellProps["markAsReadAction"];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    if (!notification.read) {
      startTransition(async () => {
        await markAsReadAction(notification.id);
        router.refresh();
      });
    }
  };

  const href =
    notification.type === "follow" && notification.actor_id
      ? `/u/${notification.actor_id}`
      : "#";

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={`flex items-start gap-3 px-4 py-3 hover:bg-surface-accent/50 transition-colors ${
        !notification.read ? "bg-primary/5" : ""
      } ${isPending ? "opacity-50" : ""}`}
    >
      <Avatar className="size-8 flex-shrink-0 mt-0.5">
        <AvatarImage
          src={notification.actor?.avatar_url ?? undefined}
          alt={notification.actor?.username ?? ""}
        />
        <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold">
          {(notification.actor?.username ?? "?").charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          {getNotificationIcon(notification.type)}
          <p className="text-xs text-foreground truncate">
            {getNotificationMessage(notification)}
          </p>
        </div>
        <p className="text-[10px] text-muted-foreground mt-0.5">
          {timeAgo(notification.created_at)}
        </p>
      </div>
      {!notification.read && (
        <div className="size-2 rounded-full bg-primary flex-shrink-0 mt-2" />
      )}
    </Link>
  );
}

export function NotificationBell({
  notifications,
  unreadCount,
  markAllAsReadAction,
  markAsReadAction,
}: NotificationBellProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleMarkAllRead = () => {
    startTransition(async () => {
      await markAllAsReadAction();
      router.refresh();
    });
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative size-9"
          aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
        >
          <Bell className="size-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center size-4 rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0" sideOffset={8}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h3 className="text-sm font-bold text-foreground">Notifications</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllRead}
              disabled={isPending}
              className="text-xs text-muted-foreground hover:text-foreground gap-1 h-7 px-2"
            >
              <Check className="size-3" />
              Mark all read
            </Button>
          )}
        </div>

        <ScrollArea className="max-h-[320px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2">
              <Bell className="size-8 text-muted-foreground/40" />
              <p className="text-xs text-muted-foreground">
                No notifications yet
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  markAsReadAction={markAsReadAction}
                />
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
