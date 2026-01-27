"use client";

import { StoriesCarousel, Feed, RightSidebar } from "@/components/home";
import {
  mockStories,
  mockFeedPosts,
  mockTrendingSets,
  mockSuggestedUsers,
} from "@/lib/mockdata";

export default function HomePage() {
  return (
    <main className="flex-1">
      <div className="flex gap-8 w-full px-4 md:px-6">
        <div className="flex-1 max-w-[700px] mx-auto flex flex-col gap-8 pt-6 pb-20">
          <StoriesCarousel stories={mockStories} />
          <Feed posts={mockFeedPosts} />
        </div>
        <div className="hidden xl:block w-px bg-border sticky top-0 h-screen" />
        <RightSidebar
          trendingSets={mockTrendingSets}
          suggestedUsers={mockSuggestedUsers}
        />
      </div>
    </main>
  );
}
