interface StudPatternBgProps {
  className?: string;
}

export function StudPatternBg({ className }: StudPatternBgProps) {
  return (
    <>
      <div
        className={`absolute inset-0 -z-20 ${className ?? ""}`}
        style={{
          backgroundImage:
            "radial-gradient(hsl(var(--surface-accent)) 15%, transparent 15%)",
          backgroundSize: "24px 24px",
        }}
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-background/95 to-background pointer-events-none" />
    </>
  );
}
