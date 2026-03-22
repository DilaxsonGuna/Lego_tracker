import { sanitizeSearchInput } from "@/lib/queries/vault";

describe("sanitizeSearchInput", () => {
  it("removes % (PostgREST wildcard)", () => {
    expect(sanitizeSearchInput("100%")).toBe("100");
  });

  it("removes _ (PostgREST single-char wildcard)", () => {
    expect(sanitizeSearchInput("test_set")).toBe("testset");
  });

  it("removes parentheses (PostgREST filter grouping)", () => {
    expect(sanitizeSearchInput("name(test)")).toBe("nametest");
  });

  it("removes commas (PostgREST OR separator)", () => {
    expect(sanitizeSearchInput("star,wars")).toBe("starwars");
  });

  it("removes dots (PostgREST field separator)", () => {
    expect(sanitizeSearchInput("lego.set")).toBe("legoset");
  });

  it("removes multiple special chars at once", () => {
    expect(sanitizeSearchInput("%(test),._")).toBe("test");
  });

  it("leaves normal text unchanged", () => {
    expect(sanitizeSearchInput("Star Wars 42151")).toBe("Star Wars 42151");
  });

  it("returns empty string when input is all special chars", () => {
    expect(sanitizeSearchInput("%_(),.")).toBe("");
  });

  it("preserves hyphens (valid in set numbers like 42151-1)", () => {
    expect(sanitizeSearchInput("42151-1")).toBe("42151-1");
  });
});
