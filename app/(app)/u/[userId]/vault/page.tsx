import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Loader2 } from "lucide-react";
import { getUserProfile } from "@/lib/queries/profile";
import { PublicVaultClient } from "./vault-client";
import {
  fetchPublicVaultSets,
  fetchPublicCollectionStats,
  fetchPublicWishlistStats,
  fetchPublicVaultThemes,
  fetchPublicCollectionCount,
  fetchPublicWishlistCount,
} from "./actions";

interface PageProps {
  params: Promise<{ userId: string }>;
}

async function PublicVaultContent({
  paramsPromise,
}: {
  paramsPromise: Promise<{ userId: string }>;
}) {
  const { userId } = await paramsPromise;

  // Check if user exists
  const profile = await getUserProfile(userId);
  if (!profile) {
    notFound();
  }

  // Fetch all vault data in parallel
  const [
    collectionSets,
    wishlistSets,
    collectionStats,
    wishlistStats,
    themes,
    collectionCount,
    wishlistCount,
  ] = await Promise.all([
    fetchPublicVaultSets(userId, "collection"),
    fetchPublicVaultSets(userId, "wishlist"),
    fetchPublicCollectionStats(userId),
    fetchPublicWishlistStats(userId),
    fetchPublicVaultThemes(userId),
    fetchPublicCollectionCount(userId),
    fetchPublicWishlistCount(userId),
  ]);

  // Combine all sets
  const allSets = [...collectionSets, ...wishlistSets];

  // Fallback stats
  const defaultCollectionStats = collectionStats ?? {
    totalValue: "$0",
    totalPieces: "0",
    setsOwned: 0,
  };

  const defaultWishlistStats = wishlistStats ?? {
    estimatedCost: "$0",
    targetBricks: "0",
    savedSets: 0,
  };

  return (
    <PublicVaultClient
      userId={userId}
      username={profile.username}
      initialSets={allSets}
      collectionStats={defaultCollectionStats}
      wishlistStats={defaultWishlistStats}
      themes={themes}
      collectionCount={collectionCount}
      wishlistCount={wishlistCount}
    />
  );
}

function VaultSkeleton() {
  return (
    <main className="flex-1 flex items-center justify-center">
      <Loader2 className="size-6 text-muted-foreground animate-spin" />
    </main>
  );
}

export default async function PublicVaultPage({ params }: PageProps) {
  return (
    <Suspense fallback={<VaultSkeleton />}>
      <PublicVaultContent paramsPromise={params} />
    </Suspense>
  );
}
