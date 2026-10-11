/**
 * Dashboard — Gift with Love
 *
 * Analytics dashboard showing global gift-search statistics.
 *
 * API call preserved:
 *   GET /api/analytics — fetches all metrics on mount
 *
 * All Recharts charts preserved:
 *   - Bar chart: top occasions
 *   - Horizontal bar: top relationships
 *   - Pie chart: gender breakdown
 *   - Pie chart: festival vs occasion
 *   - Line chart: daily searches (7-day)
 *   - Table: top voted gifts
 *
 * Design changes (Stage F):
 *   - V13 fixed: gradient stat cards replaced with ivory/white design-token surfaces
 *   - Skeleton.StatCard used during loading (C3 continuation)
 *   - Chart colors updated to brand palette (burgundy/rose/gold)
 *   - Chart grid and tick colors use neutral palette
 *   - Section headings use design-token typography
 *   - Emoji removed from headings (V1); used as aria-hidden decorative only
 *   - role="status" on loading state (A4)
 *   - role="alert" on error state (A4)
 *   - Responsive grid for stat cards
 */
import { useEffect, useState } from "react";
import { apiFetch } from "../utils/api";
import { fmt } from "../utils/format";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line, CartesianGrid,
} from "recharts";
import { Card } from "./ui/Card";
import Badge from "./ui/Badge";
import Skeleton from "./ui/Skeleton";
import Button from "./ui/Button";

// Brand-aligned chart color palette
const CHART_COLORS = [
  "#9f1239", // burgundy-600
  "#c2274b", // burgundy-500
  "#e85c79", // burgundy-400
  "#f28fa0", // burgundy-300
  "#d4941c", // gold-500
  "#f0b429", // gold-400
  "#f8d878", // gold-300
  "#7e0f2e", // burgundy-700
  "#5f0a22", // burgundy-800
  "#f43f5e", // rose-500
];

// ── Custom chart tooltip ───────────────────────────────────────────────────

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-ivory-300 rounded-base px-3 py-2 shadow-md text-xs">
      <p className="font-semibold text-neutral-700 mb-0.5">{label}</p>
      <p className="text-burgundy-600">{payload[0].value} {payload[0].name || "searches"}</p>
    </div>
  );
}

// ── Stat card ─────────────────────────────────────────────────────────────

function StatCard({ label, value, description }) {
  return (
    <Card variant="default" padding="sm" className="text-center">
      <p className="font-serif text-3xl font-semibold text-burgundy-700 mb-1 leading-none">
        {value}
      </p>
      <p className="text-sm font-medium text-neutral-700">{label}</p>
      {description && (
        <p className="text-xs text-neutral-400 mt-1">{description}</p>
      )}
    </Card>
  );
}

// ── Section wrapper ────────────────────────────────────────────────────────

function Section({ title, children, className = "" }) {
  return (
    <Card variant="default" padding="md" className={className}>
      <h2 className="font-serif text-lg font-semibold text-burgundy-700 mb-5">{title}</h2>
      {children}
    </Card>
  );
}

// ── Empty chart state ──────────────────────────────────────────────────────

function EmptyChart({ message = "No data yet" }) {
  return (
    <div className="flex items-center justify-center h-32">
      <p className="text-sm text-neutral-400">{message}</p>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

export default function Dashboard() {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(false);

  const fetchAnalytics = () => {
    setError(false);
    setLoading(true);
    apiFetch("/api/analytics")
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  };

  useEffect(() => { fetchAnalytics(); }, []);

  // ── Loading state ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="w-full max-w-4xl space-y-6" role="status" aria-label="Loading dashboard">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton.StatCard key={i} />)}
        </div>
        <Skeleton className="h-64 w-full rounded-card" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-52 rounded-card" />
          <Skeleton className="h-52 rounded-card" />
        </div>
        <span className="sr-only">Loading analytics…</span>
      </div>
    );
  }

  // ── Error state ───────────────────────────────────────────────────────────
  if (error || !data) {
    return (
      <div
        role="alert"
        className="w-full max-w-4xl bg-burgundy-50 border border-burgundy-200 rounded-card p-8 text-center"
      >
        <p className="text-sm font-medium text-burgundy-700 mb-3">
          Unable to load analytics. Please try again.
        </p>
        <Button variant="secondary" size="sm" onClick={fetchAnalytics}>
          Retry
        </Button>
      </div>
    );
  }

  // ── Festival pie data ─────────────────────────────────────────────────────
  const festivalData = [
    { name: "Festival",  value: data.festival_searches },
    { name: "Occasion",  value: data.non_festival_searches },
  ];

  return (
    <div className="w-full max-w-4xl space-y-6">

      {/* ── Stat cards ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Total Searches"
          value={data.total_searches.toLocaleString()}
        />
        <StatCard
          label="Unique Users"
          value={data.unique_users.toLocaleString()}
        />
        <StatCard
          label="Festival Searches"
          value={data.festival_searches.toLocaleString()}
        />
        <StatCard
          label="Gifts Voted"
          value={data.top_gifts.length.toLocaleString()}
        />
      </div>

      {/* ── Top Occasions bar chart ─────────────────────────────────────── */}
      <Section title="Most Searched Occasions">
        {data.top_occasions.length === 0
          ? <EmptyChart message="No searches recorded yet" />
          : <ResponsiveContainer width="100%" height={220}>
              <BarChart data={data.top_occasions.map((o) => ({ ...o, occasion: fmt(o.occasion) }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ecdcc8" vertical={false} />
                <XAxis dataKey="occasion" tick={{ fontSize: 10, fill: "#71717a" }} />
                <YAxis tick={{ fontSize: 11, fill: "#a1a1aa" }} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {data.top_occasions.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
        }
      </Section>

      {/* ── Relationships + Gender ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <Section title="Top Relationships">
          {data.top_relationships.length === 0
            ? <EmptyChart />
            : <ResponsiveContainer width="100%" height={200}>
                <BarChart
                  layout="vertical"
                  data={data.top_relationships.map((r) => ({ ...r, relationship: fmt(r.relationship) }))}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#ecdcc8" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 10, fill: "#a1a1aa" }} />
                  <YAxis
                    dataKey="relationship" type="category"
                    tick={{ fontSize: 10, fill: "#71717a" }} width={90}
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                    {data.top_relationships.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
          }
        </Section>

        <Section title="Gender Breakdown">
          {data.gender_breakdown.length === 0
            ? <EmptyChart />
            : <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={data.gender_breakdown.map((g) => ({ ...g, name: fmt(g.gender) }))}
                    dataKey="count" nameKey="name"
                    cx="50%" cy="50%" outerRadius={70}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {data.gender_breakdown.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
          }
        </Section>
      </div>

      {/* ── Festival vs Occasion + Daily line ──────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <Section title="Festival vs General Occasions">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={festivalData}
                dataKey="value" nameKey="name"
                cx="50%" cy="50%" outerRadius={70}
                label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {festivalData.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Section>

        <Section title="Daily Searches — Last 7 Days">
          {data.daily_searches.length === 0
            ? <EmptyChart />
            : <ResponsiveContainer width="100%" height={200}>
                <LineChart data={data.daily_searches}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ecdcc8" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#a1a1aa" }} />
                  <YAxis tick={{ fontSize: 11, fill: "#a1a1aa" }} />
                  <Tooltip content={<ChartTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#9f1239"
                    strokeWidth={2}
                    dot={{ r: 4, fill: "#9f1239", stroke: "#fff", strokeWidth: 2 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
          }
        </Section>
      </div>

      {/* ── Top Voted Gifts table ───────────────────────────────────────── */}
      <Section title="Most Loved Gifts">
        {data.top_gifts.length === 0
          ? (
            <div className="text-center py-8">
              <p className="text-sm text-neutral-400">
                No gift votes yet. Start rating gifts in the Find a Gift results.
              </p>
            </div>
          )
          : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm" aria-label="Top voted gifts">
                <thead>
                  <tr className="border-b border-ivory-300">
                    <th className="pb-3 pr-4 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                      Gift
                    </th>
                    <th className="pb-3 pr-4 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                      Recipient
                    </th>
                    <th className="pb-3 pr-4 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                      Occasion
                    </th>
                    <th className="pb-3 pr-4 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                      Score
                    </th>
                    <th className="pb-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                      Votes
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.top_gifts.map((g, i) => (
                    <tr
                      key={i}
                      className="border-b border-ivory-200 last:border-0 hover:bg-ivory-100 transition-colors duration-150"
                    >
                      <td className="py-3 pr-4 font-medium text-neutral-800">
                        <div className="flex items-center gap-2">
                          {i === 0 && (
                            <Badge variant="gold" size="xs">Top</Badge>
                          )}
                          {g.gift_name}
                        </div>
                      </td>
                      <td className="py-3 pr-4 text-xs text-neutral-500">{fmt(g.relationship)}</td>
                      <td className="py-3 pr-4 text-xs text-neutral-500">{fmt(g.occasion)}</td>
                      <td className="py-3 pr-4">
                        <span className={[
                          "text-sm font-semibold",
                          g.score > 0 ? "text-burgundy-600" : g.score < 0 ? "text-neutral-400" : "text-neutral-400",
                        ].join(" ")}>
                          {g.score > 0 ? "+" : ""}{g.score}
                        </span>
                      </td>
                      <td className="py-3 text-xs text-neutral-400">{g.votes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        }
      </Section>
    </div>
  );
}
