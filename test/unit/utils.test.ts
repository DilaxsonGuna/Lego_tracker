// Tests for lib/utils.ts — pure functions, no mocking needed.

import { cn, removeAccents } from "@/lib/utils";

// ─── removeAccents ──────────────────────────────────────────────────
// Used in vault search to match "Pokemon" when user types "Pokémon"

describe("removeAccents", () => {
  it("removes accents from common characters", () => {
    expect(removeAccents("café")).toBe("cafe");
    expect(removeAccents("Pokémon")).toBe("Pokemon");
    expect(removeAccents("résumé")).toBe("resume");
  });

  it("handles multiple accent types", () => {
    expect(removeAccents("ñ")).toBe("n"); // Spanish
    expect(removeAccents("ü")).toBe("u"); // German
    expect(removeAccents("à")).toBe("a"); // French
    expect(removeAccents("ô")).toBe("o"); // Portuguese
  });

  it("leaves ASCII text unchanged", () => {
    expect(removeAccents("Hello World")).toBe("Hello World");
    expect(removeAccents("LEGO 42151")).toBe("LEGO 42151");
  });

  it("handles empty string", () => {
    expect(removeAccents("")).toBe("");
  });
});

// ─── cn ─────────────────────────────────────────────────────────────
// Tailwind class merger — combines classes and resolves conflicts.

describe("cn", () => {
  it("merges multiple class strings", () => {
    expect(cn("text-sm", "font-bold")).toBe("text-sm font-bold");
  });

  it("ignores falsy values (used for conditional classes)", () => {
    // In components you write: cn("base", isActive && "text-primary")
    expect(cn("text-sm", false, null, undefined)).toBe("text-sm");
  });

  it("resolves conflicting Tailwind classes (last wins)", () => {
    // If both text-red-500 and text-blue-500 are passed, last one wins
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
  });
});
