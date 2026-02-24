import { z } from "zod";

export const toggleFollowSchema = z.object({
  userId: z.string().uuid(),
  isCurrentlyFollowing: z.boolean(),
});

export const fetchSuggestedUsersSchema = z.object({
  limit: z.number().int().min(1).max(50).default(5),
});

export const fetchLeaderboardSchema = z.object({
  offset: z.number().int().min(0).default(0),
  limit: z.number().int().min(1).max(100).default(50),
});
