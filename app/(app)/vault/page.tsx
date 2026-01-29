import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { fetchVaultSets, fetchVaultStats, fetchVaultThemes } from "./actions";
import { VaultPageClient } from "./vault-client";

async function VaultContent() {
  const [sets, stats, themes] = await Promise.all([
    fetchVaultSets({}),
    fetchVaultStats(),
    fetchVaultThemes(),
  ]);

  return (
    <VaultPageClient
      initialSets={sets}
      stats={stats ?? { totalValue: "$0", totalPieces: "0", uniqueThemes: 0 }}
      themes={themes}
    />
  );
}

export default function VaultPage() {
  return (
    <Suspense
      fallback={
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="size-6 text-muted-foreground animate-spin" />
        </main>
      }
    >
      <VaultContent />
    </Suspense>
  );
}
