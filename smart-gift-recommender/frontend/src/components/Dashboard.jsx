/**
 * Dashboard — Gift with Love / Giftverse
 *
 * Analytics dashboard showing platform gift-search statistics.
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

// Luxury brand chart color palette
const CHART_COLORS = [
  "#C69A55", // gold
  "#8E2045", // ruby burgundy
  "#DFB775", // champagne
  "#E5A93C", // amber gold
  "#50142A", // deep wine
  "#F3E5D0", // light ivory
  "#B83256", // bright rose
  "#9E7432", // bronze gold
  "#3D0E20", // dark plum
  "#D97706", // warm amber
];

// ── Custom chart tooltip ───────────────────────────────────────────────────

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1E131B]/95 border border-[#4A1830] rounded-xl px-3.5 py-2.5 shadow-2xl backdrop-blur-md text-xs text-[#FFF7E9]">
      <p className="font-serif font-semibold text-[#FFF7E9] mb-1">{label}</p>
      <p className="text-[#C69A55] font-medium">{payload[0].value} {payload[0].name || "searches"}</p>
    </div>
  );
}

// ── Stat card ─────────────────────────────────────────────────────────────

function StatCard({ label, value, description }) {
  return (
    <Card variant="luxury" padding="sm" className="text-center border border-[#4A1830]/80 bg-[#1E131B]/90 backdrop-blur-md">
      <p className="font-serif text-3xl font-bold text-[#C69A55] mb-1 leading-none tracking-tight">
        {value}
      </p>
      <p className="text-xs uppercase tracking-wider font-medium text-[#D8CABA]">{label}</p>
      {description && (
        <p className="text-[11px] text-[#A8988B] mt-1">{description}</p>
      )}
    </Card>
  );
}

// ── Section wrapper ────────────────────────────────────────────────────────

function Section({ title, children, className = "" }) {
  return (
    <Card variant="luxury" padding="md" className={`border border-[#4A1830]/80 bg-[#1E131B]/90 backdrop-blur-md ${className}`}>
      <h2 className="font-serif text-xl font-bold text-[#FFF7E9] mb-5 tracking-wide">{title}</h2>
      {children}
    </Card>
  );
}

// ── Empty chart state ──────────────────────────────────────────────────────

function EmptyChart({ message = "No data yet" }) {
  return (
    <div className="flex items-center justify-center h-32">
      <p className="text-sm text-[#A8988B] font-light">{message}</p>
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
      <div className="w-full max-w-5xl space-y-6" role="status" aria-label="Loading dashboard">
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
        className="w-full max-w-5xl bg-[#1E131B] border border-[#7E0F2E] rounded-card p-8 text-center text-[#FFF7E9]"
      >
        <p className="text-sm font-medium text-[#FFF7E9] mb-3">
          Unable to load analytics. Please try again.
        </p>
        <Button variant="gold" size="sm" onClick={fetchAnalytics}>
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
    <div className="w-full max-w-5xl space-y-8">

      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4 mb-2 flex-wrap">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-serif uppercase tracking-widest text-[#E9D7B8] bg-[#261722]/95 border border-[#4A1830] shadow-sm mb-2">
            <span>Gifting Intelligence & Trends</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#FFF7E9]">
            Analytics Dashboard
          </h1>
          <p className="text-sm text-[#E9D7B8]/80 mt-1 font-sans font-light">
            Real-time metrics, search patterns, and recipient sentiments across the platform.
          </p>
        </div>
      </div>

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
                <CartesianGrid strokeDasharray="3 3" stroke="#4A1830" opacity={0.6} vertical={false} />
                <XAxis dataKey="occasion" tick={{ fontSize: 10, fill: "#D8CABA" }} stroke="#4A1830" />
                <YAxis tick={{ fontSize: 11, fill: "#A8988B" }} stroke="#4A1830" />
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
                  <CartesianGrid strokeDasharray="3 3" stroke="#4A1830" opacity={0.6} horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 10, fill: "#A8988B" }} stroke="#4A1830" />
                  <YAxis
                    dataKey="relationship" type="category"
                    tick={{ fontSize: 10, fill: "#D8CABA" }} width={90}
                    stroke="#4A1830"
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
                  <Tooltip content={<ChartTooltip />} />
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
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Legend wrapperStyle={{ color: "#D8CABA", fontSize: "12px", paddingTop: "8px" }} />
              <Tooltip content={<ChartTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </Section>

        <Section title="Daily Searches — Last 7 Days">
          {data.daily_searches.length === 0
            ? <EmptyChart />
            : <ResponsiveContainer width="100%" height={200}>
                <LineChart data={data.daily_searches}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#4A1830" opacity={0.6} vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#D8CABA" }} stroke="#4A1830" />
                  <YAxis tick={{ fontSize: 11, fill: "#A8988B" }} stroke="#4A1830" />
                  <Tooltip content={<ChartTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#C69A55"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: "#C69A55", stroke: "#1E131B", strokeWidth: 2 }}
                    activeDot={{ r: 6, fill: "#FFF7E9", stroke: "#C69A55" }}
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
              <p className="text-sm text-[#A8988B]">
                No gift votes yet. Start rating gifts in the Find a Gift results.
              </p>
            </div>
          )
          : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm" aria-label="Top voted gifts">
                <thead>
                  <tr className="border-b border-[#4A1830]">
                    <th className="pb-3 pr-4 text-left text-xs font-semibold text-[#C69A55] uppercase tracking-wider">
                      Gift
                    </th>
                    <th className="pb-3 pr-4 text-left text-xs font-semibold text-[#C69A55] uppercase tracking-wider">
                      Recipient
                    </th>
                    <th className="pb-3 pr-4 text-left text-xs font-semibold text-[#C69A55] uppercase tracking-wider">
                      Occasion
                    </th>
                    <th className="pb-3 pr-4 text-left text-xs font-semibold text-[#C69A55] uppercase tracking-wider">
                      Score
                    </th>
                    <th className="pb-3 text-left text-xs font-semibold text-[#C69A55] uppercase tracking-wider">
                      Votes
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.top_gifts.map((g, i) => (
                    <tr
                      key={i}
                      className="border-b border-[#4A1830]/40 last:border-0 hover:bg-[#2B1825]/60 transition-colors duration-150"
                    >
                      <td className="py-3 pr-4 font-medium text-[#FFF7E9]">
                        <div className="flex items-center gap-2">
                          {i === 0 && (
                            <Badge variant="gold" size="xs">Top</Badge>
                          )}
                          {g.gift_name}
                        </div>
                      </td>
                      <td className="py-3 pr-4 text-xs text-[#D8CABA]">{fmt(g.relationship)}</td>
                      <td className="py-3 pr-4 text-xs text-[#D8CABA]">{fmt(g.occasion)}</td>
                      <td className="py-3 pr-4">
                        <span className={[
                          "text-sm font-semibold",
                          g.score > 0 ? "text-[#C69A55]" : "text-[#A8988B]",
                        ].join(" ")}>
                          {g.score > 0 ? "+" : ""}{g.score}
                        </span>
                      </td>
                      <td className="py-3 text-xs text-[#A8988B]">{g.votes}</td>
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
