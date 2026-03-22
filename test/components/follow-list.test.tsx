import { vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FollowList } from "@/components/social/follow-list";
import type { FollowListUser } from "@/types/social";

// Mock Next.js modules that don't exist in jsdom
vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));
vi.mock("sonner", () => ({ toast: { error: vi.fn(), success: vi.fn() } }));

// ─── Test data ──────────────────────────────────────────────────────

const mockUsers: FollowListUser[] = [
  {
    id: "u1",
    username: "brickfan",
    displayName: "Brick Fan",
    avatarUrl: null,
    isFollowedByCurrentUser: true,
  },
  {
    id: "u2",
    username: "legomaster",
    displayName: "Lego Master",
    avatarUrl: null,
    isFollowedByCurrentUser: false,
  },
  {
    id: "u3",
    username: "starwars_collector",
    displayName: null,
    avatarUrl: null,
    isFollowedByCurrentUser: false,
  },
];

// 6 users to trigger search bar (threshold is >5)
const sixUsers: FollowListUser[] = Array.from({ length: 6 }, (_, i) => ({
  id: `u${i}`,
  username: `user${i}`,
  displayName: `User ${i}`,
  avatarUrl: null,
  isFollowedByCurrentUser: false,
}));

const defaultProps = {
  initialUsers: mockUsers,
  initialCursor: null,
  initialHasMore: false,
  currentUserId: "current-user",
  toggleFollowAction: vi.fn().mockResolvedValue({ success: true }),
  loadMoreAction: vi.fn().mockResolvedValue({ users: [], nextCursor: null, hasMore: false }),
};

// ─── Tests ──────────────────────────────────────────────────────────

describe("FollowList", () => {
  it("renders all users", () => {
    render(<FollowList {...defaultProps} />);

    expect(screen.getByText("@brickfan")).toBeInTheDocument();
    expect(screen.getByText("@legomaster")).toBeInTheDocument();
    expect(screen.getByText("@starwars_collector")).toBeInTheDocument();
  });

  it("shows display name when available", () => {
    render(<FollowList {...defaultProps} />);

    expect(screen.getByText("Brick Fan")).toBeInTheDocument();
    expect(screen.getByText("Lego Master")).toBeInTheDocument();
  });

  it("shows empty state with custom message", () => {
    render(<FollowList {...defaultProps} initialUsers={[]} emptyMessage="No followers yet." />);

    expect(screen.getByText("No followers yet.")).toBeInTheDocument();
    expect(screen.getByText("Discover collectors")).toBeInTheDocument();
  });

  it("shows 'Follows you' badge for users who follow back", () => {
    render(<FollowList {...defaultProps} />);

    // brickfan has isFollowedByCurrentUser: true
    expect(screen.getByText("Follows you")).toBeInTheDocument();
  });

  it("uses custom badge label", () => {
    render(<FollowList {...defaultProps} badgeLabel="Mutual" />);

    expect(screen.getByText("Mutual")).toBeInTheDocument();
  });

  it("does NOT show badge for own profile", () => {
    const usersWithSelf: FollowListUser[] = [
      {
        id: "current-user",
        username: "me",
        displayName: null,
        avatarUrl: null,
        isFollowedByCurrentUser: true,
      },
    ];

    render(<FollowList {...defaultProps} initialUsers={usersWithSelf} />);

    // Badge should not appear for own profile
    expect(screen.queryByText("Follows you")).not.toBeInTheDocument();
  });

  it("shows Follow/Unfollow buttons for other users when logged in", () => {
    render(<FollowList {...defaultProps} />);

    // brickfan is followed → should show "Unfollow"
    expect(screen.getByText("Unfollow")).toBeInTheDocument();
    // legomaster and starwars_collector are not followed → should show "Follow"
    expect(screen.getAllByText("Follow")).toHaveLength(2);
  });

  it("hides Follow/Unfollow buttons when not logged in", () => {
    render(<FollowList {...defaultProps} currentUserId={null} />);

    expect(screen.queryByText("Follow")).not.toBeInTheDocument();
    expect(screen.queryByText("Unfollow")).not.toBeInTheDocument();
  });

  it("shows search bar when more than 5 users", () => {
    render(<FollowList {...defaultProps} initialUsers={sixUsers} />);

    expect(screen.getByLabelText("Search users")).toBeInTheDocument();
  });

  it("hides search bar when 5 or fewer users", () => {
    render(<FollowList {...defaultProps} />);

    expect(screen.queryByLabelText("Search users")).not.toBeInTheDocument();
  });

  it("filters users by search query", async () => {
    const user = userEvent.setup();
    render(<FollowList {...defaultProps} initialUsers={sixUsers} />);

    await user.type(screen.getByLabelText("Search users"), "user0");

    expect(screen.getByText("@user0")).toBeInTheDocument();
    expect(screen.queryByText("@user1")).not.toBeInTheDocument();
  });

  it("shows no-results message when search matches nothing", async () => {
    const user = userEvent.setup();
    render(<FollowList {...defaultProps} initialUsers={sixUsers} />);

    await user.type(screen.getByLabelText("Search users"), "nonexistent");

    expect(screen.getByText(/No users matching/)).toBeInTheDocument();
  });

  it("shows Load more button when hasMore is true", () => {
    render(<FollowList {...defaultProps} initialHasMore={true} />);

    expect(screen.getByText("Load more")).toBeInTheDocument();
  });

  it("hides Load more button when hasMore is false", () => {
    render(<FollowList {...defaultProps} initialHasMore={false} />);

    expect(screen.queryByText("Load more")).not.toBeInTheDocument();
  });
});
