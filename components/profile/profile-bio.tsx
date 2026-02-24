import { Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import type { UserProfile } from "@/types/profile";

interface ProfileBioProps {
  user: UserProfile;
}

export function ProfileBio({ user }: ProfileBioProps) {
  const hasBio = user.bio && user.bio.trim().length > 0;

  return (
    <div>
      <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground mb-4">
        Identity Bio
      </h3>
      {hasBio ? (
        <p className="text-lg text-muted-foreground leading-relaxed font-light">
          {user.bio}
        </p>
      ) : (
        <EmptyState
          icon={Pencil}
          title="No bio yet"
          description="Tell the community about yourself and your building style."
          className="py-8"
        />
      )}
      {user.interests.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-6">
          {user.interests.map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="px-4 py-1.5 rounded-full bg-card border-border text-xs font-bold text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors cursor-pointer"
            >
              #{tag}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
