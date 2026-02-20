import { createClient } from "@/lib/supabase/server";
import { MobileHeader } from "./mobile-header";
import { NAV_ITEMS } from "@/lib/constants";

async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, avatar_url")
    .eq("id", user.id)
    .single();

  if (!profile) return null;

  return {
    username: profile.username ?? "Anonymous",
    avatarUrl: profile.avatar_url ?? "",
  };
}

export async function MobileHeaderWrapper() {
  const user = await getUser();
  return <MobileHeader navItems={NAV_ITEMS} user={user} />;
}
