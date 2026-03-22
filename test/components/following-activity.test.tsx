import { vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { formatTimeAgo, FollowingActivity } from "@/components/home/following-activity";

vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));
vi.mock("next/image", () => ({
  default: (props: { src: string; alt: string }) => <img src={props.src} alt={props.alt} />,
}));

// ─── formatTimeAgo (pure function) ──────────────────────────────────

describe("formatTimeAgo", () => {
  it("returns 'just now' for < 1 minute ago", () => {
    const now = new Date().toISOString();
    expect(formatTimeAgo(now)).toBe("just now");
  });

  it("returns minutes for < 1 hour", () => {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    expect(formatTimeAgo(fiveMinutesAgo)).toBe("5m ago");
  });

  it("returns hours for < 1 day", () => {
    const threeHoursAgo = new Date(Date.now() - 3 * 3600 * 1000).toISOString();
    expect(formatTimeAgo(threeHoursAgo)).toBe("3h ago");
  });

  it("returns days for < 1 week", () => {
    const twoDaysAgo = new Date(Date.now() - 2 * 86400 * 1000).toISOString();
    expect(formatTimeAgo(twoDaysAgo)).toBe("2d ago");
  });

  it("returns formatted date for >= 1 week", () => {
    const twoWeeksAgo = new Date(Date.now() - 14 * 86400 * 1000).toISOString();
    const result = formatTimeAgo(twoWeeksAgo);
    // Should be a locale date string, not "Xd ago"
    expect(result).not.toContain("ago");
  });
});

// ─── FollowingActivity component ────────────────────────────────────

describe("FollowingActivity", () => {
  it("returns null when items is empty", () => {
    const { container } = render(<FollowingActivity items={[]} />);
    expect(container.innerHTML).toBe("");
  });

  it("renders activity items with username and set name", () => {
    render(
      <FollowingActivity
        items={[
          {
            id: "a1",
            userId: "u1",
            username: "brickfan",
            avatarUrl: "",
            setNum: "42151-1",
            setName: "Bugatti Chiron",
            setImgUrl: "/bugatti.jpg",
            addedAt: new Date().toISOString(),
          },
        ]}
      />
    );

    expect(screen.getByText("@brickfan")).toBeInTheDocument();
    expect(screen.getByText("Bugatti Chiron")).toBeInTheDocument();
    expect(screen.getByText("Following Activity")).toBeInTheDocument();
  });
});
