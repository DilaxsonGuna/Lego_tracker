"use client";

import { BadgeCheck } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserProfile, UserStats } from "@/types/profile";

interface ProfileHeroProps {
  user: UserProfile;
  stats?: UserStats | null;
}

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  return n.toString();
}

export function ProfileHero({ user, stats }: ProfileHeroProps) {
  const rank = stats?.rank;
  const displayRole = rank ? `${rank.icon} ${rank.name}` : "Collector";

  return (
    <header className="flex flex-col items-center mb-10 sm:mb-16">
      {/* Avatar */}
      <div className="relative mb-6">
        <div className="absolute -inset-1.5 rounded-full bg-primary/40 blur-xl animate-pulse" />
        <Avatar className="relative size-28 sm:size-44 border-4 border-primary bg-background shadow-[0_0_25px_rgba(255,208,0,0.4)]">
          <AvatarImage src={user.avatarUrl} alt={user.username} />
          <AvatarFallback className="text-3xl sm:text-5xl">
            {user.username.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        {user.isOnline && (
          <div className="absolute bottom-2 right-2 size-6 sm:bottom-3 sm:right-3 sm:size-8 rounded-full border-4 border-background bg-green-500" />
        )}
      </div>

      {/* Name & Role */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tighter text-foreground">
            @{user.username}
          </h1>
          {user.isVerified && (
            <BadgeCheck className="size-7 text-blue-400 fill-blue-400" />
          )}
        </div>

        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/30 px-5 py-1.5 mb-6">
          <span className="text-xs font-black uppercase tracking-[0.2em] text-primary">
            {displayRole}
          </span>
        </div>

        {/* Social Stats */}
        <div className="flex items-center justify-center gap-6 sm:gap-10 py-6 border-y border-border/50">
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-bold text-foreground leading-none">
              {formatCount(user.followers)}
            </div>
            <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mt-1">
              Followers
            </div>
          </div>
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-bold text-foreground leading-none">
              {formatCount(user.following)}
            </div>
            <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mt-1">
              Following
            </div>
          </div>
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-bold text-foreground leading-none">
              {formatCount(user.friends)}
            </div>
            <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mt-1">
              Friends
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
