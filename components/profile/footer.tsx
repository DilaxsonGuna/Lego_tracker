import { LegoFlexLogo } from "@/components/shared";

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  return (
    <footer
      className={`border-t border-border bg-background py-8 mt-auto ${className ?? ""}`}
    >
      <div className="mx-auto flex max-w-[1000px] items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <LegoFlexLogo className="h-6 w-6 rounded text-xs" />
          <span className="text-sm text-muted-foreground">
            &copy; 2024 LegoFlex Inc.
          </span>
        </div>
        <div className="flex gap-6">
          <a
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            href="#"
          >
            Privacy
          </a>
          <a
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            href="#"
          >
            Terms
          </a>
          <a
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            href="#"
          >
            Help
          </a>
        </div>
      </div>
    </footer>
  );
}
