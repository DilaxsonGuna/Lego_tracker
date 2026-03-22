import { render, screen } from "@testing-library/react";
import { NotableSetsRow } from "@/components/analytics/notable-sets-row";

describe("NotableSetsRow", () => {
  it("returns null when sets is empty", () => {
    const { container } = render(<NotableSetsRow sets={[]} />);
    expect(container.innerHTML).toBe("");
  });

  it("renders all notable set cards", () => {
    render(
      <NotableSetsRow
        sets={[
          { setNum: "42151-1", name: "Bugatti", imgUrl: "/bug.jpg", value: 3696, label: "Largest" },
          { setNum: "6080-1", name: "Castle", imgUrl: "/cas.jpg", value: 1984, label: "Oldest" },
          { setNum: "10497-1", name: "Galaxy", imgUrl: "/gal.jpg", value: 2025, label: "Newest" },
        ]}
      />
    );

    expect(screen.getByText("Notable Sets")).toBeInTheDocument();
    expect(screen.getByText("Bugatti")).toBeInTheDocument();
    expect(screen.getByText("Castle")).toBeInTheDocument();
    expect(screen.getByText("Galaxy")).toBeInTheDocument();
  });

  it("formats Largest value as pieces", () => {
    render(
      <NotableSetsRow
        sets={[{ setNum: "1", name: "Big Set", imgUrl: "", value: 5000, label: "Largest" }]}
      />
    );
    expect(screen.getByText("5,000 pcs")).toBeInTheDocument();
  });

  it("formats Most Valuable as currency", () => {
    render(
      <NotableSetsRow
        sets={[{ setNum: "1", name: "Pricey", imgUrl: "", value: 450, label: "Most Valuable" }]}
      />
    );
    expect(screen.getByText("€450")).toBeInTheDocument();
  });

  it("formats Oldest/Newest as plain year", () => {
    render(
      <NotableSetsRow
        sets={[{ setNum: "1", name: "Old", imgUrl: "", value: 1984, label: "Oldest" }]}
      />
    );
    expect(screen.getByText("1984")).toBeInTheDocument();
  });

  it("renders images when imgUrl provided", () => {
    render(
      <NotableSetsRow
        sets={[{ setNum: "1", name: "Test", imgUrl: "/test.jpg", value: 100, label: "Largest" }]}
      />
    );
    expect(screen.getByAltText("Test")).toBeInTheDocument();
  });
});
