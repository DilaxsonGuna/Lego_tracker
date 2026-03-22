import { vi } from "vitest";
import { recalculateUserStats } from "@/lib/commands/user-stats";
import { mockSupabaseMultiTable } from "@test/helpers/mock-supabase";

vi.mock("@/lib/supabase/server", () => ({ createClient: vi.fn() }));
import { createClient } from "@/lib/supabase/server";
const mockCreateClient = vi.mocked(createClient);

describe("recalculateUserStats", () => {
  it("returns error when not authenticated and no userId provided", async () => {
    mockCreateClient.mockResolvedValue(mockSupabaseMultiTable({}, null) as any);
    expect(await recalculateUserStats()).toEqual({ error: "Not authenticated" });
  });

  it("calculates correct stats for a collection", async () => {
    // 500*1 + 200*2 = 900 pieces, 2 sets, score = 900 + 200 = 1100
    mockCreateClient.mockResolvedValue(
      mockSupabaseMultiTable(
        {
          user_sets: {
            data: [
              { quantity: 1, lego_sets: { num_parts: 500 } },
              { quantity: 2, lego_sets: { num_parts: 200 } },
            ],
          },
          profiles: { error: null },
        },
        { id: "user-1" }
      ) as any
    );

    const result = await recalculateUserStats("user-1");
    expect(result).toEqual({
      success: true,
      setsCount: 2,
      piecesCount: 900,
      brickScore: 1100,
    });
  });

  it("handles empty collection", async () => {
    mockCreateClient.mockResolvedValue(
      mockSupabaseMultiTable({ user_sets: { data: [] }, profiles: { error: null } }) as any
    );
    const result = await recalculateUserStats("user-1");
    expect(result).toEqual({ success: true, setsCount: 0, piecesCount: 0, brickScore: 0 });
  });

  it("defaults quantity to 1 when null", async () => {
    mockCreateClient.mockResolvedValue(
      mockSupabaseMultiTable({
        user_sets: { data: [{ quantity: null, lego_sets: { num_parts: 300 } }] },
        profiles: { error: null },
      }) as any
    );
    const result = await recalculateUserStats("user-1");
    expect(result).toMatchObject({ piecesCount: 300 });
  });

  it("returns error on select failure", async () => {
    mockCreateClient.mockResolvedValue(
      mockSupabaseMultiTable({ user_sets: { error: { message: "timeout" } } }) as any
    );
    expect(await recalculateUserStats("user-1")).toEqual({ error: "timeout" });
  });

  it("returns error on update failure", async () => {
    mockCreateClient.mockResolvedValue(
      mockSupabaseMultiTable({
        user_sets: { data: [{ quantity: 1, lego_sets: { num_parts: 100 } }] },
        profiles: { error: { message: "update failed" } },
      }) as any
    );
    expect(await recalculateUserStats("user-1")).toEqual({ error: "update failed" });
  });
});
