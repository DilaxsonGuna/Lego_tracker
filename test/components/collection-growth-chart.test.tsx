import { vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CollectionGrowthChart } from "@/components/analytics/collection-growth-chart";

vi.stubGlobal(
  "ResizeObserver",
  class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
);

const mockData = [
  { month: "2026-01", added: 3, cumulative: 3 },
  { month: "2026-02", added: 5, cumulative: 8 },
  { month: "2026-03", added: 2, cumulative: 10 },
];

describe("CollectionGrowthChart", () => {
  it("shows empty state when no data", () => {
    render(<CollectionGrowthChart data={[]} />);

    expect(screen.getByText("Collection Growth")).toBeInTheDocument();
    expect(screen.getByText(/Add sets to your collection/)).toBeInTheDocument();
  });

  it("renders with Cumulative view by default", () => {
    render(<CollectionGrowthChart data={mockData} />);

    expect(screen.getByText("Collection Growth")).toBeInTheDocument();
    // Cumulative button should be visually active
    expect(screen.getByText("Cumulative")).toBeInTheDocument();
    expect(screen.getByText("Monthly")).toBeInTheDocument();
  });

  it("toggles between Cumulative and Monthly views", async () => {
    const user = userEvent.setup();
    render(<CollectionGrowthChart data={mockData} />);

    // Click Monthly
    await user.click(screen.getByText("Monthly"));

    // Both buttons should still be visible
    expect(screen.getByText("Cumulative")).toBeInTheDocument();
    expect(screen.getByText("Monthly")).toBeInTheDocument();

    // Click back to Cumulative
    await user.click(screen.getByText("Cumulative"));
    expect(screen.getByText("Cumulative")).toBeInTheDocument();
  });
});
