import { TrendingUp, Puzzle, DollarSign, Ratio } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { CollectionKPIs } from "@/lib/queries/analytics";

interface AnalyticsKPIsProps {
  kpis: CollectionKPIs;
}

function formatValue(value: number): string {
  return `€${value.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

function formatPricePerPiece(value: number): string {
  return `€${value.toFixed(2)}`;
}

const kpiCards = [
  {
    key: "totalSets" as const,
    label: "Total Sets",
    icon: Puzzle,
    format: (kpis: CollectionKPIs) => kpis.totalSets.toLocaleString(),
    badge: (kpis: CollectionKPIs) =>
      kpis.setsAddedThisMonth > 0 ? `+${kpis.setsAddedThisMonth} this month` : null,
  },
  {
    key: "totalPieces" as const,
    label: "Total Pieces",
    icon: TrendingUp,
    format: (kpis: CollectionKPIs) => kpis.totalPieces.toLocaleString(),
    badge: () => null,
  },
  {
    key: "totalValue" as const,
    label: "Collection Value",
    icon: DollarSign,
    format: (kpis: CollectionKPIs) =>
      kpis.totalValue !== null ? formatValue(kpis.totalValue) : "—",
    badge: () => null,
  },
  {
    key: "avgPricePerPiece" as const,
    label: "Avg Price/Piece",
    icon: Ratio,
    format: (kpis: CollectionKPIs) =>
      kpis.avgPricePerPiece !== null ? formatPricePerPiece(kpis.avgPricePerPiece) : "—",
    badge: () => null,
  },
];

export function AnalyticsKPIs({ kpis }: AnalyticsKPIsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {kpiCards.map((card) => {
        const Icon = card.icon;
        const badge = card.badge(kpis);
        return (
          <Card key={card.key} className="bg-card/50 border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="size-4 text-primary" />
                </div>
                <span className="text-xs font-medium text-muted-foreground">{card.label}</span>
              </div>
              <div className="text-2xl font-black text-foreground tracking-tight">
                {card.format(kpis)}
              </div>
              {badge && <div className="mt-1 text-xs font-medium text-primary">{badge}</div>}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
