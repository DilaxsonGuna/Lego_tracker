import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { getDiscoverySets, getCachedParentThemes, getFeaturedThemes } from "@/lib/queries/explore";
import { getUserSetsWithType } from "@/lib/commands";
import { getUserThemeIds } from "@/lib/queries/user-themes";
import { createClient } from "@/lib/supabase/server";
import { ExplorePageClient } from "./explore-client";

async function ExploreContent() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [sets, categories, topThemes, userSetsInfo, userThemeIds] = await Promise.all([
    getDiscoverySets(),
    getCachedParentThemes(),
    getFeaturedThemes(user?.id),
    getUserSetsWithType(),
    user ? getUserThemeIds(user.id) : Promise.resolve([]),
  ]);

  const hasUserThemes = userThemeIds.length > 0;

  return (
    <ExplorePageClient
      initialSets={sets}
      categories={categories}
      topThemes={topThemes}
      initialUserSets={userSetsInfo}
      hasUserThemes={hasUserThemes}
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
