"use client";

import type { CollectionStats, WishlistStats } from "@/types/vault";
import type { CollectionTab } from "@/types/lego-set";

interface VaultStatsHeroProps {
  stats: CollectionStats | WishlistStats;
  activeTab: CollectionTab;
}

export function VaultStatsHero({ stats, activeTab }: VaultStatsHeroProps) {
  const isCollection = activeTab === "collection";

  const statItems = isCollection
    ? [
        {
          label: "Total Market Value",
          value: (stats as CollectionStats).totalValue,
          isPrimary: true,
        },
        {
          label: "Total Pieces",
          value: (stats as CollectionStats).totalPieces,
          isPrimary: false,
        },
        {
          label: "Unique Sets",
          value: (stats as CollectionStats).setsOwned,
          isPrimary: false,
        },
      ]
    : [
        {
          label: "Estimated Cost",
          value: (stats as WishlistStats).estimatedCost,
          isPrimary: true,
        },
        {
          label: "Target Bricks",
          value: (stats as WishlistStats).targetBricks,
          isPrimary: false,
        },
        {
          label: "Saved Sets",
          value: (stats as WishlistStats).savedSets,
          isPrimary: false,
        },
      ];

  return (
    <section className="bg-gradient-to-b from-card/80 to-transparent px-6 md:px-8 py-8 md:py-12">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-foreground uppercase italic">
            Vault <span className="text-primary/50">/</span>{" "}
            {isCollection ? "My Shelf" : "Wishlist"}
          </h1>
          <p className="text-sm text-muted-foreground font-medium mt-1">
            {isCollection
              ? "Real-time valuation and inventory analytics for your private collection."
              : "Track sets you want to add to your collection."}
          </p>
        </div>

        {/* Stats Row */}
        <div className="flex flex-wrap items-center gap-8 md:gap-12">
          {statItems.map((item, index) => (
            <div key={item.label} className="flex items-center gap-8 md:gap-12">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold mb-2">
                  {item.label}
                </span>
                <span
                  className={`text-3xl md:text-4xl font-black tracking-tighter ${
                    item.isPrimary ? "text-primary" : "text-foreground"
                  }`}
                >
                  {item.value}
                </span>
              </div>
              {index < statItems.length - 1 && (
                <div className="hidden sm:block h-12 w-px bg-border" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
