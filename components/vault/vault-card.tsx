"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { VaultSet, VaultSetStatus } from "@/types/vault";

interface VaultCardProps {
  set: VaultSet;
  isSelected?: boolean;
  onToggleSelect?: (setNum: string) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (setNum: string) => void;
  showFavorite?: boolean;
  readonly?: boolean;
}

const STATUS_VARIANTS: Record<VaultSetStatus, string> = {
  built: "bg-green-500/80 text-white border-transparent hover:bg-green-500/70",
  "in-box": "bg-blue-500/80 text-white border-transparent hover:bg-blue-500/70",
  "missing-parts": "bg-amber-500/80 text-white border-transparent hover:bg-amber-500/70",
  "for-sale": "bg-red-500/80 text-white border-transparent hover:bg-red-500/70",
};

const STATUS_LABELS: Record<VaultSetStatus, string> = {
  built: "Built",
  "in-box": "In Box",
  "missing-parts": "Missing Parts",
  "for-sale": "For Sale",
};

export function VaultCard({ set, isSelected, onToggleSelect, isFavorite, onToggleFavorite, showFavorite = true, readonly = false }: VaultCardProps) {
  return (
    <div className="group relative flex flex-col rounded-xl bg-card border border-border transition-all hover:border-primary/50 overflow-hidden">
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
          className="absolute top-3 right-3 z-10 size-9 rounded-full bg-black/20 hover:bg-black/50 backdrop-blur-sm transition-all hover:scale-110"
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
          <div
            className="size-full bg-contain bg-center bg-no-repeat transition-transform duration-500 group-hover:scale-105"
            style={{ backgroundImage: `url("${set.setImgUrl}")` }}
          />
          <div className="absolute bottom-2 right-2 flex gap-1">
            <Badge variant="outline" className="bg-black/60 backdrop-blur-md text-[10px] font-bold px-2 py-0.5 text-white border-white/10">
              {set.setNum}
            </Badge>
            {set.status && (
              <Badge className={`backdrop-blur-md text-[10px] font-bold px-2 py-0.5 uppercase ${STATUS_VARIANTS[set.status]}`}>
                {STATUS_LABELS[set.status]}
              </Badge>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="p-4 flex flex-col gap-1">
          <h3 className="text-sm font-bold text-foreground truncate group-hover:text-primary transition-colors uppercase tracking-tight">
            {set.name}
          </h3>
          <div className="flex items-center mt-2">
            <span className="text-[11px] text-muted-foreground">
              {set.year} &bull; {set.numParts.toLocaleString()} pcs
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
