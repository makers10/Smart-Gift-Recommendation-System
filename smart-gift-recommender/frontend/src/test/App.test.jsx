import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, within, waitFor } from "@testing-library/react";
import App from "../App";

describe("App Root SPA", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [],
    });
  });

  it("renders default home view with header, hero, gift form, and footer", () => {
    render(<App />);

    // Brand title in header
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getAllByText("Gift with Love").length).toBeGreaterThan(0);

    // Hero section
    expect(screen.getByRole("heading", { name: /the right gift, for every heart\./i })).toBeInTheDocument();

    // GiftForm
    expect(screen.getByRole("heading", { name: /find the perfect gift/i })).toBeInTheDocument();

    // Footer
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  it("navigates across all five primary sections and updates screen reader live region", async () => {
    render(<App />);

    const liveRegion = screen.getByRole("status", { hidden: true });
    expect(liveRegion).toHaveTextContent("Find a Gift");

    const mainNav = screen.getByRole("navigation", { name: /main navigation/i });

    // 1. Navigate to Custom Made
    const customNavBtn = within(mainNav).getByRole("button", { name: /^custom made/i });
    fireEvent.click(customNavBtn);
    expect(liveRegion).toHaveTextContent("Custom Made");
    expect(screen.getByText(/custom made corner/i)).toBeInTheDocument();

    // 2. Navigate to History
    const historyNavBtn = within(mainNav).getByRole("button", { name: /^history/i });
    fireEvent.click(historyNavBtn);
    expect(liveRegion).toHaveTextContent("Search History");
    expect(await screen.findByRole("heading", { name: /search history/i })).toBeInTheDocument();

    // 3. Navigate to Wishlist
    const wishlistNavBtn = within(mainNav).getByRole("button", { name: /^wishlist/i });
    fireEvent.click(wishlistNavBtn);
    expect(liveRegion).toHaveTextContent("Wishlist");
    expect(await screen.findByRole("heading", { name: /my wishlist/i })).toBeInTheDocument();

    // 4. Navigate to Dashboard (lazy-loaded)
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        total_searches: 100,
        unique_users: 25,
        festival_searches: 30,
        non_festival_searches: 70,
        top_occasions: [],
        top_relationships: [],
        gender_breakdown: [],
        daily_searches: [],
        top_gifts: [],
      }),
    });

    const dashboardNavBtn = within(mainNav).getByRole("button", { name: /^dashboard/i });
    fireEvent.click(dashboardNavBtn);
    expect(liveRegion).toHaveTextContent("Dashboard");
    expect(await screen.findByText("Total Searches", {}, { timeout: 5000 })).toBeInTheDocument();

    // 5. Navigate back to Find a Gift (home)
    const homeNavBtn = within(mainNav).getByRole("button", { name: /^find a gift/i });
    fireEvent.click(homeNavBtn);
    expect(liveRegion).toHaveTextContent("Find a Gift");
    expect(screen.getByRole("heading", { name: /the right gift, for every heart\./i })).toBeInTheDocument();
  });

  it("handles mobile drawer open, navigation, and close interactions", () => {
    render(<App />);

    const openDrawerBtn = screen.getByRole("button", { name: /open navigation menu/i });
    expect(openDrawerBtn).toHaveAttribute("aria-expanded", "false");

    // Open mobile drawer
    fireEvent.click(openDrawerBtn);
    expect(openDrawerBtn).toHaveAttribute("aria-expanded", "true");

    const drawer = screen.getByRole("dialog", { name: /navigation menu/i });
    expect(drawer).toBeInTheDocument();

    // Mobile nav item click
    const mobileNav = within(drawer).getByRole("navigation", { name: /mobile navigation/i });
    const customLink = within(mobileNav).getByRole("button", { name: /^custom made/i });
    fireEvent.click(customLink);

    // Should navigate and close drawer
    expect(screen.getByText(/custom made corner/i)).toBeInTheDocument();
    expect(openDrawerBtn).toHaveAttribute("aria-expanded", "false");
  });

  it("pre-fills form and stays on home when clicking an occasion shortcut chip in Hero", async () => {
    render(<App />);

    // Click "Find gifts for Birthday" shortcut chip in Hero
    const birthdayChip = screen.getByRole("button", { name: /find gifts for birthday/i });
    fireEvent.click(birthdayChip);

    // Occasion select in GiftForm should now be prefilled
    await waitFor(() => {
      expect(screen.getByLabelText(/what's the occasion\?/i)).toHaveValue("birthday");
    });
  });

  it("transitions to GiftResults upon receiving recommendations, and resets on 'Search Again'", async () => {
    const mockRecommendData = {
      relationship: "sister",
      occasion: "birthday",
      budget: "medium",
      gender: "female",
      recommendations: [
        { name: "Indoor Bonsai Tree", score: 6 },
      ],
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockRecommendData,
    });

    render(<App />);

    // Fill form with valid options
    fireEvent.change(screen.getByLabelText(/who are you gifting\?/i), {
      target: { value: "sister" },
    });
    fireEvent.change(screen.getByLabelText(/what's the occasion\?/i), {
      target: { value: "birthday" },
    });
    fireEvent.change(screen.getByLabelText(/your budget/i), {
      target: { value: "medium" },
    });

    fireEvent.click(screen.getByRole("button", { name: /discover gift recommendations/i }));

    // GiftResults should mount and Hero should unmount
    expect(await screen.findByText("Indoor Bonsai Tree")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /gift ideas for you/i })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: /the right gift, for every heart\./i })).not.toBeInTheDocument();

    // Click Search Again
    const searchAgainBtn = screen.getByRole("button", { name: /start a new gift search/i });
    fireEvent.click(searchAgainBtn);

    // Hero and GiftForm should mount again
    expect(await screen.findByRole("heading", { name: /the right gift, for every heart\./i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /find the perfect gift/i })).toBeInTheDocument();
  });
});
