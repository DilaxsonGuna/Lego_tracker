"use client";

import { Heart, Plus, Check, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { DiscoverySet } from "@/types/explore";
import type { CollectionTab } from "@/types/lego-set";

interface DiscoveryCardProps {
  set: DiscoverySet;
  collectionType?: CollectionTab; // undefined = not in vault
  isPending: boolean;
  onAddToWishlist: () => void;
  onAddToCollection: () => void;
  onRemove: () => void;
}

export function DiscoveryCard({
  set,
  collectionType,
  isPending,
  onAddToWishlist,
  onAddToCollection,
  onRemove,
}: DiscoveryCardProps) {
  const isInWishlist = collectionType === "wishlist";
  const isInCollection = collectionType === "collection";
  const isInVault = isInWishlist || isInCollection;

  return (
    <div className="group relative flex flex-col bg-card rounded-xl overflow-hidden hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20 hover:ring-1 hover:ring-primary/50 transition-all duration-300 h-full">
      {/* Image */}
      <div className="relative w-full aspect-[4/3] bg-muted flex items-center justify-center p-6">
        <div
          className="size-full bg-center bg-contain bg-no-repeat transition-transform duration-500 group-hover:scale-105"
          style={{ backgroundImage: `url("${set.setImgUrl}")` }}
        />

        {/* Wishlist Heart Button - Top right */}
        {!isInCollection && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (isInWishlist) {
                onRemove();
              } else {
                onAddToWishlist();
              }
            }}
            disabled={isPending}
            title={isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
            className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all ${
              isInWishlist
                ? "bg-primary/20 text-primary opacity-100"
                : "bg-black/20 hover:bg-black/50 text-white opacity-0 group-hover:opacity-100"
            }`}
          >
            {isPending ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              <Heart
                className={`size-5 ${isInWishlist ? "fill-current" : ""}`}
              />
            )}
          </button>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-2 flex-grow">
        <div className="flex justify-between items-start">
          <h3 className="text-base font-bold text-foreground line-clamp-1 pr-2">
            {set.name}
          </h3>
          <span className="text-xs font-mono text-muted-foreground whitespace-nowrap">
            #{set.setNum}
          </span>
        </div>
        <div className="flex justify-between items-end mt-auto">
          <p className="text-sm text-muted-foreground font-medium">
            {set.numParts.toLocaleString()} pcs
          </p>

          {/* Collection Button - Bottom right */}
          {isInCollection ? (
            // In Collection - Show check with remove on hover
            <div className="relative group/btn">
              <Button
                variant="default"
                size="icon"
                className="size-8 rounded-full bg-primary text-primary-foreground hover:bg-red-500 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
                disabled={isPending}
                title="Remove from Collection"
              >
                {isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <>
                    <Check className="size-5 group-hover/btn:hidden" />
                    <X className="size-5 hidden group-hover/btn:block" />
                  </>
                )}
              </Button>
            </div>
          ) : (
            // Not in collection - Show add button
            <Button
              variant="secondary"
              size="icon"
              className="size-8 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onAddToCollection();
              }}
              disabled={isPending}
              title="Add to Collection"
            >
              {isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Plus className="size-5" />
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
