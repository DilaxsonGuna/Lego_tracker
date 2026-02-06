import { Badge } from "@/components/ui/badge";
import type { UserProfile } from "@/types/profile";

interface ProfileBioProps {
  user: UserProfile;
}

export function ProfileBio({ user }: ProfileBioProps) {
  return (
    <div>
      <h3 className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground mb-4">
        Identity Bio
      </h3>
      <p className="text-lg text-muted-foreground leading-relaxed font-light">
        {user.bio}
      </p>
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
    </div>
  );
}
