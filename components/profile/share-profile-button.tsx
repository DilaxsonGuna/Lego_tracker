"use client";

import { Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AnalyticsEvent, capture } from "@/lib/analytics/events";

interface ShareProfileButtonProps {
  userId: string;
  username: string;
}

export function ShareProfileButton({ userId, username }: ShareProfileButtonProps) {
  const profileUrl = `${window.location.origin}/u/${userId}`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `@${username} on BrickMaster`,
          url: profileUrl,
        });
        capture(AnalyticsEvent.ProfileShare, {
          target_user_id: userId,
          method: "web_share",
        });
      } catch (err) {
        // User cancelled share — ignore AbortError
        if (err instanceof Error && err.name === "AbortError") return;
      }
    } else {
      try {
        await navigator.clipboard.writeText(profileUrl);
        toast.success("Profile link copied!");
        capture(AnalyticsEvent.ProfileShare, {
          target_user_id: userId,
          method: "clipboard",
        });
      } catch {
        toast.error("Failed to copy link");
      }
    }
  };

  return (
    <Button variant="outline" size="sm" onClick={handleShare} className="gap-1.5">
      <Share2 className="size-4" />
      Share
    </Button>
  );
}
