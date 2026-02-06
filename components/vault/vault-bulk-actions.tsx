"use client";

import { Package, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { CollectionTab } from "@/types/lego-set";

interface VaultBulkActionsProps {
  selectedCount: number;
  selectedSetNums: string[];
  activeTab: CollectionTab;
  onRemove: () => Promise<void>;
  onMoveToCollection: () => Promise<void>;
  isProcessing: boolean;
}

export function VaultBulkActions({
  selectedCount,
  selectedSetNums,
  activeTab,
  onRemove,
  onMoveToCollection,
  isProcessing,
}: VaultBulkActionsProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 md:ml-32">
      <div className="flex items-center gap-2 bg-black/80 backdrop-blur-xl border border-white/10 px-6 py-3 rounded-full shadow-2xl">
        <span className="text-xs font-bold text-white mr-4">
          {selectedCount} Item{selectedCount !== 1 ? "s" : ""} Selected
        </span>
        <Separator orientation="vertical" className="h-4 bg-white/20" />

        {activeTab === "wishlist" && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onMoveToCollection}
            disabled={isProcessing}
            className="text-xs font-bold text-gray-300 hover:text-primary hover:bg-transparent px-3 py-1.5 h-auto"
          >
            {isProcessing ? (
              <Loader2 className="size-[18px] animate-spin" />
            ) : (
              <Package className="size-[18px]" />
            )}
            Move to Collection
          </Button>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={onRemove}
          disabled={isProcessing}
          className="text-xs font-bold text-red-400 hover:text-red-300 hover:bg-transparent px-3 py-1.5 h-auto"
        >
          {isProcessing ? (
            <Loader2 className="size-[18px] animate-spin" />
          ) : (
            <Trash2 className="size-[18px]" />
          )}
          Remove
        </Button>
      </div>
    </div>
  );
}
