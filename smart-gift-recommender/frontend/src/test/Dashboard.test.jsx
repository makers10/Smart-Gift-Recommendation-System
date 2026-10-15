import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Dashboard from "../components/Dashboard";

describe("Dashboard Component", () => {
  const mockAnalyticsData = {
    total_searches: 1420,
    unique_users: 350,
    festival_searches: 512,
    non_festival_searches: 908,
    top_occasions: [
      { occasion: "birthday", count: 420 },
      { occasion: "anniversary", count: 310 },
    ],
    top_relationships: [
      { relationship: "sister", count: 250 },
      { relationship: "mom", count: 210 },
    ],
    gender_breakdown: [
      { gender: "female", count: 600 },
      { gender: "male", count: 500 },
      { gender: "any", count: 320 },
    ],
    daily_searches: [
      { day: "2026-03-01", count: 45 },
      { day: "2026-03-02", count: 52 },
    ],
    top_gifts: [
      {
        gift_name: "Artisan Leather Journal",
        relationship: "colleague",
        occasion: "farewell",
        score: 15,
        votes: 18,
      },
      {
        gift_name: "Cashmere Scarf",
        relationship: "mother",
        occasion: "birthday",
        score: 12,
        votes: 14,
      },
    ],
  };

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders loading skeletons initially", () => {
    global.fetch = vi.fn().mockImplementation(() => new Promise(() => {}));

    render(<Dashboard />);

    expect(screen.getByRole("status", { name: /loading dashboard/i })).toBeInTheDocument();
    expect(screen.getByText(/loading analytics…/i)).toBeInTheDocument();
  });

  it("renders stat metrics and data visualizations once loaded", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockAnalyticsData,
    });

    render(<Dashboard />);

    // Metric stat cards
    expect(await screen.findByText("1,420")).toBeInTheDocument();
    expect(screen.getByText("Total Searches")).toBeInTheDocument();
    expect(screen.getByText("350")).toBeInTheDocument();
    expect(screen.getByText("Unique Users")).toBeInTheDocument();
    expect(screen.getByText("512")).toBeInTheDocument();
    expect(screen.getByText("Festival Searches")).toBeInTheDocument();
    expect(screen.getByText("Gifts Voted")).toBeInTheDocument();

    // Section headings
    expect(screen.getByRole("heading", { name: /most searched occasions/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /top relationships/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /gender breakdown/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /festival vs general occasions/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /daily searches — last 7 days/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /most loved gifts/i })).toBeInTheDocument();

    // Table entries
    expect(screen.getByText("Artisan Leather Journal")).toBeInTheDocument();
    expect(screen.getByText("+15")).toBeInTheDocument();
    expect(screen.getByText("Cashmere Scarf")).toBeInTheDocument();
    expect(screen.getByText("+12")).toBeInTheDocument();
  });

  it("handles empty/zero analytics data gracefully without errors", async () => {
    const emptyData = {
      total_searches: 0,
      unique_users: 0,
      festival_searches: 0,
      non_festival_searches: 0,
      top_occasions: [],
      top_relationships: [],
      gender_breakdown: [],
      daily_searches: [],
      top_gifts: [],
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => emptyData,
    });

    render(<Dashboard />);

    expect(await screen.findAllByText("0")).toBeTruthy();
    expect(screen.getByText(/no searches recorded yet/i)).toBeInTheDocument();
    expect(screen.getByText(/no gift votes yet\. start rating gifts/i)).toBeInTheDocument();
  });

  it("displays error alert and retry button if API fails", async () => {
    const mockFetch = vi.fn().mockRejectedValueOnce(new Error("Analytics error"));
    global.fetch = mockFetch;

    render(<Dashboard />);

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(/unable to load analytics\. please try again\./i);

    // Mock successful retry
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockAnalyticsData,
    });

    fireEvent.click(screen.getByRole("button", { name: /retry/i }));

    expect(await screen.findByText("1,420")).toBeInTheDocument();
  });
});
