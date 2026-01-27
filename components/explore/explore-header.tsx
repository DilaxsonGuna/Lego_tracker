"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ThemeChips } from "./theme-chips";
import type { ThemeCategory } from "@/types/explore";

interface ExploreHeaderProps {
  categories: ThemeCategory[];
  activeCategory: string;
  onCategoryChange: (id: string) => void;
  onSearch: (query: string) => void;
}

export function ExploreHeader({
  categories,
  activeCategory,
  onCategoryChange,
  onSearch,
}: ExploreHeaderProps) {
  return (
    <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-md pt-6 pb-2 px-6 md:px-10 border-b border-border/50 flex flex-col gap-6">
      {/* Title & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <h2 className="text-3xl md:text-4xl font-black tracking-tight text-foreground hidden md:block">
          Discovery
        </h2>
        <div className="w-full md:max-w-xl">
          <label className="relative flex items-center w-full group">
            <Search className="absolute left-4 size-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              type="text"
              placeholder="Search by set name or #"
              className="w-full h-12 pl-12 pr-12 rounded-xl bg-card border-none focus-visible:ring-2 focus-visible:ring-primary text-sm md:text-base shadow-sm"
              onChange={(e) => onSearch(e.target.value)}
            />
            <button className="absolute right-3 p-1 rounded-lg hover:bg-muted text-muted-foreground transition-colors">
              <SlidersHorizontal className="size-5" />
            </button>
          </label>
        </div>
      </div>

      {/* Theme Chips */}
      <ThemeChips
        categories={categories}
        activeId={activeCategory}
        onSelect={onCategoryChange}
      />
    </div>
  );
}
