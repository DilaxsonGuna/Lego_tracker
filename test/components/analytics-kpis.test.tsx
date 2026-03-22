import { render, screen } from "@testing-library/react";
import { AnalyticsKPIs } from "@/components/analytics/analytics-kpis";
import type { CollectionKPIs } from "@/lib/queries/analytics";

const fullKPIs: CollectionKPIs = {
  totalSets: 42,
  totalPieces: 15000,
  totalValue: 3500,
  avgPricePerPiece: 0.23,
  setsAddedThisMonth: 3,
};

const emptyKPIs: CollectionKPIs = {
  totalSets: 0,
  totalPieces: 0,
  totalValue: null,
  avgPricePerPiece: null,
  setsAddedThisMonth: 0,
};

describe("AnalyticsKPIs", () => {
  it("renders all 4 KPI cards", () => {
    render(<AnalyticsKPIs kpis={fullKPIs} />);

    expect(screen.getByText("Total Sets")).toBeInTheDocument();
    expect(screen.getByText("Total Pieces")).toBeInTheDocument();
    expect(screen.getByText("Collection Value")).toBeInTheDocument();
    expect(screen.getByText("Avg Price/Piece")).toBeInTheDocument();
  });

  it("shows formatted values", () => {
    render(<AnalyticsKPIs kpis={fullKPIs} />);

    expect(screen.getByText("42")).toBeInTheDocument();
    expect(screen.getByText("15,000")).toBeInTheDocument();
    expect(screen.getByText("€3,500")).toBeInTheDocument();
    expect(screen.getByText("€0.23")).toBeInTheDocument();
  });

  it("shows '+N this month' badge when sets added", () => {
    render(<AnalyticsKPIs kpis={fullKPIs} />);

    expect(screen.getByText("+3 this month")).toBeInTheDocument();
  });

  it("hides badge when no sets added this month", () => {
    render(<AnalyticsKPIs kpis={{ ...fullKPIs, setsAddedThisMonth: 0 }} />);

    expect(screen.queryByText(/this month/)).not.toBeInTheDocument();
  });

  it("shows dash for null value and avgPricePerPiece", () => {
    render(<AnalyticsKPIs kpis={emptyKPIs} />);

    // Should show "—" for both null values
    const dashes = screen.getAllByText("—");
    expect(dashes).toHaveLength(2);
  });
});
