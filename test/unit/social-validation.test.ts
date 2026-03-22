// Tests for the cursor validation in lib/queries/social.ts
//
// This protects against PostgREST filter injection — a malicious cursor
// could break out of the SQL predicate if not validated.
// Still a pure function: string in → void or throw.

import { validateCursor } from "@/lib/queries/social";

describe("validateCursor", () => {
  const validCursor = {
    id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    createdAt: "2026-03-22T10:30:00.000Z",
  };

  it("accepts a valid UUID + ISO date cursor", () => {
    // Should not throw
    expect(() => validateCursor(validCursor)).not.toThrow();
  });

  it("accepts dates with timezone offset", () => {
    expect(() =>
      validateCursor({ ...validCursor, createdAt: "2026-03-22T10:30:00+05:30" })
    ).not.toThrow();
  });

  it("rejects an invalid UUID", () => {
    expect(() => validateCursor({ ...validCursor, id: "not-a-uuid" })).toThrow("Invalid cursor id");
  });

  it("rejects a UUID with injection attempt", () => {
    // Attacker tries to break out of the PostgREST filter
    expect(() =>
      validateCursor({
        ...validCursor,
        id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890),or(1.eq.1",
      })
    ).toThrow("Invalid cursor id");
  });

  it("rejects an invalid date format", () => {
    expect(() => validateCursor({ ...validCursor, createdAt: "March 22, 2026" })).toThrow(
      "Invalid cursor createdAt"
    );
  });

  it("rejects a date with injection attempt", () => {
    expect(() =>
      validateCursor({
        ...validCursor,
        createdAt: "2026-01-01T00:00:00Z,id.gt.00000000-0000-0000-0000-000000000000",
      })
    ).toThrow("Invalid cursor createdAt");
  });
});
