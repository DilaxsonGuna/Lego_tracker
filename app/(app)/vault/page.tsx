import { Suspense } from "react";
import { redirect } from "next/navigation";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import {
  getVaultSets,
  getCollectionStats,
  getWishlistStats,
  getVaultThemes,
  getCollectionCount,
  getWishlistCount,
} from "@/lib/queries/vault";
import { VaultPageClient } from "./vault-client";

async function VaultContent() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  // Single auth call, then all queries in parallel with userId
  const [
    collectionStats,
    wishlistStats,
    themes,
    collectionCount,
    wishlistCount,
    collectionSets,
    wishlistSets,
    profileData,
  ] = await Promise.all([
    getCollectionStats(user.id),
    getWishlistStats(user.id),
    getVaultThemes(user.id),
    getCollectionCount(user.id),
    getWishlistCount(user.id),
    getVaultSets({ userId: user.id, collectionType: "collection" }),
    getVaultSets({ userId: user.id, collectionType: "wishlist" }),
    supabase.from("profiles").select("default_grid_view").eq("id", user.id).single(),
  ]);

  const defaultGridView = profileData.data?.default_grid_view ?? true;

  return (
    <VaultPageClient
      initialSets={[...collectionSets, ...wishlistSets]}
      collectionStats={collectionStats ?? { totalPieces: "0", setsOwned: 0, totalValue: null }}
      wishlistStats={wishlistStats ?? { targetPieces: "0", savedSets: 0, totalValue: null }}
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
