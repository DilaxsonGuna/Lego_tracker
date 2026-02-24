"use client";

interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
}

export function SettingsSection({ title, children }: SettingsSectionProps) {
  return (
    <div className="group/section">
      <h2 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4 ml-2">
        {title}
      </h2>
      <div className="overflow-hidden rounded-xl border border-border bg-card/50 backdrop-blur-sm">
        {children}
      </div>
    </div>
  );
}
