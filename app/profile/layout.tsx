import { Sidebar, MobileHeader } from "@/components/shared";
import { mockUser, mockNavItems } from "@/lib/mockdata";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen w-full font-display">
      <Sidebar navItems={mockNavItems} user={mockUser} />
      <div className="flex flex-1 flex-col">
        <MobileHeader />
        {children}
      </div>
    </div>
  );
}
