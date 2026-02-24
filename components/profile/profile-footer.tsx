import { QrCode } from "lucide-react";

export function ProfileFooter() {
  return (
    <footer className="mt-20 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6">
      <div className="flex items-center gap-2 text-muted-foreground">
        <QrCode className="size-4" />
        <span className="text-xs font-black uppercase tracking-wider">
          Digital Identity UUID: 75192-LF-2024
        </span>
      </div>
      <div className="flex gap-8">
        <a
          className="text-xs font-bold text-muted-foreground hover:text-foreground uppercase tracking-widest transition-colors"
          href="#"
        >
          Vault Guide
        </a>
        <a
          className="text-xs font-bold text-muted-foreground hover:text-foreground uppercase tracking-widest transition-colors"
          href="#"
        >
          Privacy Protocol
        </a>
        <a
          className="text-xs font-bold text-muted-foreground hover:text-foreground uppercase tracking-widest transition-colors"
          href="#"
        >
          Support
        </a>
      </div>
    </footer>
  );
}
