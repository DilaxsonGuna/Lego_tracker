"use client";

import { Grid2X2, Heart, ChevronDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CollectionTab } from "@/types/lego-set";
import { cn } from "@/lib/utils";

interface CollectionTabsProps {
  activeTab: CollectionTab;
  onTabChange: (tab: CollectionTab) => void;
  onSearch?: (query: string) => void;
}

export function CollectionTabs({
  activeTab,
  onTabChange,
  onSearch,
}: CollectionTabsProps) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex p-1 bg-card rounded-xl border border-border">
          <Button
            variant="ghost"
            className={cn(
              "gap-2 rounded-lg px-5 py-2 text-sm font-medium transition-all",
              activeTab === "collection"
                ? "bg-primary text-primary-foreground font-bold shadow-sm hover:bg-primary hover:text-primary-foreground"
                : "text-muted-foreground hover:bg-primary-ghost hover:text-primary"
            )}
            onClick={() => onTabChange("collection")}
          >
            <Grid2X2 className="size-4" />
            My Collection
          </Button>
          <Button
            variant="ghost"
            className={cn(
              "gap-2 rounded-lg px-5 py-2 text-sm font-medium transition-colors",
              activeTab === "wishlist"
                ? "bg-primary text-primary-foreground font-bold shadow-sm hover:bg-primary hover:text-primary-foreground"
                : "text-muted-foreground hover:bg-primary-ghost hover:text-primary"
            )}
            onClick={() => onTabChange("wishlist")}
          >
            <Heart className="size-4" />
            My Wishlist
          </Button>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <Button
            variant="ghost"
            className="gap-1 text-sm font-medium text-foreground hover:bg-primary-ghost hover:text-primary"
          >
            Value (High to Low)
            <ChevronDown className="size-4" />
          </Button>
        </div>
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-5" />
        <Input
          className="h-10 w-full rounded-xl border-none bg-card pl-10 pr-4 text-sm placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-primary/50"
          placeholder="Search bricks, sets..."
          onChange={(e) => onSearch?.(e.target.value)}
        />
      </div>
    </section>
  );
}
