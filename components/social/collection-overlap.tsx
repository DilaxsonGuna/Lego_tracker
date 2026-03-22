import { Layers } from "lucide-react";

interface CollectionOverlapProps {
  sharedCount: number;
  similarity: number;
}

export function CollectionOverlap({ sharedCount, similarity }: CollectionOverlapProps) {
  if (sharedCount === 0) return null;

  const percentage = Math.round(similarity * 100);

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
