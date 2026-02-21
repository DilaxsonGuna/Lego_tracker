import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { DiscoverySet } from "@/types/explore";

interface RelatedSetsProps {
  sets: DiscoverySet[];
  themeName: string;
}

export function RelatedSets({ sets, themeName }: RelatedSetsProps) {
  if (sets.length === 0) return null;

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-bold text-foreground">
        More from {themeName}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {sets.map((set) => (
          <Link
            key={set.setNum}
            href={`/set/${set.setNum}`}
            className="group flex flex-col rounded-xl bg-card border border-border overflow-hidden hover:border-primary/50 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/10 transition-all duration-300"
          >
            <div className="relative aspect-square bg-muted flex items-center justify-center p-4">
              <div
                className="size-full bg-center bg-contain bg-no-repeat transition-transform duration-500 group-hover:scale-105"
                style={{ backgroundImage: `url("${set.setImgUrl}")` }}
              />
              {set.year && (
                <div className="absolute top-2 left-2">
                  <Badge
                    variant="outline"
                    className="bg-black/60 backdrop-blur-md text-[10px] font-bold px-1.5 py-0.5 rounded text-primary border-primary/20"
                  >
                    {set.year}
                  </Badge>
                </div>
              )}
            </div>
            <div className="p-3 flex flex-col gap-1">
              <h3 className="text-xs font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors uppercase tracking-tight">
                {set.name}
              </h3>
              <span className="text-[10px] text-muted-foreground">
                {set.numParts.toLocaleString()} pcs
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
