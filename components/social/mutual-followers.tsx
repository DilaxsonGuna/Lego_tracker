import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface MutualFollowersProps {
  users: Array<{ id: string; username: string; avatarUrl: string | null }>;
  totalCount: number;
  targetUserId: string;
}

export function MutualFollowers({ users, totalCount, targetUserId }: MutualFollowersProps) {
  if (totalCount === 0) return null;

  const displayUsers = users.slice(0, 3);
  const remaining = totalCount - displayUsers.length;

  return (
    <Link
      href={`/u/${targetUserId}/followers`}
      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
    >
      <div className="flex -space-x-2">
        {displayUsers.map((user) => (
          <Avatar key={user.id} className="size-6 border-2 border-background">
            <AvatarImage src={user.avatarUrl ?? undefined} alt={user.username} />
            <AvatarFallback className="bg-primary/20 text-primary text-[10px] font-bold">
              {user.username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        ))}
      </div>
      <span>
        Followed by{" "}
        <span className="font-medium text-foreground">
          {displayUsers.map((u) => u.username).join(", ")}
        </span>
        {remaining > 0 && (
          <>
            {" "}
            and{" "}
            <span className="font-medium text-foreground">
              {remaining} other{remaining > 1 ? "s" : ""}
            </span>
          </>
        )}{" "}
        you follow
      </span>
    </Link>
  );
}
