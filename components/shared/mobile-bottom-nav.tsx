"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navIconMap } from "./nav-icon-map";
import { cn } from "@/lib/utils";

interface BottomNavItem {
  label: string;
  href: string;
  icon: string;
}

const BOTTOM_NAV_ITEMS: BottomNavItem[] = [
  { label: "Home", href: "/", icon: "home" },
  { label: "Explore", href: "/explore", icon: "compass" },
  { label: "Vault", href: "/vault", icon: "vault" },
  { label: "Profile", href: "/profile", icon: "user" },
  { label: "Settings", href: "/settings", icon: "settings" },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/80 backdrop-blur-md md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <ul className="flex items-center justify-around">
        {BOTTOM_NAV_ITEMS.map((item) => {
          const Icon = navIconMap[item.icon] || navIconMap.home;
          const isActive =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-0.5 px-3 text-[10px] font-medium transition-colors min-w-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-lg",
                  isActive
                    ? "text-primary font-bold text-[11px] bg-primary/10 rounded-xl py-1.5"
                    : "text-muted-foreground py-2"
                )}
              >
                <Icon className={isActive ? "size-6" : "size-5"} />
                <span className="truncate">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
