"use client";

import { Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

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
          title: `@${username} on LegoFlex`,
          url: profileUrl,
        });
      } catch (err) {
        // User cancelled share — ignore AbortError
        if (err instanceof Error && err.name === "AbortError") return;
      }
    } else {
      try {
        await navigator.clipboard.writeText(profileUrl);
        toast.success("Profile link copied!");
      } catch {
        toast.error("Failed to copy link");
      }
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleShare}
      className="gap-1.5"
    >
      <Share2 className="size-4" />
      Share
    </Button>
  );
}
