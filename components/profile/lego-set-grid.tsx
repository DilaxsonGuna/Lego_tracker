import { LegoSetCard } from "./lego-set-card";
import { LegoSet } from "@/types/lego-set";

interface LegoSetGridProps {
  sets: LegoSet[];
}

export function LegoSetGrid({ sets }: LegoSetGridProps) {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
      {sets.map((set) => (
        <LegoSetCard key={set.setNum} set={set} />
      ))}
    </section>
  );
}
