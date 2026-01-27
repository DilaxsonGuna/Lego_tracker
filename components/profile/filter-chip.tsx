"use client";

import { cn } from "@/lib/utils";

interface FilterChipProps {
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}

export function FilterChip({ label, isActive, onClick }: FilterChipProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-xl px-4 transition-all active:scale-95",
        isActive
          ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
          : "bg-card hover:bg-secondary border border-transparent dark:border-border"
      )}
    >
      <p
        className={cn(
          "text-sm leading-normal",
          isActive ? "font-bold" : "font-medium"
        )}
      >
        {label}
      </p>
    </button>
  );
}
