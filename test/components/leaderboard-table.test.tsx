import { vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { LeaderboardTable } from "@/components/leaderboard/leaderboard-table";
import type { LeaderboardEntry } from "@/types/leaderboard";

vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

const makeEntry = (overrides: Partial<LeaderboardEntry> = {}): LeaderboardEntry => ({
  position: 1,
  userId: "u1",
  username: "brickfan",
  avatarUrl: "",
  avatarColor: "#ffd000",
  brickScore: 5000,
  setsCount: 20,
  piecesCount: 4000,
  rank: { id: "new-recruit", name: "New Recruit", icon: "🧱", minPieces: 0, minSets: 1 },
  ...overrides,
});

describe("LeaderboardTable", () => {
  it("renders entries with username and score", () => {
    render(
      <LeaderboardTable
        entries={[makeEntry({ username: "topbuilder", brickScore: 9999 })]}
        currentUserId={null}
      />
    );

    expect(screen.getByText("@topbuilder")).toBeInTheDocument();
    expect(screen.getByText("9,999")).toBeInTheDocument();
  });

  it("shows gold emoji for position 1", () => {
    render(<LeaderboardTable entries={[makeEntry({ position: 1 })]} currentUserId={null} />);
    expect(screen.getByText("🥇")).toBeInTheDocument();
  });

  it("shows silver emoji for position 2", () => {
    render(<LeaderboardTable entries={[makeEntry({ position: 2 })]} currentUserId={null} />);
    expect(screen.getByText("🥈")).toBeInTheDocument();
  });

  it("shows bronze emoji for position 3", () => {
    render(<LeaderboardTable entries={[makeEntry({ position: 3 })]} currentUserId={null} />);
    expect(screen.getByText("🥉")).toBeInTheDocument();
  });

  it("shows number for position 4+", () => {
    render(<LeaderboardTable entries={[makeEntry({ position: 42 })]} currentUserId={null} />);
    expect(screen.getByText("42")).toBeInTheDocument();
  });

  it("shows rank badge when rank exists", () => {
    render(<LeaderboardTable entries={[makeEntry()]} currentUserId={null} />);
    expect(screen.getByText(/New Recruit/)).toBeInTheDocument();
  });

  it("links each row to user profile", () => {
    render(<LeaderboardTable entries={[makeEntry({ userId: "user-42" })]} currentUserId={null} />);
    expect(screen.getByRole("link")).toHaveAttribute("href", "/u/user-42");
  });
});
