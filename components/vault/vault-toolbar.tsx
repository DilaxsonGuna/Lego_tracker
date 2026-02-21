"use client";

import { Search, LayoutGrid, List, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { VaultViewMode, VaultSortOption } from "@/types/vault";

interface VaultTheme {
  id: number;
  name: string;
}

const SORT_OPTIONS: { value: VaultSortOption; label: string }[] = [
  { value: "recently-added", label: "Recently Added" },
  { value: "name-asc", label: "Name A-Z" },
  { value: "name-desc", label: "Name Z-A" },
  { value: "year-newest", label: "Year (Newest)" },
  { value: "year-oldest", label: "Year (Oldest)" },
  { value: "pieces-most", label: "Pieces (Most)" },
  { value: "pieces-least", label: "Pieces (Least)" },
];

interface VaultToolbarProps {
  onSearch: (query: string) => void;
  themes: VaultTheme[];
  themeFilter: string;
  viewMode: VaultViewMode;
  sortOption: VaultSortOption;
  onThemeChange: (theme: string) => void;
  onViewModeChange: (mode: VaultViewMode) => void;
  onSortChange: (sort: VaultSortOption) => void;
}

export function VaultToolbar({
  onSearch,
  themes,
  themeFilter,
  viewMode,
  sortOption,
  onThemeChange,
  onViewModeChange,
  onSortChange,
}: VaultToolbarProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const hasActiveFilter = themeFilter !== "all" || sortOption !== "recently-added";

  return (
    <div className="sticky top-0 z-40 h-14 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="mx-auto h-full max-w-7xl flex items-center gap-4 px-6 md:px-8">
        {/* Search input */}
        <label className="relative flex items-center flex-1 max-w-none sm:max-w-sm group">
          <Search className="absolute left-3 size-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            type="text"
            placeholder="Search sets..."
            className="h-9 w-full pl-9 pr-4 rounded-lg bg-card/50 border-none text-base sm:text-xs focus-visible:ring-1 focus-visible:ring-primary/50"
            onChange={(e) => onSearch(e.target.value)}
          />
        </label>

        {/* Mobile filter button */}
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="sm:hidden relative size-9 rounded-lg bg-card/50"
              aria-label="Filters"
            >
              <SlidersHorizontal className="size-4" />
              {hasActiveFilter && (
                <span className="absolute top-1 right-1 size-2 rounded-full bg-primary" />
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="rounded-t-2xl">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-6 py-4">
              {/* Theme filter */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-medium text-muted-foreground">
                  Theme
                </span>
                <Select value={themeFilter} onValueChange={(v) => { onThemeChange(v); }}>
                  <SelectTrigger className="w-full text-sm">
                    <SelectValue placeholder="All Themes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Themes</SelectItem>
                    {themes.map((theme) => (
                      <SelectItem key={theme.id} value={theme.name}>
                        {theme.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Sort */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-medium text-muted-foreground">
                  Sort By
                </span>
                <Select value={sortOption} onValueChange={(v) => { onSortChange(v as VaultSortOption); }}>
                  <SelectTrigger className="w-full text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SORT_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Apply / Reset */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    onThemeChange("all");
                    onSortChange("recently-added");
                    setSheetOpen(false);
                  }}
                >
                  Reset
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => setSheetOpen(false)}
                >
                  Apply
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Desktop: Theme filter */}
        <div className="hidden sm:flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">
            Theme
          </span>
          <Select value={themeFilter} onValueChange={onThemeChange}>
            <SelectTrigger size="sm" className="min-w-[120px] text-xs h-9 bg-card/50 border-none">
              <SelectValue placeholder="All Themes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Themes</SelectItem>
              {themes.map((theme) => (
                <SelectItem key={theme.id} value={theme.name}>
                  {theme.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Desktop: Sort */}
        <div className="hidden sm:flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">
            Sort
          </span>
          <Select value={sortOption} onValueChange={(v) => onSortChange(v as VaultSortOption)}>
            <SelectTrigger size="sm" className="min-w-[140px] text-xs h-9 bg-card/50 border-none">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Desktop: View mode toggle */}
        <div className="ml-auto hidden sm:flex items-center bg-card/50 rounded-lg p-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onViewModeChange("grid")}
            aria-label="Grid view"
            aria-pressed={viewMode === "grid"}
            className={`size-7 rounded ${
              viewMode === "grid"
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "text-muted-foreground hover:text-foreground hover:bg-transparent"
            }`}
          >
            <LayoutGrid className="size-[18px]" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onViewModeChange("list")}
            aria-label="List view"
            aria-pressed={viewMode === "list"}
            className={`size-7 rounded ${
              viewMode === "list"
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "text-muted-foreground hover:text-foreground hover:bg-transparent"
            }`}
          >
            <List className="size-[18px]" />
          </Button>
        </div>
      </div>
    </div>
  );
}
