import { vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { SetDetailActions } from "@/components/set-detail/set-detail-actions";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));
vi.mock("sonner", () => ({ toast: { error: vi.fn(), success: vi.fn() } }));
vi.mock("@/app/(app)/set/[setNum]/actions", () => ({
  addToCollection: vi.fn().mockResolvedValue({ success: true }),
  addToWishlist: vi.fn().mockResolvedValue({ success: true }),
  removeFromVault: vi.fn().mockResolvedValue({ success: true }),
  toggleFavorite: vi.fn().mockResolvedValue({ success: true }),
}));

describe("SetDetailActions", () => {
  it("shows login prompt when not authenticated", () => {
    render(
      <SetDetailActions
        setNum="42151-1"
        initialStatus={{ inCollection: false, inWishlist: false, isFavorite: false }}
        isAuthenticated={false}
      />
    );
    expect(screen.getByText("Log in to add to your vault")).toBeInTheDocument();
  });

  it("shows Add to Collection and Add to Wishlist when not in vault", () => {
    render(
      <SetDetailActions
        setNum="42151-1"
        initialStatus={{ inCollection: false, inWishlist: false, isFavorite: false }}
        isAuthenticated={true}
      />
    );
    expect(screen.getByText("Add to Collection")).toBeInTheDocument();
    expect(screen.getByText("Add to Wishlist")).toBeInTheDocument();
  });

  it("shows 'In Your Collection' when set is in collection", () => {
    render(
      <SetDetailActions
        setNum="42151-1"
        initialStatus={{ inCollection: true, inWishlist: false, isFavorite: false }}
        isAuthenticated={true}
      />
    );
    expect(screen.getByText("In Your Collection")).toBeInTheDocument();
    // Should NOT show Add to Collection or Wishlist
    expect(screen.queryByText("Add to Collection")).not.toBeInTheDocument();
    expect(screen.queryByText("Add to Wishlist")).not.toBeInTheDocument();
  });

  it("shows 'In Your Wishlist' + 'Move to Collection' when in wishlist", () => {
    render(
      <SetDetailActions
        setNum="42151-1"
        initialStatus={{ inCollection: false, inWishlist: true, isFavorite: false }}
        isAuthenticated={true}
      />
    );
    expect(screen.getByText("In Your Wishlist")).toBeInTheDocument();
    expect(screen.getByText("Move to Collection")).toBeInTheDocument();
  });
});
