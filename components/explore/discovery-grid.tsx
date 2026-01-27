import { DiscoveryCard } from "./discovery-card";
import type { DiscoverySet } from "@/types/explore";

interface DiscoveryGridProps {
  sets: DiscoverySet[];
}

export function DiscoveryGrid({ sets }: DiscoveryGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {sets.map((set) => (
        <DiscoveryCard key={set.setNum} set={set} />
      ))}
    </div>
  );
}
