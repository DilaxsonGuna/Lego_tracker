"use client";

import Image from "next/image";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LegoSet } from "@/types/lego-set";
import { cn } from "@/lib/utils";

interface LegoSetCardProps {
  set: LegoSet;
  onFavoriteToggle?: (setNum: string) => void;
}

export function LegoSetCard({ set, onFavoriteToggle }: LegoSetCardProps) {
  const formatPieces = (num: number) => {
    return num.toLocaleString();
  };

  return (
    <div className="group relative flex flex-col gap-3 rounded-xl bg-card p-4 shadow-sm hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300 border border-transparent hover:border-primary/30">
      <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-muted flex items-center justify-center">
        <div className="relative w-[80%] h-[80%]">
          <Image
            src={set.setImgUrl}
            alt={set.name}
            fill
            className="object-contain"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-3 right-3 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-sm transition-colors"
          onClick={() => onFavoriteToggle?.(set.setNum)}
        >
          <Heart
            className={cn("size-5", set.isFavorite && "fill-primary text-primary")}
          />
        </Button>
        <div className="absolute bottom-3 left-3 px-2 py-1 rounded bg-black/60 backdrop-blur-md text-white text-xs font-bold">
          {formatPieces(set.numParts)} pcs
        </div>
      </div>
      <div>
        <div className="flex justify-between items-start mb-1">
          <p className="text-muted-foreground text-xs font-bold uppercase tracking-wider">
            {set.setNum}
          </p>
          <Badge
            variant="secondary"
            className="px-2 py-0.5 rounded-full text-xs font-medium"
          >
            {set.year}
          </Badge>
        </div>
        <h3 className="text-foreground text-lg font-bold leading-tight group-hover:text-primary transition-colors">
          {set.name}
        </h3>
      </div>
    </div>
  );
}
