import { LegoFlexLogo } from "@/components/shared/legoflex-logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-svh stud-bg">
      {/* Brand header */}
      <div className="flex flex-col items-center pt-10 pb-2 gap-3">
        <LegoFlexLogo className="h-12 w-12 rounded-xl [&_svg]:size-7" />
        <span className="text-lg font-bold tracking-tight text-foreground">
          LegoFlex
        </span>
        <p className="text-sm text-muted-foreground">
          Track, collect, and share your Lego journey.
        </p>
      </div>
      {children}
    </div>
  );
}
