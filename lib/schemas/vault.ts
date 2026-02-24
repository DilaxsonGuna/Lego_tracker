import { z } from "zod";

const collectionTypeSchema = z.enum(["collection", "wishlist"]);

export const fetchVaultSetsSchema = z.object({
  collectionType: collectionTypeSchema,
  offset: z.number().int().min(0).optional(),
  search: z.string().max(200).optional(),
  theme: z.string().max(100).optional(),
});

export const addSetToVaultSchema = z.object({
  setNum: z.string().min(1).max(50),
  quantity: z.number().int().min(1).max(999).default(1),
  collectionType: collectionTypeSchema.default("collection"),
});

export const setNumSchema = z.object({
  setNum: z.string().min(1).max(50),
});

export const toggleFavoriteSchema = setNumSchema;

export const addSetToCollectionSchema = z.object({
  setNum: z.string().min(1).max(50),
  quantity: z.number().int().min(1).max(999).default(1),
  collectionType: collectionTypeSchema.default("collection"),
});

export const fetchSetsSchema = z.object({
  offset: z.number().int().min(0),
  search: z.string().max(200).optional(),
  themeIds: z.array(z.number().int().positive()).optional(),
  orderBy: z.enum(["newest", "oldest", "most-popular"]).optional(),
});
