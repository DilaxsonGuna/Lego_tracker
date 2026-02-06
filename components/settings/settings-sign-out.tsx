"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SettingsSignOut() {
  return (
    <div>
      <Button
        variant="outline"
        className="w-full gap-2 py-6 text-muted-foreground hover:text-foreground"
      >
        <LogOut className="size-5" />
        Sign Out
      </Button>
    </div>
  );
}
