import { vi } from "vitest";
import { getNotifications, getUnreadCount } from "@/lib/queries/notifications";
import { mockSupabaseQuery } from "@test/helpers/mock-supabase";

vi.mock("@/lib/supabase/server", () => ({ createClient: vi.fn() }));
import { createClient } from "@/lib/supabase/server";
const mockCreateClient = vi.mocked(createClient);

describe("getNotifications", () => {
  it("maps rows with actor profile data", async () => {
    mockCreateClient.mockResolvedValue(
      mockSupabaseQuery({
        data: [
          {
            id: "n1",
            user_id: "user-1",
            type: "follow",
            actor_id: "user-2",
            data: { extra: "info" },
            read: false,
            created_at: "2026-03-22T10:00:00Z",
            profiles: { username: "brickfan", avatar_url: "/av.jpg", full_name: "Brick Fan" },
          },
        ],
      }) as any
    );

    const result = await getNotifications("user-1");

    expect(result).toHaveLength(1);
    expect(result[0].type).toBe("follow");
    expect(result[0].actor?.username).toBe("brickfan");
    expect(result[0].actor?.display_name).toBe("Brick Fan");
    expect(result[0].data).toEqual({ extra: "info" });
  });

  it("handles null actor profile", async () => {
    mockCreateClient.mockResolvedValue(
      mockSupabaseQuery({
        data: [
          {
            id: "n1",
            user_id: "user-1",
            type: "follow",
            actor_id: "deleted-user",
            data: null,
            read: true,
            created_at: "2026-03-22T10:00:00Z",
            profiles: null,
          },
        ],
      }) as any
    );

    const result = await getNotifications("user-1");
    expect(result[0].actor).toBeUndefined();
    expect(result[0].data).toEqual({});
  });

  it("returns empty array on error", async () => {
    mockCreateClient.mockResolvedValue(
      mockSupabaseQuery({ data: null, error: { message: "fail" } }) as any
    );
    expect(await getNotifications("user-1")).toEqual([]);
  });
});

describe("getUnreadCount", () => {
  it("returns the count", async () => {
    mockCreateClient.mockResolvedValue(mockSupabaseQuery({ count: 5 }) as any);
    expect(await getUnreadCount("user-1")).toBe(5);
  });

  it("returns 0 on error", async () => {
    mockCreateClient.mockResolvedValue(
      mockSupabaseQuery({ count: null, error: { message: "fail" } }) as any
    );
    expect(await getUnreadCount("user-1")).toBe(0);
  });
});
