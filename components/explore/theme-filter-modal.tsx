"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import type { ThemeCategory } from "@/types/explore";
import { removeAccents } from "@/lib/utils";

interface ThemeFilterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  themes: ThemeCategory[];
  selectedThemeIds: number[];
  onChange: (themeIds: number[]) => void;
  maxThemes?: number;
}

export function ThemeFilterModal({
  open,
  onOpenChange,
  themes,
  selectedThemeIds,
  onChange,
  maxThemes = 10,
}: ThemeFilterModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  // Local selection state for the modal
  const [localSelection, setLocalSelection] = useState<number[]>(selectedThemeIds);

  // Sync local selection when modal opens
  useEffect(() => {
    if (open) {
      setLocalSelection(selectedThemeIds);
      setSearchQuery("");
    }
  }, [open, selectedThemeIds]);

  const handleToggle = (themeId: number) => {
    if (localSelection.includes(themeId)) {
      setLocalSelection(localSelection.filter((id) => id !== themeId));
    } else {
      if (localSelection.length < maxThemes) {
        setLocalSelection([...localSelection, themeId]);
      }
    }
  };

  const handleApply = () => {
    onChange(localSelection);
    onOpenChange(false);
  };

  const handleClearAll = () => {
    setLocalSelection([]);
  };

  // Filter out "all" from themes
  const allThemes = themes.filter((theme) => theme.id !== "all");

  // Filtered themes for search (accent-insensitive)
  const filteredThemes = useMemo(() => {
    if (!searchQuery.trim()) return allThemes;
    const query = removeAccents(searchQuery.toLowerCase());
    return allThemes.filter((theme) =>
      removeAccents(theme.label.toLowerCase()).includes(query)
    );
  }, [allThemes, searchQuery]);

  const renderThemeBadge = (theme: ThemeCategory) => {
    const themeId = theme.id as number;
    const isSelected = localSelection.includes(themeId);
    const isDisabled = !isSelected && localSelection.length >= maxThemes;

    return (
      <Badge
        key={themeId}
        variant={isSelected ? "default" : "outline"}
        className={`px-4 py-2 rounded-full text-sm font-medium cursor-pointer transition-colors ${
          isSelected
            ? "border-primary bg-primary/5 text-primary hover:bg-primary/10"
            : isDisabled
              ? "border-border text-muted-foreground cursor-not-allowed"
              : "border-border text-muted-foreground hover:border-muted-foreground hover:bg-transparent"
        }`}
        onClick={() => !isDisabled && handleToggle(themeId)}
      >
        {theme.label}
      </Badge>
    );
  };

  const hasChanges = JSON.stringify(localSelection.sort()) !== JSON.stringify(selectedThemeIds.sort());

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Filter by Theme</DialogTitle>
          <DialogDescription>
            Select up to {maxThemes} themes to filter discovery sets
          </DialogDescription>
        </DialogHeader>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search themes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10 rounded-lg"
          />
        </div>

        {/* Themes Grid - Fixed height with scroll */}
        <div className="h-[300px] overflow-y-auto py-4 -mx-6 px-6">
          <div className="flex flex-wrap gap-2">
            {filteredThemes.length > 0 ? (
              filteredThemes.map((theme) => renderThemeBadge(theme))
            ) : (
              <p className="text-sm text-muted-foreground">
                No themes found matching "{searchQuery}"
              </p>
            )}
          </div>
        </div>

        {/* Footer with actions */}
        <div className="pt-4 border-t border-border flex justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <p className="text-sm text-muted-foreground">
              {localSelection.length}/{maxThemes} selected
            </p>
            {localSelection.length > 0 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleClearAll}
                className="text-muted-foreground hover:text-foreground h-8 px-2"
              >
                <X className="size-3 mr-1" />
                Clear
              </Button>
            )}
          </div>
          <Button
            type="button"
            onClick={handleApply}
            className="rounded-lg"
          >
            Apply Filter
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
