import { Card, CardContent } from "@/components/ui/card";
import type { NotableSet } from "@/lib/queries/analytics";

interface NotableSetsRowProps {
  sets: NotableSet[];
}

const labelIcons: Record<string, string> = {
  Largest: "\u{1F3D7}",
  Oldest: "\u{1F4DC}",
  Newest: "\u{2728}",
  "Most Valuable": "\u{1F4B0}",
};

function formatValue(label: string, value: number): string {
  if (label === "Largest") return `${value.toLocaleString()} pcs`;
  if (label === "Most Valuable") return `€${value.toLocaleString()}`;
  return String(value);
}

export function NotableSetsRow({ sets }: NotableSetsRowProps) {
  if (sets.length === 0) return null;

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-black uppercase tracking-wider text-muted-foreground">
        Notable Sets
      </h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {sets.map((set) => (
          <Card key={set.label} className="bg-card/50 border-border overflow-hidden">
            <div className="relative h-28 bg-muted">
              {set.imgUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={set.imgUrl}
                  alt={set.name}
                  className="size-full object-cover"
                  loading="lazy"
                />
              )}
            </div>
            <CardContent className="p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-sm">{labelIcons[set.label] ?? "\u{2B50}"}</span>
                <span className="text-xs font-bold text-primary uppercase tracking-wider">
                  {set.label}
                </span>
              </div>
              <p className="text-sm font-bold text-foreground truncate">{set.name}</p>
              <p className="text-xs text-muted-foreground">{formatValue(set.label, set.value)}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
