"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ArrowDownWideNarrow, Plus, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ThemeChips } from "./theme-chips";
import { ThemeFilterModal } from "./theme-filter-modal";
import type { ThemeCategory, OrderByOption } from "@/types/explore";

interface ExploreHeaderProps {
  categories: ThemeCategory[];
  topThemes: ThemeCategory[];
  selectedThemes: number[];
  onThemesChange: (ids: number[]) => void;
  onSearch: (query: string) => void;
  orderBy: OrderByOption;
  onOrderByChange: (orderBy: OrderByOption) => void;
  hasUserThemes: boolean;
}

const ORDER_BY_OPTIONS: { value: OrderByOption; label: string }[] = [
  { value: "newest", label: "Most Recent" },
  { value: "oldest", label: "Least Recent" },
  { value: "most-popular", label: "Most Popular" },
];

export function ExploreHeader({
  categories,
  topThemes,
  selectedThemes,
  onThemesChange,
  onSearch,
  orderBy,
  onOrderByChange,
  hasUserThemes,
}: ExploreHeaderProps) {
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);

  // Get button label based on selection
  const getThemeButtonLabel = () => {
    if (selectedThemes.length === 0) return "All Themes";
    if (selectedThemes.length === 1) {
      const theme = categories.find((c) => c.id === selectedThemes[0]);
      return theme?.label ?? "1 theme";
    }
    return `${selectedThemes.length} themes`;
  };

  // Handle quick chip toggle
  const handleChipToggle = (themeId: number) => {
    if (selectedThemes.includes(themeId)) {
      onThemesChange(selectedThemes.filter((id) => id !== themeId));
    } else if (selectedThemes.length < 10) {
      onThemesChange([...selectedThemes, themeId]);
    }
  };

  return (
    <div className="sm:sticky sm:top-0 z-10 bg-background sm:backdrop-blur-md pt-6 pb-4 px-4 sm:px-6 md:px-10 border-b border-border flex flex-col gap-6">
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
        {/* Left: Theme filter button + chips */}
        <div className="flex items-center gap-3 overflow-hidden">
          {/* Theme Filter Button */}
          <Button
            onClick={() => setIsThemeModalOpen(true)}
            className="h-10 px-4 rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-sm hover:brightness-110 transition-all flex-shrink-0"
          >
            {getThemeButtonLabel()}
            <ChevronDown className="size-4 ml-2" />
          </Button>

          {/* Theme Filter Modal */}
          <ThemeFilterModal
            open={isThemeModalOpen}
            onOpenChange={setIsThemeModalOpen}
            themes={categories}
            selectedThemeIds={selectedThemes}
            onChange={onThemesChange}
            maxThemes={10}
          />

          {/* Divider */}
          <div className="h-6 w-px bg-border mx-1 flex-shrink-0" />

          {/* Top Theme Quick Chips or Add Themes Button */}
          {hasUserThemes ? (
            <ThemeChips
              categories={topThemes}
              selectedIds={selectedThemes}
              onToggle={handleChipToggle}
              maxSelected={10}
            />
          ) : (
            <Link href="/settings/profile">
              <Button
                variant="outline"
                className="rounded-xl gap-2 h-10 px-4 border-primary/30 bg-primary/5 text-primary hover:bg-primary/10"
              >
                <Plus className="size-4" />
                Add Favorite Themes
              </Button>
            </Link>
          )}
        </div>

        {/* Right: Order By & Filters */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Order By */}
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-xs font-bold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
              Order By:
            </span>
            <Select value={orderBy} onValueChange={(val) => onOrderByChange(val as OrderByOption)}>
              <SelectTrigger className="h-10 px-4 rounded-xl bg-card border border-border text-primary text-base sm:text-sm font-bold">
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
