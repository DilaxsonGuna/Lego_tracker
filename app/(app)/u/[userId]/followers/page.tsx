import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FollowList } from "@/components/social";
import { fetchFollowers, getCurrentUserId, handleToggleFollow } from "./actions";

interface PageProps {
  params: Promise<{ userId: string }>;
}

async function FollowersContent({
  paramsPromise,
}: {
  paramsPromise: Promise<{ userId: string }>;
}) {
  const { userId } = await paramsPromise;

  const [followers, currentUserId] = await Promise.all([
    fetchFollowers(userId),
    getCurrentUserId(),
  ]);

  return (
    <>
      <div className="flex items-center gap-3 mb-8">
        <Link href={`/u/${userId}`}>
          <Button variant="ghost" size="icon" className="size-9">
            <ArrowLeft className="size-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-black tracking-tight text-foreground">
          Followers
        </h1>
      </div>
      <FollowList
        users={followers}
        currentUserId={currentUserId}
        toggleFollowAction={handleToggleFollow}
        emptyMessage="No followers yet."
      />
    </>
  );
}

export default async function FollowersPage({ params }: PageProps) {
  return (
    <main className="flex-1 relative">
      <div className="mx-auto max-w-[600px] px-6 py-10">
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-16">
              <div className="animate-pulse text-muted-foreground">
                Loading followers...
              </div>
            </div>
          }
        >
          <FollowersContent paramsPromise={params} />
        </Suspense>
      </div>
    </main>
  );
}
