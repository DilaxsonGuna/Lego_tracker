import type { FavoriteSet } from "@/types/profile";

interface FavoritesGridProps {
  favorites: FavoriteSet[];
}

export function FavoritesGrid({ favorites }: FavoritesGridProps) {
  return (
    <section className="mb-16">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground">
          Top {favorites.length} Favorites
        </h3>
        <button className="text-[11px] font-bold text-primary hover:underline">
          Edit Selection
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 shadow-[0_0_40px_-10px_rgba(255,208,0,0.15)]">
        {favorites.map((fav) => (
          <div
            key={fav.setNum}
            className="group relative aspect-[3/4] overflow-hidden rounded-lg border border-border/50 transition-all hover:scale-[1.03] hover:border-primary/50 cursor-pointer"
          >
            <div
              className="size-full bg-cover bg-center grayscale-[0.3] group-hover:grayscale-0 transition-all"
              style={{ backgroundImage: `url("${fav.imageUrl}")` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ))}
      </div>
    </section>
  );
}
