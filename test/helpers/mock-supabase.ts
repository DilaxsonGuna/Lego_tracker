/**
 * Shared Supabase mock helpers for unit tests.
 *
 * Instead of building mock chains in every test file, use these helpers.
 * They create fake Supabase clients that return whatever data you pass.
 *
 * Usage:
 *   import { mockSupabaseAuth, mockSupabaseQuery, mockSupabaseMultiTable } from "@test/helpers/mock-supabase";
 */

import { vi } from "vitest";

// ─── Types ──────────────────────────────────────────────────────────

type MockChainTerminal = {
  data?: unknown;
  error?: { message: string; code?: string } | null;
  count?: number | null;
};

// ─── Chain builder ──────────────────────────────────────────────────
// Builds a mock that handles any Supabase method chain.
// Every method returns the next mock in the chain. The last one resolves.

function chainMock(terminal: MockChainTerminal): Record<string, ReturnType<typeof vi.fn>> {
  const resolved = vi.fn().mockResolvedValue(terminal);
  const chain: Record<string, ReturnType<typeof vi.fn>> = {};

  // Every method returns either the chain (for more chaining) or resolves
  const methods = [
    "select",
    "insert",
    "upsert",
    "update",
    "delete",
    "eq",
    "neq",
    "gt",
    "gte",
    "lt",
    "lte",
    "in",
    "is",
    "or",
    "ilike",
    "order",
    "limit",
    "range",
    "single",
    "maybeSingle",
  ];

  for (const method of methods) {
    if (method === "single" || method === "maybeSingle") {
      // Terminal methods — resolve immediately
      chain[method] = resolved;
    } else {
      // Chaining methods — return self for further chaining, but also resolve if awaited
      chain[method] = vi.fn().mockImplementation(() => {
        // Return a proxy that is both thenable (for await) and chainable
        return new Proxy(chain, {
          get(target, prop) {
            if (prop === "then") return resolved().then.bind(resolved());
            return target[prop as string];
          },
        });
      });
    }
  }

  return chain;
}

// ─── Public helpers ─────────────────────────────────────────────────

/**
 * Create a mock Supabase client with auth + a single table query response.
 * Good for functions that call one table.
 */
export function mockSupabaseAuth(options: {
  user?: { id: string } | null;
  queryResult?: MockChainTerminal;
}) {
  const { user = { id: "user-1" }, queryResult = { data: [], error: null } } = options;

  return {
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user } }),
    },
    from: vi.fn().mockReturnValue(chainMock(queryResult)),
  };
}

/**
 * Create a mock Supabase client that returns different data per table.
 * Good for functions that query multiple tables (e.g., user_sets + set_prices).
 */
export function mockSupabaseMultiTable(
  tableMap: Record<string, MockChainTerminal>,
  user: { id: string } | null = { id: "user-1" }
) {
  return {
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user } }),
    },
    from: vi.fn().mockImplementation((table: string) => {
      const terminal = tableMap[table] ?? { data: null, error: null };
      return chainMock(terminal);
    }),
  };
}

/**
 * Create a mock for read-only queries (no auth needed).
 * Good for query functions that take userId as a parameter.
 */
export function mockSupabaseQuery(result: MockChainTerminal) {
  return {
    from: vi.fn().mockReturnValue(chainMock(result)),
  };
}

/**
 * Create a mock for anon client (used by set-detail queries).
 * Returns an object with `from()` that returns the chainable mock.
 */
export function mockSupabaseAnon(result: MockChainTerminal) {
  return {
    from: vi.fn().mockReturnValue(chainMock(result)),
  };
}
