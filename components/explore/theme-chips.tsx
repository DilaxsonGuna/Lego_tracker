"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { ThemeCategory } from "@/types/explore";

interface ThemeChipsProps {
  categories: ThemeCategory[];
  selectedIds: number[];
  onToggle: (id: number) => void;
  maxSelected?: number;
}

export function ThemeChips({
  categories,
  selectedIds,
  onToggle,
  maxSelected = 10,
}: ThemeChipsProps) {
  // Filter out "All" since it's handled elsewhere
  const chips = categories.filter((cat) => cat.id !== "all");

  return (
    <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide flex-1">
      {chips.map((cat) => {
        const themeId = cat.id as number;
        const isSelected = selectedIds.includes(themeId);
        const isDisabled = !isSelected && selectedIds.length >= maxSelected;

        return (
          <Button
            key={cat.id}
            variant={isSelected ? "default" : "outline"}
            onClick={() => !isDisabled && onToggle(themeId)}
            disabled={isDisabled}
            className={cn(
              "flex-shrink-0 h-10 px-4 rounded-xl font-medium text-sm whitespace-nowrap",
              isSelected
                ? "font-bold shadow-sm"
                : "bg-card hover:border-primary/50 text-primary",
              isDisabled && "opacity-50 cursor-not-allowed"
            )}
          >
            {cat.label}
          </Button>
        );
      })}
    </div>
  );
}
