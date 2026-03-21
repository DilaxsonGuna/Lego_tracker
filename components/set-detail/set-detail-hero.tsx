import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import type { SetDetail } from "@/types/set-detail";

interface SetDetailHeroProps {
  set: SetDetail;
}

export function SetDetailHero({ set }: SetDetailHeroProps) {
  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Image */}
      <div className="relative w-full lg:w-1/2 aspect-square bg-muted rounded-xl overflow-hidden flex items-center justify-center p-8">
        {set.imgUrl ? (
          <Image
            src={set.imgUrl}
            alt={`${set.name} LEGO set ${set.setNum}`}
            fill
            className="object-contain p-2"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        ) : (
          <div className="size-full flex items-center justify-center text-muted-foreground text-sm">
            No image available
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 flex flex-col justify-center gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant="outline"
            className="bg-primary/10 text-primary border-primary/20 font-mono text-xs"
          >
            #{set.setNum}
          </Badge>
          {set.year && (
            <Badge
              variant="outline"
              className="bg-muted text-muted-foreground border-border text-xs"
            >
              {set.year}
            </Badge>
          )}
          <Badge className="bg-primary/90 text-primary-foreground text-xs uppercase tracking-wide border-transparent">
            {set.themeName}
          </Badge>
        </div>

        <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-foreground tracking-tight">
          {set.name}
        </h1>
      </div>
    </div>
  );
}
