import { vi } from "vitest";
import { followUser, unfollowUser, toggleFollow } from "@/lib/commands/follows";
import { mockSupabaseAuth } from "@test/helpers/mock-supabase";

vi.mock("@/lib/supabase/server", () => ({ createClient: vi.fn() }));
vi.mock("@/lib/commands/notifications", () => ({
  createNotification: vi.fn().mockResolvedValue(undefined),
}));

import { createClient } from "@/lib/supabase/server";
import { createNotification } from "@/lib/commands/notifications";
const mockCreateClient = vi.mocked(createClient);

describe("followUser", () => {
  it("returns error when not authenticated", async () => {
    mockCreateClient.mockResolvedValue(mockSupabaseAuth({ user: null }) as any);
    expect(await followUser("target-456")).toEqual({ error: "Not authenticated" });
  });

  it("prevents self-follow", async () => {
    mockCreateClient.mockResolvedValue(mockSupabaseAuth({ user: { id: "user-123" } }) as any);
    expect(await followUser("user-123")).toEqual({ error: "Cannot follow yourself" });
  });

  it("returns success and sends notification on valid follow", async () => {
    mockCreateClient.mockResolvedValue(
      mockSupabaseAuth({ user: { id: "user-123" }, queryResult: { error: null } }) as any
    );
    const result = await followUser("target-456");
    expect(result).toEqual({ success: true });
    expect(createNotification).toHaveBeenCalledWith({
      userId: "target-456",
      type: "follow",
      actorId: "user-123",
    });
  });

  it("returns 'Already following' on duplicate (unique constraint 23505)", async () => {
    mockCreateClient.mockResolvedValue(
      mockSupabaseAuth({ queryResult: { error: { code: "23505", message: "duplicate" } } }) as any
    );
    expect(await followUser("target-456")).toEqual({ error: "Already following this user" });
  });

  it("returns the database error message for unknown errors", async () => {
    mockCreateClient.mockResolvedValue(
      mockSupabaseAuth({
        queryResult: { error: { code: "42P01", message: "relation does not exist" } },
      }) as any
    );
    expect(await followUser("target-456")).toEqual({ error: "relation does not exist" });
  });
});

describe("unfollowUser", () => {
  it("returns error when not authenticated", async () => {
    mockCreateClient.mockResolvedValue(mockSupabaseAuth({ user: null }) as any);
    expect(await unfollowUser("target-456")).toEqual({ error: "Not authenticated" });
  });

  it("returns success on valid unfollow", async () => {
    mockCreateClient.mockResolvedValue(mockSupabaseAuth({ queryResult: { error: null } }) as any);
    expect(await unfollowUser("target-456")).toEqual({ success: true });
  });
});

describe("toggleFollow", () => {
  it("calls unfollowUser when currently following", async () => {
    mockCreateClient.mockResolvedValue(mockSupabaseAuth({ queryResult: { error: null } }) as any);
    expect(await toggleFollow("target-456", true)).toEqual({ success: true });
  });

  it("calls followUser when not currently following", async () => {
    mockCreateClient.mockResolvedValue(mockSupabaseAuth({ queryResult: { error: null } }) as any);
    expect(await toggleFollow("target-456", false)).toEqual({ success: true });
  });
});
