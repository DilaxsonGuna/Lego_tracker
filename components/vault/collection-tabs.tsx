"use client";

import { Package, Heart } from "lucide-react";
import type { CollectionTab } from "@/types/lego-set";

interface CollectionTabsProps {
  activeTab: CollectionTab;
  onTabChange: (tab: CollectionTab) => void;
  collectionCount: number;
  wishlistCount: number;
}

export function CollectionTabs({
  activeTab,
  onTabChange,
}: CollectionTabsProps) {
  return (
    <div className="sticky top-0 z-30 flex justify-center py-4 pointer-events-none">
      <div
        className="relative flex p-1 bg-card/90 backdrop-blur-md rounded-full border border-border w-64 h-12 items-center shadow-2xl pointer-events-auto"
        role="tablist"
      >
        {/* Sliding indicator */}
        <div
          className={`absolute left-1 top-1 bottom-1 w-[calc(50%-4px)] bg-primary rounded-full transition-transform duration-300 ease-out ${
            activeTab === "wishlist" ? "translate-x-[calc(100%+8px)]" : "translate-x-0"
          }`}
        />

        {/* Collection tab */}
        <button
          onClick={() => onTabChange("collection")}
          aria-selected={activeTab === "collection"}
          role="tab"
          className={`relative z-10 flex-1 flex items-center justify-center gap-2 text-xs font-black uppercase tracking-tighter transition-colors cursor-pointer ${
            activeTab === "collection"
              ? "text-primary-foreground"
              : "text-muted-foreground"
          }`}
        >
          <Package className="size-4" />
          Collection
        </button>

        {/* Wishlist tab */}
        <button
          onClick={() => onTabChange("wishlist")}
          aria-selected={activeTab === "wishlist"}
          role="tab"
          className={`relative z-10 flex-1 flex items-center justify-center gap-2 text-xs font-black uppercase tracking-tighter transition-colors cursor-pointer ${
            activeTab === "wishlist"
              ? "text-primary-foreground"
              : "text-muted-foreground"
          }`}
        >
          <Heart className="size-4" />
          Wishlist
        </button>
      </div>
    </div>
  );
}
