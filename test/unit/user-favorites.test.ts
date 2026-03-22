import { vi } from "vitest";
import {
  addUserFavorite,
  removeUserFavorite,
  getUserFavoriteSetNums,
  getUserFavoritesCount,
} from "@/lib/commands/user-favorites";
import { mockSupabaseAuth, mockSupabaseQuery } from "@test/helpers/mock-supabase";

vi.mock("@/lib/supabase/server", () => ({ createClient: vi.fn() }));
import { createClient } from "@/lib/supabase/server";
const mockCreateClient = vi.mocked(createClient);

describe("addUserFavorite", () => {
  it("returns error when not authenticated", async () => {
    mockCreateClient.mockResolvedValue(mockSupabaseAuth({ user: null }) as any);
    expect(await addUserFavorite("42151-1")).toEqual({ error: "Not authenticated" });
  });

  it("returns success when insert succeeds", async () => {
    mockCreateClient.mockResolvedValue(mockSupabaseAuth({ queryResult: { error: null } }) as any);
    expect(await addUserFavorite("42151-1")).toEqual({ success: true });
  });

  it("returns error message on database failure", async () => {
    mockCreateClient.mockResolvedValue(
      mockSupabaseAuth({ queryResult: { error: { message: "duplicate key" } } }) as any
    );
    expect(await addUserFavorite("42151-1")).toEqual({ error: "duplicate key" });
  });
});

describe("removeUserFavorite", () => {
  it("returns error when not authenticated", async () => {
    mockCreateClient.mockResolvedValue(mockSupabaseAuth({ user: null }) as any);
    expect(await removeUserFavorite("42151-1")).toEqual({ error: "Not authenticated" });
  });

  it("returns success when delete succeeds", async () => {
    mockCreateClient.mockResolvedValue(mockSupabaseAuth({ queryResult: { error: null } }) as any);
    expect(await removeUserFavorite("42151-1")).toEqual({ success: true });
  });
});

describe("getUserFavoriteSetNums", () => {
  it("returns a Set of favorite set numbers", async () => {
    mockCreateClient.mockResolvedValue(
      mockSupabaseQuery({
        data: [{ set_num: "42151-1" }, { set_num: "75192-1" }, { set_num: "10294-1" }],
      }) as any
    );
    const result = await getUserFavoriteSetNums("user-1");
    expect(result).toBeInstanceOf(Set);
    expect(result.size).toBe(3);
    expect(result.has("42151-1")).toBe(true);
    expect(result.has("99999-1")).toBe(false);
  });

  it("returns empty Set on error", async () => {
    mockCreateClient.mockResolvedValue(
      mockSupabaseQuery({ data: null, error: { message: "fail" } }) as any
    );
    const result = await getUserFavoriteSetNums("user-1");
    expect(result.size).toBe(0);
  });
});

describe("getUserFavoritesCount", () => {
  it("returns the count", async () => {
    mockCreateClient.mockResolvedValue(mockSupabaseQuery({ count: 3 }) as any);
    expect(await getUserFavoritesCount("user-1")).toBe(3);
  });

  it("returns 0 when count is null", async () => {
    mockCreateClient.mockResolvedValue(mockSupabaseQuery({ count: null }) as any);
    expect(await getUserFavoritesCount("user-1")).toBe(0);
  });

  it("returns 0 on error", async () => {
    mockCreateClient.mockResolvedValue(
      mockSupabaseQuery({ count: null, error: { message: "fail" } }) as any
    );
    expect(await getUserFavoritesCount("user-1")).toBe(0);
  });
});
