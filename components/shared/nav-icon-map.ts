import { Home, Compass, Store, User, Lock, Settings, Trophy } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const navIconMap: Record<string, LucideIcon> = {
  home: Home,
  compass: Compass,
  trophy: Trophy,
  vault: Lock,
  store: Store,
  user: User,
  settings: Settings,
};
