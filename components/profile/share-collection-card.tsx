"use client";

import { useState } from "react";
import { Copy, Check, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface ShareCollectionCardProps {
  userId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ShareCollectionCard({
  userId,
  open,
  onOpenChange,
}: ShareCollectionCardProps) {
  const [copied, setCopied] = useState(false);

  const ogImageUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/api/og/collection?userId=${userId}`
      : "";

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(ogImageUrl);
      setCopied(true);
      toast.success("Link copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const handleShare = async () => {
    if (!navigator.share) {
      // Fallback to copy
      handleCopyLink();
      return;
    }

    try {
      await navigator.share({
        title: "My LEGO Collection",
        text: "Check out my LEGO collection on BrickBox!",
        url: ogImageUrl,
      });
    } catch (err) {
      // User cancelled share - ignore AbortError
      if (err instanceof Error && err.name !== "AbortError") {
        toast.error("Failed to share");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Share Collection Card</DialogTitle>
          <DialogDescription>
            Preview and share your collection card image.
          </DialogDescription>
        </DialogHeader>

        {/* OG Image Preview */}
        <div className="rounded-lg overflow-hidden border border-border bg-muted/20">
          {ogImageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={ogImageUrl}
              alt="Collection card preview"
              className="w-full h-auto"
            />
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleCopyLink}
          >
            {copied ? (
              <Check className="size-4 mr-2" />
            ) : (
              <Copy className="size-4 mr-2" />
            )}
            {copied ? "Copied" : "Copy Link"}
          </Button>
          <Button className="flex-1" onClick={handleShare}>
            <Share2 className="size-4 mr-2" />
            Share
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
