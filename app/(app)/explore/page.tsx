import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { getDiscoverySets, getParentThemes, getFeaturedThemes } from "@/lib/queries/explore";
import { getUserSetNums } from "@/lib/commands";
import { ExplorePageClient } from "./explore-client";

async function ExploreContent() {
  const [sets, categories, topThemes, userCollectionSetNums] = await Promise.all([
    getDiscoverySets(),
    getParentThemes(),
    getFeaturedThemes(),
    getUserSetNums(),
  ]);

  return (
    <ExplorePageClient
      initialSets={sets}
      categories={categories}
      topThemes={topThemes}
      initialCollectionSetNums={userCollectionSetNums}
    />
  );
}

export default function ExplorePage() {
  return (
    <Suspense
      fallback={
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="size-6 text-muted-foreground animate-spin" />
        </main>
      }
    >
      <ExploreContent />
    </Suspense>
  );
}
