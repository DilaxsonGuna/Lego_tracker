import { Puzzle, Users, Palette } from "lucide-react";

interface SetDetailStatsProps {
  numParts: number;
  ownerCount: number;
  themeName: string;
}

export function SetDetailStats({ numParts, ownerCount, themeName }: SetDetailStatsProps) {
  const stats = [
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
    <div className="grid grid-cols-3 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex flex-col items-center gap-2 rounded-xl bg-card border border-border p-4 text-center"
        >
          <stat.icon className="size-5 text-primary" />
          <span className="text-lg md:text-xl font-black text-foreground">
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
