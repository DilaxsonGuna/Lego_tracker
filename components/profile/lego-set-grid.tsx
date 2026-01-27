"use client";

import { LegoSetCard } from "./lego-set-card";
import { LegoSet } from "@/types/lego-set";

interface LegoSetGridProps {
  sets: LegoSet[];
  onFavoriteToggle?: (setNum: string) => void;
}

export function LegoSetGrid({ sets, onFavoriteToggle }: LegoSetGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-2">
      {sets.map((set) => (
        <LegoSetCard
          key={set.setNum}
          set={set}
          onFavoriteToggle={onFavoriteToggle}
        />
      ))}
    </div>
  );
}
