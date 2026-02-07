"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export function SettingsSignOut() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    setIsLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  return (
    <div>
      <Button
        variant="outline"
        className="w-full gap-2 py-6 text-muted-foreground hover:text-foreground"
        onClick={handleSignOut}
        disabled={isLoading}
      >
        <LogOut className="size-5" />
        {isLoading ? "Signing out..." : "Sign Out"}
      </Button>
    </div>
  );
}
