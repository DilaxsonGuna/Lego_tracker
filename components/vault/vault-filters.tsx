"use client";

import { LayoutGrid, List } from "lucide-react";
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

interface VaultFiltersProps {
  themes: VaultTheme[];
  themeFilter: string;
  viewMode: VaultViewMode;
  onThemeChange: (theme: string) => void;
  onViewModeChange: (mode: VaultViewMode) => void;
}

export function VaultFilters({
  themes,
  themeFilter,
  viewMode,
  onThemeChange,
  onViewModeChange,
}: VaultFiltersProps) {
  return (
    <div className="bg-card/40 border-b border-border px-6 md:px-8 py-4">
      <div className="mx-auto max-w-7xl flex flex-wrap items-center gap-4 md:gap-6">
        {/* Theme filter */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-tighter">
            Theme
          </span>
          <Select value={themeFilter} onValueChange={onThemeChange}>
            <SelectTrigger size="sm" className="min-w-[140px] text-xs">
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
        <div className="ml-auto flex items-center bg-card rounded-lg p-1 border border-border">
          <button
            onClick={() => onViewModeChange("grid")}
            className={`flex items-center justify-center p-1.5 rounded transition-colors ${
              viewMode === "grid"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <LayoutGrid className="size-[18px]" />
          </button>
          <button
            onClick={() => onViewModeChange("list")}
            className={`flex items-center justify-center p-1.5 rounded transition-colors ${
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
