import { vi } from "vitest";
import { getUserThemes, getUserThemeIds } from "@/lib/queries/user-themes";
import { mockSupabaseQuery } from "@test/helpers/mock-supabase";

vi.mock("@/lib/supabase/server", () => ({ createClient: vi.fn() }));
import { createClient } from "@/lib/supabase/server";
const mockCreateClient = vi.mocked(createClient);

describe("getUserThemes", () => {
  it("maps rows to ThemeCategory with id and label", async () => {
    mockCreateClient.mockResolvedValue(
      mockSupabaseQuery({
        data: [
          { theme_id: 1, display_order: 0, themes: { id: 1, name: "Star Wars" } },
          { theme_id: 2, display_order: 1, themes: { id: 2, name: "Technic" } },
        ],
      }) as any
    );

    const result = await getUserThemes("user-1");
    expect(result).toEqual([
      { id: 1, label: "Star Wars" },
      { id: 2, label: "Technic" },
    ]);
  });

  it("returns empty array on error", async () => {
    mockCreateClient.mockResolvedValue(
      mockSupabaseQuery({ data: null, error: { message: "fail" } }) as any
    );
    expect(await getUserThemes("user-1")).toEqual([]);
  });

  it("defaults label to empty string when theme name is null", async () => {
    mockCreateClient.mockResolvedValue(
      mockSupabaseQuery({
        data: [{ theme_id: 99, display_order: 0, themes: null }],
      }) as any
    );
    const result = await getUserThemes("user-1");
    expect(result[0].label).toBe("");
  });
});

describe("getUserThemeIds", () => {
  it("returns array of theme IDs in order", async () => {
    mockCreateClient.mockResolvedValue(
      mockSupabaseQuery({
        data: [{ theme_id: 10 }, { theme_id: 20 }, { theme_id: 30 }],
      }) as any
    );
    expect(await getUserThemeIds("user-1")).toEqual([10, 20, 30]);
  });

  it("returns empty array on error", async () => {
    mockCreateClient.mockResolvedValue(
      mockSupabaseQuery({ data: null, error: { message: "fail" } }) as any
    );
    expect(await getUserThemeIds("user-1")).toEqual([]);
  });
});
