"use client";

import { useState, useEffect, useCallback, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search, Loader2, Box, Users, Palette, SearchX } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { performSearch } from "@/app/(app)/search/actions";
import type {
  SearchTab,
  SearchSet,
  SearchUser,
  SearchTheme,
} from "@/types/search";

interface SearchPageClientProps {
  initialQuery: string;
  initialTab: SearchTab;
  initialSets: SearchSet[] | null;
  initialUsers: SearchUser[] | null;
  initialThemes: SearchTheme[] | null;
}

const TAB_CONFIG: { value: SearchTab; label: string; icon: typeof Box }[] = [
  { value: "sets", label: "Sets", icon: Box },
  { value: "users", label: "Users", icon: Users },
  { value: "themes", label: "Themes", icon: Palette },
];

export function SearchPageClient({
  initialQuery,
  initialTab,
  initialSets,
  initialUsers,
  initialThemes,
}: SearchPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialQuery);
  const [tab, setTab] = useState<SearchTab>(initialTab);
  const [sets, setSets] = useState<SearchSet[] | null>(initialSets);
  const [users, setUsers] = useState<SearchUser[] | null>(initialUsers);
  const [themes, setThemes] = useState<SearchTheme[] | null>(initialThemes);
  const [isPending, startTransition] = useTransition();

  // Debounced URL update + search
  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams();
      if (query.trim()) params.set("q", query.trim());
      if (tab !== "sets") params.set("tab", tab);
      const qs = params.toString();
      router.replace(`/search${qs ? `?${qs}` : ""}`, { scroll: false });

      if (query.trim()) {
        startTransition(async () => {
          const results = await performSearch(query, tab);
          switch (tab) {
            case "sets":
              setSets(results as SearchSet[]);
              break;
            case "users":
              setUsers(results as SearchUser[]);
              break;
            case "themes":
              setThemes(results as SearchTheme[]);
              break;
          }
        });
      } else {
        setSets(null);
        setUsers(null);
        setThemes(null);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [query, tab, router]);

  const handleTabChange = useCallback((value: string) => {
    setTab(value as SearchTab);
  }, []);

  const hasQuery = query.trim().length > 0;
  const currentResults =
    tab === "sets" ? sets : tab === "users" ? users : themes;
  const isEmpty = hasQuery && currentResults !== null && currentResults.length === 0;

  return (
    <main className="flex-1 flex flex-col">
      {/* Header */}
      <div className="sm:sticky sm:top-0 z-10 bg-background sm:backdrop-blur-md pt-6 pb-4 px-4 sm:px-6 md:px-10 border-b border-border flex flex-col gap-5">
        <div className="flex items-center justify-between gap-6">
          <div className="flex-1">
            <label className="relative flex items-center w-full group">
              <Search className="absolute left-4 size-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                type="text"
                placeholder="Search sets, users, or themes..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full h-14 pl-12 pr-4 rounded-xl bg-card border border-border focus-visible:ring-2 focus-visible:ring-primary text-base shadow-sm"
                autoFocus
              />
              {isPending && (
                <Loader2 className="absolute right-4 size-5 text-muted-foreground animate-spin" />
              )}
            </label>
          </div>
          <h2 className="hidden lg:block text-2xl font-black tracking-tight uppercase italic">
            Search
          </h2>
        </div>

        <Tabs value={tab} onValueChange={handleTabChange}>
          <TabsList>
            {TAB_CONFIG.map(({ value, label, icon: Icon }) => (
              <TabsTrigger key={value} value={value} className="gap-1.5">
                <Icon className="size-4" />
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Results */}
      <div className="flex-1 px-4 sm:px-6 md:px-10 py-6">
        {!hasQuery && (
          <EmptyState
            icon={Search}
            title="Search LegoFlex"
            description="Find sets by name or number, discover other collectors, or browse themes."
          />
        )}

        {isEmpty && !isPending && (
          <EmptyState
            icon={SearchX}
            title="No results found"
            description={`No ${tab} matched \u201c${query}\u201d. Try a different search term.`}
          />
        )}

        {/* Sets results */}
        {tab === "sets" && sets && sets.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {sets.map((set) => (
              <Link
                key={set.setNum}
                href={`/set/${set.setNum}`}
                className="group flex flex-col bg-card rounded-xl overflow-hidden hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20 hover:ring-1 hover:ring-primary/50 transition-all duration-300"
              >
                <div className="relative w-full aspect-[4/3] bg-muted flex items-center justify-center p-6">
                  <div
                    className="size-full bg-center bg-contain bg-no-repeat transition-transform duration-500 group-hover:scale-105"
                    style={{ backgroundImage: `url("${set.setImgUrl}")` }}
                  />
                  {set.year && (
                    <div className="absolute top-3 left-3">
                      <Badge
                        variant="outline"
                        className="bg-black/80 backdrop-blur-md text-xs font-bold px-2.5 py-1 rounded-md text-primary border-primary/20"
                      >
                        {set.year}
                      </Badge>
                    </div>
                  )}
                  {set.theme && (
                    <div className="absolute bottom-3 left-3">
                      <Badge className="bg-primary/90 backdrop-blur-sm text-xs font-bold px-2.5 py-1 rounded-md text-primary-foreground uppercase tracking-wide line-clamp-1 max-w-[220px] border-transparent hover:bg-primary/80">
                        {set.theme}
                      </Badge>
                    </div>
                  )}
                </div>
                <div className="p-4 flex flex-col gap-1">
                  <h3 className="text-sm font-bold text-foreground line-clamp-1">
                    {set.name}
                  </h3>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-mono text-muted-foreground">
                      #{set.setNum}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {set.numParts.toLocaleString()} pcs
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Users results */}
        {tab === "users" && users && users.length > 0 && (
          <div className="flex flex-col gap-2">
            {users.map((user) => (
              <Link
                key={user.id}
                href={`/u/${user.id}`}
                className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border hover:border-primary/30 hover:bg-card/80 transition-colors"
              >
                <Avatar
                  className="size-10 ring-2 ring-surface-accent"
                  style={{
                    backgroundColor: user.avatarUrl || "#3b82f6",
                  }}
                >
                  <AvatarFallback
                    style={{
                      backgroundColor: user.avatarUrl || "#3b82f6",
                    }}
                    className="text-white font-bold"
                  >
                    {user.username
                      ? user.username.charAt(0).toUpperCase()
                      : "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-bold text-foreground truncate">
                    @{user.username}
                  </span>
                  {user.fullName && (
                    <span className="text-xs text-muted-foreground truncate">
                      {user.fullName}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Themes results */}
        {tab === "themes" && themes && themes.length > 0 && (
          <div className="flex flex-col gap-2">
            {themes.map((theme) => (
              <div
                key={theme.id}
                className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border"
              >
                <div className="flex items-center justify-center size-10 rounded-lg bg-primary/10">
                  <Palette className="size-5 text-primary" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-bold text-foreground">
                    {theme.name}
                  </span>
                  {theme.parentName && (
                    <span className="text-xs text-muted-foreground">
                      {theme.parentName}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
