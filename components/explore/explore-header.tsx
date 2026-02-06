"use client";

import { Search, ArrowDownWideNarrow } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ThemeChips } from "./theme-chips";
import type { ThemeCategory, OrderByOption } from "@/types/explore";

interface ExploreHeaderProps {
  categories: ThemeCategory[];
  topThemes: ThemeCategory[];
  activeCategory: number | "all";
  onCategoryChange: (id: number | "all") => void;
  onSearch: (query: string) => void;
  orderBy: OrderByOption;
  onOrderByChange: (orderBy: OrderByOption) => void;
}

const ORDER_BY_OPTIONS: { value: OrderByOption; label: string }[] = [
  { value: "newest", label: "Most Recent" },
  { value: "oldest", label: "Least Recent" },
  { value: "most-popular", label: "Most Popular" },
];

export function ExploreHeader({
  categories,
  topThemes,
  activeCategory,
  onCategoryChange,
  onSearch,
  orderBy,
  onOrderByChange,
}: ExploreHeaderProps) {
  const activeThemeLabel = categories.find((c) => c.id === activeCategory)?.label ?? "All Themes";

  return (
    <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-md pt-6 pb-4 px-6 md:px-10 border-b border-border/50 flex flex-col gap-6">
      {/* Row 1: Search & Title */}
      <div className="flex items-center justify-between gap-6">
        <div className="flex-1">
          <label className="relative flex items-center w-full group">
            <Search className="absolute left-4 size-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              type="text"
              placeholder="Search by set name, theme, or #ID..."
              className="w-full h-14 pl-12 pr-4 rounded-xl bg-card border border-border focus-visible:ring-2 focus-visible:ring-primary text-base shadow-sm"
              onChange={(e) => onSearch(e.target.value)}
            />
          </label>
        </div>
        <h2 className="hidden lg:block text-2xl font-black tracking-tight uppercase italic">
          Explore
        </h2>
      </div>

      {/* Row 2: Theme Filters & Order By */}
      <div className="flex flex-col xl:flex-row xl:items-center gap-4 justify-between">
        {/* Left: Theme dropdown + chips */}
        <div className="flex items-center gap-3 overflow-hidden">
          {/* All Themes Dropdown */}
          <Select
            value={String(activeCategory)}
            onValueChange={(val) => onCategoryChange(val === "all" ? "all" : Number(val))}
          >
            <SelectTrigger className="h-10 px-4 rounded-xl bg-primary text-primary font-bold text-sm shadow-sm hover:brightness-110 transition-all border-none">
              <SelectValue placeholder="All Themes" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={String(cat.id)}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Divider */}
          <div className="h-6 w-px bg-border mx-1 flex-shrink-0" />

          {/* Top Theme Quick Chips */}
          <ThemeChips
            categories={topThemes}
            activeId={activeCategory}
            onSelect={onCategoryChange}
          />
        </div>

        {/* Right: Order By & Filters */}
        <div className="flex items-center gap-3">
          {/* Order By */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
              Order By:
            </span>
            <Select value={orderBy} onValueChange={(val) => onOrderByChange(val as OrderByOption)}>
              <SelectTrigger className="h-10 px-4 rounded-xl bg-card border border-border text-primary text-sm font-bold">
                <ArrowDownWideNarrow className="size-4 text-muted-foreground" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ORDER_BY_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
