import { Suspense } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import {
  getThemeDistribution,
  getYearDistribution,
  getCollectionGrowth,
  getNotableSets,
  getCollectionKPIs,
} from "@/lib/queries/analytics";
import {
  AnalyticsKPIs,
  ThemeDistributionChart,
  YearDistributionChart,
  CollectionGrowthChart,
  NotableSetsRow,
} from "@/components/analytics";

async function AnalyticsContent() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const [kpis, themes, years, growth, notables] = await Promise.all([
    getCollectionKPIs(user.id),
    getThemeDistribution(user.id),
    getYearDistribution(user.id),
    getCollectionGrowth(user.id),
    getNotableSets(user.id),
  ]);

  return (
    <div className="space-y-8">
      {/* KPI Summary */}
      <AnalyticsKPIs kpis={kpis} />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ThemeDistributionChart data={themes} />
        <YearDistributionChart data={years} />
      </div>

      {/* Growth Chart (full width) */}
      <CollectionGrowthChart data={growth} />

      {/* Notable Sets */}
      <NotableSetsRow sets={notables} />
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <main className="flex-1 overflow-y-auto">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 md:px-8 py-8 space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/vault">
            <Button variant="ghost" size="icon" className="size-9">
              <ArrowLeft className="size-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-black tracking-tight text-foreground">
            Collection Analytics
          </h1>
        </div>

        <Suspense
          fallback={
            <div className="flex items-center justify-center py-24">
              <Loader2 className="size-6 text-muted-foreground animate-spin" />
            </div>
          }
        >
          <AnalyticsContent />
        </Suspense>
      </div>
    </main>
  );
}
