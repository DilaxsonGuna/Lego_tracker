import { vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { VaultCard } from "@/components/vault/vault-card";

vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));
vi.mock("next/image", () => ({
  default: (props: { alt: string }) => <img alt={props.alt} />,
}));

const mockSet = {
  setNum: "42151-1",
  name: "Bugatti Chiron",
  year: 2023,
  numParts: 3696,
  setImgUrl: "/bugatti.jpg",
  themeName: "Technic",
  collectionType: "collection" as const,
  isFavorite: false,
  retailPrice: 449.99,
};

describe("VaultCard", () => {
  it("renders set name and number", () => {
    render(<VaultCard set={mockSet} />);
    expect(screen.getByText("Bugatti Chiron")).toBeInTheDocument();
    expect(screen.getByText("42151-1")).toBeInTheDocument();
  });

  it("shows year, parts, and price", () => {
    render(<VaultCard set={mockSet} />);
    expect(screen.getByText(/2023/)).toBeInTheDocument();
    expect(screen.getByText(/3,696 pcs/)).toBeInTheDocument();
    expect(screen.getByText("€449.99")).toBeInTheDocument();
  });

  it("hides price when null", () => {
    render(<VaultCard set={{ ...mockSet, retailPrice: null }} />);
    expect(screen.queryByText(/€/)).not.toBeInTheDocument();
  });

  it("shows checkbox when not readonly", () => {
    const onToggle = vi.fn();
    render(<VaultCard set={mockSet} onToggleSelect={onToggle} />);
    expect(screen.getByRole("checkbox")).toBeInTheDocument();
  });

  it("hides checkbox in readonly mode", () => {
    render(<VaultCard set={mockSet} readonly={true} onToggleSelect={vi.fn()} />);
    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
  });

  it("shows favorite button when showFavorite is true and not readonly", () => {
    render(<VaultCard set={mockSet} showFavorite={true} onToggleFavorite={vi.fn()} />);
    expect(screen.getByLabelText("Add to favorites")).toBeInTheDocument();
  });

  it("hides favorite button when showFavorite is false", () => {
    render(<VaultCard set={mockSet} showFavorite={false} onToggleFavorite={vi.fn()} />);
    expect(screen.queryByLabelText(/favorites/)).not.toBeInTheDocument();
  });

  it("hides favorite button in readonly mode", () => {
    render(
      <VaultCard set={mockSet} showFavorite={true} readonly={true} onToggleFavorite={vi.fn()} />
    );
    expect(screen.queryByLabelText(/favorites/)).not.toBeInTheDocument();
  });

  it("calls onToggleFavorite when heart is clicked", async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    render(<VaultCard set={mockSet} showFavorite={true} onToggleFavorite={onToggle} />);

    await user.click(screen.getByLabelText("Add to favorites"));
    expect(onToggle).toHaveBeenCalledWith("42151-1");
  });

  it("shows 'Remove from favorites' label when isFavorite is true", () => {
    render(
      <VaultCard set={mockSet} isFavorite={true} showFavorite={true} onToggleFavorite={vi.fn()} />
    );
    expect(screen.getByLabelText("Remove from favorites")).toBeInTheDocument();
  });
});
