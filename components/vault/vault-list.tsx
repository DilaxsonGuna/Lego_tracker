"use client";

import { Checkbox } from "@/components/ui/checkbox";
import type { VaultSet, VaultSetStatus } from "@/types/vault";

interface VaultListProps {
  sets: VaultSet[];
  selectedSets: Set<string>;
  onToggleSelect: (setNum: string) => void;
  onToggleFavorite: (setNum: string) => void;
  showFavorite?: boolean;
}

const STATUS_VARIANTS: Partial<Record<VaultSetStatus, string>> = {
  built: "bg-green-700/10 text-green-700 dark:text-green-400 border-green-700/20",
  "in-box": "bg-blue-700/10 text-blue-700 dark:text-blue-400 border-blue-700/20",
};

const STATUS_LABELS: Partial<Record<VaultSetStatus, string>> = {
  built: "Built",
  "in-box": "In Box",
};

export function VaultList({ sets, selectedSets, onToggleSelect }: VaultListProps) {
  return (
    <div className="hidden sm:block bg-card/30 rounded-xl border border-border overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="text-xs uppercase tracking-wider text-muted-foreground border-b border-border bg-background">
            <th className="px-4 py-3 font-bold w-12">
              <span className="sr-only">Select</span>
            </th>
            <th className="px-2 py-3 font-bold w-16">Img</th>
            <th className="px-4 py-3 font-bold">Set Name</th>
            <th className="px-4 py-3 font-bold">Set #</th>
            <th className="px-4 py-3 font-bold">Theme</th>
            <th className="px-4 py-3 font-bold text-right">Pieces</th>
            <th className="px-4 py-3 font-bold text-center">Year</th>
            <th className="px-4 py-3 font-bold">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {sets.map((set) => (
            <tr
              key={set.setNum}
              className="group transition-colors hover:bg-card"
            >
              <td className="px-4 py-2">
                <Checkbox
                  checked={selectedSets.has(set.setNum)}
                  onCheckedChange={() => onToggleSelect(set.setNum)}
                  className="bg-background/80"
                />
              </td>
              <td className="px-2 py-2">
                <div
                  className="w-10 h-10 rounded bg-black bg-cover bg-center border border-border"
                  style={{ backgroundImage: `url("${set.setImgUrl}")` }}
                />
              </td>
              <td className="px-4 py-2 text-sm font-bold text-foreground uppercase tracking-tight">
                {set.name}
              </td>
              <td className="px-4 py-2 text-xs font-mono text-muted-foreground">
                {set.setNum}
              </td>
              <td className="px-4 py-2 text-xs text-muted-foreground">
                {set.themeName}
              </td>
              <td className="px-4 py-2 text-sm font-medium text-right text-muted-foreground">
                {set.numParts.toLocaleString()}
              </td>
              <td className="px-4 py-2 text-xs text-center text-muted-foreground font-medium">
                {set.year}
              </td>
              <td className="px-4 py-2">
                {set.status && STATUS_VARIANTS[set.status] && (
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold border uppercase ${STATUS_VARIANTS[set.status]}`}
                  >
                    {STATUS_LABELS[set.status]}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
