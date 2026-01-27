"use client";

import { Plus } from "lucide-react";
import type { Story } from "@/types/feed";

interface StoriesCarouselProps {
  stories: Story[];
}

export function StoriesCarousel({ stories }: StoriesCarouselProps) {
  return (
    <section className="w-full overflow-hidden">
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
        {stories.map((story) =>
          story.isAddStory ? (
            <div
              key={story.id}
              className="flex flex-col items-center gap-2 min-w-[72px] cursor-pointer group"
            >
              <div className="size-[72px] rounded-full border-2 border-dashed border-border flex items-center justify-center bg-card group-hover:border-primary transition-colors">
                <Plus className="size-5 text-primary" />
              </div>
              <span className="text-xs font-medium text-muted-foreground">
                {story.username}
              </span>
            </div>
          ) : (
            <div
              key={story.id}
              className="flex flex-col items-center gap-2 min-w-[72px] cursor-pointer"
            >
              <div
                className={`size-[72px] p-[2px] rounded-full ${
                  story.hasUnviewed
                    ? "bg-gradient-to-tr from-primary to-amber-200"
                    : "border-2 border-border"
                }`}
              >
                <div
                  className="size-full rounded-full border-2 border-background bg-cover bg-center"
                  style={{ backgroundImage: `url("${story.avatarUrl}")` }}
                />
              </div>
              <span
                className={`text-xs font-medium ${
                  story.hasUnviewed
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {story.username}
              </span>
            </div>
          )
        )}
      </div>
    </section>
  );
}
