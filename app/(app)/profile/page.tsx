import { Suspense } from "react";
import {
  ProfileHero,
  FavoritesGrid,
  ProfileBio,
  ProfileStatsRow,
  MilestoneVault,
  ProfileFooter,
  StudPatternBg,
} from "@/components/profile";
import {
  mockUser,
  mockUserStats,
  mockMilestones,
} from "@/lib/mockdata";
import { fetchFavoriteSets } from "./actions";
import type { FavoriteSet } from "@/types/profile";

async function ProfileContent() {
  const favoriteSets = await fetchFavoriteSets();
  return (
    <>
      <ProfileHero user={mockUser} />

      <FavoritesGrid favorites={favoriteSets} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <ProfileBio user={mockUser} />
          <ProfileStatsRow stats={mockUserStats} />
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
