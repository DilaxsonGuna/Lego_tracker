import { vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { VaultBulkActions } from "@/components/vault/vault-bulk-actions";

const defaultProps = {
  selectedCount: 0,
  selectedSetNums: [],
  activeTab: "collection" as const,
  onRemove: vi.fn(),
  onMoveToCollection: vi.fn(),
  isProcessing: false,
};

describe("VaultBulkActions", () => {
  it("renders nothing when no items selected", () => {
    const { container } = render(<VaultBulkActions {...defaultProps} />);
    expect(container.innerHTML).toBe("");
  });

  it("shows selection count with correct pluralization", () => {
    render(<VaultBulkActions {...defaultProps} selectedCount={1} />);
    expect(screen.getByText("1 Item Selected")).toBeInTheDocument();

    render(<VaultBulkActions {...defaultProps} selectedCount={3} />);
    expect(screen.getByText("3 Items Selected")).toBeInTheDocument();
  });

  it("shows Remove button for collection tab", () => {
    render(<VaultBulkActions {...defaultProps} selectedCount={2} activeTab="collection" />);
    expect(screen.getByText("Remove")).toBeInTheDocument();
  });

  it("shows 'Move to Collection' button only on wishlist tab", () => {
    const { rerender } = render(
      <VaultBulkActions {...defaultProps} selectedCount={2} activeTab="collection" />
    );
    expect(screen.queryByText("Move to Collection")).not.toBeInTheDocument();

    rerender(<VaultBulkActions {...defaultProps} selectedCount={2} activeTab="wishlist" />);
    expect(screen.getByText("Move to Collection")).toBeInTheDocument();
  });
});
