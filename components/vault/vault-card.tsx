"use client";

import { Heart } from "lucide-react";
import type { VaultSet, VaultSetStatus } from "@/types/vault";

interface VaultCardProps {
  set: VaultSet;
  isSelected: boolean;
  onToggleSelect: (setNum: string) => void;
  isFavorite: boolean;
  onToggleFavorite: (setNum: string) => void;
}

const STATUS_STYLES: Record<VaultSetStatus, string> = {
  built: "bg-green-500/80 text-white",
  "in-box": "bg-blue-500/80 text-white",
  "missing-parts": "bg-amber-500/80 text-white",
  "for-sale": "bg-red-500/80 text-white",
};

const STATUS_LABELS: Record<VaultSetStatus, string> = {
  built: "Built",
  "in-box": "In Box",
  "missing-parts": "Missing Parts",
  "for-sale": "For Sale",
};

export function VaultCard({ set, isSelected, onToggleSelect, isFavorite, onToggleFavorite }: VaultCardProps) {
  return (
    <div className="group relative flex flex-col rounded-xl bg-card border border-border transition-all hover:border-primary/50 overflow-hidden">
      {/* Checkbox */}
      <div className="absolute top-3 left-3 z-20">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggleSelect(set.setNum)}
          className="h-4 w-4 rounded border-border bg-background text-primary focus:ring-primary cursor-pointer"
        />
      </div>

      {/* Favorite Heart */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite(set.setNum);
        }}
        className="absolute top-3 right-3 z-20 p-2 rounded-full bg-black/20 hover:bg-black/50 backdrop-blur-sm transition-all hover:scale-110"
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        <Heart
          className={`size-5 transition-colors ${
            isFavorite ? "fill-primary text-primary" : "text-white"
          }`}
        />
      </button>

      {/* Image */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-black/50">
        <div
          className="h-full w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
          style={{ backgroundImage: `url("${set.setImgUrl}")` }}
        />
        <div className="absolute bottom-2 right-2 flex gap-1">
          <span className="bg-black/60 backdrop-blur-md text-[10px] font-bold px-2 py-0.5 rounded text-white border border-white/10">
            {set.setNum}
          </span>
          {set.status && (
            <span
              className={`backdrop-blur-md text-[10px] font-bold px-2 py-0.5 rounded uppercase ${STATUS_STYLES[set.status]}`}
            >
              {STATUS_LABELS[set.status]}
            </span>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-1">
        <h3 className="text-sm font-bold text-foreground truncate group-hover:text-primary transition-colors uppercase tracking-tight">
          {set.name}
        </h3>
        <div className="flex items-center justify-between mt-2">
          <span className="text-[11px] text-muted-foreground">
            {set.year} &bull; {set.numParts.toLocaleString()} pcs
          </span>
          <span className="text-sm font-black text-foreground">{set.price}</span>
        </div>
      </div>
    </div>
  );
}
