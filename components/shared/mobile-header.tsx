"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LegoFlexLogo } from "./legoflex-logo";

interface MobileHeaderProps {
  className?: string;
}

export function MobileHeader({ className }: MobileHeaderProps) {
  return (
    <header
      className={`sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur-md md:hidden ${className ?? ""}`}
    >
      <div className="flex items-center gap-3">
        <LegoFlexLogo />
        <h2 className="text-lg font-bold tracking-tight text-foreground">
          LegoFlex
        </h2>
      </div>
      <Button variant="ghost" size="icon" className="text-foreground">
        <Menu className="size-6" />
      </Button>
    </header>
  );
}
