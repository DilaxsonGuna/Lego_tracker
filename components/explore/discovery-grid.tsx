import { DiscoveryCard } from "./discovery-card";
import type { DiscoverySet } from "@/types/explore";

interface DiscoveryGridProps {
  sets: DiscoverySet[];
  collectionSetNums: Set<string>;
  pendingToggles: Set<string>;
  onToggleCollection: (setNum: string) => void;
}

export function DiscoveryGrid({
  sets,
  collectionSetNums,
  pendingToggles,
  onToggleCollection,
}: DiscoveryGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {sets.map((set) => (
        <DiscoveryCard
          key={set.setNum}
          set={set}
          isInCollection={collectionSetNums.has(set.setNum)}
          isPending={pendingToggles.has(set.setNum)}
          onToggle={() => onToggleCollection(set.setNum)}
        />
      ))}
    </div>
  );
}
