import { vi } from "vitest";
import { getLeaderboard } from "@/lib/queries/leaderboard";
import { mockSupabaseMultiTable } from "@test/helpers/mock-supabase";

vi.mock("@/lib/supabase/server", () => ({ createClient: vi.fn() }));
import { createClient } from "@/lib/supabase/server";
const mockCreateClient = vi.mocked(createClient);

describe("getLeaderboard", () => {
  it("returns empty entries on error", async () => {
    mockCreateClient.mockResolvedValue(
      mockSupabaseMultiTable({ profiles: { data: null, error: { message: "fail" } } }) as any
    );
    const result = await getLeaderboard();
    expect(result).toEqual({ entries: [], currentUserPosition: null, totalUsers: 0 });
  });

  it("maps profile rows to leaderboard entries with position", async () => {
    mockCreateClient.mockResolvedValue(
      mockSupabaseMultiTable({
        profiles: {
          data: [
            {
              id: "u1",
              username: "topbuilder",
              avatar_url: "/a.jpg",
              brick_score: 5000,
              sets_count: 20,
              pieces_count: 4000,
            },
            {
              id: "u2",
              username: null,
              avatar_url: null,
              brick_score: 3000,
              sets_count: 10,
              pieces_count: 2000,
            },
          ],
          count: 2,
        },
      }) as any
    );

    const result = await getLeaderboard(0, 50);

    expect(result.entries).toHaveLength(2);
    expect(result.entries[0].position).toBe(1);
    expect(result.entries[0].username).toBe("topbuilder");
    expect(result.entries[1].position).toBe(2);
    expect(result.entries[1].username).toBe("Anonymous"); // null → fallback
  });

  it("assigns rank based on pieces and sets", async () => {
    mockCreateClient.mockResolvedValue(
      mockSupabaseMultiTable({
        profiles: {
          data: [
            {
              id: "u1",
              username: "master",
              avatar_url: "",
              brick_score: 30000,
              sets_count: 50,
              pieces_count: 25000,
            },
          ],
          count: 1,
        },
      }) as any
    );

    const result = await getLeaderboard();
    // 25000 pieces, 50 sets → Master Builder
    expect(result.entries[0].rank?.id).toBe("master-builder");
  });
});
