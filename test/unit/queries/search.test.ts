import { vi } from "vitest";
import { searchSets, searchUsers, searchThemes } from "@/lib/queries/search";
import { mockSupabaseQuery } from "@test/helpers/mock-supabase";

vi.mock("@/lib/supabase/server", () => ({ createClient: vi.fn() }));
import { createClient } from "@/lib/supabase/server";
const mockCreateClient = vi.mocked(createClient);

describe("searchSets", () => {
  it("returns empty array for empty query", async () => {
    expect(await searchSets("")).toEqual([]);
    expect(await searchSets("   ")).toEqual([]);
  });

  it("maps database rows to SearchSet shape", async () => {
    mockCreateClient.mockResolvedValue(
      mockSupabaseQuery({
        data: [
          {
            set_num: "42151-1",
            name: "Bugatti Chiron",
            year: 2023,
            num_parts: 3696,
            img_url: "/bugatti.jpg",
            themes: { name: "Technic" },
          },
        ],
      }) as any
    );

    const result = await searchSets("bugatti");
    expect(result).toEqual([
      {
        setNum: "42151-1",
        name: "Bugatti Chiron",
        year: 2023,
        numParts: 3696,
        setImgUrl: "/bugatti.jpg",
        theme: "Technic",
      },
    ]);
  });

  it("defaults numParts to 0 and imgUrl to empty string when null", async () => {
    mockCreateClient.mockResolvedValue(
      mockSupabaseQuery({
        data: [
          {
            set_num: "1-1",
            name: "Test",
            year: 2020,
            num_parts: null,
            img_url: null,
            themes: null,
          },
        ],
      }) as any
    );

    const result = await searchSets("test");
    expect(result[0].numParts).toBe(0);
    expect(result[0].setImgUrl).toBe("");
    expect(result[0].theme).toBe("");
  });

  it("returns empty array on database error", async () => {
    mockCreateClient.mockResolvedValue(
      mockSupabaseQuery({ data: null, error: { message: "fail" } }) as any
    );
    expect(await searchSets("bugatti")).toEqual([]);
  });
});

describe("searchUsers", () => {
  it("returns empty array for empty query", async () => {
    expect(await searchUsers("")).toEqual([]);
  });

  it("maps rows and defaults null fields to empty strings", async () => {
    mockCreateClient.mockResolvedValue(
      mockSupabaseQuery({
        data: [{ id: "u1", username: null, full_name: null, avatar_url: null }],
      }) as any
    );
    const result = await searchUsers("test");
    expect(result[0]).toEqual({ id: "u1", username: "", fullName: "", avatarUrl: "" });
  });
});

describe("searchThemes", () => {
  it("returns empty array for empty query", async () => {
    expect(await searchThemes("")).toEqual([]);
  });

  it("maps rows with parent theme name", async () => {
    mockCreateClient.mockResolvedValue(
      mockSupabaseQuery({
        data: [
          { id: 1, name: "Star Wars", parent: { name: "Licensed" } },
          { id: 2, name: "City", parent: null },
        ],
      }) as any
    );

    const result = await searchThemes("star");
    expect(result).toEqual([
      { id: 1, name: "Star Wars", parentName: "Licensed" },
      { id: 2, name: "City", parentName: null },
    ]);
  });
});
