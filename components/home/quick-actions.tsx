"use client";

import Link from "next/link";
import { Compass, Package } from "lucide-react";
import { Button } from "@/components/ui/button";

export function QuickActions() {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <Button asChild className="flex-1">
        <Link href="/explore">
          <Compass className="size-4 mr-2" />
          Browse Sets
        </Link>
      </Button>
      <Button asChild variant="outline" className="flex-1">
        <Link href="/vault">
          <Package className="size-4 mr-2" />
          View Vault
        </Link>
      </Button>
    </div>
  );
}
