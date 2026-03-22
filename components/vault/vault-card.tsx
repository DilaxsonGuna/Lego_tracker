"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { VaultSet } from "@/types/vault";

interface VaultCardProps {
  set: VaultSet;
  isSelected?: boolean;
  onToggleSelect?: (setNum: string) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (setNum: string) => void;
  showFavorite?: boolean;
  readonly?: boolean;
}

export function VaultCard({
  set,
  isSelected,
  onToggleSelect,
  isFavorite,
  onToggleFavorite,
  showFavorite = true,
  readonly = false,
}: VaultCardProps) {
  return (
    <div className="group relative flex flex-col rounded-xl bg-card border border-border transition-colors hover:border-primary/50 overflow-hidden">
      {/* Checkbox - hidden in readonly mode */}
      {!readonly && onToggleSelect && (
        <div className="absolute top-3 left-3 z-10">
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => onToggleSelect(set.setNum)}
            className="bg-background/80 backdrop-blur-sm"
          />
        </div>
      )}

      {/* Favorite Heart - Only shown for collection items and not readonly */}
      {showFavorite && !readonly && onToggleFavorite && (
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleFavorite(set.setNum);
          }}
          className="absolute top-3 right-3 z-10 size-10 rounded-full bg-black/20 hover:bg-black/50 backdrop-blur-sm transition-[background-color,transform] hover:scale-110"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart
            className={`size-5 transition-colors ${
              isFavorite ? "fill-primary text-primary" : "text-white"
            }`}
          />
        </Button>
      )}

      {/* Image + Info - wrapped in Link */}
      <Link href={`/set/${set.setNum}`}>
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted flex items-center justify-center p-6">
          {set.setImgUrl ? (
            <Image
              src={set.setImgUrl}
              alt={`${set.name} LEGO set ${set.setNum}`}
              fill
              className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div className="size-full flex items-center justify-center text-muted-foreground text-xs">
              No image
            </div>
          )}
          <div className="absolute bottom-2 right-2 flex gap-1">
            <Badge
              variant="outline"
              className="bg-black/80 backdrop-blur-md text-xs font-bold px-2 py-0.5 text-white border-white/10"
            >
              {set.setNum}
            </Badge>
          </div>
        </div>

        {/* Info */}
        <div className="p-4 flex flex-col gap-1">
          <h3
            className="text-sm font-bold text-foreground truncate group-hover:text-primary transition-colors uppercase tracking-tight"
            title={set.name}
          >
            {set.name}
          </h3>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-muted-foreground">
              {set.year} &bull; {set.numParts.toLocaleString()} pcs
            </span>
            {set.retailPrice != null && (
              <span className="text-xs font-bold text-primary">
                €{set.retailPrice.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
