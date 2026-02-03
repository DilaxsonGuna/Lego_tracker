"use client";

import { Bookmark, Trash2, Loader2 } from "lucide-react";

interface VaultBulkActionsProps {
  selectedCount: number;
  selectedSetNums: string[];
  onRemove: () => Promise<void>;
  isRemoving: boolean;
}

export function VaultBulkActions({
  selectedCount,
  selectedSetNums,
  onRemove,
  isRemoving
}: VaultBulkActionsProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 md:ml-32">
      <div className="flex items-center gap-2 bg-black/80 backdrop-blur-xl border border-white/10 px-6 py-3 rounded-full shadow-2xl">
        <span className="text-xs font-bold text-white mr-4">
          {selectedCount} Item{selectedCount !== 1 ? "s" : ""} Selected
        </span>
        <div className="h-4 w-px bg-white/20 mr-2" />
        <button className="flex items-center gap-2 text-xs font-bold text-gray-300 hover:text-primary px-3 py-1.5 transition-colors">
          <Bookmark className="size-[18px]" />
          Wishlist
        </button>
        <button
          onClick={onRemove}
          disabled={isRemoving}
          className="flex items-center gap-2 text-xs font-bold text-red-400 hover:text-red-300 px-3 py-1.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isRemoving ? (
            <Loader2 className="size-[18px] animate-spin" />
          ) : (
            <Trash2 className="size-[18px]" />
          )}
          Remove
        </button>
      </div>
    </div>
  );
}
