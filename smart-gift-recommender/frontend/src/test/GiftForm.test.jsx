import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import GiftForm from "../components/GiftForm";

describe("GiftForm Component", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders all four form controls with labels and submit button", () => {
    render(<GiftForm onRecommend={vi.fn()} />);

    expect(screen.getByRole("heading", { name: /find the perfect gift/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/who are you gifting\?/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/their gender/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/your budget/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/what's the occasion\?/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /discover gift recommendations/i })).toBeInTheDocument();
  });

  it("displays a validation error when required fields are missing on submit", async () => {
    const handleRecommend = vi.fn();
    render(<GiftForm onRecommend={handleRecommend} />);

    const submitBtn = screen.getByRole("button", { name: /discover gift recommendations/i });
    fireEvent.click(submitBtn);

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(/please fill in all required fields/i);
    expect(handleRecommend).not.toHaveBeenCalled();
  });

  it("pre-populates fields from prefill prop and invokes onPrefillUsed", () => {
    const onPrefillUsed = vi.fn();
    const prefill = {
      relationship: "sister",
      occasion: "birthday",
      budget: "medium",
      gender: "female",
    };

    render(
      <GiftForm
        onRecommend={vi.fn()}
        prefill={prefill}
        onPrefillUsed={onPrefillUsed}
      />
    );

    expect(screen.getByLabelText(/who are you gifting\?/i)).toHaveValue("sister");
    expect(screen.getByLabelText(/what's the occasion\?/i)).toHaveValue("birthday");
    expect(screen.getByLabelText(/your budget/i)).toHaveValue("medium");
    expect(screen.getByLabelText(/their gender/i)).toHaveValue("female");
    expect(onPrefillUsed).toHaveBeenCalledTimes(1);
  });

  it("successfully submits form, displays loading state, and calls onRecommend", async () => {
    const mockResponse = {
      relationship: "mom",
      occasion: "mothers_day",
      budget: "medium",
      gender: "female",
      recommendations: [
        { name: "Scented Candle Set", score: 5 },
        { name: "Silk Scarf", score: 3 },
      ],
    };

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });
    global.fetch = mockFetch;

    const handleRecommend = vi.fn();
    render(<GiftForm onRecommend={handleRecommend} />);

    fireEvent.change(screen.getByLabelText(/who are you gifting\?/i), {
      target: { value: "mom" },
    });
    fireEvent.change(screen.getByLabelText(/what's the occasion\?/i), {
      target: { value: "mothers_day" },
    });
    fireEvent.change(screen.getByLabelText(/your budget/i), {
      target: { value: "medium" },
    });
    fireEvent.change(screen.getByLabelText(/their gender/i), {
      target: { value: "female" },
    });

    const submitBtn = screen.getByRole("button", { name: /discover gift recommendations/i });
    fireEvent.click(submitBtn);

    // Verify loading message is displayed
    expect(screen.getByText(/finding the perfect gift…/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(handleRecommend).toHaveBeenCalledWith(mockResponse);
    });

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const calledUrl = mockFetch.mock.calls[0][0];
    expect(calledUrl).toContain("/api/recommend?");
    expect(calledUrl).toContain("relationship=mom");
    expect(calledUrl).toContain("occasion=mothers_day");
    expect(calledUrl).toContain("budget=medium");
    expect(calledUrl).toContain("gender=female");
  });

  it("displays an error alert when the recommendation API fails", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ detail: "No recommendations found. Try adjusting your filters." }),
    });
    global.fetch = mockFetch;

    render(<GiftForm onRecommend={vi.fn()} />);

    fireEvent.change(screen.getByLabelText(/who are you gifting\?/i), {
      target: { value: "colleague" },
    });
    fireEvent.change(screen.getByLabelText(/what's the occasion\?/i), {
      target: { value: "farewell" },
    });
    fireEvent.change(screen.getByLabelText(/your budget/i), {
      target: { value: "low" },
    });

    fireEvent.click(screen.getByRole("button", { name: /discover gift recommendations/i }));

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(/no recommendations found/i);
  });
});
