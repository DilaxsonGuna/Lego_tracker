"use client";

import Link from "next/link";
import {
  ChevronRight,
  User,
  Lock,
  Eye,
  LayoutGrid,
  Sun,
  Bell,
  LogOut,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap: Record<string, LucideIcon> = {
  user: User,
  lock: Lock,
  eye: Eye,
  "layout-grid": LayoutGrid,
  sun: Sun,
  bell: Bell,
  "log-out": LogOut,
};

interface SettingsLinkItemProps {
  href: string;
  icon: string;
  title: string;
  description: string;
  isLast?: boolean;
}

export function SettingsLinkItem({
  href,
  icon,
  title,
  description,
  isLast = false,
}: SettingsLinkItemProps) {
  const Icon = iconMap[icon] || User;
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center justify-between gap-4 p-4 sm:px-6 hover:bg-surface-accent transition-colors group/item",
        !isLast && "border-b border-border"
      )}
    >
      <div className="flex items-center gap-4">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-surface-accent text-muted-foreground group-hover/item:text-primary transition-colors">
          <Icon className="size-5" />
        </div>
        <div>
          <p className="font-medium text-foreground">{title}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <ChevronRight className="size-5 text-muted-foreground group-hover/item:text-foreground transition-colors" />
    </Link>
  );
}
