import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { EditProfileForm } from "@/components/settings/edit-profile-form";
import { getUserThemeIds, getPopularThemes } from "@/lib/queries/user-themes";
import { getParentThemes } from "@/lib/queries/explore";

async function getProfileData() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const [profileResult, userThemeIds, availableThemes, popularThemes] = await Promise.all([
    supabase
      .from("profiles")
      .select("username, bio, avatar_url, location")
      .eq("id", user.id)
      .single(),
    getUserThemeIds(user.id),
    getParentThemes(),
    getPopularThemes(10),
  ]);

  const profile = profileResult.data;

  return {
    username: profile?.username ?? "",
    bio: profile?.bio ?? "",
    avatarColor: profile?.avatar_url ?? "blue",
    location: profile?.location ?? "",
    selectedThemeIds: userThemeIds,
    availableThemes,
    popularThemes,
  };
}

function EditProfileSkeleton() {
  return (
    <div className="flex-1 w-full max-w-2xl mx-auto px-4 py-8 md:px-6 lg:py-12">
      <div className="animate-pulse">
        <div className="h-6 w-32 bg-muted rounded mb-8" />
        <div className="h-10 w-48 bg-muted rounded mb-2" />
        <div className="h-6 w-64 bg-muted rounded mb-10" />
        <div className="flex justify-center mb-10">
          <div className="size-32 rounded-full bg-muted" />
        </div>
        <div className="space-y-8">
          <div className="h-12 bg-muted rounded-xl" />
          <div className="h-12 bg-muted rounded-xl" />
          <div className="h-32 bg-muted rounded-xl" />
        </div>
      </div>
    </div>
  );
}

async function EditProfileContent() {
  const profileData = await getProfileData();

  return <EditProfileForm initialData={profileData} />;
}

export default function EditProfilePage() {
  return (
    <main className="flex-1">
      <Suspense fallback={<EditProfileSkeleton />}>
        <EditProfileContent />
      </Suspense>
    </main>
  );
}
