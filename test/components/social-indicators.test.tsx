import { vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MutualFollowers } from "@/components/social/mutual-followers";
import { CollectionOverlap } from "@/components/social/collection-overlap";
import { SocialProofBadge } from "@/components/social/social-proof-badge";

vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

// ─── MutualFollowers ────────────────────────────────────────────────

describe("MutualFollowers", () => {
  it("returns null when totalCount is 0", () => {
    const { container } = render(<MutualFollowers users={[]} totalCount={0} targetUserId="t1" />);
    expect(container.innerHTML).toBe("");
  });

  it("shows usernames when users provided", () => {
    render(
      <MutualFollowers
        users={[
          { id: "u1", username: "alice", avatarUrl: null },
          { id: "u2", username: "bob", avatarUrl: null },
        ]}
        totalCount={2}
        targetUserId="t1"
      />
    );
    expect(screen.getByText("alice, bob")).toBeInTheDocument();
    expect(screen.getByText(/you follow/)).toBeInTheDocument();
  });

  it("shows 'and N others' when totalCount exceeds displayed users", () => {
    render(
      <MutualFollowers
        users={[
          { id: "u1", username: "alice", avatarUrl: null },
          { id: "u2", username: "bob", avatarUrl: null },
          { id: "u3", username: "charlie", avatarUrl: null },
        ]}
        totalCount={7}
        targetUserId="t1"
      />
    );
    expect(screen.getByText("4 others")).toBeInTheDocument();
  });

  it("uses singular 'other' when remaining is 1", () => {
    render(
      <MutualFollowers
        users={[{ id: "u1", username: "alice", avatarUrl: null }]}
        totalCount={2}
        targetUserId="t1"
      />
    );
    expect(screen.getByText("1 other")).toBeInTheDocument();
  });

  it("links to the target user's followers page", () => {
    render(
      <MutualFollowers
        users={[{ id: "u1", username: "alice", avatarUrl: null }]}
        totalCount={1}
        targetUserId="target-123"
      />
    );
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/u/target-123/followers");
  });
});

// ─── CollectionOverlap ──────────────────────────────────────────────

describe("CollectionOverlap", () => {
  it("returns null when sharedCount is 0", () => {
    const { container } = render(<CollectionOverlap sharedCount={0} similarity={0} />);
    expect(container.innerHTML).toBe("");
  });

  it("shows singular 'set' for count of 1", () => {
    render(<CollectionOverlap sharedCount={1} similarity={0.1} />);
    expect(screen.getByText("1 set")).toBeInTheDocument();
    expect(screen.getByText(/in common/)).toBeInTheDocument();
  });

  it("shows plural 'sets' for count > 1", () => {
    render(<CollectionOverlap sharedCount={5} similarity={0.25} />);
    expect(screen.getByText("5 sets")).toBeInTheDocument();
  });

  it("shows percentage match", () => {
    render(<CollectionOverlap sharedCount={3} similarity={0.456} />);
    expect(screen.getByText("(46% match)")).toBeInTheDocument();
  });
});

// ─── SocialProofBadge ───────────────────────────────────────────────

describe("SocialProofBadge", () => {
  it("returns null when totalCount is 0", () => {
    const { container } = render(<SocialProofBadge users={[]} totalCount={0} />);
    expect(container.innerHTML).toBe("");
  });

  it("shows usernames of followers who own the set", () => {
    render(
      <SocialProofBadge users={[{ username: "alice" }, { username: "bob" }]} totalCount={2} />
    );
    expect(screen.getByText("alice, bob")).toBeInTheDocument();
    expect(screen.getByText(/you follow own this set/)).toBeInTheDocument();
  });

  it("shows 'and N others' when totalCount exceeds display limit", () => {
    render(
      <SocialProofBadge users={[{ username: "alice" }, { username: "bob" }]} totalCount={5} />
    );
    expect(screen.getByText("3 others")).toBeInTheDocument();
  });
});
