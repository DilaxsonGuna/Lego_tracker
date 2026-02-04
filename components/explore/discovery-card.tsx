"use client";

import { Plus, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { DiscoverySet } from "@/types/explore";

interface DiscoveryCardProps {
  set: DiscoverySet;
  isInCollection: boolean;
  isPending: boolean;
  onToggle: () => void;
}

export function DiscoveryCard({
  set,
  isInCollection,
  isPending,
  onToggle,
}: DiscoveryCardProps) {
  return (
    <div className="group relative flex flex-col bg-card rounded-xl overflow-hidden hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20 hover:ring-1 hover:ring-primary/50 transition-all duration-300 cursor-pointer h-full">
      {/* Image */}
      <div className="relative w-full aspect-[4/3] bg-muted flex items-center justify-center p-6">
        <div
          className="size-full bg-center bg-contain bg-no-repeat transition-transform duration-500 group-hover:scale-105"
          style={{ backgroundImage: `url("${set.setImgUrl}")` }}
        />
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
          <Button
            variant={isInCollection ? "default" : "secondary"}
            size="icon"
            className={`size-8 rounded-full transition-colors ${
              isInCollection
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "hover:bg-primary hover:text-primary-foreground"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : isInCollection ? (
              <Check className="size-5" />
            ) : (
              <Plus className="size-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
