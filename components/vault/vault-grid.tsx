import { VaultCard } from "./vault-card";
import type { VaultSet } from "@/types/vault";

interface VaultGridProps {
  sets: VaultSet[];
  selectedSets?: Set<string>;
  onToggleSelect?: (setNum: string) => void;
  onToggleFavorite?: (setNum: string) => void;
  showFavorite?: boolean;
  readonly?: boolean;
}

export function VaultGrid({ sets, selectedSets, onToggleSelect, onToggleFavorite, showFavorite = true, readonly = false }: VaultGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {sets.map((set) => (
        <VaultCard
          key={set.setNum}
          set={set}
          isSelected={selectedSets?.has(set.setNum)}
          onToggleSelect={onToggleSelect}
          isFavorite={set.isFavorite}
          onToggleFavorite={onToggleFavorite}
          showFavorite={showFavorite}
          readonly={readonly}
        />
      ))}
    </div>
  );
}
