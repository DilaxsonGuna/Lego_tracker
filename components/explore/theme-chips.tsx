"use client";

import { cn } from "@/lib/utils";
import type { ThemeCategory } from "@/types/explore";

interface ThemeChipsProps {
  categories: ThemeCategory[];
  activeId: string;
  onSelect: (id: string) => void;
}

export function ThemeChips({ categories, activeId, onSelect }: ThemeChipsProps) {
  // Filter out "All" since it's handled by the dropdown
  const chips = categories.filter((cat) => cat.id !== "all");

  return (
    <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide flex-1 mask-gradient-right">
      {chips.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={cn(
            "flex-shrink-0 h-10 px-4 rounded-xl font-medium text-sm transition-all whitespace-nowrap",
            cat.id === activeId
              ? "bg-primary text-primary-foreground font-bold shadow-sm"
              : "bg-card border border-border hover:border-primary/50 text-muted-foreground"
          )}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
