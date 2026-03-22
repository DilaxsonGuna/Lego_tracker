/**
 * Shared Next.js mock factories for component tests.
 *
 * Usage in test files:
 *   vi.mock("next/link", () => nextLinkMock);
 *   vi.mock("next/image", () => nextImageMock);
 *   vi.mock("next/navigation", () => nextNavigationMock);
 */

import { vi } from "vitest";
import React from "react";

/** next/link → renders a plain <a> tag */
export const nextLinkMock = {
  default: ({ children, href }: { children: React.ReactNode; href: string }) =>
    React.createElement("a", { href }, children),
};

/** next/image → renders a plain <img> tag */
export const nextImageMock = {
  default: (props: { src: string; alt: string; [key: string]: unknown }) =>
    React.createElement("img", { src: props.src, alt: props.alt }),
};

/** next/navigation → stubs */
export const nextNavigationMock = {
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
    back: vi.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
};
