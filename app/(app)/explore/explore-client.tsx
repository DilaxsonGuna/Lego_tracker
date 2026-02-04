"use client";

import { useState, useEffect, useRef, useCallback, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { ExploreHeader, DiscoveryGrid } from "@/components/explore";
import { Button } from "@/components/ui/button";
import { fetchSets, addSetToCollection, removeSetFromCollection } from "./actions";
import { PAGE_SIZE } from "@/lib/constants";
import type { DiscoverySet, ThemeCategory, OrderByOption } from "@/types/explore";

interface ExplorePageClientProps {
  initialSets: DiscoverySet[];
  categories: ThemeCategory[];
  topThemes: ThemeCategory[];
  initialCollectionSetNums: string[];
}

export function ExplorePageClient({
  initialSets,
  categories,
  topThemes,
  initialCollectionSetNums,
}: ExplorePageClientProps) {
  const [activeCategory, setActiveCategory] = useState<number | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [orderBy, setOrderBy] = useState<OrderByOption>("newest");
  const [sets, setSets] = useState(initialSets);
  const [hasMore, setHasMore] = useState(initialSets.length >= PAGE_SIZE);
  const [isPending, startTransition] = useTransition();
  const isInitialMount = useRef(true);

  // Collection state
  const [collectionSetNums, setCollectionSetNums] = useState<Set<string>>(
    () => new Set(initialCollectionSetNums)
  );
  const [pendingToggles, setPendingToggles] = useState<Set<string>>(new Set());

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Refetch when filters change
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    startTransition(async () => {
      const results = await fetchSets({
        offset: 0,
        search: debouncedSearch || undefined,
        themeId: activeCategory !== "all" ? activeCategory : undefined,
        orderBy,
      });
      setSets(results);
      setHasMore(results.length >= PAGE_SIZE);
    });
  }, [debouncedSearch, activeCategory, orderBy]);

  const handleLoadMore = useCallback(() => {
    startTransition(async () => {
      const nextSets = await fetchSets({
        offset: sets.length,
        search: debouncedSearch || undefined,
        themeId: activeCategory !== "all" ? activeCategory : undefined,
        orderBy,
      });
      if (nextSets.length < PAGE_SIZE) {
        setHasMore(false);
      }
      setSets((prev) => [...prev, ...nextSets]);
    });
  }, [sets.length, debouncedSearch, activeCategory, orderBy]);

  const handleToggleCollection = useCallback(
    async (setNum: string) => {
      const isCurrentlyInCollection = collectionSetNums.has(setNum);

      // Mark as pending
      setPendingToggles((prev) => new Set(prev).add(setNum));

      // Optimistic update
      setCollectionSetNums((prev) => {
        const next = new Set(prev);
        if (isCurrentlyInCollection) {
          next.delete(setNum);
        } else {
          next.add(setNum);
        }
        return next;
      });

      // Call server action
      const result = isCurrentlyInCollection
        ? await removeSetFromCollection(setNum)
        : await addSetToCollection(setNum);

      // Remove from pending
      setPendingToggles((prev) => {
        const next = new Set(prev);
        next.delete(setNum);
        return next;
      });

      // Revert on error
      if (result.error) {
        setCollectionSetNums((prev) => {
          const next = new Set(prev);
          if (isCurrentlyInCollection) {
            next.add(setNum);
          } else {
            next.delete(setNum);
          }
          return next;
        });
        console.error("Failed to toggle collection:", result.error);
      }
    },
    [collectionSetNums]
  );

  return (
    <main className="flex-1 flex flex-col min-h-0">
      <ExploreHeader
        categories={categories}
        topThemes={topThemes}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        onSearch={setSearchQuery}
        orderBy={orderBy}
        onOrderByChange={setOrderBy}
      />

      <div className="flex-1 overflow-y-auto p-6 md:px-10 pb-20">
        {isPending && sets.length === 0 ? (
          <div className="flex justify-center py-20">
            <Loader2 className="size-6 text-muted-foreground animate-spin" />
          </div>
        ) : (
          <DiscoveryGrid
            sets={sets}
            collectionSetNums={collectionSetNums}
            pendingToggles={pendingToggles}
            onToggleCollection={handleToggleCollection}
          />
        )}

        {hasMore && (
          <div className="flex justify-center py-10">
            <Button
              variant="outline"
              onClick={handleLoadMore}
              disabled={isPending}
              className="min-w-[140px]"
            >
              {isPending && sets.length > 0 ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                "Load More"
              )}
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
