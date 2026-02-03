import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import {
  fetchVaultSets,
  fetchCollectionStats,
  fetchWishlistStats,
  fetchVaultThemes,
  fetchCollectionCount,
  fetchWishlistCount,
} from "./actions";
import { VaultPageClient } from "./vault-client";

async function VaultContent() {
  const [
    collectionStats,
    wishlistStats,
    themes,
    collectionCount,
    wishlistCount,
    collectionSets,
    wishlistSets,
  ] = await Promise.all([
    fetchCollectionStats(),
    fetchWishlistStats(),
    fetchVaultThemes(),
    fetchCollectionCount(),
    fetchWishlistCount(),
    fetchVaultSets({ collectionType: "collection" }),
    fetchVaultSets({ collectionType: "wishlist" }),
  ]);

  return (
    <VaultPageClient
      initialSets={[...collectionSets, ...wishlistSets]}
      collectionStats={collectionStats ?? { totalValue: "$0", totalPieces: "0", setsOwned: 0 }}
      wishlistStats={wishlistStats ?? { estimatedCost: "$0", targetBricks: "0", savedSets: 0 }}
      themes={themes}
      collectionCount={collectionCount}
      wishlistCount={wishlistCount}
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
