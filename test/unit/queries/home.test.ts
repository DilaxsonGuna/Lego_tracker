import { vi } from "vitest";
import { getDashboardStats, getRecentlyAddedSets, getFollowingActivity } from "@/lib/queries/home";
import {
  mockSupabaseMultiTable,
  mockSupabaseAuth,
  mockSupabaseQuery,
} from "@test/helpers/mock-supabase";

vi.mock("@/lib/supabase/server", () => ({ createClient: vi.fn() }));
import { createClient } from "@/lib/supabase/server";
const mockCreateClient = vi.mocked(createClient);

describe("getDashboardStats", () => {
  it("calculates stats for a collection", async () => {
    mockCreateClient.mockResolvedValue(
      mockSupabaseMultiTable({
        user_sets: {
          data: [
            { quantity: 1, lego_sets: { num_parts: 500 } },
            { quantity: 2, lego_sets: { num_parts: 300 } },
          ],
        },
        profiles: { count: 5 },
      }) as any
    );

    const result = await getDashboardStats("user-1");
    expect(result).not.toBeNull();
    expect(result!.totalSets).toBe(2);
    expect(result!.totalPieces).toBe(1100); // 500 + 300*2
    expect(result!.brickScore).toBe(1300); // 1100 + 2*100
    expect(result!.rankNumber).toBe(6); // 5 higher + 1
    expect(result!.rankName).toBe("New Recruit");
  });

  it("handles empty collection", async () => {
    mockCreateClient.mockResolvedValue(
      mockSupabaseMultiTable({ user_sets: { data: [] }, profiles: { count: 0 } }) as any
    );
    const result = await getDashboardStats("user-1");
    expect(result!.totalSets).toBe(0);
    expect(result!.rankName).toBeNull();
  });

  it("returns null on error", async () => {
    mockCreateClient.mockResolvedValue(
      mockSupabaseMultiTable({ user_sets: { error: { message: "fail" } } }) as any
    );
    expect(await getDashboardStats("user-1")).toBeNull();
  });

  it("includes rank progress", async () => {
    mockCreateClient.mockResolvedValue(
      mockSupabaseMultiTable({
        user_sets: { data: [{ quantity: 1, lego_sets: { num_parts: 3000 } }] },
        profiles: { count: 0 },
      }) as any
    );
    const result = await getDashboardStats("user-1");
    expect(result!.rankProgress).toBeDefined();
    expect(result!.rankProgress.overallProgress).toBeGreaterThanOrEqual(0);
  });
});

describe("getRecentlyAddedSets", () => {
  it("maps rows to RecentlyAddedSet shape", async () => {
    mockCreateClient.mockResolvedValue(
      mockSupabaseQuery({
        data: [
          {
            created_at: "2026-03-22T10:00:00Z",
            lego_sets: {
              set_num: "42151-1",
              name: "Bugatti",
              year: 2023,
              num_parts: 3696,
              img_url: "/bug.jpg",
              themes: { name: "Technic" },
            },
          },
        ],
      }) as any
    );

    const result = await getRecentlyAddedSets("user-1");
    expect(result).toHaveLength(1);
    expect(result[0].setNum).toBe("42151-1");
    expect(result[0].themeName).toBe("Technic");
    expect(result[0].addedAt).toBe("2026-03-22T10:00:00Z");
  });

  it("returns empty array on error", async () => {
    mockCreateClient.mockResolvedValue(
      mockSupabaseQuery({ data: null, error: { message: "fail" } }) as any
    );
    expect(await getRecentlyAddedSets("user-1")).toEqual([]);
  });
});

describe("getFollowingActivity", () => {
  it("returns empty array when user follows nobody", async () => {
    mockCreateClient.mockResolvedValue(mockSupabaseQuery({ data: [], error: null }) as any);
    expect(await getFollowingActivity("user-1")).toEqual([]);
  });
});
