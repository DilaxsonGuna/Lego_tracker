"use client";

import { Search, ChevronDown, SlidersHorizontal, LayoutGrid, ArrowDownWideNarrow } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ThemeChips } from "./theme-chips";
import type { ThemeCategory, OrderByOption } from "@/types/explore";

interface ExploreHeaderProps {
  categories: ThemeCategory[];
  activeCategory: string;
  onCategoryChange: (id: string) => void;
  onSearch: (query: string) => void;
  orderBy: OrderByOption;
  onOrderByChange: (orderBy: OrderByOption) => void;
}

const ORDER_BY_OPTIONS: { value: OrderByOption; label: string }[] = [
  { value: "newest", label: "Most Recent" },
  { value: "oldest", label: "Least Recent" },
];

export function ExploreHeader({
  categories,
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
          Discovery
        </h2>
      </div>

      {/* Row 2: Theme Filters & Order By */}
      <div className="flex flex-col xl:flex-row xl:items-center gap-4 justify-between">
        {/* Left: Theme dropdown + chips */}
        <div className="flex items-center gap-3 overflow-hidden">
          {/* All Themes Dropdown */}
          <div className="relative flex-shrink-0">
            <select
              value={activeCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="appearance-none flex items-center gap-2 h-10 pl-4 pr-10 rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-sm hover:brightness-110 transition-all cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
            <LayoutGrid className="absolute left-4 top-1/2 -translate-y-1/2 size-4 pointer-events-none hidden" />
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 pointer-events-none" />
          </div>

          {/* Divider */}
          <div className="h-6 w-px bg-border mx-1 flex-shrink-0" />

          {/* Theme Quick Chips */}
          <ThemeChips
            categories={categories}
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
            <div className="relative">
              <select
                value={orderBy}
                onChange={(e) => onOrderByChange(e.target.value as OrderByOption)}
                className="appearance-none h-10 pl-4 pr-10 rounded-xl bg-card border border-border focus:ring-2 focus:ring-primary text-sm font-bold cursor-pointer transition-all"
              >
                {ORDER_BY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ArrowDownWideNarrow className="absolute right-3 top-1/2 -translate-y-1/2 size-4 pointer-events-none text-muted-foreground" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
