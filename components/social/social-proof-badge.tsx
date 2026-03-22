import { Users } from "lucide-react";

interface SocialProofBadgeProps {
  users: Array<{ username: string }>;
  totalCount: number;
}

export function SocialProofBadge({ users, totalCount }: SocialProofBadgeProps) {
  if (totalCount === 0) return null;

  const displayNames = users.slice(0, 2).map((u) => u.username);
  const remaining = totalCount - displayNames.length;

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Users className="size-4 text-primary shrink-0" />
      <span>
        <span className="font-medium text-foreground">{displayNames.join(", ")}</span>
        {remaining > 0 && (
          <>
            {" "}
            and{" "}
            <span className="font-medium text-foreground">
              {remaining} other{remaining > 1 ? "s" : ""}
            </span>
          </>
        )}{" "}
        you follow own this set
      </span>
    </div>
  );
}
