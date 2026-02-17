import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { getLeaderboard } from "@/lib/queries/leaderboard";
import { createClient } from "@/lib/supabase/server";
import { LeaderboardPageClient } from "./leaderboard-client";

async function LeaderboardContent() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const leaderboardData = await getLeaderboard();

  return (
    <LeaderboardPageClient
      initialData={leaderboardData}
      currentUserId={user?.id ?? null}
    />
  );
}

export default function LeaderboardPage() {
  return (
    <Suspense
      fallback={
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="size-6 text-muted-foreground animate-spin" />
        </main>
      }
    >
      <LeaderboardContent />
    </Suspense>
  );
}
