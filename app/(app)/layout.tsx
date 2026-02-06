import { Suspense } from "react";
import { MobileHeader } from "@/components/shared";
import { SidebarWrapper } from "@/components/shared/sidebar-wrapper";

function SidebarSkeleton() {
  return (
    <aside className="sticky top-0 z-50 hidden h-screen w-64 flex-col border-r border-border bg-card/95 px-6 py-6 md:flex">
      <div className="mb-10 flex items-center gap-3 px-2">
        <div className="size-8 rounded-lg bg-muted animate-pulse" />
        <div className="h-5 w-20 bg-muted rounded animate-pulse" />
      </div>
      <nav className="flex flex-1 flex-col gap-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-12 bg-muted/50 rounded-xl animate-pulse" />
        ))}
      </nav>
    </aside>
  );
}

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen w-full font-display">
      <Suspense fallback={<SidebarSkeleton />}>
        <SidebarWrapper />
      </Suspense>
      <div className="flex flex-1 flex-col">
        <MobileHeader />
        {children}
      </div>
    </div>
  );
}
