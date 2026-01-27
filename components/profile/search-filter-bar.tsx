"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FilterChip } from "./filter-chip";
import { ThemeFilter } from "@/types/lego-set";

interface SearchFilterBarProps {
  filters: ThemeFilter[];
  onFilterChange?: (filterId: string) => void;
  onSearch?: (query: string) => void;
}

export function SearchFilterBar({
  filters,
  onFilterChange,
  onSearch,
}: SearchFilterBarProps) {
  return (
    <div className="sticky top-[72px] z-40 bg-background py-4 px-2 -mx-2 md:mx-0">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="size-5 text-muted-foreground" />
          </div>
          <Input
            type="text"
            placeholder="Find a set in collection..."
            className="pl-10 pr-3 py-3 rounded-xl border-none bg-card text-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary shadow-sm h-auto"
            onChange={(e) => onSearch?.(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
          {filters.map((filter) => (
            <FilterChip
              key={filter.id}
              label={filter.label}
              isActive={filter.isActive}
              onClick={() => onFilterChange?.(filter.id)}
            />
          ))}
          <Button
            variant="ghost"
            size="icon"
            className="size-9 shrink-0 rounded-xl bg-card hover:bg-secondary border border-transparent dark:border-border"
          >
            <SlidersHorizontal className="size-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
