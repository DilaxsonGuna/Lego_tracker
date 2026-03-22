import { vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProfileHero } from "@/components/profile/profile-hero";

vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

const baseUser = {
  id: "user-1",
  username: "brickfan",
  fullName: "Brick Fan",
  avatarUrl: "",
  bio: "I love LEGO",
  isVerified: false,
  role: "Collector",
  isOnline: false,
  followers: 0,
  following: 0,
  friends: 0,
  interests: [],
};

describe("ProfileHero", () => {
  it("renders username", () => {
    render(<ProfileHero user={baseUser} />);
    expect(screen.getByText("@brickfan")).toBeInTheDocument();
  });

  it("formats follower counts with k suffix for 1000+", () => {
    render(<ProfileHero user={{ ...baseUser, followers: 1500, following: 250, friends: 42 }} />);

    expect(screen.getByText("1.5k")).toBeInTheDocument(); // 1500
    expect(screen.getByText("250")).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();
  });

  it("links followers and following counts to list pages", () => {
    render(<ProfileHero user={{ ...baseUser, followers: 10, following: 5 }} />);

    const followersLink = screen.getByText("10").closest("a");
    const followingLink = screen.getByText("5").closest("a");

    expect(followersLink).toHaveAttribute("href", "/u/user-1/followers");
    expect(followingLink).toHaveAttribute("href", "/u/user-1/following");
  });

  it("shows share buttons when isOwnProfile", () => {
    render(<ProfileHero user={baseUser} isOwnProfile={true} />);
    expect(screen.getByText("Share Collection Card")).toBeInTheDocument();
  });

  it("hides share buttons when not own profile", () => {
    render(<ProfileHero user={baseUser} isOwnProfile={false} />);
    expect(screen.queryByText("Share Collection Card")).not.toBeInTheDocument();
  });

  it("shows rank when stats provided", () => {
    const stats = {
      setsCount: 5,
      piecesCount: 1000,
      brickScore: 1500,
      rank: { id: "new-recruit", name: "New Recruit", icon: "🧱", minPieces: 0, minSets: 1 },
      rankProgress: {
        currentRank: null,
        nextRank: null,
        piecesToNextRank: 0,
        setsToNextRank: 0,
        overallProgress: 50,
      },
      rankNumber: 10,
      vaultValue: "Coming Soon",
    };

    render(<ProfileHero user={baseUser} stats={stats} />);
    expect(screen.getByText(/New Recruit/)).toBeInTheDocument();
  });
});
