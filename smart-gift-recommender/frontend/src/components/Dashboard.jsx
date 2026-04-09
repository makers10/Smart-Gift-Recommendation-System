import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line, CartesianGrid,
} from "recharts";

const COLORS = ["#7c3aed","#a78bfa","#ec4899","#f59e0b","#10b981","#3b82f6","#ef4444","#8b5cf6","#14b8a6","#f97316"];
const fmt = (s) => s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

function StatCard({ label, value, color = "violet" }) {
  const colors = {
    violet: "bg-violet-50 border-violet-300 text-violet-700",
    pink: "bg-pink-50 border-pink-300 text-pink-700",
    green: "bg-green-50 border-green-300 text-green-700",
    orange: "bg-orange-50 border-orange-300 text-orange-700",
  };
  return (
    <div className={`rounded-xl border-2 p-4 text-center ${colors[color]}`}>
      <p className="text-3xl font-bold">{value}</p>
      <p className="text-xs mt-1 font-medium">{label}</p>
    </div>
  );
}

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8001/api/analytics")
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl p-8 text-center text-gray-400">
      Loading analytics...
    </div>
  );

  if (!data) return (
    <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl p-8 text-center text-red-400">
      Failed to load analytics.
    </div>
  );

  const festivalData = [
    { name: "Festival", value: data.festival_searches },
    { name: "Non-Festival", value: data.non_festival_searches },
  ];

  return (
    <div className="w-full max-w-4xl space-y-6">

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Searches" value={data.total_searches} color="violet" />
        <StatCard label="Festival Searches" value={data.festival_searches} color="orange" />
        <StatCard label="Non-Festival" value={data.non_festival_searches} color="green" />
        <StatCard label="Top Gifts Voted" value={data.top_gifts.length} color="pink" />
      </div>

      {/* Top Occasions Bar Chart */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <h3 className="text-base font-semibold text-violet-700 mb-4">🎉 Most Searched Occasions</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data.top_occasions.map((o) => ({ ...o, occasion: fmt(o.occasion) }))}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="occasion" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="count" fill="#7c3aed" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top Relationships + Gender side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-base font-semibold text-violet-700 mb-4">👥 Top Relationships</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart layout="vertical" data={data.top_relationships.map((r) => ({ ...r, relationship: fmt(r.relationship) }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis dataKey="relationship" type="category" tick={{ fontSize: 10 }} width={90} />
              <Tooltip />
              <Bar dataKey="count" fill="#a78bfa" radius={[0,4,4,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-base font-semibold text-violet-700 mb-4">⚧ Gender Breakdown</h3>
          {data.gender_breakdown.length === 0 ? (
            <p className="text-gray-400 text-sm text-center mt-8">No data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={data.gender_breakdown.map((g) => ({ ...g, name: fmt(g.gender) }))}
                  dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={75} label>
                  {data.gender_breakdown.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Festival vs Non-Festival Pie */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-base font-semibold text-violet-700 mb-4">🪔 Festival vs Occasion</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={festivalData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} label>
                {festivalData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Daily searches line chart */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-base font-semibold text-violet-700 mb-4">📈 Daily Searches (Last 7 Days)</h3>
          {data.daily_searches.length === 0 ? (
            <p className="text-gray-400 text-sm text-center mt-8">No data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={data.daily_searches}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#7c3aed" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Top Voted Gifts Table */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <h3 className="text-base font-semibold text-violet-700 mb-4">🏆 Top Voted Gifts</h3>
        {data.top_gifts.length === 0 ? (
          <p className="text-gray-400 text-sm text-center">No votes yet. Start rating gifts!</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-500 border-b">
                  <th className="pb-2 pr-4">Gift</th>
                  <th className="pb-2 pr-4">Relationship</th>
                  <th className="pb-2 pr-4">Occasion</th>
                  <th className="pb-2 pr-4">Score</th>
                  <th className="pb-2">Votes</th>
                </tr>
              </thead>
              <tbody>
                {data.top_gifts.map((g, i) => (
                  <tr key={i} className="border-b last:border-0 hover:bg-violet-50 transition">
                    <td className="py-2 pr-4 font-medium text-gray-800">🎁 {g.gift_name}</td>
                    <td className="py-2 pr-4 text-gray-600">{fmt(g.relationship)}</td>
                    <td className="py-2 pr-4 text-gray-600">{fmt(g.occasion)}</td>
                    <td className="py-2 pr-4">
                      <span className={`font-bold ${g.score > 0 ? "text-green-600" : g.score < 0 ? "text-red-500" : "text-gray-400"}`}>
                        {g.score > 0 ? "+" : ""}{g.score}
                      </span>
                    </td>
                    <td className="py-2 text-gray-500">{g.votes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
