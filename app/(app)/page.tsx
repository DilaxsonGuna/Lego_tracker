import { Suspense } from "react";
import { StoriesCarousel, Feed, RightSidebar } from "@/components/home";
import { fetchSuggestedUsers } from "./actions";
import {
  mockStories,
  mockFeedPosts,
  mockTrendingSets,
} from "@/lib/mockdata";

async function RightSidebarWrapper() {
  const suggestedUsers = await fetchSuggestedUsers(5);

  return (
    <RightSidebar
      trendingSets={mockTrendingSets}
      suggestedUsers={suggestedUsers}
    />
  );
}

function RightSidebarSkeleton() {
  return (
    <aside className="hidden xl:flex flex-col w-80 flex-shrink-0 gap-8 py-2 sticky top-0 h-screen">
      <div className="h-10 bg-card/50 rounded-xl animate-pulse" />
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-12 bg-card/50 rounded-lg animate-pulse" />
        ))}
      </div>
    </aside>
  );
}

export default function HomePage() {
  return (
    <main className="flex-1">
      <div className="flex gap-6 sm:gap-8 w-full px-6">
        <div className="flex-1 min-w-0 max-w-[700px] mx-auto flex flex-col gap-6 sm:gap-8 pt-4 sm:pt-6 pb-20">
          <StoriesCarousel stories={mockStories} />
          <Feed posts={mockFeedPosts} />
        </div>
        <div className="hidden xl:block w-px bg-border sticky top-0 h-screen" />
        <Suspense fallback={<RightSidebarSkeleton />}>
          <RightSidebarWrapper />
        </Suspense>
      </div>
    </main>
  );
}
