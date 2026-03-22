import { vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeDistributionChart } from "@/components/analytics/theme-distribution-chart";

// Recharts uses ResizeObserver which doesn't exist in jsdom
vi.stubGlobal(
  "ResizeObserver",
  class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
);

describe("ThemeDistributionChart", () => {
  it("shows empty state when no data", () => {
    render(<ThemeDistributionChart data={[]} />);

    expect(screen.getByText("Theme Distribution")).toBeInTheDocument();
    expect(screen.getByText(/Add sets to your collection/)).toBeInTheDocument();
  });

  it("renders chart with data", () => {
    render(
      <ThemeDistributionChart
        data={[
          { theme: "Star Wars", count: 10 },
          { theme: "Technic", count: 5 },
        ]}
      />
    );

    expect(screen.getByText("Theme Distribution")).toBeInTheDocument();
    // Should NOT show empty state
    expect(screen.queryByText(/Add sets to your collection/)).not.toBeInTheDocument();
  });

  it("shows 'Show all' button when more than 8 themes", async () => {
    const data = Array.from({ length: 12 }, (_, i) => ({
      theme: `Theme ${i}`,
      count: 12 - i,
    }));

    render(<ThemeDistributionChart data={data} />);

    expect(screen.getByText("Show all 12 themes")).toBeInTheDocument();
  });

  it("hides 'Show all' button when 8 or fewer themes", () => {
    const data = Array.from({ length: 5 }, (_, i) => ({
      theme: `Theme ${i}`,
      count: 5 - i,
    }));

    render(<ThemeDistributionChart data={data} />);

    expect(screen.queryByText(/Show all/)).not.toBeInTheDocument();
  });

  it("toggles between show all and show less", async () => {
    const user = userEvent.setup();
    const data = Array.from({ length: 12 }, (_, i) => ({
      theme: `Theme ${i}`,
      count: 12 - i,
    }));

    render(<ThemeDistributionChart data={data} />);

    await user.click(screen.getByText("Show all 12 themes"));
    expect(screen.getByText("Show less")).toBeInTheDocument();

    await user.click(screen.getByText("Show less"));
    expect(screen.getByText("Show all 12 themes")).toBeInTheDocument();
  });
});
