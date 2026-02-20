"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LegoFlexLogo } from "./legoflex-logo";
import { navIconMap } from "./nav-icon-map";
import { cn } from "@/lib/utils";
import { NavItem } from "@/types/navigation";

interface MobileHeaderProps {
  className?: string;
  navItems: NavItem[];
  user?: { username: string; avatarUrl: string } | null;
}

export function MobileHeader({ className, navItems, user }: MobileHeaderProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header
      className={cn(
        "sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur-md md:hidden",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <LegoFlexLogo />
        <h2 className="text-lg font-bold tracking-tight text-foreground">
          LegoFlex
        </h2>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="text-foreground"
            aria-label="Open menu"
          >
            <Menu className="size-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex w-[80vw] max-w-72 flex-col bg-card/95 p-0 backdrop-blur-md">
          <SheetHeader className="px-6 pb-4 pt-6">
            <div className="flex items-center gap-3">
              <LegoFlexLogo />
              <SheetTitle className="text-lg font-bold tracking-tight text-foreground">
                LegoFlex
              </SheetTitle>
            </div>
          </SheetHeader>

          <nav className="flex flex-1 flex-col gap-2 px-6">
            {navItems.map((item) => {
              const Icon = navIconMap[item.icon] || navIconMap.home;
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
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

          {user && (
            <div className="mt-auto flex items-center gap-3 border-t border-border px-6 py-6">
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
        </SheetContent>
      </Sheet>
    </header>
  );
}
