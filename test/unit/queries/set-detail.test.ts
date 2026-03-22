import { vi } from "vitest";
import { getSetDetail, getSetOwnerCount, getUserSetStatus } from "@/lib/queries/set-detail";
import {
  mockSupabaseQuery,
  mockSupabaseAnon,
  mockSupabaseMultiTable,
} from "@test/helpers/mock-supabase";

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
  createAnonClient: vi.fn(),
}));

import { createClient, createAnonClient } from "@/lib/supabase/server";
const mockCreateClient = vi.mocked(createClient);
const mockCreateAnonClient = vi.mocked(createAnonClient);

describe("getSetDetail", () => {
  it("maps row to SetDetail shape", async () => {
    mockCreateAnonClient.mockReturnValue(
      mockSupabaseAnon({
        data: {
          set_num: "42151-1",
          name: "Bugatti",
          year: 2023,
          num_parts: 3696,
          img_url: "/bugatti.jpg",
          theme_id: 1,
          themes: { name: "Technic" },
        },
      }) as any
    );

    const result = await getSetDetail("42151-1");
    expect(result).toEqual({
      setNum: "42151-1",
      name: "Bugatti",
      year: 2023,
      numParts: 3696,
      imgUrl: "/bugatti.jpg",
      themeId: 1,
      themeName: "Technic",
    });
  });

  it("defaults null fields", async () => {
    mockCreateAnonClient.mockReturnValue(
      mockSupabaseAnon({
        data: {
          set_num: "1-1",
          name: "Test",
          year: 2020,
          num_parts: null,
          img_url: null,
          theme_id: 1,
          themes: null,
        },
      }) as any
    );
    const result = await getSetDetail("1-1");
    expect(result?.numParts).toBe(0);
    expect(result?.imgUrl).toBe("");
    expect(result?.themeName).toBe("Unknown");
  });

  it("returns null when not found", async () => {
    mockCreateAnonClient.mockReturnValue(
      mockSupabaseAnon({ data: null, error: { message: "not found" } }) as any
    );
    expect(await getSetDetail("nonexistent")).toBeNull();
  });
});

describe("getSetOwnerCount", () => {
  it("returns the count", async () => {
    mockCreateAnonClient.mockReturnValue(mockSupabaseAnon({ count: 42 }) as any);
    expect(await getSetOwnerCount("42151-1")).toBe(42);
  });

  it("returns 0 on error", async () => {
    mockCreateAnonClient.mockReturnValue(
      mockSupabaseAnon({ count: null, error: { message: "fail" } }) as any
    );
    expect(await getSetOwnerCount("42151-1")).toBe(0);
  });
});

describe("getUserSetStatus", () => {
  it("returns inCollection=true for collection type", async () => {
    mockCreateClient.mockResolvedValue(
      mockSupabaseMultiTable({
        user_sets: { data: { collection_type: "collection" } },
        user_favorites: { data: null },
      }) as any
    );
    const result = await getUserSetStatus("user-1", "42151-1");
    expect(result.inCollection).toBe(true);
    expect(result.inWishlist).toBe(false);
  });

  it("returns inWishlist=true for wishlist type", async () => {
    mockCreateClient.mockResolvedValue(
      mockSupabaseMultiTable({
        user_sets: { data: { collection_type: "wishlist" } },
        user_favorites: { data: null },
      }) as any
    );
    const result = await getUserSetStatus("user-1", "42151-1");
    expect(result.inWishlist).toBe(true);
  });

  it("returns isFavorite=true when favorite exists", async () => {
    mockCreateClient.mockResolvedValue(
      mockSupabaseMultiTable({
        user_sets: { data: { collection_type: "collection" } },
        user_favorites: { data: { id: "fav-1" } },
      }) as any
    );
    const result = await getUserSetStatus("user-1", "42151-1");
    expect(result.isFavorite).toBe(true);
  });

  it("returns all false when not in vault", async () => {
    mockCreateClient.mockResolvedValue(
      mockSupabaseMultiTable({
        user_sets: { data: null },
        user_favorites: { data: null },
      }) as any
    );
    const result = await getUserSetStatus("user-1", "42151-1");
    expect(result).toEqual({ inCollection: false, inWishlist: false, isFavorite: false });
  });
});
