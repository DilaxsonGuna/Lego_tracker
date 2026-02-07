"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  VaultToolbar,
  VaultStatsHero,
  CollectionTabs,
  VaultGrid,
  VaultBulkActions,
} from "@/components/vault";
import { moveToCollection, removeSetFromVault, toggleFavorite } from "./actions";
import type { VaultSet, CollectionStats, WishlistStats, VaultViewMode } from "@/types/vault";
import type { CollectionTab } from "@/types/lego-set";

// Normalize string for accent-insensitive search
const normalize = (str: string) =>
  str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

interface VaultTheme {
  id: number;
  name: string;
}

interface VaultPageClientProps {
  initialSets: VaultSet[];
  collectionStats: CollectionStats;
  wishlistStats: WishlistStats;
  themes: VaultTheme[];
  collectionCount: number;
  wishlistCount: number;
}

export function VaultPageClient({
  initialSets,
  collectionStats,
  wishlistStats,
  themes,
  collectionCount,
  wishlistCount,
}: VaultPageClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [activeTab, setActiveTab] = useState<CollectionTab>(
    (searchParams.get("tab") as CollectionTab) || "collection"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [themeFilter, setThemeFilter] = useState("all");
  const [viewMode, setViewMode] = useState<VaultViewMode>("grid");
  const [selectedSets, setSelectedSets] = useState<Set<string>>(new Set());
  const [isProcessing, setIsProcessing] = useState(false);

  const handleTabChange = useCallback(
    (tab: CollectionTab) => {
      setActiveTab(tab);
      setSelectedSets(new Set()); // Clear selection when switching tabs

      // Update URL
      const params = new URLSearchParams(searchParams);
      params.set("tab", tab);
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  const toggleSelect = useCallback((setNum: string) => {
    setSelectedSets((prev) => {
      const next = new Set(prev);
      if (next.has(setNum)) {
        next.delete(setNum);
      } else {
        next.add(setNum);
      }
      return next;
    });
  }, []);

  const handleToggleFavorite = useCallback(async (setNum: string) => {
    const result = await toggleFavorite(setNum);
    if (result.error) {
      toast.error(result.error);
    } else {
      router.refresh();
    }
  }, [router]);

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

  const handleMoveToCollection = useCallback(async () => {
    setIsProcessing(true);
    try {
      const results = await Promise.all(
        Array.from(selectedSets).map((setNum) => moveToCollection(setNum))
      );

      const errors = results.filter((r) => r.error);
      if (errors.length > 0) {
        toast.error(`Failed to move ${errors.length} set(s)`);
      } else {
        toast.success("Sets moved to collection");
      }

      setSelectedSets(new Set());
      router.refresh();
    } finally {
      setIsProcessing(false);
    }
  }, [selectedSets, router]);

  const handleBulkRemove = useCallback(async () => {
    setIsProcessing(true);
    try {
      const results = await Promise.all(
        Array.from(selectedSets).map((setNum) => removeSetFromVault(setNum))
      );

      const errors = results.filter((r) => r.error);
      if (errors.length > 0) {
        toast.error(`Failed to remove ${errors.length} set(s)`);
      } else {
        toast.success("Sets removed from vault");
      }

      setSelectedSets(new Set());
      router.refresh();
    } finally {
      setIsProcessing(false);
    }
  }, [selectedSets, router]);

  return (
    <main className="flex-1 flex flex-col min-h-0 stud-bg bg-fixed">
      {/* Sticky toolbar - search + filters */}
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

        {/* Sticky tabs - sticks to top of scroll area */}
        <CollectionTabs
          activeTab={activeTab}
          onTabChange={handleTabChange}
          collectionCount={collectionCount}
          wishlistCount={wishlistCount}
        />

        {/* Grid */}
        <div className="px-6 md:px-8 pb-24">
          <VaultGrid
            sets={filteredSets}
            selectedSets={selectedSets}
            onToggleSelect={toggleSelect}
            onToggleFavorite={handleToggleFavorite}
            showFavorite={activeTab === "collection"}
          />
        </div>
      </div>

      <VaultBulkActions
        selectedCount={selectedSets.size}
        selectedSetNums={Array.from(selectedSets)}
        activeTab={activeTab}
        onRemove={handleBulkRemove}
        onMoveToCollection={handleMoveToCollection}
        isProcessing={isProcessing}
      />
    </main>
  );
}
