"use client";

import Image from "next/image";
import Link from "next/link";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import type { RecentlyAddedSet } from "@/lib/queries/home";

interface RecentlyAddedProps {
  sets: RecentlyAddedSet[];
}

export function RecentlyAdded({ sets }: RecentlyAddedProps) {
  if (sets.length === 0) return null;

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-foreground font-bold text-lg">Recently Added</h2>
        <Link href="/vault" className="text-primary text-xs font-medium hover:underline">
          View Vault
        </Link>
      </div>
      <ScrollArea className="w-full">
        <div className="flex gap-3 pb-4">
          {sets.map((set) => (
            <div key={set.setNum} className="flex-shrink-0 w-[200px] sm:w-[240px] group">
              <div className="aspect-square rounded-xl bg-card border border-border overflow-hidden mb-2">
                {set.setImgUrl ? (
                  <Image
                    src={set.setImgUrl}
                    alt={set.name}
                    width={240}
                    height={240}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                    No Image
                  </div>
                )}
              </div>
              <p className="text-sm font-medium text-foreground truncate" title={set.name}>
                {set.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {set.year} &middot; {set.numParts.toLocaleString()} pcs
              </p>
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </section>
  );
}
