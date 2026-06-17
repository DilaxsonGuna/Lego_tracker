"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { BrickMasterLogo } from "./brickmaster-logo";
import { navIconMap } from "./nav-icon-map";
import { NavItem } from "@/types/navigation";
import { cn } from "@/lib/utils";

interface SidebarUser {
  username: string;
  avatarUrl: string;
}

interface SidebarProps {
  navItems: NavItem[];
  user: SidebarUser | null;
  notificationSlot?: React.ReactNode;
}

export function Sidebar({ navItems, user, notificationSlot }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 z-50 hidden h-screen w-64 flex-col border-r border-border bg-card/95 backdrop-blur-md px-6 py-6 md:flex">
      <div className="mb-10 flex items-center gap-3 px-2">
        <BrickMasterLogo />
        <span className="text-lg font-bold tracking-tight text-foreground">BrickMaster</span>
      </div>

      <nav className="flex flex-1 flex-col">
        <ul className="flex flex-col gap-2">
          {navItems.map((item) => {
            const Icon = navIconMap[item.icon] || navIconMap.home;
            const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-card",
                    isActive
                      ? "bg-surface-accent text-primary font-bold"
                      : "text-muted-foreground hover:bg-surface-accent hover:text-foreground"
                  )}
                >
                  <Icon className="size-6" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {user && (
        <div className="mt-auto flex items-center gap-3 border-t border-border pt-6">
          <Avatar
            className="size-10 ring-2 ring-surface-accent"
            style={{ backgroundColor: user.avatarUrl || "hsl(var(--info))" }}
          >
            <AvatarFallback
              style={{ backgroundColor: user.avatarUrl || "hsl(var(--info))" }}
              className="text-white font-bold"
            >
              {user.username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-1 flex-col">
            <span className="text-sm font-bold text-foreground">@{user.username}</span>
            <span className="text-xs text-muted-foreground">Collector</span>
          </div>
          {notificationSlot}
        </div>
      )}

      <div className="mt-4 flex flex-col gap-1 px-2">
        <div className="flex gap-2 text-[10px] text-muted-foreground/60">
          <a href="/privacy" className="hover:text-muted-foreground transition-colors">
            Privacy
          </a>
          <span>&middot;</span>
          <a href="/terms" className="hover:text-muted-foreground transition-colors">
            Terms
          </a>
        </div>
        <p className="text-[10px] text-muted-foreground/40 leading-tight">
          LEGO is a trademark of the LEGO Group. Not affiliated with or endorsed by the LEGO Group.
        </p>
      </div>
    </aside>
  );
}
