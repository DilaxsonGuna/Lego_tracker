"use client";

import { Search, LayoutGrid, List } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { VaultViewMode } from "@/types/vault";

interface VaultTheme {
  id: number;
  name: string;
}

interface VaultToolbarProps {
  onSearch: (query: string) => void;
  themes: VaultTheme[];
  themeFilter: string;
  viewMode: VaultViewMode;
  onThemeChange: (theme: string) => void;
  onViewModeChange: (mode: VaultViewMode) => void;
}

export function VaultToolbar({
  onSearch,
  themes,
  themeFilter,
  viewMode,
  onThemeChange,
  onViewModeChange,
}: VaultToolbarProps) {
  return (
    <div className="sticky top-0 z-40 h-14 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="mx-auto h-full max-w-7xl flex items-center gap-4 px-6 md:px-8">
        {/* Search input */}
        <label className="relative flex items-center flex-1 max-w-sm group">
          <Search className="absolute left-3 size-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            type="text"
            placeholder="Search sets..."
            className="h-9 w-full pl-9 pr-4 rounded-lg bg-card/50 border-none text-xs focus-visible:ring-1 focus-visible:ring-primary/50"
            onChange={(e) => onSearch(e.target.value)}
          />
        </label>

        {/* Theme filter */}
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

        {/* View mode toggle */}
        <div className="ml-auto flex items-center bg-card/50 rounded-lg p-1">
          <button
            onClick={() => onViewModeChange("grid")}
            aria-label="Grid view"
            aria-pressed={viewMode === "grid"}
            className={`flex items-center justify-center p-1.5 rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
              viewMode === "grid"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <LayoutGrid className="size-[18px]" />
          </button>
          <button
            onClick={() => onViewModeChange("list")}
            aria-label="List view"
            aria-pressed={viewMode === "list"}
            className={`flex items-center justify-center p-1.5 rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
              viewMode === "list"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <List className="size-[18px]" />
          </button>
        </div>
      </div>
    </div>
  );
}
