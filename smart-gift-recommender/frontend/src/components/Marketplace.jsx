import { useEffect, useState } from "react";
import { apiFetch, getUserId } from "../utils/api";
import { fmt } from "../utils/format";

const statusColors = {
  open:        "bg-emerald-100 text-emerald-700",
  in_progress: "bg-amber-100 text-amber-700",
  closed:      "bg-gray-100 text-gray-500",
};

// ── POST ORDER FORM ──────────────────────────────────────────
function PostOrderForm({ onPosted }) {
  const [form, setForm] = useState({ buyer_name:"", title:"", description:"", occasion:"", budget_min:"", budget_max:"", deadline:"" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const inp = "w-full border-2 border-rose-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-rose-400 bg-rose-50/40 text-gray-800 transition";

  const submit = async (e) => {
    e.preventDefault();
    if (!form.buyer_name || !form.title || !form.description) { setError("Please fill name, title and description."); return; }
    setLoading(true);
    try {
      const res = await apiFetch("/api/marketplace/orders", {
        method: "POST",
        body: JSON.stringify({ ...form, budget_min: Number(form.budget_min)||0, budget_max: Number(form.budget_max)||0 }),
      });
      if (!res.ok) throw new Error("Failed to post");
      onPosted();
    } catch { setError("Something went wrong. Try again."); }
    setLoading(false);
  };

  return (
    <form onSubmit={submit} className="bg-white rounded-3xl border border-rose-100 shadow-lg p-6 space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl">✂️</span>
        <div>
          <h3 className="font-serif text-xl font-bold text-rose-700">Post a Custom Gift Request</h3>
          <p className="text-xs text-rose-400">Describe what you need — makers will send you offers</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="mp-buyer-name" className="text-xs font-bold text-rose-500 uppercase tracking-widest">Your Name</label>
          <input id="mp-buyer-name" className={inp} placeholder="e.g. Priya Sharma" value={form.buyer_name}
            onChange={e => setForm({...form, buyer_name: e.target.value})} />
        </div>
        <div>
          <label htmlFor="mp-occasion" className="text-xs font-bold text-rose-500 uppercase tracking-widest">Occasion</label>
          <input id="mp-occasion" className={inp} placeholder="e.g. Sister's Wedding" value={form.occasion}
            onChange={e => setForm({...form, occasion: e.target.value})} />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="mp-title" className="text-xs font-bold text-rose-500 uppercase tracking-widest">Gift Title</label>
          <input id="mp-title" className={inp} placeholder="e.g. Handmade jewellery box for my sister" value={form.title}
            onChange={e => setForm({...form, title: e.target.value})} />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="mp-description" className="text-xs font-bold text-rose-500 uppercase tracking-widest">Description &amp; Requirements</label>
          <textarea id="mp-description" className={`${inp} resize-none`} rows={3}
            placeholder="Describe exactly what you want — material, size, colour, personalisation, etc."
            value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
        </div>
        <div>
          <label htmlFor="mp-budget-min" className="text-xs font-bold text-rose-500 uppercase tracking-widest">Min Budget (₹)</label>
          <input id="mp-budget-min" type="number" className={inp} placeholder="500" value={form.budget_min}
            onChange={e => setForm({...form, budget_min: e.target.value})} />
        </div>
        <div>
          <label htmlFor="mp-budget-max" className="text-xs font-bold text-rose-500 uppercase tracking-widest">Max Budget (₹)</label>
          <input id="mp-budget-max" type="number" className={inp} placeholder="2000" value={form.budget_max}
            onChange={e => setForm({...form, budget_max: e.target.value})} />
        </div>
        <div>
          <label htmlFor="mp-deadline" className="text-xs font-bold text-rose-500 uppercase tracking-widest">Deadline (optional)</label>
          <input id="mp-deadline" type="date" className={inp} value={form.deadline}
            onChange={e => setForm({...form, deadline: e.target.value})} />
        </div>
      </div>

      {error && <p className="text-rose-500 text-xs bg-rose-50 rounded-xl px-3 py-2">{error}</p>}

      <button type="submit" disabled={loading}
        className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600
          text-white font-bold py-3 rounded-2xl transition shadow-lg shadow-rose-200 cursor-pointer disabled:opacity-50">
        {loading ? "Posting..." : "🌹 Post My Request"}
      </button>
    </form>
  );
}

// ── ORDER DETAIL / NEGOTIATION ───────────────────────────────
function OrderDetail({ orderId, myUserId, onBack }) {
  const [data, setData] = useState(null);
  const [offerForm, setOfferForm] = useState({ seller_name:"", description:"", price:"", delivery_days:"7" });
  const [msgForm, setMsgForm] = useState({ sender_name:"", message:"" });
  const [loading, setLoading] = useState(true);

  const inp = "w-full border border-rose-100 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-rose-400 bg-rose-50/40 text-gray-800";

  const load = async () => {
    const res = await apiFetch(`/api/marketplace/orders/${orderId}`);
    setData(await res.json());
    setLoading(false);
  };

  useEffect(() => { load(); }, [orderId]);

  const submitOffer = async (e) => {
    e.preventDefault();
    await apiFetch(`/api/marketplace/orders/${orderId}/offers`, {
      method: "POST",
      body: JSON.stringify({ ...offerForm, price: Number(offerForm.price), delivery_days: Number(offerForm.delivery_days) }),
    });
    setOfferForm({ seller_name:"", description:"", price:"", delivery_days:"7" });
    load();
  };

  const sendMsg = async (e) => {
    e.preventDefault();
    await apiFetch(`/api/marketplace/orders/${orderId}/messages`, {
      method: "POST",
      body: JSON.stringify(msgForm),
    });
    setMsgForm({ sender_name:"", message:"" });
    load();
  };

  const updateOffer = async (offerId, status) => {
    await apiFetch(`/api/marketplace/offers/${offerId}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    load();
  };

  if (loading) return <p className="text-center text-neutral-400 py-10" role="status">Loading order…</p>;
  if (!data) return null;

  const { order, offers, messages } = data;
  const isBuyer = order.buyer_id === myUserId;

  return (
    <div className="space-y-5">
      <button onClick={onBack} className="text-sm text-rose-500 hover:text-rose-700 flex items-center gap-1 cursor-pointer">
        ← Back to all requests
      </button>

      {/* Order card */}
      <div className="bg-white rounded-3xl border border-rose-100 shadow-lg p-6">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${statusColors[order.status] || "bg-gray-100 text-gray-500"}`}>
              {fmt(order.status)}
            </span>
            <h3 className="font-serif text-2xl font-bold text-rose-800 mt-2">{order.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{order.description}</p>
          </div>
          <div className="text-right text-xs text-rose-400 shrink-0">
            <p>By <span className="font-semibold text-rose-600">{order.buyer_name}</span></p>
            {order.occasion && <p>🎉 {order.occasion}</p>}
            {(order.budget_min > 0 || order.budget_max > 0) && (
              <p>💰 ₹{order.budget_min} – ₹{order.budget_max}</p>
            )}
            {order.deadline && <p>📅 By {order.deadline}</p>}
          </div>
        </div>
      </div>

      {/* Offers */}
      <div className="bg-white rounded-3xl border border-rose-100 shadow-lg p-6">
        <h4 className="font-serif text-lg font-bold text-rose-700 mb-4">
          💌 Offers ({offers.length})
        </h4>
        {offers.length === 0 && <p className="text-rose-300 text-sm">No offers yet. Be the first to make one!</p>}
        <div className="space-y-3">
          {offers.map((o) => (
            <div key={o.id} className={`rounded-2xl border p-4 ${o.status === "accepted" ? "border-emerald-200 bg-emerald-50" : o.status === "rejected" ? "border-gray-200 bg-gray-50 opacity-60" : "border-rose-100 bg-rose-50/40"}`}>
              <div className="flex items-start justify-between gap-2 flex-wrap">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-gray-800 text-sm">{o.seller_name}</span>
                    <span className="text-xs bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full font-bold">₹{o.price}</span>
                    <span className="text-xs text-gray-400">🚚 {o.delivery_days} days</span>
                    {o.status !== "pending" && (
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${o.status === "accepted" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                        {fmt(o.status)}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{o.description}</p>
                </div>
                {isBuyer && o.status === "pending" && order.status === "open" && (
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => updateOffer(o.id, "accepted")}
                      aria-label="Accept this offer"
                      className="text-xs px-3 py-1.5 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition cursor-pointer font-semibold">
                      Accept
                    </button>
                    <button
                      onClick={() => updateOffer(o.id, "rejected")}
                      aria-label="Reject this offer"
                      className="text-xs px-3 py-1.5 bg-gray-200 text-gray-600 rounded-xl hover:bg-gray-300 transition cursor-pointer">
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Make offer form */}
        {order.status === "open" && !isBuyer && (
          <form onSubmit={submitOffer} className="mt-5 pt-5 border-t border-rose-100 space-y-3">
            <h5 className="font-semibold text-rose-600 text-sm">Make an Offer</h5>
            <div className="grid grid-cols-2 gap-3">
              <input
                className={inp}
                placeholder="Your name"
                aria-label="Your name"
                value={offerForm.seller_name}
                onChange={e => setOfferForm({...offerForm, seller_name: e.target.value})}
                required
              />
              <input
                type="number"
                className={inp}
                placeholder="Your price (₹)"
                aria-label="Your price in rupees"
                value={offerForm.price}
                onChange={e => setOfferForm({...offerForm, price: e.target.value})}
                required
              />
              <input
                type="number"
                className={inp}
                placeholder="Delivery days"
                aria-label="Delivery days"
                value={offerForm.delivery_days}
                onChange={e => setOfferForm({...offerForm, delivery_days: e.target.value})}
              />
            </div>
            <textarea
              className={`${inp} resize-none`}
              rows={2}
              placeholder="Describe your offer — what you'll make, materials, customisation..."
              aria-label="Offer description"
              value={offerForm.description}
              onChange={e => setOfferForm({...offerForm, description: e.target.value})}
              required
            />
            <button type="submit"
              className="w-full bg-rose-500 hover:bg-rose-600 text-white font-semibold py-2.5 rounded-xl transition cursor-pointer text-sm">
              Submit Offer
            </button>
          </form>
        )}
      </div>

      {/* Messages / Negotiation */}
      <div className="bg-white rounded-3xl border border-rose-100 shadow-lg p-6">
        <h4 className="font-serif text-lg font-bold text-rose-700 mb-4">
          💬 Negotiation Thread ({messages.length})
        </h4>
        <div className="space-y-3 max-h-64 overflow-y-auto mb-4 pr-1">
          {messages.length === 0 && <p className="text-rose-300 text-sm">No messages yet. Start the conversation!</p>}
          {messages.map((m) => (
            <div key={m.id} className={`flex gap-3 ${m.sender_id === myUserId ? "flex-row-reverse" : ""}`}>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                {m.sender_name?.[0]?.toUpperCase() || "?"}
              </div>
              <div className={`max-w-xs rounded-2xl px-4 py-2.5 text-sm ${m.sender_id === myUserId ? "bg-rose-500 text-white rounded-tr-sm" : "bg-rose-50 text-gray-800 border border-rose-100 rounded-tl-sm"}`}>
                <p className={`text-xs font-semibold mb-1 ${m.sender_id === myUserId ? "text-rose-100" : "text-rose-500"}`}>{m.sender_name}</p>
                <p>{m.message}</p>
                <p className={`text-xs mt-1 ${m.sender_id === myUserId ? "text-rose-200" : "text-gray-400"}`}>
                  {new Date(m.created_at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={sendMsg} className="flex gap-2">
          <input
            className={`${inp} flex-1`}
            placeholder="Your name"
            aria-label="Your name"
            value={msgForm.sender_name}
            onChange={e => setMsgForm({...msgForm, sender_name: e.target.value})}
            required
          />
          <input
            className={`${inp} flex-[3]`}
            placeholder="Type a message..."
            aria-label="Message"
            value={msgForm.message}
            onChange={e => setMsgForm({...msgForm, message: e.target.value})}
            required
          />
          <button type="submit"
            className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-xl transition cursor-pointer text-sm font-semibold shrink-0">
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

// ── MAIN MARKETPLACE ─────────────────────────────────────────
export default function Marketplace() {
  const [view,     setView]     = useState("browse"); // browse | post | detail
  const [orders,   setOrders]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [selected, setSelected] = useState(null);
  const [filter,   setFilter]   = useState("open");
  const myUserId = getUserId();

  const loadOrders = async () => {
    setLoading(true);
    const res = await apiFetch(`/api/marketplace/orders?status=${filter}`);
    setOrders(await res.json());
    setLoading(false);
  };

  useEffect(() => { loadOrders(); }, [filter]);

  if (view === "detail" && selected) {
    return (
      <div className="w-full max-w-2xl">
        <OrderDetail orderId={selected} myUserId={myUserId}
          onBack={() => { setView("browse"); setSelected(null); loadOrders(); }} />
      </div>
    );
  }

  if (view === "post") {
    return (
      <div className="w-full max-w-2xl space-y-4">
        <button onClick={() => setView("browse")} className="text-sm text-rose-500 hover:text-rose-700 flex items-center gap-1 cursor-pointer">
          ← Back to browse
        </button>
        <PostOrderForm onPosted={() => { setView("browse"); loadOrders(); }} />
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl space-y-6">

      {/* Header */}
      <div className="bg-white rounded-3xl border border-rose-100 shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-rose-500 to-pink-500 px-8 py-6 text-white">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="font-serif text-3xl font-bold">✂️ Custom Made Corner</h2>
              <p className="text-rose-100 text-sm mt-1">Post your dream gift — connect with skilled makers & negotiate directly</p>
            </div>
            <button onClick={() => setView("post")}
              className="bg-white text-rose-600 font-bold px-5 py-2.5 rounded-2xl hover:bg-rose-50 transition shadow-md cursor-pointer text-sm">
              + Post a Request
            </button>
          </div>
        </div>

        {/* How it works */}
        <div className="grid grid-cols-3 divide-x divide-rose-100 text-center">
          {[
            { icon: "📝", step: "1. Post", desc: "Describe your gift idea & budget" },
            { icon: "💌", step: "2. Receive Offers", desc: "Makers send you their proposals" },
            { icon: "🤝", step: "3. Negotiate", desc: "Chat, agree on price & get it made" },
          ].map((s) => (
            <div key={s.step} className="p-4">
              <div className="text-2xl mb-1">{s.icon}</div>
              <p className="text-xs font-bold text-rose-600">{s.step}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {["open","in_progress","closed"].map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer
              ${filter === s ? "bg-rose-500 text-white shadow-md" : "bg-white border border-rose-100 text-rose-500 hover:bg-rose-50"}`}>
            {s === "open" ? "🟢 Open" : s === "in_progress" ? "🟡 In Progress" : "⚫ Closed"}
          </button>
        ))}
        <span className="ml-auto text-xs text-rose-400 self-center">{orders.length} requests</span>
      </div>

      {/* Orders list */}
      {loading && <p className="text-center text-neutral-400 py-10" role="status">Loading requests…</p>}
      {!loading && orders.length === 0 && (
        <div className="text-center py-16 bg-white rounded-3xl border border-rose-100 shadow-sm">
          <div className="text-5xl mb-3">🌹</div>
          <p className="text-rose-400 font-medium">No {filter} requests yet.</p>
          <p className="text-rose-300 text-sm mt-1">Be the first to post a custom gift request!</p>
          <button onClick={() => setView("post")}
            className="mt-4 bg-rose-500 text-white px-6 py-2.5 rounded-2xl text-sm font-semibold hover:bg-rose-600 transition cursor-pointer">
            + Post a Request
          </button>
        </div>
      )}

      <div className="space-y-3">
        {orders.map((o) => (
          <button
            key={o.id}
            onClick={() => { setSelected(o.id); setView("detail"); }}
            aria-label={`View request: ${o.title}`}
            className="w-full text-left bg-white rounded-2xl border border-rose-100 shadow-sm
              hover:shadow-md hover:border-rose-200 transition-all cursor-pointer p-5
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy-500 focus-visible:ring-offset-2"
          >
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${statusColors[o.status]}`}>
                    {fmt(o.status)}
                  </span>
                  {o.occasion && <span className="text-xs text-rose-400" aria-hidden="true">🎉 {o.occasion}</span>}
                </div>
                <h3 className="font-semibold text-gray-800 text-base truncate">{o.title}</h3>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{o.description}</p>
              </div>
              <div className="text-right text-xs text-rose-400 shrink-0">
                <p className="font-semibold text-rose-600">{o.buyer_name}</p>
                {(o.budget_min > 0 || o.budget_max > 0) && (
                  <p className="mt-1 font-bold text-emerald-600">₹{o.budget_min}–₹{o.budget_max}</p>
                )}
                {o.deadline && <p className="mt-1" aria-hidden="true">📅 {o.deadline}</p>}
                <p className="mt-1 text-rose-300">{o.offer_count} offer{o.offer_count !== 1 ? "s" : ""}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
