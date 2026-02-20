import type { NavItem } from "@/types/navigation";

export const PAGE_SIZE = 50;

export const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/", icon: "home" },
  { label: "Explore", href: "/explore", icon: "compass" },
  { label: "Leaderboard", href: "/leaderboard", icon: "trophy" },
  { label: "Vault", href: "/vault", icon: "vault" },
  { label: "Profile", href: "/profile", icon: "user" },
  { label: "Settings", href: "/settings", icon: "settings" },
];
