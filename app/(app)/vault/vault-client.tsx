"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  VaultHeader,
  CollectionTabs,
  VaultFilters,
  VaultGrid,
  VaultBulkActions,
} from "@/components/vault";
import { moveToCollection, removeSetFromVault, toggleFavorite } from "./actions";
import type { VaultSet, CollectionStats, WishlistStats, VaultViewMode } from "@/types/vault";
import type { CollectionTab } from "@/types/lego-set";

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
    return initialSets.filter((set) => {
      // Filter by active tab
      const matchesTab = set.collectionType === activeTab;

      const matchesSearch =
        !searchQuery ||
        set.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        set.setNum.includes(searchQuery);

      const matchesTheme =
        themeFilter === "all" || set.themeName === themeFilter;

      return matchesTab && matchesSearch && matchesTheme;
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
        console.error(`Failed to move ${errors.length} set(s)`);
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
        console.error(`Failed to remove ${errors.length} set(s)`);
      }

      setSelectedSets(new Set());
      router.refresh();
    } finally {
      setIsProcessing(false);
    }
  }, [selectedSets, router]);

  return (
    <main className="flex-1 flex flex-col min-h-0 stud-bg bg-fixed">
      <VaultHeader
        stats={activeTab === "collection" ? collectionStats : wishlistStats}
        activeTab={activeTab}
        onSearch={setSearchQuery}
      />

      <CollectionTabs
        activeTab={activeTab}
        onTabChange={handleTabChange}
        collectionCount={collectionCount}
        wishlistCount={wishlistCount}
      />

      <VaultFilters
        themes={themes}
        themeFilter={themeFilter}
        viewMode={viewMode}
        onThemeChange={setThemeFilter}
        onViewModeChange={setViewMode}
      />

      <div className="flex-1 overflow-y-auto p-6 md:px-8 pb-20">
        <div className="mx-auto max-w-7xl">
          <VaultGrid
            sets={filteredSets}
            selectedSets={selectedSets}
            onToggleSelect={toggleSelect}
            onToggleFavorite={handleToggleFavorite}
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
