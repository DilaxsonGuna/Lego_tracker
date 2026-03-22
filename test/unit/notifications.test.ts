import { vi } from "vitest";
import { createNotification, markAsRead, markAllAsRead } from "@/lib/commands/notifications";
import { mockSupabaseQuery } from "@test/helpers/mock-supabase";

vi.mock("@/lib/supabase/server", () => ({ createClient: vi.fn() }));
import { createClient } from "@/lib/supabase/server";
const mockCreateClient = vi.mocked(createClient);

describe("createNotification", () => {
  it("does NOT create when userId === actorId (self-notification)", async () => {
    const insertMock = vi.fn();
    mockCreateClient.mockResolvedValue({
      from: vi.fn().mockReturnValue({ insert: insertMock }),
    } as any);

    await createNotification({ userId: "user-1", type: "follow", actorId: "user-1" });
    expect(insertMock).not.toHaveBeenCalled();
  });

  it("creates notification when userId !== actorId", async () => {
    const insertMock = vi.fn().mockResolvedValue({ error: null });
    mockCreateClient.mockResolvedValue({
      from: vi.fn().mockReturnValue({ insert: insertMock }),
    } as any);

    await createNotification({ userId: "user-1", type: "follow", actorId: "user-2" });
    expect(insertMock).toHaveBeenCalledWith({
      user_id: "user-1",
      type: "follow",
      actor_id: "user-2",
      data: {},
    });
  });

  it("passes custom data through", async () => {
    const insertMock = vi.fn().mockResolvedValue({ error: null });
    mockCreateClient.mockResolvedValue({
      from: vi.fn().mockReturnValue({ insert: insertMock }),
    } as any);

    await createNotification({
      userId: "user-1",
      type: "follow",
      actorId: "user-2",
      data: { setNum: "42151-1" },
    });
    expect(insertMock).toHaveBeenCalledWith(
      expect.objectContaining({ data: { setNum: "42151-1" } })
    );
  });

  it("logs error on database failure (does not throw)", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    mockCreateClient.mockResolvedValue({
      from: vi.fn().mockReturnValue({
        insert: vi.fn().mockResolvedValue({ error: { message: "db down" } }),
      }),
    } as any);

    await createNotification({ userId: "user-1", type: "follow", actorId: "user-2" });
    expect(consoleSpy).toHaveBeenCalledWith("Failed to create notification:", "db down");
    consoleSpy.mockRestore();
  });
});

describe("markAsRead", () => {
  it("returns success", async () => {
    mockCreateClient.mockResolvedValue(mockSupabaseQuery({ error: null }) as any);
    expect(await markAsRead("notif-1")).toEqual({ success: true });
  });

  it("returns error on failure", async () => {
    mockCreateClient.mockResolvedValue(
      mockSupabaseQuery({ error: { message: "not found" } }) as any
    );
    expect(await markAsRead("notif-1")).toEqual({ error: "not found" });
  });
});

describe("markAllAsRead", () => {
  it("returns success", async () => {
    mockCreateClient.mockResolvedValue(mockSupabaseQuery({ error: null }) as any);
    expect(await markAllAsRead("user-1")).toEqual({ success: true });
  });
});
