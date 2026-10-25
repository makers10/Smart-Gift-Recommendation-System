import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import App from "../App";

describe("App Root SPA", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [],
    });
  });

  it("renders default home view with header, hero, wizard, and footer", () => {
    render(<App />);

    // Brand title in header
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getAllByText("GIFTVERSE").length).toBeGreaterThan(0);

    // Hero section
    expect(screen.getByRole("heading", { name: /every gift has/i })).toBeInTheDocument();

    // Gift Discovery Wizard
    expect(screen.getByRole("heading", { name: /gift discovery questionnaire/i })).toBeInTheDocument();

    // Footer
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  it("navigates across all primary sections", async () => {
    render(<App />);

    const header = screen.getByRole("banner");

    // 1. Navigate to Custom Atelier
    const customNavBtn = within(header).getByRole("button", { name: /custom atelier/i });
    fireEvent.click(customNavBtn);
    expect(await screen.findByRole("heading", { name: /custom made atelier/i })).toBeInTheDocument();

    // 2. Navigate to History
    const historyNavBtn = within(header).getByRole("button", { name: /history/i });
    fireEvent.click(historyNavBtn);
    expect(await screen.findByRole("heading", { name: /search history/i })).toBeInTheDocument();

    // 3. Navigate to Wishlist
    const wishlistNavBtn = within(header).getByRole("button", { name: /^wishlist$/i });
    fireEvent.click(wishlistNavBtn);
    expect(await screen.findByRole("heading", { name: /my wishlist/i })).toBeInTheDocument();

    // 4. Navigate to Analytics (Dashboard)
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

    const dashboardNavBtn = within(header).getByRole("button", { name: /analytics/i });
    fireEvent.click(dashboardNavBtn);
    expect(await screen.findByText("Total Searches", {}, { timeout: 5000 })).toBeInTheDocument();

    // 5. Navigate back to Experience (home)
    const homeNavBtn = within(header).getByRole("button", { name: /experience/i });
    fireEvent.click(homeNavBtn);
    expect(screen.getByRole("heading", { name: /every gift has/i })).toBeInTheDocument();
  });

  it("handles mobile drawer open, navigation, and close interactions", async () => {
    render(<App />);

    const openDrawerBtn = screen.getByRole("button", { name: /toggle navigation/i });
    expect(openDrawerBtn).toBeInTheDocument();

    // Open mobile drawer
    fireEvent.click(openDrawerBtn);

    // Click Custom Atelier in mobile menu
    const customButtons = screen.getAllByRole("button", { name: /custom atelier/i });
    fireEvent.click(customButtons[customButtons.length - 1]);

    // Should navigate
    expect(await screen.findByRole("heading", { name: /custom made atelier/i })).toBeInTheDocument();
  });

  it("transitions to GiftResults upon receiving recommendations, and resets on 'New Search'", async () => {
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

    // Step 1: Click Sister option card
    const sisterCard = await screen.findByRole("button", { name: /sister/i });
    fireEvent.click(sisterCard);
    fireEvent.click(screen.getByRole("button", { name: /continue/i }));

    // Step 2: Click Birthday option card
    const birthdayCard = await screen.findByRole("button", { name: /birthday/i });
    fireEvent.click(birthdayCard);
    fireEvent.click(screen.getByRole("button", { name: /continue/i }));

    // Step 3: Interests
    const continueBtn3 = await screen.findByRole("button", { name: /continue/i });
    fireEvent.click(continueBtn3);

    // Step 4: Budget
    const continueBtn4 = await screen.findByRole("button", { name: /continue/i });
    fireEvent.click(continueBtn4);

    // Step 5: Reveal Curated Gifts
    const revealBtn = await screen.findByRole("button", { name: /reveal curated gifts/i });
    fireEvent.click(revealBtn);

    // GiftResults should mount and display the recommendation
    expect(await screen.findByText("Indoor Bonsai Tree", {}, { timeout: 4000 })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /thoughtful gifts/i })).toBeInTheDocument();

    // Click New Search to reset
    const newSearchBtn = screen.getByRole("button", { name: /new search/i });
    fireEvent.click(newSearchBtn);

    // Hero and Wizard should be visible again
    expect(await screen.findByRole("heading", { name: /every gift has/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /gift discovery questionnaire/i })).toBeInTheDocument();
  });
});
