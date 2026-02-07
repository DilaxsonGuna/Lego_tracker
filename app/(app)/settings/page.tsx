import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getSettings } from "./actions";
import { SettingsClient } from "./settings-client";

function SettingsLoading() {
  return (
    <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-8 md:px-6 lg:py-12">
      <div className="mb-10">
        <div className="h-10 w-32 bg-muted animate-pulse rounded mb-2" />
        <div className="h-5 w-64 bg-muted animate-pulse rounded" />
      </div>
      <div className="space-y-10">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 w-20 bg-muted animate-pulse rounded" />
            <div className="h-20 bg-muted animate-pulse rounded-lg" />
          </div>
        ))}
      </div>
    </main>
  );
}

async function SettingsContent() {
  const settings = await getSettings();

  if (!settings) {
    redirect("/auth/login");
  }

  return <SettingsClient initialSettings={settings} />;
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<SettingsLoading />}>
      <SettingsContent />
    </Suspense>
  );
}
