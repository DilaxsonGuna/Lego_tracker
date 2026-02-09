import { Suspense } from "react";
import {
  ProfileHero,
  FavoritesGrid,
  ProfileBio,
  ProfileStatsRow,
  RankProgressCard,
  MilestoneVault,
  ProfileFooter,
  StudPatternBg,
} from "@/components/profile";
import { mockMilestones } from "@/lib/mockdata";
import { fetchProfile, fetchFavoriteSets, fetchUserStats } from "./actions";
import { calculateRankProgress } from "@/lib/brick-score";

async function ProfileContent() {
  const [profile, favoriteSets, userStats] = await Promise.all([
    fetchProfile(),
    fetchFavoriteSets(),
    fetchUserStats(),
  ]);

  // Fallback for users with no profile
  const user = profile ?? {
    id: "",
    username: "Anonymous",
    fullName: "",
    avatarUrl: "",
    bio: "",
    isVerified: false,
    role: "Collector",
    isOnline: false,
    followers: 0,
    following: 0,
    friends: 0,
    interests: [],
  };

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
    <>
      <ProfileHero user={user} stats={stats} />

      <FavoritesGrid favorites={favoriteSets} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <ProfileBio user={user} />
          <RankProgressCard
            progress={stats.rankProgress}
            brickScore={stats.brickScore}
          />
          <ProfileStatsRow stats={stats} />
        </div>
        <MilestoneVault milestones={mockMilestones} />
      </div>

      <ProfileFooter />
    </>
  );
}

function ProfileSkeleton() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-pulse text-muted-foreground">Loading profile...</div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <main className="flex-1 relative">
      <StudPatternBg />

      <div className="relative z-10 mx-auto max-w-[1100px] px-8 py-12">
        <Suspense fallback={<ProfileSkeleton />}>
          <ProfileContent />
        </Suspense>
      </div>
    </main>
  );
}
