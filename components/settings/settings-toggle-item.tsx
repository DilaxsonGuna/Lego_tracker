"use client";

import { Eye, Bell } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";

const iconMap: Record<string, LucideIcon> = {
  eye: Eye,
  bell: Bell,
};

interface SettingsToggleItemProps {
  icon: string;
  title: string;
  description: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  isLast?: boolean;
}

export function SettingsToggleItem({
  icon,
  title,
  description,
  checked = false,
  onCheckedChange,
  disabled = false,
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
      <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
      />
    </div>
  );
}
