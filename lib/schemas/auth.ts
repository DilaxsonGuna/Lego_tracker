import { z } from "zod";

export const usernameSchema = z
  .string()
  .trim()
  .min(3, "Username must be 3-20 characters")
  .max(20, "Username must be 3-20 characters")
  .regex(
    /^[a-zA-Z0-9_]+$/,
    "Username can only contain letters, numbers, and underscores"
  )
  .transform((val) => val.toLowerCase());

export const createProfileSchema = z.object({
  username: usernameSchema,
  fullName: z.string().trim().max(100).optional(),
  avatarUrl: z.string().url().optional().or(z.literal("")),
  bio: z.string().trim().max(500).optional(),
  location: z.string().trim().max(100).optional(),
  dateOfBirth: z.string().optional(),
  themeIds: z.array(z.number().int().positive()).max(10).optional(),
});

export const checkUsernameSchema = z.object({
  username: z.string().trim().min(1),
});
