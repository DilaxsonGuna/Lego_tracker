import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { TrendingSet, SuggestedUser } from "@/types/feed";

interface RightSidebarProps {
  trendingSets: TrendingSet[];
  suggestedUsers: SuggestedUser[];
}

export function RightSidebar({
  trendingSets,
  suggestedUsers,
}: RightSidebarProps) {
  return (
    <aside className="hidden xl:flex flex-col w-80 flex-shrink-0 gap-8 py-2 sticky top-0 h-screen overflow-y-auto scrollbar-hide">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search sets, users..."
          className="w-full rounded-xl py-3 pl-10 pr-4 bg-card border-border text-sm"
        />
      </div>

      {/* Trending Sets */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-foreground font-bold text-sm">Trending Sets</h3>
          <a
            className="text-primary text-xs font-medium hover:underline"
            href="#"
          >
            View All
          </a>
        </div>
        <div className="flex flex-col gap-4">
          {trendingSets.map((set) => (
            <div
              key={set.setNum}
              className="flex gap-3 items-center group cursor-pointer"
            >
              <div
                className="size-12 rounded-lg bg-cover bg-center bg-card flex-shrink-0"
                style={{ backgroundImage: `url("${set.thumbnailUrl}")` }}
              />
              <div className="flex flex-col">
                <span className="text-foreground text-sm font-medium group-hover:text-primary transition-colors">
                  {set.name}
                </span>
                <span className="text-muted-foreground text-xs">
                  #{set.setNum} • {set.postCount}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Suggested Collectors */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-foreground font-bold text-sm">
            Suggested Collectors
          </h3>
        </div>
        <div className="space-y-4">
          {suggestedUsers.map((user) => (
            <div key={user.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="size-8">
                  <AvatarImage src={user.avatarUrl} alt={user.username} />
                  <AvatarFallback>
                    {user.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-foreground text-xs font-medium">
                  {user.username}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-primary text-xs font-bold hover:text-foreground px-2 h-auto py-1"
              >
                Follow
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Links */}
      <div className="mt-auto flex flex-wrap gap-x-4 gap-y-2 text-[10px] text-muted-foreground">
        <a className="hover:text-foreground transition-colors" href="#">
          About
        </a>
        <a className="hover:text-foreground transition-colors" href="#">
          Help
        </a>
        <a className="hover:text-foreground transition-colors" href="#">
          Press
        </a>
        <a className="hover:text-foreground transition-colors" href="#">
          API
        </a>
        <a className="hover:text-foreground transition-colors" href="#">
          Jobs
        </a>
        <a className="hover:text-foreground transition-colors" href="#">
          Privacy
        </a>
        <a className="hover:text-foreground transition-colors" href="#">
          Terms
        </a>
        <span>&copy; 2024 LegoFlex</span>
      </div>
    </aside>
  );
}
