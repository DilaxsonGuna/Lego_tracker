import { vi } from "vitest";
import {
  addUserSet,
  deleteUserSet,
  getUserSetNums,
  getUserSetsWithType,
} from "@/lib/commands/user-sets";
import { mockSupabaseAuth } from "@test/helpers/mock-supabase";

vi.mock("@/lib/supabase/server", () => ({ createClient: vi.fn() }));
vi.mock("@/lib/commands/user-stats", () => ({
  recalculateUserStats: vi.fn().mockResolvedValue({ success: true }),
}));

import { createClient } from "@/lib/supabase/server";
import { recalculateUserStats } from "@/lib/commands/user-stats";
const mockCreateClient = vi.mocked(createClient);

describe("addUserSet", () => {
  it("returns error when not authenticated", async () => {
    mockCreateClient.mockResolvedValue(mockSupabaseAuth({ user: null }) as any);
    expect(await addUserSet("42151-1")).toEqual({ error: "Not authenticated" });
  });

  it("returns success on valid insert", async () => {
    mockCreateClient.mockResolvedValue(mockSupabaseAuth({ queryResult: { error: null } }) as any);
    expect(await addUserSet("42151-1")).toEqual({ success: true });
  });

  it("defaults to quantity=1 and collectionType='wishlist'", async () => {
    const upsertMock = vi.fn().mockResolvedValue({ error: null });
    mockCreateClient.mockResolvedValue({
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: "u1" } } }) },
      from: vi.fn().mockReturnValue({ upsert: upsertMock }),
    } as any);

    await addUserSet("42151-1");
    expect(upsertMock).toHaveBeenCalledWith(
      expect.objectContaining({ quantity: 1, collection_type: "wishlist" }),
      expect.anything()
    );
  });

  it("recalculates stats when added to collection (not wishlist)", async () => {
    mockCreateClient.mockResolvedValue(mockSupabaseAuth({ queryResult: { error: null } }) as any);

    await addUserSet("42151-1", 1, "collection");
    expect(recalculateUserStats).toHaveBeenCalled();
  });

  it("does NOT recalculate stats when added to wishlist", async () => {
    vi.mocked(recalculateUserStats).mockClear();
    mockCreateClient.mockResolvedValue(mockSupabaseAuth({ queryResult: { error: null } }) as any);

    await addUserSet("42151-1", 1, "wishlist");
    expect(recalculateUserStats).not.toHaveBeenCalled();
  });

  it("returns error message on database failure", async () => {
    mockCreateClient.mockResolvedValue(
      mockSupabaseAuth({ queryResult: { error: { message: "conflict" } } }) as any
    );
    expect(await addUserSet("42151-1")).toEqual({ error: "conflict" });
  });
});

describe("deleteUserSet", () => {
  it("returns error when not authenticated", async () => {
    mockCreateClient.mockResolvedValue(mockSupabaseAuth({ user: null }) as any);
    expect(await deleteUserSet("42151-1")).toEqual({ error: "Not authenticated" });
  });

  it("returns success and recalculates stats", async () => {
    mockCreateClient.mockResolvedValue(mockSupabaseAuth({ queryResult: { error: null } }) as any);
    const result = await deleteUserSet("42151-1");
    expect(result).toEqual({ success: true });
    expect(recalculateUserStats).toHaveBeenCalled();
  });
});

describe("getUserSetNums", () => {
  it("returns array of set numbers", async () => {
    mockCreateClient.mockResolvedValue(
      mockSupabaseAuth({
        queryResult: { data: [{ set_num: "42151-1" }, { set_num: "75192-1" }] },
      }) as any
    );
    expect(await getUserSetNums()).toEqual(["42151-1", "75192-1"]);
  });

  it("returns empty array when not authenticated", async () => {
    mockCreateClient.mockResolvedValue(mockSupabaseAuth({ user: null }) as any);
    expect(await getUserSetNums()).toEqual([]);
  });
});

describe("getUserSetsWithType", () => {
  it("maps rows to setNum + collectionType", async () => {
    mockCreateClient.mockResolvedValue(
      mockSupabaseAuth({
        queryResult: {
          data: [
            { set_num: "42151-1", collection_type: "collection" },
            { set_num: "75192-1", collection_type: "wishlist" },
          ],
        },
      }) as any
    );
    const result = await getUserSetsWithType();
    expect(result).toEqual([
      { setNum: "42151-1", collectionType: "collection" },
      { setNum: "75192-1", collectionType: "wishlist" },
    ]);
  });

  it("returns empty array when not authenticated", async () => {
    mockCreateClient.mockResolvedValue(mockSupabaseAuth({ user: null }) as any);
    expect(await getUserSetsWithType()).toEqual([]);
  });
});
