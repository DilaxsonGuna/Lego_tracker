"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Store, User, Plus, Lock, Settings, Trophy } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LegoFlexLogo } from "./legoflex-logo";
import { NavItem } from "@/types/navigation";
import { cn } from "@/lib/utils";

const iconMap: Record<string, LucideIcon> = {
  home: Home,
  compass: Compass,
  trophy: Trophy,
  vault: Lock,
  store: Store,
  user: User,
  settings: Settings,
};

interface SidebarUser {
  username: string;
  avatarUrl: string;
}

interface SidebarProps {
  navItems: NavItem[];
  user: SidebarUser | null;
}

export function Sidebar({ navItems, user }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 z-50 hidden h-screen w-64 flex-col border-r border-border bg-card/95 backdrop-blur-md px-6 py-6 md:flex">
      <div className="mb-10 flex items-center gap-3 px-2">
        <LegoFlexLogo />
        <h2 className="text-lg font-bold tracking-tight text-foreground">
          LegoFlex
        </h2>
      </div>

      <nav className="flex flex-1 flex-col gap-2">
        {navItems.map((item) => {
          const Icon = iconMap[item.icon] || Home;
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                isActive
                  ? "bg-surface-accent text-primary font-bold"
                  : "text-muted-foreground hover:bg-surface-accent hover:text-foreground"
              )}
            >
              <Icon className="size-6" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-8">
        <Button className="w-full gap-2 rounded-xl py-6 text-sm font-bold shadow-lg shadow-primary/20">
          <Plus className="size-5" />
          Post Build
        </Button>
      </div>

      {user && (
        <div className="mt-auto flex items-center gap-3 border-t border-border pt-6">
          <Avatar
            className="size-10 ring-2 ring-surface-accent"
            style={{ backgroundColor: user.avatarUrl || "#3b82f6" }}
          >
            <AvatarFallback
              style={{ backgroundColor: user.avatarUrl || "#3b82f6" }}
              className="text-white font-bold"
            >
              {user.username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-foreground">
              @{user.username}
            </span>
            <span className="text-xs text-muted-foreground">Collector</span>
          </div>
        </div>
      )}
    </aside>
  );
}
