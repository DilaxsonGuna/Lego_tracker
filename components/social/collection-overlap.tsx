"use client";

import { useEffect, useRef } from "react";
import { Layers } from "lucide-react";
import { AnalyticsEvent, capture } from "@/lib/analytics/events";

interface CollectionOverlapProps {
  sharedCount: number;
  similarity: number;
}

export function CollectionOverlap({ sharedCount, similarity }: CollectionOverlapProps) {
  const percentage = Math.round(similarity * 100);

  // Fires once when overlap is actually shown — a signal of social-comparison
  // behaviour. Guarded so a parent re-render (e.g. router.refresh after a
  // follow) doesn't re-fire and inflate the metric.
  const firedRef = useRef(false);
  useEffect(() => {
    if (sharedCount === 0 || firedRef.current) return;
    firedRef.current = true;
    capture(AnalyticsEvent.OverlapView, {
      shared_count: sharedCount,
      similarity_pct: percentage,
    });
  }, [sharedCount, percentage]);

  if (sharedCount === 0) return null;

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Layers className="size-4 text-primary" />
      <span>
        <span className="font-medium text-foreground">
          {sharedCount} set{sharedCount > 1 ? "s" : ""}
        </span>{" "}
        in common
        {percentage > 0 && (
          <span className="ml-1 text-xs text-muted-foreground">({percentage}% match)</span>
        )}
      </span>
    </div>
  );
}
