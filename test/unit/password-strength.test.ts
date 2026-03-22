// Tests for components/auth/password-strength.tsx → calculateStrength
//
// Pure function — scoring rules:
//   +1 if length >= 8
//   +1 if length >= 12
//   +1 if has uppercase
//   +1 if has lowercase
//   +1 if has digit
//   +1 if has special char
//   Score: 0-1 = very-weak, 2 = weak, 3 = fair, 4 = good, 5-6 = strong

import { calculateStrength } from "@/components/auth/password-strength";

describe("calculateStrength", () => {
  it("returns very-weak for empty string", () => {
    expect(calculateStrength("")).toBe("very-weak");
  });

  it("returns very-weak for short simple password", () => {
    // "abc" — length < 8 (0 points), has lowercase (+1) = score 1
    expect(calculateStrength("abc")).toBe("very-weak");
  });

  it("returns weak for 8+ chars with one character type", () => {
    // "abcdefgh" — length >= 8 (+1), lowercase (+1) = score 2
    expect(calculateStrength("abcdefgh")).toBe("weak");
  });

  it("returns fair for 8+ chars with two character types", () => {
    // "Abcdefgh" — length >= 8 (+1), uppercase (+1), lowercase (+1) = score 3
    expect(calculateStrength("Abcdefgh")).toBe("fair");
  });

  it("returns good for 8+ chars with three character types", () => {
    // "Abcdef1h" — length >= 8 (+1), uppercase (+1), lowercase (+1), digit (+1) = score 4
    expect(calculateStrength("Abcdef1h")).toBe("good");
  });

  it("returns strong for 8+ chars with all character types", () => {
    // "Abcde1!" — only 7 chars (0 for length), but...
    // Actually: "Abcdef1!" — length >= 8 (+1), upper (+1), lower (+1), digit (+1), special (+1) = score 5
    expect(calculateStrength("Abcdef1!")).toBe("strong");
  });

  it("returns strong for 12+ chars with all types (max score 6)", () => {
    // "Abcdefghij1!" — length >= 8 (+1), length >= 12 (+1), upper, lower, digit, special = 6
    expect(calculateStrength("Abcdefghij1!")).toBe("strong");
  });

  it("returns very-weak for digits only (short)", () => {
    // "123" — only digit (+1) = score 1
    expect(calculateStrength("123")).toBe("very-weak");
  });
});
