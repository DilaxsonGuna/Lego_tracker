import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { searchSets, searchUsers, searchThemes } from "@/lib/queries/search";
import { SearchPageClient } from "@/components/search/search-page-client";
import type { SearchTab } from "@/types/search";

interface SearchPageProps {
  searchParams: Promise<{ q?: string; tab?: string }>;
}

async function SearchContent({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q ?? "";
  const tab = (params.tab as SearchTab) || "sets";

  let sets = null;
  let users = null;
  let themes = null;

  if (query.trim()) {
    switch (tab) {
      case "sets":
        sets = await searchSets(query);
        break;
      case "users":
        users = await searchUsers(query);
        break;
      case "themes":
        themes = await searchThemes(query);
        break;
    }
  }

  return (
    <SearchPageClient
      initialQuery={query}
      initialTab={tab}
      initialSets={sets}
      initialUsers={users}
      initialThemes={themes}
    />
  );
}

export default function SearchPage(props: SearchPageProps) {
  return (
    <Suspense
      fallback={
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="size-6 text-muted-foreground animate-spin" />
        </main>
      }
    >
      <SearchContent {...props} />
    </Suspense>
  );
}
