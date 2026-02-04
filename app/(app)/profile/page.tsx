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

export default async function ProfilePage() {
  const favoriteSets = await fetchFavoriteSets();
  return (
    <main className="flex-1 relative">
      <StudPatternBg />

      <div className="relative z-10 mx-auto max-w-[1100px] px-8 py-12">
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
      </div>
    </main>
  );
}
