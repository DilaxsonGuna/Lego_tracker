"use client";

import { Package, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
  selectedSetNums: _selectedSetNums,
  activeTab,
  onRemove,
  onMoveToCollection,
  isProcessing,
}: VaultBulkActionsProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-50 md:ml-32">
      <div className="flex items-center gap-2 bg-black/80 backdrop-blur-xl border border-white/10 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full shadow-2xl">
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
            className="text-xs font-bold text-muted-foreground hover:text-primary hover:bg-primary/10 px-3 py-1.5 h-auto"
          >
            {isProcessing ? (
              <Loader2 className="size-[18px] animate-spin" />
            ) : (
              <Package className="size-[18px]" />
            )}
            Move to Collection
          </Button>
        )}

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              disabled={isProcessing}
              className="text-xs font-bold text-destructive hover:text-destructive hover:bg-destructive/10 px-3 py-1.5 h-auto"
            >
              {isProcessing ? (
                <Loader2 className="size-[18px] animate-spin" />
              ) : (
                <Trash2 className="size-[18px]" />
              )}
              Remove
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Remove {selectedCount} set{selectedCount !== 1 ? "s" : ""}?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This will remove the selected sets from your vault. This action
                cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction variant="destructive" onClick={onRemove}>
                Remove
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
