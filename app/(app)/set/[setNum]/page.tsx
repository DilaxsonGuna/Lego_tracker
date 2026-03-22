import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  getSetDetail,
  getSetOwnerCount,
  getRelatedSets,
  getUserSetStatus,
} from "@/lib/queries/set-detail";
import { getFollowersWhoOwnSet } from "@/lib/queries/social";
import {
  SetDetailHero,
  SetDetailStats,
  SetDetailActions,
  RelatedSets,
} from "@/components/set-detail";
import { SocialProofBadge } from "@/components/social";

interface SetDetailPageProps {
  params: Promise<{ setNum: string }>;
}

async function SetDetailContent({ paramsPromise }: { paramsPromise: Promise<{ setNum: string }> }) {
  const { setNum } = await paramsPromise;
  const set = await getSetDetail(setNum);

  if (!set) {
    notFound();
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [ownerCount, relatedSets, userStatus, priceData, socialProof] = await Promise.all([
    getSetOwnerCount(setNum),
    getRelatedSets(set.themeId, setNum, 6),
    user
      ? getUserSetStatus(user.id, setNum)
      : Promise.resolve({
          inCollection: false,
          inWishlist: false,
          isFavorite: false,
        }),
    supabase
      .from("set_prices")
      .select("retail_price")
      .eq("set_num", setNum)
      .eq("currency", "EUR")
      .eq("source", "brickset")
      .maybeSingle(),
    user ? getFollowersWhoOwnSet(user.id, setNum) : Promise.resolve({ users: [], totalCount: 0 }),
  ]);

  return (
    <main className="flex-1 overflow-y-auto">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 py-8 space-y-8">
        {/* Back link */}
        <Link
          href="/explore"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-4" />
          Back to Explore
        </Link>

        {/* Hero: image + title */}
        <SetDetailHero set={set} />

        {/* Stats row */}
        <SetDetailStats
          numParts={set.numParts}
          ownerCount={ownerCount}
          themeName={set.themeName}
          retailPrice={priceData.data?.retail_price ?? null}
        />

        {/* Social proof */}
        {socialProof.totalCount > 0 && (
          <SocialProofBadge users={socialProof.users} totalCount={socialProof.totalCount} />
        )}

        {/* Action buttons */}
        <SetDetailActions setNum={set.setNum} initialStatus={userStatus} isAuthenticated={!!user} />

        {/* Related sets */}
        <RelatedSets sets={relatedSets} themeName={set.themeName} />
      </div>
    </main>
  );
}

export default function SetDetailPage({ params }: SetDetailPageProps) {
  return (
    <Suspense
      fallback={
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="size-6 text-muted-foreground animate-spin" />
        </main>
      }
    >
      <SetDetailContent paramsPromise={params} />
    </Suspense>
  );
}
