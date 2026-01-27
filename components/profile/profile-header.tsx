import { Plus, BadgeCheck } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { StatsBar } from "./stats-bar";
import { UserProfile, UserStats } from "@/types/profile";

interface ProfileHeaderProps {
  user: UserProfile;
  stats: UserStats;
}

export function ProfileHeader({ user, stats }: ProfileHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row p-4 gap-8 items-center md:items-start mb-6">
      <div className="relative shrink-0 group">
        <Avatar className="size-32 md:size-40 border-4 border-primary shadow-lg shadow-black/50">
          <AvatarImage src={user.avatarUrl} alt={user.username} />
          <AvatarFallback className="text-4xl">
            {user.username.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        {user.isVerified && (
          <div className="absolute bottom-1 right-1 bg-card p-1.5 rounded-full border-2 border-background">
            <BadgeCheck className="size-5 text-primary" />
          </div>
        )}
      </div>
      <div className="flex flex-col gap-4 items-center md:items-start flex-1 w-full">
        <div className="flex flex-col items-center md:items-start">
          <h1 className="text-foreground text-3xl font-extrabold leading-tight tracking-[-0.015em] mb-1">
            {user.username}
          </h1>
          <p className="text-muted-foreground text-sm md:text-base font-medium leading-normal text-center md:text-left">
            {user.bio}
          </p>
        </div>
        <StatsBar stats={stats} />
        <Button className="w-full md:w-auto mt-2 rounded-xl h-10 px-6">
          <Plus className="mr-2 size-4" />
          Follow
        </Button>
      </div>
    </div>
  );
}
