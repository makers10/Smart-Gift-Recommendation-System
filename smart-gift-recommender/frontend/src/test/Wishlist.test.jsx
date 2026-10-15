import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Wishlist from "../components/Wishlist";

describe("Wishlist Component", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("shows loading skeletons on mount", () => {
    global.fetch = vi.fn().mockImplementation(() => new Promise(() => {}));

    render(<Wishlist />);
    expect(screen.getByRole("heading", { name: /my wishlist/i })).toBeInTheDocument();
    expect(screen.getAllByRole("status", { name: /loading wishlist item…/i })).toHaveLength(4);
  });

  it("renders empty state when no items are returned from API", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [],
    });

    render(<Wishlist />);

    expect(await screen.findByRole("heading", { name: /your wishlist is empty/i })).toBeInTheDocument();
    expect(screen.getByText(/when you find a gift you love, save it here for later\./i)).toBeInTheDocument();
  });

  it("renders wishlist items with details, buy link, and item count", async () => {
    const mockItems = [
      {
        id: 1,
        gift_name: "Vintage Fountain Pen",
        relationship: "father",
        occasion: "retirement",
        budget: "high",
      },
      {
        id: 2,
        gift_name: "Scented Candle Set",
        relationship: "mom",
        occasion: "mothers_day",
        budget: "medium",
      },
    ];

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockItems,
    });

    render(<Wishlist />);

    expect(await screen.findByText("Vintage Fountain Pen")).toBeInTheDocument();
    expect(screen.getByText("Scented Candle Set")).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("2 saved gifts");

    const buyLinks = screen.getAllByRole("link", { name: /^buy .* on amazon india$/i });
    expect(buyLinks).toHaveLength(2);
    expect(buyLinks[0].href).toContain("Vintage%20Fountain%20Pen");
  });

  it("removes an item when the delete button is clicked", async () => {
    const mockItems = [
      {
        id: 101,
        gift_name: "Personalized Mug",
        relationship: "friend",
        occasion: "birthday",
        budget: "low",
      },
    ];

    const mockFetch = vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockItems,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ status: "deleted" }),
      });
    global.fetch = mockFetch;

    render(<Wishlist />);

    expect(await screen.findByText("Personalized Mug")).toBeInTheDocument();

    const removeBtn = screen.getByRole("button", { name: /remove personalized mug from wishlist/i });
    fireEvent.click(removeBtn);

    await waitFor(() => {
      expect(screen.queryByText("Personalized Mug")).not.toBeInTheDocument();
    });

    // After removal, should show empty state
    expect(screen.getByRole("heading", { name: /your wishlist is empty/i })).toBeInTheDocument();

    expect(mockFetch).toHaveBeenLastCalledWith(
      expect.stringContaining("/api/wishlist/101"),
      expect.objectContaining({ method: "DELETE" })
    );
  });

  it("displays an error alert when the wishlist API fails and allows retry", async () => {
    const mockFetch = vi.fn().mockRejectedValueOnce(new Error("Network failure"));
    global.fetch = mockFetch;

    render(<Wishlist />);

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(/unable to load your wishlist/i);

    const retryBtn = screen.getByRole("button", { name: /retry/i });
    expect(retryBtn).toBeInTheDocument();

    // Now mock success on retry
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        {
          id: 5,
          gift_name: "Photo Album",
          relationship: "sister",
          occasion: "birthday",
          budget: "low",
        },
      ],
    });

    fireEvent.click(retryBtn);

    expect(await screen.findByText("Photo Album")).toBeInTheDocument();
  });
});
