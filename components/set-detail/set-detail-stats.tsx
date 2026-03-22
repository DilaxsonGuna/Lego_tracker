import { Puzzle, Users, Palette, Tag } from "lucide-react";

interface SetDetailStatsProps {
  numParts: number;
  ownerCount: number;
  themeName: string;
  retailPrice?: number | null;
}

export function SetDetailStats({
  numParts,
  ownerCount,
  themeName,
  retailPrice,
}: SetDetailStatsProps) {
  const stats = [
    ...(retailPrice != null
      ? [
          {
            icon: Tag,
            label: "Retail Price",
            value: `€${retailPrice.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
            highlight: true,
          },
        ]
      : []),
    {
      icon: Puzzle,
      label: "Pieces",
      value: numParts.toLocaleString(),
    },
    {
      icon: Users,
      label: "Collectors",
      value: ownerCount.toLocaleString(),
    },
    {
      icon: Palette,
      label: "Theme",
      value: themeName,
    },
  ];

  return (
    <div
      className={`grid gap-4 ${stats.length > 3 ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-3"}`}
    >
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex flex-col items-center gap-2 rounded-xl bg-card border border-border p-4 text-center"
        >
          <stat.icon className="size-5 text-primary" />
          <span
            className={`text-lg md:text-xl font-black ${"highlight" in stat && stat.highlight ? "text-primary" : "text-foreground"}`}
          >
            {stat.value}
          </span>
          <span className="text-xs text-muted-foreground uppercase tracking-wide">
            {stat.label}
          </span>
        </div>
      ))}
    </div>
  );
}
