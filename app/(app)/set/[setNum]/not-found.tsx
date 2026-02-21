import Link from "next/link";
import { PackageX } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SetNotFound() {
  return (
    <main className="flex-1 flex items-center justify-center p-6">
      <div className="text-center space-y-4">
        <PackageX className="size-12 text-muted-foreground mx-auto" />
        <h1 className="text-2xl font-bold text-foreground">Set Not Found</h1>
        <p className="text-muted-foreground max-w-sm mx-auto">
          This set does not exist in our database.
        </p>
        <Button asChild>
          <Link href="/explore">Browse All Sets</Link>
        </Button>
      </div>
    </main>
  );
}
