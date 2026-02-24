import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FollowList } from "@/components/social";
import { fetchFollowing, getCurrentUserId, handleToggleFollow } from "./actions";

interface PageProps {
  params: Promise<{ userId: string }>;
}

async function FollowingContent({
  paramsPromise,
}: {
  paramsPromise: Promise<{ userId: string }>;
}) {
  const { userId } = await paramsPromise;

  const [following, currentUserId] = await Promise.all([
    fetchFollowing(userId),
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
          Following
        </h1>
      </div>
      <FollowList
        users={following}
        currentUserId={currentUserId}
        toggleFollowAction={handleToggleFollow}
        emptyMessage="Not following anyone yet."
      />
    </>
  );
}

export default async function FollowingPage({ params }: PageProps) {
  return (
    <main className="flex-1 relative">
      <div className="mx-auto max-w-[600px] px-6 py-10">
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-16">
              <div className="animate-pulse text-muted-foreground">
                Loading following...
              </div>
            </div>
          }
        >
          <FollowingContent paramsPromise={params} />
        </Suspense>
      </div>
    </main>
  );
}
