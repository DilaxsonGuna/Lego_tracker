"use client";

import { LayoutGrid, List } from "lucide-react";
import type { VaultSetStatus, VaultViewMode } from "@/types/vault";

interface VaultFiltersProps {
  themeFilter: string;
  statusFilter: string;
  viewMode: VaultViewMode;
  onThemeChange: (theme: string) => void;
  onStatusChange: (status: string) => void;
  onViewModeChange: (mode: VaultViewMode) => void;
}

const THEME_OPTIONS = [
  "All Themes",
  "Ninjago",
  "City",
  "Harry Potter",
  "Technic",
  "Star Wars",
  "Icons",
];

const STATUS_OPTIONS: { label: string; value: string }[] = [
  { label: "Any Status", value: "all" },
  { label: "Built", value: "built" },
  { label: "In Box", value: "in-box" },
  { label: "Missing Parts", value: "missing-parts" },
  { label: "For Sale", value: "for-sale" },
];

export function VaultFilters({
  themeFilter,
  statusFilter,
  viewMode,
  onThemeChange,
  onStatusChange,
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
          <select
            value={themeFilter}
            onChange={(e) => onThemeChange(e.target.value)}
            className="bg-card border border-border rounded-lg text-xs font-medium text-foreground focus:ring-primary focus:border-primary px-3 py-1.5 min-w-[140px]"
          >
            {THEME_OPTIONS.map((theme) => (
              <option key={theme} value={theme}>
                {theme}
              </option>
            ))}
          </select>
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-tighter">
            Status
          </span>
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="bg-card border border-border rounded-lg text-xs font-medium text-foreground focus:ring-primary focus:border-primary px-3 py-1.5 min-w-[140px]"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
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
