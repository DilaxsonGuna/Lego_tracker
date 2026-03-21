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
      {/* 2x2 Lego brick top-view: 4 studs */}
      <svg viewBox="0 0 24 24" fill="currentColor" className="size-5" aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="3" opacity="0.3" />
        <circle cx="8.5" cy="8.5" r="3" />
        <circle cx="15.5" cy="8.5" r="3" />
        <circle cx="8.5" cy="15.5" r="3" />
        <circle cx="15.5" cy="15.5" r="3" />
      </svg>
    </div>
  );
}
