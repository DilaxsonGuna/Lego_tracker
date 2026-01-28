"use client";

import { useState, useEffect, useRef, useCallback, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { ExploreHeader, DiscoveryGrid } from "@/components/explore";
import { Button } from "@/components/ui/button";
import { fetchSets } from "./actions";
import { PAGE_SIZE } from "@/lib/constants";
import type { DiscoverySet, ThemeCategory, OrderByOption } from "@/types/explore";

interface ExplorePageClientProps {
  initialSets: DiscoverySet[];
  categories: ThemeCategory[];
  topThemes: ThemeCategory[];
}

export function ExplorePageClient({
  initialSets,
  categories,
  topThemes,
}: ExplorePageClientProps) {
  const [activeCategory, setActiveCategory] = useState<number | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [orderBy, setOrderBy] = useState<OrderByOption>("newest");
  const [sets, setSets] = useState(initialSets);
  const [hasMore, setHasMore] = useState(initialSets.length >= PAGE_SIZE);
  const [isPending, startTransition] = useTransition();
  const isInitialMount = useRef(true);

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
          <DiscoveryGrid sets={sets} />
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
