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
  collectionCount,
  wishlistCount,
}: CollectionTabsProps) {
  return (
    <div className="bg-card/40 backdrop-blur-sm border-b border-border px-6 md:px-8 py-4">
      <div className="mx-auto max-w-7xl flex items-center justify-center">
        <div className="inline-flex items-center bg-card/40 backdrop-blur-sm rounded-xl p-1 border border-border gap-1" role="tablist">
          <button
            onClick={() => onTabChange("collection")}
            aria-selected={activeTab === "collection"}
            role="tab"
            className={`flex items-center gap-2 h-10 px-4 rounded-lg font-medium text-sm transition-all duration-200 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
              activeTab === "collection"
                ? "bg-primary text-primary-foreground font-bold"
                : "text-muted-foreground hover:bg-primary/10"
            }`}
          >
            <Package className="size-4" />
            <span>Collection</span>
            <span
              className={`ml-1 px-1.5 py-0.5 rounded-md text-xs font-bold ${
                activeTab === "collection"
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {collectionCount}
            </span>
          </button>

          <button
            onClick={() => onTabChange("wishlist")}
            aria-selected={activeTab === "wishlist"}
            role="tab"
            className={`flex items-center gap-2 h-10 px-4 rounded-lg font-medium text-sm transition-all duration-200 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
              activeTab === "wishlist"
                ? "bg-primary text-primary-foreground font-bold"
                : "text-muted-foreground hover:bg-primary/10"
            }`}
          >
            <Heart className="size-4" />
            <span>Wishlist</span>
            <span
              className={`ml-1 px-1.5 py-0.5 rounded-md text-xs font-bold ${
                activeTab === "wishlist"
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {wishlistCount}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
