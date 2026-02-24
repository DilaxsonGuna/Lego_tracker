"use client";

import { useState, useTransition } from "react";
import { LayoutGrid, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { updateProfileSetting } from "@/app/(app)/settings/actions";
import { toast } from "sonner";

interface DefaultViewDialogProps {
  defaultGridView: boolean;
  isLast?: boolean;
}

export function DefaultViewDialog({
  defaultGridView,
  isLast = false,
}: DefaultViewDialogProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(defaultGridView);
  const [isPending, startTransition] = useTransition();

  const handleSelect = (value: boolean) => {
    setSelected(value);
    startTransition(async () => {
      const result = await updateProfileSetting({ default_grid_view: value });
      if (result.error) {
        toast.error(result.error);
        setSelected(defaultGridView);
      } else {
        toast.success("Default view updated");
        setOpen(false);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className={cn(
            "flex items-center justify-between gap-4 p-4 sm:px-6 hover:bg-surface-accent transition-colors group/item w-full text-left",
            !isLast && "border-b border-border"
          )}
        >
          <div className="flex items-center gap-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-surface-accent text-muted-foreground group-hover/item:text-primary transition-colors">
              <LayoutGrid className="size-5" />
            </div>
            <div>
              <p className="font-medium text-foreground">Default View</p>
              <p className="text-sm text-muted-foreground">
                {selected ? "Grid view" : "List view"}
              </p>
            </div>
          </div>
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Default View</DialogTitle>
          <DialogDescription>
            Choose the default view for your vault
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-2 py-4">
          <button
            onClick={() => handleSelect(true)}
            disabled={isPending}
            className={cn(
              "flex items-center justify-between p-4 rounded-lg border transition-colors",
              selected
                ? "border-primary bg-primary/10"
                : "border-border hover:border-primary/50"
            )}
          >
            <div className="flex items-center gap-3">
              <LayoutGrid className="size-5" />
              <span className="font-medium">Grid View</span>
            </div>
            {selected && <Check className="size-5 text-primary" />}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
