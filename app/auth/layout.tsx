import { BrickMasterLogo } from "@/components/shared/brickmaster-logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-svh stud-bg bg-gradient-to-b from-background via-background/95 to-background">
      {/* Brand header */}
      <div className="flex flex-col items-center pt-12 pb-4 gap-4">
        <div className="relative">
          {/* Pulsing glow behind logo */}
          <div className="absolute -inset-3 rounded-2xl bg-primary/30 blur-xl motion-safe:animate-pulse" />
          <BrickMasterLogo className="relative h-14 w-14 rounded-xl shadow-lg shadow-primary/20 [&_svg]:size-8" />
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-xl font-black tracking-tight text-foreground uppercase">
            BrickMaster
          </span>
          <p className="text-sm text-muted-foreground font-medium">
            Track, collect, and share your LEGO journey.
          </p>
        </div>
      </div>
      {children}
    </div>
  );
}
