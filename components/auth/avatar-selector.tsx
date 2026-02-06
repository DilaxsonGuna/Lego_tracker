"use client";

import { cn } from "@/lib/utils";

const AVATAR_COLORS = [
  { name: "red", bg: "bg-red-500", ring: "ring-red-500" },
  { name: "blue", bg: "bg-blue-500", ring: "ring-blue-500" },
  { name: "green", bg: "bg-green-500", ring: "ring-green-500" },
  { name: "yellow", bg: "bg-yellow-500", ring: "ring-yellow-500" },
  { name: "purple", bg: "bg-purple-500", ring: "ring-purple-500" },
  { name: "orange", bg: "bg-orange-500", ring: "ring-orange-500" },
];

interface AvatarSelectorProps {
  value: string;
  onChange: (color: string) => void;
}

export function AvatarSelector({ value, onChange }: AvatarSelectorProps) {
  return (
    <div className="grid grid-cols-6 gap-3">
      {AVATAR_COLORS.map((color) => (
        <button
          key={color.name}
          type="button"
          onClick={() => onChange(color.name)}
          className={cn(
            "size-12 rounded-full transition-all",
            color.bg,
            value === color.name
              ? "ring-2 ring-offset-2 ring-offset-background ring-primary scale-110"
              : "hover:scale-105 hover:ring-2 hover:ring-offset-2 hover:ring-offset-background hover:ring-muted"
          )}
          aria-label={`Select ${color.name} avatar`}
        />
      ))}
    </div>
  );
}

/**
 * Convert color name to a CSS color for avatar display
 */
export function getAvatarColor(colorName: string): string {
  const colorMap: Record<string, string> = {
    red: "#ef4444",
    blue: "#3b82f6",
    green: "#22c55e",
    yellow: "#eab308",
    purple: "#a855f7",
    orange: "#f97316",
  };
  return colorMap[colorName] || "#6b7280";
}
