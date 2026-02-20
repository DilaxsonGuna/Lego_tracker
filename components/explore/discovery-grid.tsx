import { Compass } from "lucide-react";
import { DiscoveryCard } from "./discovery-card";
import { EmptyState } from "@/components/shared/empty-state";
import type { DiscoverySet } from "@/types/explore";
import type { CollectionTab } from "@/types/lego-set";

interface DiscoveryGridProps {
  sets: DiscoverySet[];
  userSets: Map<string, CollectionTab>;
  pendingToggles: Set<string>;
  onAddToWishlist: (setNum: string) => void;
  onAddToCollection: (setNum: string) => void;
  onRemove: (setNum: string) => void;
}

export function DiscoveryGrid({
  sets,
  userSets,
  pendingToggles,
  onAddToWishlist,
  onAddToCollection,
  onRemove,
}: DiscoveryGridProps) {
  if (sets.length === 0) {
    return (
      <EmptyState
        icon={Compass}
        title="No sets found"
        description="Try adjusting your filters or search to discover more sets."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {sets.map((set) => (
        <DiscoveryCard
          key={set.setNum}
          set={set}
          collectionType={userSets.get(set.setNum)}
          isPending={pendingToggles.has(set.setNum)}
          onAddToWishlist={() => onAddToWishlist(set.setNum)}
          onAddToCollection={() => onAddToCollection(set.setNum)}
          onRemove={() => onRemove(set.setNum)}
        />
      ))}
    </div>
  );
}
