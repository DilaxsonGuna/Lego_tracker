import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import {
  fetchVaultSets,
  fetchCollectionStats,
  fetchWishlistStats,
  fetchVaultThemes,
  fetchCollectionCount,
  fetchWishlistCount,
  fetchDefaultGridView,
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
    defaultGridView,
  ] = await Promise.all([
    fetchCollectionStats(),
    fetchWishlistStats(),
    fetchVaultThemes(),
    fetchCollectionCount(),
    fetchWishlistCount(),
    fetchVaultSets({ collectionType: "collection" }),
    fetchVaultSets({ collectionType: "wishlist" }),
    fetchDefaultGridView(),
  ]);

  return (
    <VaultPageClient
      initialSets={[...collectionSets, ...wishlistSets]}
      collectionStats={collectionStats ?? { totalPieces: "0", setsOwned: 0 }}
      wishlistStats={wishlistStats ?? { targetPieces: "0", savedSets: 0 }}
      themes={themes}
      collectionCount={collectionCount}
      wishlistCount={wishlistCount}
      defaultGridView={defaultGridView}
    />
  );
}

export default function VaultPage() {
  return (
    <Suspense
      fallback={
        <main className="flex-1 flex items-center justify-center">
          <div role="status" aria-label="Loading vault">
            <Loader2 className="size-6 text-muted-foreground animate-spin" aria-hidden="true" />
          </div>
        </main>
      }
    >
      <VaultContent />
    </Suspense>
  );
}
