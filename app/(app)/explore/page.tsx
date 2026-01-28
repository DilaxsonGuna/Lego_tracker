import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { getDiscoverySets, getThemeCategories } from "@/lib/queries/explore";
import { ExplorePageClient } from "./explore-client";

async function ExploreContent() {
  const [sets, categories] = await Promise.all([
    getDiscoverySets(),
    getThemeCategories(),
  ]);

  return <ExplorePageClient initialSets={sets} categories={categories} />;
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
