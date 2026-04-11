import { useEffect, useState } from "react";
import { apiFetch } from "../utils/api";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line, CartesianGrid,
} from "recharts";

const COLORS = ["#f43f5e","#fb7185","#fda4af","#e11d48","#f97316","#ec4899","#a855f7","#8b5cf6","#14b8a6","#f59e0b"];
const fmt = (s) => s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

function StatCard({ label, value, icon, color }) {
  const colors = {
    rose: "from-rose-400 to-pink-400",
    pink: "from-pink-400 to-fuchsia-400",
    orange: "from-orange-400 to-rose-400",
    purple: "from-purple-400 to-pink-400",
  };
  return (
    <div className={`bg-gradient-to-br ${colors[color]} rounded-2xl p-4 text-white shadow-lg text-center`}>
      <div className="text-3xl mb-1">{icon}</div>
      <p className="text-3xl font-bold font-serif">{value}</p>
      <p className="text-xs mt-1 opacity-90 tracking-wide">{label}</p>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white border border-rose-100 rounded-xl px-3 py-2 shadow-lg text-xs text-rose-700">
        <p className="font-semibold">{label}</p>
        <p>{payload[0].value} searches</p>
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/api/analytics")
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl w-full max-w-4xl p-10 text-center text-rose-300 border border-rose-100">
      <div className="text-5xl mb-3 animate-pulse">💕</div>
      <p className="font-serif text-lg text-rose-400">Loading your love analytics...</p>
    </div>
  );

  if (!data) return (
    <div className="bg-white/80 rounded-3xl shadow-xl w-full max-w-4xl p-8 text-center text-rose-400 border border-rose-100">
      Failed to load analytics 💔
    </div>
  );

  const festivalData = [
    { name: "Festival 🪔", value: data.festival_searches },
    { name: "Occasion 🎉", value: data.non_festival_searches },
  ];

  return (
    <div className="w-full max-w-4xl space-y-6">

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Searches" value={data.total_searches} icon="🔍" color="rose" />
        <StatCard label="Unique Users" value={data.unique_users} icon="👥" color="pink" />
        <StatCard label="Festival Gifts" value={data.festival_searches} icon="🪔" color="orange" />
        <StatCard label="Gifts Voted" value={data.top_gifts.length} icon="💝" color="purple" />
      </div>

      {/* Top Occasions */}
      <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-lg border border-rose-100 p-6">
        <h3 className="font-serif text-lg font-bold text-rose-700 mb-4">🌹 Most Searched Occasions</h3>
        {data.top_occasions.length === 0
          ? <p className="text-rose-300 text-sm text-center py-6">No searches yet 💕</p>
          : <ResponsiveContainer width="100%" height={220}>
              <BarChart data={data.top_occasions.map((o) => ({ ...o, occasion: fmt(o.occasion) }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#fce7f3" />
                <XAxis dataKey="occasion" tick={{ fontSize: 10, fill: "#f43f5e" }} />
                <YAxis tick={{ fontSize: 11, fill: "#fda4af" }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" radius={[6,6,0,0]}>
                  {data.top_occasions.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
        }
      </div>

      {/* Relationships + Gender */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-lg border border-rose-100 p-6">
          <h3 className="font-serif text-lg font-bold text-rose-700 mb-4">💑 Top Relationships</h3>
          {data.top_relationships.length === 0
            ? <p className="text-rose-300 text-sm text-center py-6">No data yet 🌹</p>
            : <ResponsiveContainer width="100%" height={200}>
                <BarChart layout="vertical" data={data.top_relationships.map((r) => ({ ...r, relationship: fmt(r.relationship) }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#fce7f3" />
                  <XAxis type="number" tick={{ fontSize: 10, fill: "#fda4af" }} />
                  <YAxis dataKey="relationship" type="category" tick={{ fontSize: 10, fill: "#f43f5e" }} width={90} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" radius={[0,6,6,0]}>
                    {data.top_relationships.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
          }
        </div>

        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-lg border border-rose-100 p-6">
          <h3 className="font-serif text-lg font-bold text-rose-700 mb-4">⚧ Gender Breakdown</h3>
          {data.gender_breakdown.length === 0
            ? <p className="text-rose-300 text-sm text-center py-6">No data yet 💕</p>
            : <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={data.gender_breakdown.map((g) => ({ ...g, name: fmt(g.gender) }))}
                    dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={70}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}>
                    {data.gender_breakdown.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
          }
        </div>
      </div>

      {/* Festival Pie + Daily Line */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-lg border border-rose-100 p-6">
          <h3 className="font-serif text-lg font-bold text-rose-700 mb-4">🪔 Festival vs Occasion</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={festivalData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70}
                label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`} labelLine={false}>
                {festivalData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-lg border border-rose-100 p-6">
          <h3 className="font-serif text-lg font-bold text-rose-700 mb-4">📈 Daily Searches (7 Days)</h3>
          {data.daily_searches.length === 0
            ? <p className="text-rose-300 text-sm text-center py-6">No data yet 🌹</p>
            : <ResponsiveContainer width="100%" height={200}>
                <LineChart data={data.daily_searches}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#fce7f3" />
                  <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#fda4af" }} />
                  <YAxis tick={{ fontSize: 11, fill: "#fda4af" }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#f43f5e" strokeWidth={2.5}
                    dot={{ r: 5, fill: "#f43f5e", stroke: "#fff", strokeWidth: 2 }} />
                </LineChart>
              </ResponsiveContainer>
          }
        </div>
      </div>

      {/* Top Voted Gifts */}
      <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-lg border border-rose-100 p-6">
        <h3 className="font-serif text-lg font-bold text-rose-700 mb-4">💖 Most Loved Gifts</h3>
        {data.top_gifts.length === 0
          ? <div className="text-center py-8">
              <div className="text-4xl mb-2">🌹</div>
              <p className="text-rose-300 text-sm">No votes yet — start rating gifts!</p>
            </div>
          : <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-rose-400 border-b border-rose-100 uppercase tracking-wide">
                    <th className="pb-3 pr-4">Gift</th>
                    <th className="pb-3 pr-4">For</th>
                    <th className="pb-3 pr-4">Occasion</th>
                    <th className="pb-3 pr-4">Score</th>
                    <th className="pb-3">Votes</th>
                  </tr>
                </thead>
                <tbody>
                  {data.top_gifts.map((g, i) => (
                    <tr key={i} className="border-b border-rose-50 last:border-0 hover:bg-rose-50/50 transition">
                      <td className="py-2.5 pr-4 font-medium text-gray-800">
                        {i === 0 && <span className="mr-1">✨</span>}🎁 {g.gift_name}
                      </td>
                      <td className="py-2.5 pr-4 text-rose-500 text-xs">{fmt(g.relationship)}</td>
                      <td className="py-2.5 pr-4 text-rose-400 text-xs">{fmt(g.occasion)}</td>
                      <td className="py-2.5 pr-4">
                        <span className={`font-bold text-sm ${g.score > 0 ? "text-rose-500" : g.score < 0 ? "text-gray-400" : "text-pink-300"}`}>
                          {g.score > 0 ? "+" : ""}{g.score} ♥
                        </span>
                      </td>
                      <td className="py-2.5 text-gray-400 text-xs">{g.votes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
        }
      </div>

    </div>
  );
}
