"use client";

import { useState, useMemo, useCallback, useTransition, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  VaultToolbar,
  VaultStatsHero,
  CollectionTabs,
  VaultGrid,
  VaultList,
  VaultBulkActions,
} from "@/components/vault";
import { MilestoneCelebration } from "@/components/profile/milestone-celebration";
import { fetchVaultSets, moveToCollection, removeSetFromVault, toggleFavorite, checkMilestones } from "./actions";
import { useMilestoneCheck } from "@/lib/hooks/use-milestone-check";
import { PAGE_SIZE } from "@/lib/constants";
import type { VaultSet, CollectionStats, WishlistStats, VaultViewMode, VaultSortOption } from "@/types/vault";
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

function applySortOption(sets: VaultSet[], sortOption: VaultSortOption): VaultSet[] {
  const sorted = [...sets];
  switch (sortOption) {
    case "name-asc":
      sorted.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "name-desc":
      sorted.sort((a, b) => b.name.localeCompare(a.name));
      break;
    case "year-newest":
      sorted.sort((a, b) => b.year - a.year);
      break;
    case "year-oldest":
      sorted.sort((a, b) => a.year - b.year);
      break;
    case "pieces-most":
      sorted.sort((a, b) => b.numParts - a.numParts);
      break;
    case "pieces-least":
      sorted.sort((a, b) => a.numParts - b.numParts);
      break;
    case "recently-added":
    default:
      // Keep server order (created_at desc), but favorites first
      sorted.sort((a, b) => {
        if (a.isFavorite && !b.isFavorite) return -1;
        if (!a.isFavorite && b.isFavorite) return 1;
        return 0;
      });
      break;
  }
  return sorted;
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
  const [sortOption, setSortOption] = useState<VaultSortOption>("recently-added");
  const [selectedSets, setSelectedSets] = useState<Set<string>>(new Set());
  const [isProcessing, setIsProcessing] = useState(false);

  // Milestone celebration
  const {
    newMilestone,
    celebrationOpen,
    setCelebrationOpen,
    checkMilestones: checkMilestonesLocal,
  } = useMilestoneCheck();

  // Seed milestones on mount
  useEffect(() => {
    checkMilestones().then(checkMilestonesLocal);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Local optimistic state for sets
  const [sets, setSets] = useState(initialSets);

  // Pagination state per tab
  const [hasMoreCollection, setHasMoreCollection] = useState(
    initialSets.filter((s) => s.collectionType === "collection").length >= PAGE_SIZE
  );
  const [hasMoreWishlist, setHasMoreWishlist] = useState(
    initialSets.filter((s) => s.collectionType === "wishlist").length >= PAGE_SIZE
  );
  const [isLoadingMore, startLoadMore] = useTransition();

  const hasMore = activeTab === "collection" ? hasMoreCollection : hasMoreWishlist;

  const handleTabChange = useCallback(
    (tab: CollectionTab) => {
      setActiveTab(tab);
      setSelectedSets(new Set());

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
    // Optimistic update
    setSets((prev) =>
      prev.map((s) =>
        s.setNum === setNum ? { ...s, isFavorite: !s.isFavorite } : s
      )
    );

    const result = await toggleFavorite(setNum);
    if (result.error) {
      // Revert on error
      setSets((prev) =>
        prev.map((s) =>
          s.setNum === setNum ? { ...s, isFavorite: !s.isFavorite } : s
        )
      );
      toast.error(result.error);
    }
  }, []);

  const filteredSets = useMemo(() => {
    const filtered = sets.filter((set) => {
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
    });

    return applySortOption(filtered, sortOption);
  }, [sets, activeTab, searchQuery, themeFilter, sortOption]);

  const handleLoadMore = useCallback(() => {
    const currentTabSets = sets.filter((s) => s.collectionType === activeTab);
    startLoadMore(async () => {
      const nextSets = await fetchVaultSets({
        collectionType: activeTab,
        offset: currentTabSets.length,
      });

      if (nextSets.length < PAGE_SIZE) {
        if (activeTab === "collection") setHasMoreCollection(false);
        else setHasMoreWishlist(false);
      }

      setSets((prev) => [...prev, ...nextSets]);
    });
  }, [sets, activeTab]);

  const handleMoveToCollection = useCallback(async () => {
    setIsProcessing(true);
    const toMove = Array.from(selectedSets);

    // Optimistic: move sets from wishlist to collection
    setSets((prev) =>
      prev.map((s) =>
        toMove.includes(s.setNum) ? { ...s, collectionType: "collection" as CollectionTab } : s
      )
    );
    setSelectedSets(new Set());

    try {
      const results = await Promise.all(
        toMove.map((setNum) => moveToCollection(setNum))
      );

      const errors = results.filter((r) => r.error);
      if (errors.length > 0) {
        // Revert failed ones
        const failedNums = new Set(
          toMove.filter((_, i) => results[i].error)
        );
        setSets((prev) =>
          prev.map((s) =>
            failedNums.has(s.setNum) ? { ...s, collectionType: "wishlist" as CollectionTab } : s
          )
        );
        toast.error(`Failed to move ${errors.length} set(s)`);
      } else {
        toast.success("Sets moved to collection");
        // Check for new milestones after successful move
        checkMilestones().then(checkMilestonesLocal);
      }
    } finally {
      setIsProcessing(false);
    }
  }, [selectedSets, checkMilestonesLocal]);

  const handleBulkRemove = useCallback(async () => {
    setIsProcessing(true);
    const toRemove = Array.from(selectedSets);

    // Snapshot for revert
    const removedSets = sets.filter((s) => toRemove.includes(s.setNum));

    // Optimistic: remove sets
    setSets((prev) => prev.filter((s) => !toRemove.includes(s.setNum)));
    setSelectedSets(new Set());

    try {
      const results = await Promise.all(
        toRemove.map((setNum) => removeSetFromVault(setNum))
      );

      const errors = results.filter((r) => r.error);
      if (errors.length > 0) {
        // Re-add failed sets
        const failedNums = new Set(
          toRemove.filter((_, i) => results[i].error)
        );
        const failedSets = removedSets.filter((s) => failedNums.has(s.setNum));
        setSets((prev) => [...prev, ...failedSets]);
        toast.error(`Failed to remove ${errors.length} set(s)`);
      } else {
        toast.success("Sets removed from vault");
      }
    } finally {
      setIsProcessing(false);
    }
  }, [selectedSets, sets]);

  return (
    <main className="flex-1 flex flex-col min-h-0 stud-bg bg-fixed">
      {/* Sticky toolbar - search + filters */}
      <VaultToolbar
        onSearch={setSearchQuery}
        themes={themes}
        themeFilter={themeFilter}
        viewMode={viewMode}
        sortOption={sortOption}
        onThemeChange={setThemeFilter}
        onViewModeChange={setViewMode}
        onSortChange={setSortOption}
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

        {/* Grid or List */}
        <div className="px-6 md:px-8 pb-24">
          {/* Grid: always visible on mobile, toggled on desktop */}
          <div className={viewMode === "grid" ? "block" : "sm:hidden"}>
            <VaultGrid
              sets={filteredSets}
              selectedSets={selectedSets}
              onToggleSelect={toggleSelect}
              onToggleFavorite={handleToggleFavorite}
              showFavorite={activeTab === "collection"}
            />
          </div>
          {/* List: desktop only */}
          <div className={viewMode === "list" ? "hidden sm:block" : "hidden"}>
            <VaultList
              sets={filteredSets}
              selectedSets={selectedSets}
              onToggleSelect={toggleSelect}
              onToggleFavorite={handleToggleFavorite}
              showFavorite={activeTab === "collection"}
            />
          </div>

          {/* Load More */}
          {hasMore && (
            <div className="flex justify-center py-10">
              <Button
                variant="outline"
                onClick={handleLoadMore}
                disabled={isLoadingMore}
                className="min-w-[140px]"
              >
                {isLoadingMore ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  "Load More"
                )}
              </Button>
            </div>
          )}
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

      <MilestoneCelebration
        milestone={newMilestone}
        open={celebrationOpen}
        onOpenChange={setCelebrationOpen}
      />
    </main>
  );
}
