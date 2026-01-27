"use client";

import Image from "next/image";
import { LegoSet } from "@/types/lego-set";

interface LegoSetCardProps {
  set: LegoSet;
}

export function LegoSetCard({ set }: LegoSetCardProps) {
  return (
    <div className="group relative flex flex-col gap-3 rounded-2xl bg-card p-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/5 border border-transparent hover:border-border">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-surface-accent">
        <Image
          src={set.setImgUrl}
          alt={set.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute top-3 right-3 rounded-md bg-black/60 px-2 py-1 text-xs font-bold text-white backdrop-blur-sm">
          {set.setNum}
        </div>
      </div>
      <div className="flex flex-col px-1 pb-2">
        <h3 className="text-lg font-bold leading-tight text-foreground group-hover:text-primary transition-colors">
          {set.name}
        </h3>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {set.year} &bull; {set.numParts.toLocaleString()} pcs
          </span>
          {set.price && (
            <span className="text-sm font-bold text-primary">{set.price}</span>
          )}
        </div>
      </div>
    </div>
  );
}
