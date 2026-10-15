import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import GiftResults from "../components/GiftResults";

describe("GiftResults Component", () => {
  const sampleResult = {
    relationship: "sister",
    occasion: "birthday",
    budget: "medium",
    gender: "female",
    recommendations: [
      { name: "Handcrafted Jewelry Box", score: 8 },
      { name: "Aromatherapy Diffuser", score: 4 },
      { name: "Customized Photo Frame", score: 0 },
    ],
  };

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders gift recommendations, top pick badge, and meta header", () => {
    render(<GiftResults result={sampleResult} onReset={vi.fn()} />);

    expect(screen.getByRole("heading", { name: /gift ideas for you/i })).toBeInTheDocument();
    expect(screen.getByText("Handcrafted Jewelry Box")).toBeInTheDocument();
    expect(screen.getByText("Aromatherapy Diffuser")).toBeInTheDocument();
    expect(screen.getByText("Customized Photo Frame")).toBeInTheDocument();

    // Top Pick badge on the first item
    expect(screen.getByText(/top pick/i)).toBeInTheDocument();

    // Score badges
    expect(screen.getByText("+8")).toBeInTheDocument();
    expect(screen.getByText("+4")).toBeInTheDocument();
    expect(screen.getByText("0")).toBeInTheDocument();

    // Occasion and relationship in subtitle
    expect(screen.getByText("Sister")).toBeInTheDocument();
    expect(screen.getByText("Birthday")).toBeInTheDocument();
  });

  it("renders Amazon buy links pointing to Amazon India with proper attributes", () => {
    render(<GiftResults result={sampleResult} onReset={vi.fn()} />);

    const buyLinks = screen.getAllByRole("link", { name: /buy .* on amazon india/i });
    expect(buyLinks).toHaveLength(3);

    expect(buyLinks[0]).toHaveAttribute("target", "_blank");
    expect(buyLinks[0]).toHaveAttribute("rel", "noreferrer");
    expect(buyLinks[0].href).toContain("https://www.amazon.in/s?k=Handcrafted%20Jewelry%20Box");
  });

  it("handles voting (Love it) optimistically and calls POST /api/vote", async () => {
    const mockFetch = vi.fn().mockResolvedValue({ ok: true });
    global.fetch = mockFetch;

    render(<GiftResults result={sampleResult} onReset={vi.fn()} />);

    const loveButtons = screen.getAllByRole("button", { name: /^recommend /i });
    expect(loveButtons.length).toBeGreaterThan(0);

    fireEvent.click(loveButtons[0]);

    // Score increases to +9 after API call
    await waitFor(() => {
      expect(screen.getByText("+9")).toBeInTheDocument();
    });

    // Feedback message displayed
    expect(await screen.findByText(/thanks for the rating!/i)).toBeInTheDocument();

    // Button becomes disabled to prevent double voting
    expect(loveButtons[0]).toBeDisabled();

    // API verified
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/vote"),
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          gift_name: "Handcrafted Jewelry Box",
          relationship: "sister",
          occasion: "birthday",
          vote: 1,
        }),
      })
    );
  });

  it("handles voting (Not for me) optimistically and calls POST /api/vote", async () => {
    const mockFetch = vi.fn().mockResolvedValue({ ok: true });
    global.fetch = mockFetch;

    render(<GiftResults result={sampleResult} onReset={vi.fn()} />);

    const nopeButtons = screen.getAllByRole("button", { name: /^not for me: /i });
    fireEvent.click(nopeButtons[1]); // vote on Aromatherapy Diffuser (score 4 -> 3)

    await waitFor(() => {
      expect(screen.getByText("+3")).toBeInTheDocument();
    });

    expect(await screen.findByText(/noted, we'll improve\./i)).toBeInTheDocument();
    expect(nopeButtons[1]).toBeDisabled();
  });

  it("handles Wishlist save and calls POST /api/wishlist", async () => {
    const mockFetch = vi.fn().mockResolvedValue({ ok: true });
    global.fetch = mockFetch;

    render(<GiftResults result={sampleResult} onReset={vi.fn()} />);

    const saveButtons = screen.getAllByRole("button", { name: /^save .* to wishlist$/i });
    fireEvent.click(saveButtons[0]);

    // Button updates to "Saved"
    expect(await screen.findByRole("button", { name: /handcrafted jewelry box saved to wishlist/i })).toBeInTheDocument();

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/wishlist"),
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          gift_name: "Handcrafted Jewelry Box",
          relationship: "sister",
          occasion: "birthday",
          budget: "medium",
        }),
      })
    );
  });

  it("calls onReset when 'Search Again' button is clicked", () => {
    const onReset = vi.fn();
    render(<GiftResults result={sampleResult} onReset={onReset} />);

    const resetBtn = screen.getByRole("button", { name: /start a new gift search/i });
    fireEvent.click(resetBtn);

    expect(onReset).toHaveBeenCalledTimes(1);
  });
});
