"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BadgeCheck, UserPlus, UserMinus, Lock } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  FavoritesGrid,
  ProfileBio,
  ProfileStatsRow,
  RankProgressCard,
  MilestoneVault,
  ProfileFooter,
} from "@/components/profile";
import { handleToggleFollow } from "./actions";
import type { UserProfile, UserStats, FavoriteSet, Milestone } from "@/types/profile";

interface PublicProfileClientProps {
  user: UserProfile;
  stats: UserStats;
  favorites: FavoriteSet[];
  milestones: Milestone[];
  isOwner: boolean;
  isFollowing: boolean;
  isLoggedIn: boolean;
  targetUserId: string;
}

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  return n.toString();
}

export function PublicProfileClient({
  user,
  stats,
  favorites,
  milestones,
  isOwner,
  isFollowing: initialIsFollowing,
  isLoggedIn,
  targetUserId,
}: PublicProfileClientProps) {
  const router = useRouter();
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isPending, startTransition] = useTransition();

  const rank = stats?.rank;
  const displayRole = rank ? `${rank.icon} ${rank.name}` : "Collector";

  const onFollowToggle = () => {
    startTransition(async () => {
      const result = await handleToggleFollow(targetUserId, isFollowing);
      if (result.success) {
        setIsFollowing(!isFollowing);
        router.refresh();
      }
    });
  };

  return (
    <>
      {/* Profile Hero */}
      <header className="flex flex-col items-center mb-16">
        {/* Avatar */}
        <div className="relative mb-6">
          <div className="absolute -inset-1.5 rounded-full bg-primary/40 blur-xl animate-pulse" />
          <Avatar className="relative size-44 border-4 border-primary bg-background shadow-[0_0_25px_rgba(255,208,0,0.4)]">
            <AvatarImage src={user.avatarUrl} alt={user.username} />
            <AvatarFallback className="text-5xl">
              {user.username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {user.isOnline && (
            <div className="absolute bottom-3 right-3 size-8 rounded-full border-4 border-background bg-green-500" />
          )}
        </div>

        {/* Name & Role */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <h1 className="text-5xl font-black tracking-tighter text-foreground">
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

          {/* Follow Button (only if not owner and logged in) */}
          {!isOwner && isLoggedIn && (
            <div className="mb-6">
              <Button
                onClick={onFollowToggle}
                disabled={isPending}
                variant={isFollowing ? "outline" : "default"}
                className="gap-2"
              >
                {isFollowing ? (
                  <>
                    <UserMinus className="size-4" />
                    Unfollow
                  </>
                ) : (
                  <>
                    <UserPlus className="size-4" />
                    Follow
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Social Stats */}
          <div className="flex items-center justify-center gap-10 py-6 border-y border-border/50">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground leading-none">
                {formatCount(user.followers)}
              </div>
              <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mt-1">
                Followers
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground leading-none">
                {formatCount(user.following)}
              </div>
              <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mt-1">
                Following
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground leading-none">
                {formatCount(user.friends)}
              </div>
              <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mt-1">
                Friends
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Favorites Grid (read-only for non-owners) */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground">
            Top {favorites.length} Favorites
          </h3>
          {isOwner && (
            <Button
              variant="link"
              size="sm"
              className="text-[11px] font-bold text-primary h-auto p-0"
            >
              Edit Selection
            </Button>
          )}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 shadow-[0_0_40px_-10px_rgba(255,208,0,0.15)]">
          {favorites.map((fav) => (
            <div
              key={fav.setNum}
              className="group relative aspect-[3/4] overflow-hidden rounded-lg border border-border/50 transition-all hover:scale-[1.03] hover:border-primary/50 cursor-pointer"
            >
              <div
                className="size-full bg-cover bg-center grayscale-[0.3] group-hover:grayscale-0 transition-all"
                style={{ backgroundImage: `url("${fav.imageUrl}")` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
      </section>

      {/* View Vault Link */}
      <div className="flex justify-center mb-12">
        <Link href={`/u/${targetUserId}/vault`}>
          <Button variant="outline" className="gap-2">
            <Lock className="size-4" />
            View Vault
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <ProfileBio user={user} />
          <RankProgressCard
            progress={stats.rankProgress}
            brickScore={stats.brickScore}
          />
          <ProfileStatsRow stats={stats} />
        </div>
        <MilestoneVault milestones={milestones} />
      </div>

      <ProfileFooter />
    </>
  );
}
