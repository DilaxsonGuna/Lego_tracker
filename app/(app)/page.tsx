import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import {
  getDashboardStats,
  getRecentlyAddedSets,
  getFollowingActivity,
} from "@/lib/queries/home";
import { fetchSuggestedUsers } from "./actions";
import {
  DashboardStatsCard,
  RecentlyAdded,
  FollowingActivity,
  SuggestedCollectors,
  DashboardWelcome,
  QuickActions,
} from "@/components/home";

async function DashboardContent() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="rounded-xl bg-card border border-border p-6 text-center">
        <p className="text-sm text-muted-foreground">
          Please log in to view your dashboard.
        </p>
      </div>
    );
  }

  // Fetch profile for username
  const { data: profile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .single();

  const username = profile?.username ?? "Collector";

  // Fetch all dashboard data in parallel
  const [stats, recentSets, activity, suggestedUsers] = await Promise.all([
    getDashboardStats(user.id),
    getRecentlyAddedSets(user.id, 6),
    getFollowingActivity(user.id, 10),
    fetchSuggestedUsers(5),
  ]);

  const isEmpty = !stats || stats.totalSets === 0;

  if (isEmpty) {
    return (
      <div className="flex flex-col gap-6">
        <DashboardWelcome username={username} />
        <SuggestedCollectors users={suggestedUsers} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {stats && <DashboardStatsCard stats={stats} />}
      <RecentlyAdded sets={recentSets} />
      <QuickActions />
      <FollowingActivity items={activity} />
      <SuggestedCollectors users={suggestedUsers} />
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      {/* Stats skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-[72px] bg-card/50 rounded-xl animate-pulse border border-border"
          />
        ))}
      </div>
      {/* Recently added skeleton */}
      <div className="space-y-4">
        <div className="h-4 w-32 bg-card/50 rounded animate-pulse" />
        <div className="flex gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-[140px] sm:w-[160px] flex-shrink-0 space-y-2"
            >
              <div className="aspect-square rounded-xl bg-card/50 animate-pulse border border-border" />
              <div className="h-3 w-20 bg-card/50 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
      {/* Activity skeleton */}
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-14 bg-card/50 rounded-xl animate-pulse border border-border"
          />
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="flex-1">
      <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6 pb-20">
        <Suspense fallback={<DashboardSkeleton />}>
          <DashboardContent />
        </Suspense>
      </div>
    </main>
  );
}
