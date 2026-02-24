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
          label: "Total Pieces",
          value: (stats as CollectionStats).totalPieces,
        },
        {
          label: "Unique Sets",
          value: (stats as CollectionStats).setsOwned,
        },
      ]
    : [
        {
          label: "Total Pieces",
          value: (stats as WishlistStats).targetPieces,
        },
        {
          label: "Saved Sets",
          value: (stats as WishlistStats).savedSets,
        },
      ];

  return (
    <section className="bg-gradient-to-b from-card/80 to-transparent px-6 md:px-8 py-8 md:py-12">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-foreground uppercase italic">
            Vault <span className="text-primary/50">/</span>{" "}
            {isCollection ? "Collection" : "Wishlist"}
          </h1>
          <p className="text-sm text-muted-foreground font-medium mt-1">
            {isCollection
              ? "Your private collection inventory."
              : "Track sets you want to add to your collection."}
          </p>
        </div>

        {/* Stats Row */}
        <div className="flex flex-wrap items-center gap-8 md:gap-12">
          {statItems.map((item, index) => (
            <div key={item.label} className="flex items-center gap-8 md:gap-12">
              <div className="flex flex-col">
                <span className="text-xs uppercase tracking-wider text-muted-foreground font-bold mb-2">
                  {item.label}
                </span>
                <span className="text-3xl md:text-4xl font-black tracking-tighter text-foreground">
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
