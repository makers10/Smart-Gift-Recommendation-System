import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import History from "../components/History";

describe("History Component", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("shows loading skeletons on mount", () => {
    global.fetch = vi.fn().mockImplementation(() => new Promise(() => {}));

    render(<History onReSearch={vi.fn()} />);

    expect(screen.getByRole("heading", { name: /search history/i })).toBeInTheDocument();
    expect(screen.getAllByRole("status", { name: /loading history entry…/i })).toHaveLength(4);
  });

  it("renders empty state when there are no past searches", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [],
    });

    render(<History onReSearch={vi.fn()} />);

    expect(await screen.findByRole("heading", { name: /no searches yet/i })).toBeInTheDocument();
    expect(screen.getByText(/your gift searches will appear here/i)).toBeInTheDocument();
  });

  it("renders history entries with details and invokes onReSearch on 'Search again'", async () => {
    const mockHistory = [
      {
        id: 1,
        occasion: "birthday",
        relationship: "sister",
        budget: "medium",
        gender: "female",
        created_at: "2026-03-15T10:00:00",
      },
      {
        id: 2,
        occasion: "anniversary",
        relationship: "spouse",
        budget: "high",
        gender: "any",
        created_at: "2026-03-14T10:00:00",
      },
    ];

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockHistory,
    });

    const handleReSearch = vi.fn();
    render(<History onReSearch={handleReSearch} />);

    expect(await screen.findByText("Birthday")).toBeInTheDocument();
    expect(screen.getByText("Sister")).toBeInTheDocument();
    expect(screen.getByText("Anniversary")).toBeInTheDocument();

    const searchAgainBtns = screen.getAllByRole("button", { name: /^search again:/i });
    expect(searchAgainBtns).toHaveLength(2);

    fireEvent.click(searchAgainBtns[0]);

    expect(handleReSearch).toHaveBeenCalledWith({
      relationship: "sister",
      occasion: "birthday",
      budget: "medium",
      gender: "female",
    });
  });

  it("removes a single item from history", async () => {
    const mockHistory = [
      {
        id: 42,
        occasion: "diwali",
        relationship: "colleague",
        budget: "low",
        gender: "any",
        created_at: "2026-03-10T10:00:00",
      },
    ];

    const mockFetch = vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockHistory,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ status: "deleted" }),
      });
    global.fetch = mockFetch;

    render(<History onReSearch={vi.fn()} />);

    expect(await screen.findByText("Diwali")).toBeInTheDocument();

    const deleteBtn = screen.getByRole("button", { name: /remove diwali search from history/i });
    fireEvent.click(deleteBtn);

    await waitFor(() => {
      expect(screen.queryByText("Diwali")).not.toBeInTheDocument();
    });

    expect(mockFetch).toHaveBeenLastCalledWith(
      expect.stringContaining("/api/history/42"),
      expect.objectContaining({ method: "DELETE" })
    );
  });

  it("supports clearing all history with confirmation step", async () => {
    const mockHistory = [
      {
        id: 1,
        occasion: "housewarming",
        relationship: "friend",
        budget: "medium",
        gender: "any",
        created_at: "2026-03-01T10:00:00",
      },
    ];

    const mockFetch = vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockHistory,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ status: "cleared" }),
      });
    global.fetch = mockFetch;

    render(<History onReSearch={vi.fn()} />);

    expect(await screen.findByText("Housewarming")).toBeInTheDocument();

    const clearAllBtn = screen.getByRole("button", { name: /clear all search history/i });
    fireEvent.click(clearAllBtn);

    // Confirmation options appear
    expect(screen.getByText(/remove all\?/i)).toBeInTheDocument();
    const confirmBtn = screen.getByRole("button", { name: /yes, clear/i });
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(screen.queryByText("Housewarming")).not.toBeInTheDocument();
    });

    expect(screen.getByRole("heading", { name: /no searches yet/i })).toBeInTheDocument();
    expect(mockFetch).toHaveBeenLastCalledWith(
      expect.stringContaining("/api/history"),
      expect.objectContaining({ method: "DELETE" })
    );
  });

  it("displays error alert and allows retry if history fetch fails", async () => {
    const mockFetch = vi.fn().mockRejectedValueOnce(new Error("Network error"));
    global.fetch = mockFetch;

    render(<History onReSearch={vi.fn()} />);

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(/unable to load your search history/i);

    // Retry
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    fireEvent.click(screen.getByRole("button", { name: /retry/i }));

    expect(await screen.findByRole("heading", { name: /no searches yet/i })).toBeInTheDocument();
  });
});
