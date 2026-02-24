"use client";

import { LegoFlexLogo } from "./legoflex-logo";
import { cn } from "@/lib/utils";
import { NavItem } from "@/types/navigation";

interface MobileHeaderProps {
  className?: string;
  navItems: NavItem[];
  user?: { username: string; avatarUrl: string } | null;
  notificationSlot?: React.ReactNode;
}

export function MobileHeader({ className, notificationSlot }: MobileHeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-50 flex h-14 w-full items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur-md md:hidden",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <LegoFlexLogo />
        <h2 className="text-lg font-bold tracking-tight text-foreground">
          LegoFlex
        </h2>
      </div>
      {notificationSlot}
    </header>
  );
}
