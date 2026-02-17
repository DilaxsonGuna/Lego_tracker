"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  VaultToolbar,
  VaultStatsHero,
  CollectionTabs,
  VaultGrid,
} from "@/components/vault";
import type { VaultSet, CollectionStats, WishlistStats, VaultViewMode } from "@/types/vault";
import type { CollectionTab } from "@/types/lego-set";

// Normalize string for accent-insensitive search
const normalize = (str: string) =>
  str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

interface VaultTheme {
  id: number;
  name: string;
}

interface PublicVaultClientProps {
  userId: string;
  username: string;
  initialSets: VaultSet[];
  collectionStats: CollectionStats;
  wishlistStats: WishlistStats;
  themes: VaultTheme[];
  collectionCount: number;
  wishlistCount: number;
}

export function PublicVaultClient({
  userId,
  username,
  initialSets,
  collectionStats,
  wishlistStats,
  themes,
  collectionCount,
  wishlistCount,
}: PublicVaultClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [activeTab, setActiveTab] = useState<CollectionTab>(
    (searchParams.get("tab") as CollectionTab) || "collection"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [themeFilter, setThemeFilter] = useState("all");
  const [viewMode, setViewMode] = useState<VaultViewMode>("grid");

  const handleTabChange = useCallback(
    (tab: CollectionTab) => {
      setActiveTab(tab);

      // Update URL
      const params = new URLSearchParams(searchParams);
      params.set("tab", tab);
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  const filteredSets = useMemo(() => {
    return initialSets
      .filter((set) => {
        // Filter by active tab
        const matchesTab = set.collectionType === activeTab;

        const normalizedQuery = normalize(searchQuery);
        const matchesSearch =
          !searchQuery ||
          normalize(set.name).includes(normalizedQuery) ||
          set.setNum.includes(searchQuery) ||
          normalize(set.themeName).includes(normalizedQuery);

        const matchesTheme =
          themeFilter === "all" || set.themeName === themeFilter;

        return matchesTab && matchesSearch && matchesTheme;
      })
      .sort((a, b) => {
        // Favorites first, then maintain original order (year descending)
        if (a.isFavorite && !b.isFavorite) return -1;
        if (!a.isFavorite && b.isFavorite) return 1;
        return 0;
      });
  }, [initialSets, activeTab, searchQuery, themeFilter]);

  return (
    <main className="flex-1 flex flex-col min-h-0 stud-bg bg-fixed">
      {/* Back to profile link */}
      <div className="px-6 md:px-8 py-4 border-b border-border bg-background/80 backdrop-blur-sm">
        <Link href={`/u/${userId}`}>
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="size-4" />
            Back to @{username}&apos;s Profile
          </Button>
        </Link>
      </div>

      {/* Toolbar - search + filters (readonly, no actions) */}
      <VaultToolbar
        onSearch={setSearchQuery}
        themes={themes}
        themeFilter={themeFilter}
        viewMode={viewMode}
        onThemeChange={setThemeFilter}
        onViewModeChange={setViewMode}
      />

      {/* Scrollable content area */}
      <div className="flex-1 overflow-y-auto">
        {/* Stats hero - scrolls with content */}
        <VaultStatsHero
          stats={activeTab === "collection" ? collectionStats : wishlistStats}
          activeTab={activeTab}
        />

        {/* Tabs */}
        <CollectionTabs
          activeTab={activeTab}
          onTabChange={handleTabChange}
          collectionCount={collectionCount}
          wishlistCount={wishlistCount}
        />

        {/* Grid (readonly mode - no checkboxes, no favorites) */}
        <div className="px-6 md:px-8 pb-24">
          {filteredSets.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-muted-foreground">
                {activeTab === "collection"
                  ? "No sets in collection yet."
                  : "No sets in wishlist yet."}
              </p>
            </div>
          ) : (
            <VaultGrid
              sets={filteredSets}
              showFavorite={false}
              readonly={true}
            />
          )}
        </div>
      </div>
    </main>
  );
}
