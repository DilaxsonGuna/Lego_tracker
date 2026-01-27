"use client";

import { useState } from "react";
import {
  Header,
  ProfileHeader,
  SearchFilterBar,
  LegoSetGrid,
} from "@/components/profile";
import {
  mockUser,
  mockUserStats,
  mockNavItems,
  mockLegoSets,
  mockThemeFilters,
} from "@/lib/mockdata";
import { ThemeFilter } from "@/types/lego-set";
import { LegoSet } from "@/types/lego-set";

export default function ProfilePage() {
  const [filters, setFilters] = useState<ThemeFilter[]>(mockThemeFilters);
  const [sets, setSets] = useState<LegoSet[]>(mockLegoSets);
  const [searchQuery, setSearchQuery] = useState("");

  const handleFilterChange = (filterId: string) => {
    setFilters(
      filters.map((f) => ({
        ...f,
        isActive: f.id === filterId,
      }))
    );
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFavoriteToggle = (setNum: string) => {
    setSets(
      sets.map((s) =>
        s.setNum === setNum ? { ...s, isFavorite: !s.isFavorite } : s
      )
    );
  };

  const filteredSets = sets.filter((set) =>
    set.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden font-display">
      <Header
        navItems={mockNavItems}
        userAvatarUrl={mockUser.avatarUrl}
        userName={mockUser.username}
      />
      <main className="flex h-full grow flex-col">
        <div className="px-4 md:px-20 lg:px-40 flex flex-1 justify-center py-8">
          <div className="flex flex-col max-w-[1024px] flex-1">
            <ProfileHeader user={mockUser} stats={mockUserStats} />
            <SearchFilterBar
              filters={filters}
              onFilterChange={handleFilterChange}
              onSearch={handleSearch}
            />
            <LegoSetGrid
              sets={filteredSets}
              onFavoriteToggle={handleFavoriteToggle}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
