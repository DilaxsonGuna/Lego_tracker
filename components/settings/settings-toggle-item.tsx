"use client";

import { Eye, Bell } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap: Record<string, LucideIcon> = {
  eye: Eye,
  bell: Bell,
};

interface SettingsToggleItemProps {
  icon: string;
  title: string;
  description: string;
  checked?: boolean;
  isLast?: boolean;
}

export function SettingsToggleItem({
  icon,
  title,
  description,
  checked = false,
  isLast = false,
}: SettingsToggleItemProps) {
  const Icon = iconMap[icon] || Eye;
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 p-4 sm:px-6 hover:bg-surface-accent transition-colors group/item",
        !isLast && "border-b border-border/50"
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
      {/* Custom Toggle Switch */}
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          defaultChecked={checked}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary transition-colors" />
      </label>
    </div>
  );
}
