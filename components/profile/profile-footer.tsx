export function ProfileFooter() {
  return (
    <footer className="mt-20 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6">
      <span className="text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} BrickBox
      </span>
      <div className="flex flex-wrap gap-4 sm:gap-8">
        <a
          className="text-xs font-bold text-muted-foreground hover:text-foreground uppercase tracking-widest transition-colors"
          href="#"
        >
          Guide
        </a>
        <a
          className="text-xs font-bold text-muted-foreground hover:text-foreground uppercase tracking-widest transition-colors"
          href="#"
        >
          Privacy
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
