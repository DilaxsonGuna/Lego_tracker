"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Package, Heart, X, Loader2, Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { UserSetStatus } from "@/types/set-detail";
import {
  addToCollection,
  addToWishlist,
  removeFromVault,
  toggleFavorite,
} from "@/app/(app)/set/[setNum]/actions";

interface SetDetailActionsProps {
  setNum: string;
  initialStatus: UserSetStatus;
  isAuthenticated: boolean;
}

export function SetDetailActions({
  setNum,
  initialStatus,
  isAuthenticated,
}: SetDetailActionsProps) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);
  const [isPending, startTransition] = useTransition();

  const handleAddToCollection = () => {
    startTransition(async () => {
      const result = await addToCollection(setNum);
      if (result.error) {
        toast.error(result.error);
      } else {
        setStatus({ inCollection: true, inWishlist: false, isFavorite: status.isFavorite });
        toast.success("Added to collection");
        router.refresh();
      }
    });
  };

  const handleAddToWishlist = () => {
    startTransition(async () => {
      const result = await addToWishlist(setNum);
      if (result.error) {
        toast.error(result.error);
      } else {
        setStatus({ inCollection: false, inWishlist: true, isFavorite: false });
        toast.success("Added to wishlist");
        router.refresh();
      }
    });
  };

  const handleRemove = () => {
    startTransition(async () => {
      const result = await removeFromVault(setNum);
      if (result.error) {
        toast.error(result.error);
      } else {
        setStatus({ inCollection: false, inWishlist: false, isFavorite: false });
        toast.success("Removed from vault");
        router.refresh();
      }
    });
  };

  const handleToggleFavorite = () => {
    startTransition(async () => {
      const result = await toggleFavorite(setNum);
      if (result.error) {
        toast.error(result.error);
      } else {
        setStatus((prev) => ({ ...prev, isFavorite: !prev.isFavorite }));
        router.refresh();
      }
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          size="lg"
          className="flex-1"
          onClick={() => router.push("/auth/login")}
        >
          <Package className="size-5 mr-2" />
          Log in to add to your vault
        </Button>
      </div>
    );
  }

  if (status.inCollection) {
    return (
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          size="lg"
          variant="outline"
          className="flex-1 border-primary/50 text-primary"
          disabled
        >
          <Check className="size-5 mr-2" />
          In Your Collection
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="hover:bg-primary/10 hover:text-primary"
          onClick={handleToggleFavorite}
          disabled={isPending}
        >
          {isPending ? (
            <Loader2 className="size-5 animate-spin" />
          ) : (
            <Star
              className={`size-5 ${
                status.isFavorite ? "fill-primary text-primary" : ""
              }`}
            />
          )}
        </Button>
        <Button
          size="lg"
          variant="ghost"
          className="text-muted-foreground hover:text-destructive"
          onClick={handleRemove}
          disabled={isPending}
        >
          {isPending ? (
            <Loader2 className="size-5 animate-spin" />
          ) : (
            <X className="size-5" />
          )}
        </Button>
      </div>
    );
  }

  if (status.inWishlist) {
    return (
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          size="lg"
          className="flex-1"
          onClick={handleAddToCollection}
          disabled={isPending}
        >
          {isPending ? (
            <Loader2 className="size-5 mr-2 animate-spin" />
          ) : (
            <Package className="size-5 mr-2" />
          )}
          Move to Collection
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="flex-1 border-primary/50 text-primary"
          disabled
        >
          <Heart className="size-5 mr-2 fill-current" />
          In Your Wishlist
        </Button>
        <Button
          size="lg"
          variant="ghost"
          className="text-muted-foreground hover:text-destructive"
          onClick={handleRemove}
          disabled={isPending}
        >
          {isPending ? (
            <Loader2 className="size-5 animate-spin" />
          ) : (
            <X className="size-5" />
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <Button
        size="lg"
        className="flex-1"
        onClick={handleAddToCollection}
        disabled={isPending}
      >
        {isPending ? (
          <Loader2 className="size-5 mr-2 animate-spin" />
        ) : (
          <Package className="size-5 mr-2" />
        )}
        Add to Collection
      </Button>
      <Button
        size="lg"
        variant="outline"
        className="flex-1"
        onClick={handleAddToWishlist}
        disabled={isPending}
      >
        {isPending ? (
          <Loader2 className="size-5 mr-2 animate-spin" />
        ) : (
          <Heart className="size-5 mr-2" />
        )}
        Add to Wishlist
      </Button>
    </div>
  );
}
