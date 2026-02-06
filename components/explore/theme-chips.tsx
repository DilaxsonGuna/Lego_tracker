"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { ThemeCategory } from "@/types/explore";

interface ThemeChipsProps {
  categories: ThemeCategory[];
  activeId: number | "all";
  onSelect: (id: number | "all") => void;
}

export function ThemeChips({ categories, activeId, onSelect }: ThemeChipsProps) {
  // Filter out "All" since it's handled by the dropdown
  const chips = categories.filter((cat) => cat.id !== "all");

  return (
    <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide flex-1">
      {chips.map((cat) => (
        <Button
          key={cat.id}
          variant={cat.id === activeId ? "default" : "outline"}
          onClick={() => onSelect(cat.id)}
          className={cn(
            "flex-shrink-0 h-10 px-4 rounded-xl font-medium text-sm whitespace-nowrap",
            cat.id === activeId
              ? "font-bold shadow-sm"
              : "bg-card hover:border-primary/50 text-primary"
          )}
        >
          {cat.label}
        </Button>
      ))}
    </div>
  );
}
