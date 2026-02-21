"use client";

import Link from "next/link";
import { Compass, Package } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardWelcomeProps {
  username: string;
}

export function DashboardWelcome({ username }: DashboardWelcomeProps) {
  return (
    <div className="rounded-xl bg-card border border-border p-6 sm:p-8 text-center">
      <h2 className="text-lg font-bold text-foreground mb-2">
        Welcome to LegoFlex, @{username}!
      </h2>
      <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
        Your collection journey starts here. Browse sets to build your vault and track your brick score.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Button asChild className="w-full sm:w-auto">
          <Link href="/explore">
            <Compass className="size-4 mr-2" />
            Browse Sets
          </Link>
        </Button>
        <Button asChild variant="outline" className="w-full sm:w-auto">
          <Link href="/vault">
            <Package className="size-4 mr-2" />
            View Vault
          </Link>
        </Button>
      </div>
    </div>
  );
}
