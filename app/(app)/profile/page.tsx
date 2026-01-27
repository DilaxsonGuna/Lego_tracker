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
  mockFavoriteSets,
  mockMilestones,
} from "@/lib/mockdata";

export default function ProfilePage() {
  return (
    <main className="flex-1 relative">
      <StudPatternBg />

      <div className="relative z-10 mx-auto max-w-[1100px] px-8 py-12">
        <ProfileHero user={mockUser} />

        <FavoritesGrid favorites={mockFavoriteSets} />

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
