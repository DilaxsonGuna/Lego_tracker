import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "./sidebar";
import { mockNavItems } from "@/lib/mockdata";

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

export async function SidebarWrapper() {
  const user = await getUser();
  return <Sidebar navItems={mockNavItems} user={user} />;
}
