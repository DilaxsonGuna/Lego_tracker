import { vi } from "vitest";
import { setUserThemes, getUserThemesCount } from "@/lib/commands/user-themes";
import { mockSupabaseQuery } from "@test/helpers/mock-supabase";

vi.mock("@/lib/supabase/server", () => ({ createClient: vi.fn() }));
import { createClient } from "@/lib/supabase/server";
const mockCreateClient = vi.mocked(createClient);

// setUserThemes needs a special mock because it calls .delete() then .insert()
// on the same from() chain. We need to track what insert receives.
function mockThemesSupabase(
  options: {
    user?: { id: string } | null;
    deleteError?: { message: string } | null;
    insertError?: { message: string } | null;
  } = {}
) {
  const { user = { id: "user-1" }, deleteError = null, insertError = null } = options;
  const insertMock = vi.fn().mockResolvedValue({ error: insertError });

  return {
    mock: {
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user } }) },
      from: vi.fn().mockReturnValue({
        delete: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ error: deleteError }),
        }),
        insert: insertMock,
      }),
    },
    insertMock,
  };
}

describe("setUserThemes", () => {
  it("returns error when not authenticated", async () => {
    const { mock } = mockThemesSupabase({ user: null });
    mockCreateClient.mockResolvedValue(mock as any);
    expect(await setUserThemes([1, 2, 3])).toEqual({ error: "Not authenticated" });
  });

  it("truncates to 10 themes when more than 10 are passed", async () => {
    const { mock, insertMock } = mockThemesSupabase();
    mockCreateClient.mockResolvedValue(mock as any);

    await setUserThemes([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
    expect(insertMock.mock.calls[0][0]).toHaveLength(10);
  });

  it("assigns display_order starting from 0", async () => {
    const { mock, insertMock } = mockThemesSupabase();
    mockCreateClient.mockResolvedValue(mock as any);

    await setUserThemes([100, 200, 300]);
    expect(insertMock.mock.calls[0][0]).toEqual([
      { user_id: "user-1", theme_id: 100, display_order: 0 },
      { user_id: "user-1", theme_id: 200, display_order: 1 },
      { user_id: "user-1", theme_id: 300, display_order: 2 },
    ]);
  });

  it("skips insert when empty array is passed", async () => {
    const { mock, insertMock } = mockThemesSupabase();
    mockCreateClient.mockResolvedValue(mock as any);
    expect(await setUserThemes([])).toEqual({ success: true });
    expect(insertMock).not.toHaveBeenCalled();
  });

  it("returns error if delete fails", async () => {
    const { mock } = mockThemesSupabase({ deleteError: { message: "delete failed" } });
    mockCreateClient.mockResolvedValue(mock as any);
    expect(await setUserThemes([1])).toEqual({ error: "delete failed" });
  });

  it("returns error if insert fails", async () => {
    const { mock } = mockThemesSupabase({ insertError: { message: "insert failed" } });
    mockCreateClient.mockResolvedValue(mock as any);
    expect(await setUserThemes([1])).toEqual({ error: "insert failed" });
  });

  it("returns success for valid themes", async () => {
    const { mock } = mockThemesSupabase();
    mockCreateClient.mockResolvedValue(mock as any);
    expect(await setUserThemes([1, 2, 3])).toEqual({ success: true });
  });
});

describe("getUserThemesCount", () => {
  it("returns the count", async () => {
    mockCreateClient.mockResolvedValue(mockSupabaseQuery({ count: 7 }) as any);
    expect(await getUserThemesCount("user-1")).toBe(7);
  });

  it("returns 0 on error", async () => {
    mockCreateClient.mockResolvedValue(
      mockSupabaseQuery({ count: null, error: { message: "fail" } }) as any
    );
    expect(await getUserThemesCount("user-1")).toBe(0);
  });
});
