import { Award } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { UserProfile } from "@/types/profile";

interface ProfileHeroProps {
  user: UserProfile;
}

export function ProfileHero({ user }: ProfileHeroProps) {
  return (
    <section className="flex flex-col items-center gap-6 text-center px-6 py-12">
      <div className="relative group cursor-pointer">
        <div className="absolute -inset-1 rounded-full bg-primary/20 blur-md transition-all duration-500 group-hover:bg-primary/40" />
        <Avatar className="relative size-36 border-4 border-card">
          <AvatarImage
            src={user.avatarUrl}
            alt={user.username}
            className="transition-transform duration-700 group-hover:scale-110"
          />
          <AvatarFallback className="text-4xl">
            {user.username.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        {user.isOnline && (
          <div className="absolute bottom-2 right-2 size-6 rounded-full border-4 border-background bg-green-500" />
        )}
      </div>

      <div className="flex flex-col items-center gap-2">
        <h1 className="text-4xl font-black tracking-tight text-foreground">
          @{user.username}
        </h1>
        <Badge
          variant="outline"
          className="gap-2 rounded-full border-border bg-card/80 px-4 py-1.5 backdrop-blur-sm"
        >
          <Award className="size-4 text-primary" />
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            {user.role}
          </span>
        </Badge>
        <p className="mt-2 max-w-md text-base font-normal text-muted-foreground">
          {user.bio}
        </p>
      </div>
    </section>
  );
}
