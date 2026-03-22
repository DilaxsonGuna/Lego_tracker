import { vi } from "vitest";
import {
  getFollowCounts,
  getFollowerCount,
  getFollowingCount,
  isFollowing,
} from "@/lib/queries/social";
import { mockSupabaseQuery } from "@test/helpers/mock-supabase";

vi.mock("@/lib/supabase/server", () => ({ createClient: vi.fn() }));
import { createClient } from "@/lib/supabase/server";
const mockCreateClient = vi.mocked(createClient);

describe("getFollowCounts", () => {
  it("reads denormalized counts from profiles", async () => {
    mockCreateClient.mockResolvedValue(
      mockSupabaseQuery({ data: { follower_count: 42, following_count: 15 } }) as any
    );
    expect(await getFollowCounts("user-1")).toEqual({ followers: 42, following: 15 });
  });

  it("returns zeros when counts are null", async () => {
    mockCreateClient.mockResolvedValue(
      mockSupabaseQuery({ data: { follower_count: null, following_count: null } }) as any
    );
    expect(await getFollowCounts("user-1")).toEqual({ followers: 0, following: 0 });
  });

  it("returns zeros on error", async () => {
    mockCreateClient.mockResolvedValue(
      mockSupabaseQuery({ data: null, error: { message: "not found" } }) as any
    );
    expect(await getFollowCounts("user-1")).toEqual({ followers: 0, following: 0 });
  });
});

describe("getFollowerCount", () => {
  it("delegates to getFollowCounts", async () => {
    mockCreateClient.mockResolvedValue(
      mockSupabaseQuery({ data: { follower_count: 10, following_count: 5 } }) as any
    );
    expect(await getFollowerCount("user-1")).toBe(10);
  });
});

describe("getFollowingCount", () => {
  it("delegates to getFollowCounts", async () => {
    mockCreateClient.mockResolvedValue(
      mockSupabaseQuery({ data: { follower_count: 10, following_count: 5 } }) as any
    );
    expect(await getFollowingCount("user-1")).toBe(5);
  });
});

describe("isFollowing", () => {
  it("returns true when follow exists", async () => {
    mockCreateClient.mockResolvedValue(mockSupabaseQuery({ data: { id: "follow-1" } }) as any);
    expect(await isFollowing("user-1", "user-2")).toBe(true);
  });

  it("returns false when no follow", async () => {
    mockCreateClient.mockResolvedValue(mockSupabaseQuery({ data: null }) as any);
    expect(await isFollowing("user-1", "user-2")).toBe(false);
  });

  it("returns false on error", async () => {
    mockCreateClient.mockResolvedValue(
      mockSupabaseQuery({ data: null, error: { message: "fail" } }) as any
    );
    expect(await isFollowing("user-1", "user-2")).toBe(false);
  });
});
