"use client";

import { useState, useMemo } from "react";
import { Search, Plus } from "lucide-react";
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

interface ThemeSelectorProps {
  availableThemes: ThemeCategory[];
  popularThemes?: ThemeCategory[];
  selectedThemeIds: number[];
  onChange: (themeIds: number[]) => void;
  maxThemes?: number;
}

export function ThemeSelector({
  availableThemes,
  popularThemes,
  selectedThemeIds,
  onChange,
  maxThemes = 10,
}: ThemeSelectorProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleToggle = (themeId: number) => {
    if (selectedThemeIds.includes(themeId)) {
      onChange(selectedThemeIds.filter((id) => id !== themeId));
    } else {
      if (selectedThemeIds.length < maxThemes) {
        onChange([...selectedThemeIds, themeId]);
      }
    }
  };

  // Filter out "all" from themes
  const allThemes = availableThemes.filter((theme) => theme.id !== "all");

  // Themes to show in the main view: popular + any selected that aren't in popular
  const visibleThemes = useMemo(() => {
    if (!popularThemes || popularThemes.length === 0) {
      // Fallback to showing all themes if no popular themes provided
      return allThemes;
    }

    const popularIds = new Set(popularThemes.map((t) => t.id as number));

    // Get selected themes that aren't in popular list
    const selectedNotInPopular = allThemes.filter(
      (theme) =>
        selectedThemeIds.includes(theme.id as number) &&
        !popularIds.has(theme.id as number)
    );

    return [...popularThemes, ...selectedNotInPopular];
  }, [popularThemes, allThemes, selectedThemeIds]);

  // Filtered themes for the dialog
  const filteredThemes = useMemo(() => {
    if (!searchQuery.trim()) return allThemes;
    const query = searchQuery.toLowerCase();
    return allThemes.filter((theme) =>
      theme.label.toLowerCase().includes(query)
    );
  }, [allThemes, searchQuery]);

  const renderThemeBadge = (theme: ThemeCategory, inDialog: boolean = false) => {
    const themeId = theme.id as number;
    const isSelected = selectedThemeIds.includes(themeId);
    const isDisabled = !isSelected && selectedThemeIds.length >= maxThemes;

    return (
      <Badge
        key={themeId}
        variant={isSelected ? "default" : "outline"}
        className={`px-4 py-2 rounded-full text-sm font-medium cursor-pointer transition-colors ${
          isSelected
            ? "border-primary bg-primary/5 text-primary hover:bg-primary/10"
            : isDisabled
              ? "border-border text-muted-foreground/50 cursor-not-allowed"
              : "border-border text-muted-foreground hover:border-muted-foreground hover:bg-transparent"
        }`}
        onClick={() => !isDisabled && handleToggle(themeId)}
      >
        {theme.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {visibleThemes.map((theme) => renderThemeBadge(theme))}

        {/* View More Button */}
        {popularThemes && popularThemes.length > 0 && allThemes.length > popularThemes.length && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsDialogOpen(true)}
            className="px-4 py-2 h-auto rounded-full border-primary/20 bg-primary/5 text-primary hover:bg-primary/10"
          >
            <Plus className="size-4 mr-1" />
            View More
          </Button>
        )}
      </div>

      <p className="text-[10px] text-muted-foreground">
        {selectedThemeIds.length}/{maxThemes} themes selected
      </p>

      {/* All Themes Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>All Themes</DialogTitle>
            <DialogDescription>
              Search and select up to {maxThemes} favorite themes
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

          {/* Themes Grid */}
          <div className="flex-1 overflow-y-auto py-4 -mx-6 px-6">
            <div className="flex flex-wrap gap-2">
              {filteredThemes.length > 0 ? (
                filteredThemes.map((theme) => renderThemeBadge(theme, true))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No themes found matching "{searchQuery}"
                </p>
              )}
            </div>
          </div>

          {/* Selection Counter */}
          <div className="pt-4 border-t border-border flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              {selectedThemeIds.length}/{maxThemes} themes selected
            </p>
            <Button
              type="button"
              onClick={() => setIsDialogOpen(false)}
              className="rounded-lg"
            >
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
