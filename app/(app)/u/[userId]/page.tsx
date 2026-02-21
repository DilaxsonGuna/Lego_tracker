import { Suspense } from "react";
import { notFound } from "next/navigation";
import { StudPatternBg } from "@/components/profile";
import { calculateRankProgress } from "@/lib/brick-score";
import { PublicProfileClient } from "./profile-client";
import {
  fetchPublicProfile,
  fetchPublicStats,
  fetchPublicFavorites,
  fetchPublicMilestones,
  fetchIsFollowing,
  getCurrentUserId,
  checkProfileAccess,
} from "./actions";

interface PageProps {
  params: Promise<{ userId: string }>;
}

async function PublicProfileContent({
  paramsPromise,
}: {
  paramsPromise: Promise<{ userId: string }>;
}) {
  const { userId } = await paramsPromise;

  // Check profile access (visibility + ownership)
  const access = await checkProfileAccess(userId);

  if (access.isPrivate) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-lg font-semibold text-foreground">This profile is private</p>
        <p className="text-sm text-muted-foreground">
          This user has chosen to keep their profile hidden.
        </p>
      </div>
    );
  }

  const [profile, userStats, favoriteSets, milestones, currentUserId] = await Promise.all([
    fetchPublicProfile(userId),
    fetchPublicStats(userId),
    fetchPublicFavorites(userId),
    fetchPublicMilestones(userId),
    getCurrentUserId(),
  ]);

  // If profile doesn't exist, show 404
  if (!profile) {
    notFound();
  }

  const isOwner = access.isOwner;
  const isLoggedIn = currentUserId !== null;

  // Check if current user follows this profile (only if logged in and not owner)
  const isFollowing =
    isLoggedIn && !isOwner ? await fetchIsFollowing(userId) : false;

  // Fallback for users with no collection
  const stats = userStats ?? {
    setsCount: 0,
    piecesCount: 0,
    brickScore: 0,
    rank: null,
    rankProgress: calculateRankProgress(0, 0),
    rankNumber: 0,
    vaultValue: "Coming Soon",
  };

  return (
    <PublicProfileClient
      user={profile}
      stats={stats}
      favorites={favoriteSets}
      milestones={milestones}
      isOwner={isOwner}
      isFollowing={isFollowing}
      isLoggedIn={isLoggedIn}
      targetUserId={userId}
    />
  );
}

function ProfileSkeleton() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-pulse text-muted-foreground">
        Loading profile...
      </div>
    </div>
  );
}

export default async function PublicProfilePage({ params }: PageProps) {
  return (
    <main className="flex-1 relative">
      <StudPatternBg />

      <div className="relative z-10 mx-auto max-w-[1100px] px-8 py-12">
        <Suspense fallback={<ProfileSkeleton />}>
          <PublicProfileContent paramsPromise={params} />
        </Suspense>
      </div>
    </main>
  );
}
