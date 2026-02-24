import { z } from "zod";
import { usernameSchema } from "./auth";

export const updateProfileSchema = z.object({
  username: usernameSchema.optional(),
  fullName: z.string().trim().max(100).optional(),
  avatarUrl: z.string().url().optional().or(z.literal("")),
  bio: z.string().trim().max(500).optional(),
  location: z.string().trim().max(100).optional(),
  themeIds: z.array(z.number().int().positive()).max(10).optional(),
});

export const updateProfileSettingSchema = z.object({
  profile_visible: z.boolean().optional(),
  default_grid_view: z.boolean().optional(),
  email_notifications: z.boolean().optional(),
});

export const userIdSchema = z.object({
  userId: z.string().uuid(),
});

export const publicVaultSetsSchema = z.object({
  userId: z.string().uuid(),
  collectionType: z.enum(["collection", "wishlist"]),
});
