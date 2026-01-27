"use client";

import { useState, useMemo } from "react";
import { Loader2 } from "lucide-react";
import { ExploreHeader, DiscoveryGrid } from "@/components/explore";
import {
  mockThemeCategories,
  mockDiscoverySets,
} from "@/lib/mockdata";

export default function ExplorePage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSets = useMemo(() => {
    return mockDiscoverySets.filter((set) => {
      const matchesTheme =
        activeCategory === "all" || set.theme === activeCategory;
      const matchesSearch =
        !searchQuery ||
        set.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        set.setNum.includes(searchQuery);
      return matchesTheme && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <main className="flex-1 flex flex-col min-h-0">
      <ExploreHeader
        categories={mockThemeCategories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        onSearch={setSearchQuery}
      />

      <div className="flex-1 overflow-y-auto p-6 md:px-10 pb-20">
        <DiscoveryGrid sets={filteredSets} />

        {/* Loading indicator */}
        <div className="flex justify-center py-10">
          <Loader2 className="size-6 text-muted-foreground animate-spin" />
        </div>
      </div>
    </main>
  );
}
