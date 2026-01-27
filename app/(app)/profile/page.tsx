"use client";

import { useState } from "react";
import {
  ProfileHero,
  StatsCard,
  CollectionTabs,
  LegoSetGrid,
  Footer,
  StudPatternBg,
} from "@/components/profile";
import {
  mockUser,
  mockUserStats,
  mockLegoSets,
} from "@/lib/mockdata";
import { CollectionTab } from "@/types/lego-set";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<CollectionTab>("collection");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSets = mockLegoSets.filter((set) =>
    set.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <main className="flex-1 relative">
        <StudPatternBg />

        <div className="relative z-10 mx-auto max-w-[1000px] px-6 py-12 flex flex-col gap-10">
          <ProfileHero user={mockUser} />

          <StatsCard stats={mockUserStats} />

          <CollectionTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onSearch={setSearchQuery}
          />

          <LegoSetGrid sets={filteredSets} />
        </div>
      </main>

      <Footer />
    </>
  );
}
