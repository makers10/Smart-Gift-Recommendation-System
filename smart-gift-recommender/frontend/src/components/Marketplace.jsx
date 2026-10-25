import { useEffect, useState } from "react";
import { apiFetch, getUserId } from "../utils/api";
import { fmt } from "../utils/format";
import { Scissors, Sparkles, Send, ArrowLeft, Check, Clock, ShieldCheck, User } from "lucide-react";

const statusColors = {
  open:        "bg-emerald-950/60 text-emerald-300 border border-emerald-800/60",
  in_progress: "bg-amber-950/60 text-amber-300 border border-amber-800/60",
  closed:      "bg-neutral-900/60 text-neutral-400 border border-neutral-800",
};

// ── POST ORDER FORM ──────────────────────────────────────────
function PostOrderForm({ onPosted }) {
  const [form, setForm] = useState({ buyer_name:"", title:"", description:"", occasion:"", budget_min:"", budget_max:"", deadline:"" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const inp = "w-full border border-[#4A1830] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#C69A55] bg-[#1E131B] text-[#FFF7E9] placeholder-[#D8CABA]/50 transition";

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
    <form onSubmit={submit} className="bg-[#241620]/95 rounded-3xl border border-[#4A1830] shadow-[0_12px_45px_rgba(0,0,0,0.6)] p-6 sm:p-8 space-y-5 text-[#FFF7E9]">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-[#4A1830] border border-[#C69A55]/40 flex items-center justify-center text-[#C69A55]">
          <Scissors className="w-5 h-5 text-[#C69A55]" />
        </div>
        <div>
          <h3 className="font-serif text-2xl font-bold text-[#FFF7E9]">Post a Custom Gift Commission</h3>
          <p className="text-xs text-[#E9D7B8]/75">Describe your unique vision — independent artisans will review and send offers</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="mp-buyer-name" className="text-xs font-serif font-bold text-[#C69A55] uppercase tracking-wider block mb-1">Your Name</label>
          <input id="mp-buyer-name" className={inp} placeholder="e.g. Priya Sharma" value={form.buyer_name}
            onChange={e => setForm({...form, buyer_name: e.target.value})} />
        </div>
        <div>
          <label htmlFor="mp-occasion" className="text-xs font-serif font-bold text-[#C69A55] uppercase tracking-wider block mb-1">Occasion</label>
          <input id="mp-occasion" className={inp} placeholder="e.g. Sister's Wedding" value={form.occasion}
            onChange={e => setForm({...form, occasion: e.target.value})} />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="mp-title" className="text-xs font-serif font-bold text-[#C69A55] uppercase tracking-wider block mb-1">Commission Title</label>
          <input id="mp-title" className={inp} placeholder="e.g. Handmade carved jewelry box for my sister" value={form.title}
            onChange={e => setForm({...form, title: e.target.value})} />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="mp-description" className="text-xs font-serif font-bold text-[#C69A55] uppercase tracking-wider block mb-1">Description &amp; Specifications</label>
          <textarea id="mp-description" className={`${inp} resize-none`} rows={3}
            placeholder="Describe material, dimensions, color preferences, personalization details, etc."
            value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
        </div>
        <div>
          <label htmlFor="mp-budget-min" className="text-xs font-serif font-bold text-[#C69A55] uppercase tracking-wider block mb-1">Min Budget (₹)</label>
          <input id="mp-budget-min" type="number" className={inp} placeholder="500" value={form.budget_min}
            onChange={e => setForm({...form, budget_min: e.target.value})} />
        </div>
        <div>
          <label htmlFor="mp-budget-max" className="text-xs font-serif font-bold text-[#C69A55] uppercase tracking-wider block mb-1">Max Budget (₹)</label>
          <input id="mp-budget-max" type="number" className={inp} placeholder="2500" value={form.budget_max}
            onChange={e => setForm({...form, budget_max: e.target.value})} />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="mp-deadline" className="text-xs font-serif font-bold text-[#C69A55] uppercase tracking-wider block mb-1">Required By (Optional)</label>
          <input id="mp-deadline" type="date" className={inp} value={form.deadline}
            onChange={e => setForm({...form, deadline: e.target.value})} />
        </div>
      </div>

      {error && <p className="text-rose-300 text-xs bg-rose-950/60 border border-rose-800 rounded-xl px-4 py-2.5" role="alert">{error}</p>}

      <button type="submit" disabled={loading}
        className="w-full min-h-[44px] bg-gradient-to-r from-[#C69A55] via-[#DCB372] to-[#E9D7B8] text-[#17131A] font-bold py-3 px-6 rounded-full transition shadow-md hover:brightness-105 cursor-pointer disabled:opacity-50 tracking-wider uppercase text-xs">
        {loading ? "Publishing Request…" : "Publish Commission Request"}
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

  const inp = "w-full border border-[#4A1830] rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#C69A55] bg-[#1E131B] text-[#FFF7E9] placeholder-[#D8CABA]/50";

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

  if (loading) return <p className="text-center text-[#E9D7B8] py-12" role="status">Loading commission details…</p>;
  if (!data) return null;

  const { order, offers, messages } = data;
  const isBuyer = order.buyer_id === myUserId;

  return (
    <div className="space-y-6 text-[#FFF7E9]">
      <button onClick={onBack} className="text-xs font-serif uppercase tracking-widest text-[#E9D7B8] hover:text-[#FFF7E9] flex items-center gap-1.5 cursor-pointer transition-colors">
        <ArrowLeft className="w-3.5 h-3.5 text-[#C69A55]" />
        <span>Return to All Requests</span>
      </button>

      {/* Order card */}
      <div className="bg-[#241620]/95 rounded-3xl border border-[#4A1830] shadow-[0_12px_45px_rgba(0,0,0,0.6)] p-6 sm:p-8 backdrop-blur-xl">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex-1 min-w-[280px]">
            <span className={`text-xs font-serif font-bold px-3 py-1 rounded-full ${statusColors[order.status] || "bg-neutral-900 text-neutral-400"}`}>
              {fmt(order.status)}
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#FFF7E9] mt-3">{order.title}</h3>
            <p className="text-sm text-[#D8CABA] mt-2 font-sans font-light leading-relaxed">{order.description}</p>
          </div>
          <div className="text-right text-xs text-[#E9D7B8]/80 shrink-0 font-sans space-y-1">
            <p>Commissioned by <span className="font-semibold text-[#FFF7E9]">{order.buyer_name}</span></p>
            {order.occasion && <p className="text-[#C69A55]">Occasion: {order.occasion}</p>}
            {(order.budget_min > 0 || order.budget_max > 0) && (
              <p className="font-semibold text-[#E9D7B8]">Budget: ₹{order.budget_min} – ₹{order.budget_max}</p>
            )}
            {order.deadline && <p>Deadline: {order.deadline}</p>}
          </div>
        </div>
      </div>

      {/* Offers */}
      <div className="bg-[#241620]/95 rounded-3xl border border-[#4A1830] shadow-[0_12px_45px_rgba(0,0,0,0.6)] p-6 sm:p-8 backdrop-blur-xl">
        <h4 className="font-serif text-xl font-bold text-[#FFF7E9] mb-4 flex items-center gap-2">
          <span>Artisan Proposals</span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#4A1830] text-[#E9D7B8] border border-[#C69A55]/30">
            {offers.length}
          </span>
        </h4>
        {offers.length === 0 && <p className="text-[#E9D7B8]/70 text-sm">No proposals received yet. Be the first artisan to submit an offer!</p>}
        <div className="space-y-3.5">
          {offers.map((o) => (
            <div key={o.id} className={`rounded-2xl border p-5 transition-all ${o.status === "accepted" ? "border-emerald-700/80 bg-emerald-950/40" : o.status === "rejected" ? "border-neutral-800 bg-neutral-900/40 opacity-60" : "border-[#4A1830] bg-[#1E131B]/90"}`}>
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="font-semibold text-[#FFF7E9] text-sm">{o.seller_name}</span>
                    <span className="text-xs font-serif font-bold bg-[#C69A55]/15 text-[#DCB372] border border-[#C69A55]/40 px-2.5 py-0.5 rounded-full">₹{o.price}</span>
                    <span className="text-xs text-[#E9D7B8]/70 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#C69A55]" />
                      <span>{o.delivery_days} days delivery</span>
                    </span>
                    {o.status !== "pending" && (
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${o.status === "accepted" ? "bg-emerald-950 text-emerald-300 border border-emerald-800" : "bg-neutral-900 text-neutral-400"}`}>
                        {fmt(o.status)}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-[#D8CABA] mt-2 font-sans font-light leading-relaxed">{o.description}</p>
                </div>
                {isBuyer && o.status === "pending" && order.status === "open" && (
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => updateOffer(o.id, "accepted")}
                      aria-label="Accept this offer"
                      className="min-h-[36px] text-xs px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition cursor-pointer font-semibold shadow-sm">
                      Accept
                    </button>
                    <button
                      onClick={() => updateOffer(o.id, "rejected")}
                      aria-label="Reject this offer"
                      className="min-h-[36px] text-xs px-3.5 py-1.5 bg-[#311C2C] text-[#D8CABA] hover:text-[#FFF7E9] rounded-xl border border-[#4A1830] transition cursor-pointer">
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
          <form onSubmit={submitOffer} className="mt-6 pt-6 border-t border-[#4A1830] space-y-4">
            <h5 className="font-serif font-bold text-base text-[#C69A55]">Submit Maker Proposal</h5>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                className={inp}
                placeholder="Your maker / artisan name"
                aria-label="Your name"
                value={offerForm.seller_name}
                onChange={e => setOfferForm({...offerForm, seller_name: e.target.value})}
                required
              />
              <input
                type="number"
                className={inp}
                placeholder="Proposal Price (₹)"
                aria-label="Your price in rupees"
                value={offerForm.price}
                onChange={e => setOfferForm({...offerForm, price: e.target.value})}
                required
              />
              <input
                type="number"
                className={inp}
                placeholder="Production days"
                aria-label="Delivery days"
                value={offerForm.delivery_days}
                onChange={e => setOfferForm({...offerForm, delivery_days: e.target.value})}
              />
            </div>
            <textarea
              className={`${inp} resize-none`}
              rows={2}
              placeholder="Describe materials, custom techniques, and milestones..."
              aria-label="Offer description"
              value={offerForm.description}
              onChange={e => setOfferForm({...offerForm, description: e.target.value})}
              required
            />
            <button type="submit"
              className="w-full min-h-[44px] bg-gradient-to-r from-[#C69A55] to-[#E9D7B8] hover:brightness-105 text-[#17131A] font-bold py-2.5 rounded-full transition cursor-pointer text-xs uppercase tracking-wider">
              Submit Proposal
            </button>
          </form>
        )}
      </div>

      {/* Messages / Negotiation */}
      <div className="bg-[#241620]/95 rounded-3xl border border-[#4A1830] shadow-[0_12px_45px_rgba(0,0,0,0.6)] p-6 sm:p-8 backdrop-blur-xl">
        <h4 className="font-serif text-xl font-bold text-[#FFF7E9] mb-4 flex items-center gap-2">
          <span>Negotiation &amp; Specification Thread</span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#4A1830] text-[#E9D7B8] border border-[#C69A55]/30">
            {messages.length}
          </span>
        </h4>
        <div className="space-y-3.5 max-h-72 overflow-y-auto mb-5 pr-1">
          {messages.length === 0 && <p className="text-[#E9D7B8]/70 text-sm">No messages yet. Clarify dimensions, design preferences, or shipping details below.</p>}
          {messages.map((m) => (
            <div key={m.id} className={`flex gap-3 ${m.sender_id === myUserId ? "flex-row-reverse" : ""}`}>
              <div className="w-8 h-8 rounded-full bg-[#4A1830] border border-[#C69A55]/40 flex items-center justify-center text-[#C69A55] text-xs font-bold shrink-0">
                {m.sender_name?.[0]?.toUpperCase() || "?"}
              </div>
              <div className={`max-w-md rounded-2xl px-4 py-3 text-sm ${m.sender_id === myUserId ? "bg-gradient-to-r from-[#C69A55] to-[#E9D7B8] text-[#17131A] font-medium rounded-tr-sm" : "bg-[#1E131B] text-[#FFF7E9] border border-[#4A1830] rounded-tl-sm"}`}>
                <p className={`text-[11px] font-semibold mb-1 ${m.sender_id === myUserId ? "text-[#17131A]/80 font-serif" : "text-[#C69A55] font-serif"}`}>{m.sender_name}</p>
                <p className="leading-relaxed">{m.message}</p>
                <p className={`text-[10px] mt-1 ${m.sender_id === myUserId ? "text-[#17131A]/70" : "text-[#D8CABA]/60"}`}>
                  {new Date(m.created_at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={sendMsg} className="flex gap-2.5">
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
            placeholder="Type your message or inquiry…"
            aria-label="Message"
            value={msgForm.message}
            onChange={e => setMsgForm({...msgForm, message: e.target.value})}
            required
          />
          <button type="submit"
            className="min-h-[44px] bg-gradient-to-r from-[#C69A55] to-[#E9D7B8] hover:brightness-105 text-[#17131A] px-5 py-2.5 rounded-xl transition cursor-pointer text-xs font-bold uppercase tracking-wider shrink-0 flex items-center gap-1.5">
            <Send className="w-3.5 h-3.5" />
            <span>Send</span>
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
      <div className="w-full max-w-3xl">
        <OrderDetail orderId={selected} myUserId={myUserId}
          onBack={() => { setView("browse"); setSelected(null); loadOrders(); }} />
      </div>
    );
  }

  if (view === "post") {
    return (
      <div className="w-full max-w-2xl space-y-4">
        <button onClick={() => setView("browse")} className="text-xs font-serif uppercase tracking-widest text-[#E9D7B8] hover:text-[#FFF7E9] flex items-center gap-1.5 cursor-pointer transition-colors">
          <ArrowLeft className="w-3.5 h-3.5 text-[#C69A55]" />
          <span>Return to Browse</span>
        </button>
        <PostOrderForm onPosted={() => { setView("browse"); loadOrders(); }} />
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl space-y-6 text-[#FFF7E9]">

      {/* Hero Banner Header */}
      <div className="bg-[#241620]/95 rounded-3xl border border-[#4A1830] shadow-[0_12px_45px_rgba(0,0,0,0.6)] overflow-hidden backdrop-blur-xl">
        <div className="bg-gradient-to-r from-[#4A1830] via-[#2B101D] to-[#17131A] px-8 py-8 border-b border-[#4A1830]">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-serif uppercase tracking-widest text-[#E9D7B8] bg-[#17131A]/70 border border-[#C69A55]/30 mb-2.5">
                <Scissors className="w-3.5 h-3.5 text-[#C69A55]" />
                <span>Bespoke Atelier</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#FFF7E9]">Custom Made Atelier</h2>
              <p className="text-[#E9D7B8]/80 text-sm mt-1 max-w-lg font-sans font-light">
                Commission one-of-a-kind presents directly with independent jewelers, leather crafters, and artists.
              </p>
            </div>
            <button onClick={() => setView("post")}
              className="min-h-[44px] bg-gradient-to-r from-[#C69A55] via-[#DCB372] to-[#E9D7B8] text-[#17131A] font-bold px-6 py-2.5 rounded-full hover:brightness-105 transition shadow-[0_2px_14px_rgba(198,154,85,0.35)] cursor-pointer text-xs uppercase tracking-wider">
              + Post a Request
            </button>
          </div>
        </div>

        {/* How it works 3-step banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#4A1830] text-center bg-[#1D121B]/95">
          {[
            { step: "01. Commission", desc: "Specify your custom gift vision & budget boundaries" },
            { step: "02. Receive Offers", desc: "Independent artisans review & submit price proposals" },
            { step: "03. Collaborate", desc: "Direct specification thread, approve price & receive heirloom" },
          ].map((s) => (
            <div key={s.step} className="p-5">
              <p className="text-xs font-serif font-bold text-[#C69A55] uppercase tracking-wider">{s.step}</p>
              <p className="text-xs text-[#E9D7B8]/75 mt-1 font-sans">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2.5 flex-wrap">
        {[
          { id: "open", label: "Open Requests" },
          { id: "in_progress", label: "In Progress" },
          { id: "closed", label: "Completed" },
        ].map((s) => (
          <button key={s.id} onClick={() => setFilter(s.id)}
            className={`min-h-[38px] px-4 py-1.5 rounded-full text-xs font-medium transition cursor-pointer
              ${filter === s.id ? "bg-gradient-to-r from-[#C69A55] to-[#E9D7B8] text-[#17131A] font-bold shadow-sm" : "bg-[#241620] border border-[#4A1830] text-[#E9D7B8] hover:text-[#FFF7E9]"}`}>
            {s.label}
          </button>
        ))}
        <span className="ml-auto text-xs text-[#E9D7B8]/80 font-serif self-center">{orders.length} commissions</span>
      </div>

      {/* Orders list */}
      {loading && <p className="text-center text-[#E9D7B8] py-12" role="status">Loading requests…</p>}
      {!loading && orders.length === 0 && (
        <div className="text-center py-16 bg-[#241620]/95 rounded-3xl border border-[#4A1830] shadow-[0_10px_35px_rgba(0,0,0,0.5)] p-8">
          <div className="w-16 h-16 rounded-2xl bg-[#4A1830] border border-[#C69A55]/40 flex items-center justify-center mx-auto mb-4 text-[#C69A55]">
            <Scissors className="w-8 h-8" />
          </div>
          <p className="text-[#FFF7E9] font-serif text-xl font-bold">No {filter} requests yet.</p>
          <p className="text-[#E9D7B8]/75 text-xs sm:text-sm mt-1 max-w-sm mx-auto font-sans">
            Have a custom idea in mind? Post your commission and skilled artisans will reach out.
          </p>
          <button onClick={() => setView("post")}
            className="mt-5 min-h-[44px] bg-gradient-to-r from-[#C69A55] to-[#E9D7B8] text-[#17131A] px-6 py-2.5 rounded-full text-xs uppercase tracking-wider font-bold hover:brightness-105 transition cursor-pointer shadow-md">
            + Post a Request
          </button>
        </div>
      )}

      <div className="space-y-3.5">
        {orders.map((o) => (
          <button
            key={o.id}
            onClick={() => { setSelected(o.id); setView("detail"); }}
            aria-label={`View request: ${o.title}`}
            className="w-full text-left bg-[#241620]/90 hover:bg-[#2C1A27] rounded-2xl border border-[#4A1830] hover:border-[#C69A55]/60 shadow-[0_4px_20px_rgba(0,0,0,0.4)] hover:shadow-[0_8px_30px_rgba(198,154,85,0.15)] transition-all cursor-pointer p-6
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C69A55] focus-visible:ring-offset-2 focus-visible:ring-offset-[#17131A]"
          >
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1.5">
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${statusColors[o.status] || "bg-neutral-900 text-neutral-400"}`}>
                    {fmt(o.status)}
                  </span>
                  {o.occasion && <span className="text-xs text-[#C69A55]" aria-hidden="true">✦ {o.occasion}</span>}
                </div>
                <h3 className="font-serif font-bold text-[#FFF7E9] text-lg sm:text-xl truncate group-hover:text-[#C69A55] transition-colors">{o.title}</h3>
                <p className="text-xs sm:text-sm text-[#D8CABA] mt-1.5 line-clamp-2 font-sans font-light leading-relaxed">{o.description}</p>
              </div>
              <div className="text-right text-xs text-[#E9D7B8]/80 shrink-0 font-sans space-y-1">
                <p className="font-semibold text-[#FFF7E9]">{o.buyer_name}</p>
                {(o.budget_min > 0 || o.budget_max > 0) && (
                  <p className="font-serif font-bold text-[#C69A55] text-sm">₹{o.budget_min}–₹{o.budget_max}</p>
                )}
                {o.deadline && <p className="text-[11px] text-[#D8CABA]/70" aria-hidden="true">Due {o.deadline}</p>}
                <p className="text-xs text-[#E9D7B8] font-medium">{o.offer_count} offer{o.offer_count !== 1 ? "s" : ""}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
