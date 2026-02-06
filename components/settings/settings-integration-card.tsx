"use client";

import { Puzzle, Link as LinkIcon } from "lucide-react";

export function SettingsIntegrationCard() {
  return (
    <button className="w-full group relative overflow-hidden rounded-xl border border-primary bg-transparent p-5 text-left transition-all hover:bg-primary/5 hover:shadow-[0_0_20px_rgba(255,208,0,0.1)]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20">
            <Puzzle className="size-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
              Link Rebrickable Account
            </span>
            <span className="text-sm text-muted-foreground">
              Sync your sets and MOCs automatically
            </span>
          </div>
        </div>
        <LinkIcon className="size-6 text-primary/50 group-hover:text-primary transition-colors" />
      </div>
    </button>
  );
}
