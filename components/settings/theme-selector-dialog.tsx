"use client";

import { useState } from "react";
import { Sun, Moon, Monitor, Check } from "lucide-react";
import { useTheme } from "next-themes";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface ThemeSelectorDialogProps {
  isLast?: boolean;
}

const themes = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
] as const;

export function ThemeSelectorDialog({ isLast = false }: ThemeSelectorDialogProps) {
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const currentThemeLabel = themes.find((t) => t.value === theme)?.label || "System";

  const handleSelect = (value: string) => {
    setTheme(value);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className={cn(
            "flex items-center justify-between gap-4 p-4 sm:px-6 hover:bg-surface-accent transition-colors group/item w-full text-left",
            !isLast && "border-b border-border/50"
          )}
        >
          <div className="flex items-center gap-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-surface-accent text-muted-foreground group-hover/item:text-primary transition-colors">
              <Sun className="size-5" />
            </div>
            <div>
              <p className="font-medium text-foreground">Theme</p>
              <p className="text-sm text-muted-foreground">{currentThemeLabel}</p>
            </div>
          </div>
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Theme</DialogTitle>
          <DialogDescription>
            Choose your preferred appearance
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-2 py-4">
          {themes.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => handleSelect(value)}
              className={cn(
                "flex items-center justify-between p-4 rounded-lg border transition-colors",
                theme === value
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/50"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon className="size-5" />
                <span className="font-medium">{label}</span>
              </div>
              {theme === value && <Check className="size-5 text-primary" />}
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
