"use client";

import { Search, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { CollectionStats, WishlistStats } from "@/types/vault";
import type { CollectionTab } from "@/types/lego-set";

interface VaultHeaderProps {
  stats: CollectionStats | WishlistStats;
  activeTab: CollectionTab;
  onSearch: (query: string) => void;
}

export function VaultHeader({ stats, activeTab, onSearch }: VaultHeaderProps) {
  const isCollection = activeTab === "collection";

  return (
    <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="mx-auto flex flex-col md:flex-row items-start md:items-center justify-between px-6 md:px-8 py-4 md:h-20 gap-4 md:gap-0 max-w-7xl">
        <div className="flex items-center gap-6 md:gap-8">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
              {isCollection ? "Total Market Value" : "Estimated Cost"}
            </span>
            <span className="text-xl font-black text-primary">
              {isCollection ? (stats as CollectionStats).totalValue : (stats as WishlistStats).estimatedCost}
            </span>
          </div>
          <div className="hidden md:block h-8 w-px bg-border" />
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
              {isCollection ? "Total Pieces" : "Target Bricks"}
            </span>
            <span className="text-xl font-bold text-foreground">
              {isCollection ? (stats as CollectionStats).totalPieces : (stats as WishlistStats).targetBricks}
            </span>
          </div>
          <div className="hidden md:block h-8 w-px bg-border" />
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
              {isCollection ? "Sets Owned" : "Saved Sets"}
            </span>
            <span className="text-xl font-bold text-foreground">
              {isCollection ? (stats as CollectionStats).setsOwned : (stats as WishlistStats).savedSets}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <label className="relative flex items-center flex-1 md:flex-initial group">
            <Search className="absolute left-3 size-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              type="text"
              placeholder="Filter vault..."
              className="h-9 w-full md:w-48 pl-9 pr-4 rounded-lg bg-card border-none text-xs focus-visible:ring-1 focus-visible:ring-primary/50"
              onChange={(e) => onSearch(e.target.value)}
            />
          </label>
          <button
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-card text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Vault settings"
          >
            <Settings className="size-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
