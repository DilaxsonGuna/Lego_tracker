import { Puzzle } from "lucide-react";
import { cn } from "@/lib/utils";

interface LegoFlexLogoProps {
  className?: string;
}

export function LegoFlexLogo({ className }: LegoFlexLogoProps) {
  return (
    <div
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground",
        className
      )}
    >
      <Puzzle className="size-5" />
    </div>
  );
}
