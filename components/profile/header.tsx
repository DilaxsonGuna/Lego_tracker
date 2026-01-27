"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { BrickBoxLogo } from "./brickbox-logo";
import { NavItem } from "@/types/navigation";
import { cn } from "@/lib/utils";

interface HeaderProps {
  navItems: NavItem[];
  userAvatarUrl?: string;
  userName?: string;
}

export function Header({ navItems, userAvatarUrl, userName }: HeaderProps) {
  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-border px-4 md:px-10 py-3 bg-card sticky top-0 z-50">
      <div className="flex items-center gap-8">
        <Link href="/" className="flex items-center gap-4">
          <div className="size-8 text-primary">
            <BrickBoxLogo className="w-full h-full" />
          </div>
          <h2 className="text-foreground text-xl font-bold leading-tight tracking-[-0.015em]">
            BrickBox
          </h2>
        </Link>
        <nav className="hidden md:flex items-center gap-9">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium leading-normal transition-colors",
                item.isActive
                  ? "text-primary font-bold"
                  : "text-foreground hover:text-primary"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="flex flex-1 justify-end gap-4 md:gap-8 items-center">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-xl size-10 hover:bg-foreground/5"
        >
          <Bell className="size-6" />
        </Button>
        <Avatar className="size-10 border-2 border-primary">
          <AvatarImage src={userAvatarUrl} alt={userName || "User"} />
          <AvatarFallback>
            {userName?.charAt(0).toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
