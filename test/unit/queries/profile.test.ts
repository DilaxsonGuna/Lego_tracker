import { vi } from "vitest";
import { getMilestones, isProfileComplete, isUsernameAvailable } from "@/lib/queries/profile";
import { mockSupabaseQuery } from "@test/helpers/mock-supabase";

vi.mock("@/lib/supabase/server", () => ({ createClient: vi.fn() }));
import { createClient } from "@/lib/supabase/server";
const mockCreateClient = vi.mocked(createClient);

describe("getMilestones", () => {
  it("returns empty array for empty collection", async () => {
    mockCreateClient.mockResolvedValue(mockSupabaseQuery({ data: [] }) as any);
    expect(await getMilestones("user-1")).toEqual([]);
  });

  it("returns 1k Bricks milestone at 1000+ pieces", async () => {
    mockCreateClient.mockResolvedValue(
      mockSupabaseQuery({
        data: [{ quantity: 1, lego_sets: { num_parts: 1200, year: 2023 } }],
      }) as any
    );
    const result = await getMilestones("user-1");
    expect(result.find((m) => m.id === "m-1k")).toBeDefined();
  });

  it("returns 10 Sets milestone at 10+ sets", async () => {
    const rows = Array.from({ length: 11 }, (_, i) => ({
      quantity: 1,
      lego_sets: { num_parts: 50, year: 2020 + (i % 3) },
    }));
    mockCreateClient.mockResolvedValue(mockSupabaseQuery({ data: rows }) as any);
    const result = await getMilestones("user-1");
    expect(result.find((m) => m.id === "m-10s")).toBeDefined();
  });

  it("returns decade milestone when year span >= 10", async () => {
    mockCreateClient.mockResolvedValue(
      mockSupabaseQuery({
        data: [
          { quantity: 1, lego_sets: { num_parts: 100, year: 2010 } },
          { quantity: 1, lego_sets: { num_parts: 100, year: 2023 } },
        ],
      }) as any
    );
    const result = await getMilestones("user-1");
    expect(result.find((m) => m.id === "m-decade")).toBeDefined();
  });

  it("does NOT return decade milestone when span < 10", async () => {
    mockCreateClient.mockResolvedValue(
      mockSupabaseQuery({
        data: [
          { quantity: 1, lego_sets: { num_parts: 100, year: 2020 } },
          { quantity: 1, lego_sets: { num_parts: 100, year: 2023 } },
        ],
      }) as any
    );
    const result = await getMilestones("user-1");
    expect(result.find((m) => m.id === "m-decade")).toBeUndefined();
  });

  it("accumulates multiple milestones", async () => {
    const rows = Array.from({ length: 15 }, (_, i) => ({
      quantity: 1,
      lego_sets: { num_parts: 1000, year: 2010 + i },
    }));
    mockCreateClient.mockResolvedValue(mockSupabaseQuery({ data: rows }) as any);
    const result = await getMilestones("user-1");
    const ids = result.map((m) => m.id);
    expect(ids).toContain("m-1k");
    expect(ids).toContain("m-10k");
    expect(ids).toContain("m-10s");
    expect(ids).toContain("m-decade");
  });
});

describe("isProfileComplete", () => {
  it("returns true when username is set", async () => {
    mockCreateClient.mockResolvedValue(
      mockSupabaseQuery({ data: { username: "brickfan" } }) as any
    );
    expect(await isProfileComplete("user-1")).toBe(true);
  });

  it("returns false when username is null", async () => {
    mockCreateClient.mockResolvedValue(mockSupabaseQuery({ data: { username: null } }) as any);
    expect(await isProfileComplete("user-1")).toBe(false);
  });

  it("returns false when username is empty/whitespace", async () => {
    mockCreateClient.mockResolvedValue(mockSupabaseQuery({ data: { username: "   " } }) as any);
    expect(await isProfileComplete("user-1")).toBe(false);
  });

  it("returns false on error", async () => {
    mockCreateClient.mockResolvedValue(
      mockSupabaseQuery({ data: null, error: { message: "fail" } }) as any
    );
    expect(await isProfileComplete("user-1")).toBe(false);
  });
});

describe("isUsernameAvailable", () => {
  it("returns true when no matching user found", async () => {
    mockCreateClient.mockResolvedValue(mockSupabaseQuery({ data: null }) as any);
    expect(await isUsernameAvailable("newuser")).toBe(true);
  });

  it("returns false when username is taken", async () => {
    mockCreateClient.mockResolvedValue(mockSupabaseQuery({ data: { id: "existing" } }) as any);
    expect(await isUsernameAvailable("takenuser")).toBe(false);
  });
});
