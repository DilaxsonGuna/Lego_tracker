"use client";

import { cn } from "@/lib/utils";
import type { ThemeCategory } from "@/types/explore";

interface ThemeChipsProps {
  categories: ThemeCategory[];
  activeId: string;
  onSelect: (id: string) => void;
}

export function ThemeChips({ categories, activeId, onSelect }: ThemeChipsProps) {
  return (
    <div className="flex gap-3 pb-2 overflow-x-auto scrollbar-hide">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={cn(
            "flex-shrink-0 h-9 px-5 rounded-lg font-medium text-sm transition-all whitespace-nowrap",
            cat.id === activeId
              ? "bg-primary text-primary-foreground font-bold shadow-sm"
              : "bg-card border border-transparent hover:border-primary/50 text-muted-foreground"
          )}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
