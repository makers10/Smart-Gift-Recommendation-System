from fastapi import FastAPI, Query, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from data.gifts import gift_data
from database import init_db, get_db

app = FastAPI(title="Smart Gift Recommender API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup():
    init_db()

# ─── RECOMMEND ────────────────────────────────────────────────
@app.get("/api/recommend")
def recommend(
    relationship: str = Query(...),
    occasion: str = Query(...),
    budget: str = Query(...),
    gender: str = Query(default="any"),
    x_user_id: Optional[str] = Header(default=None),
):
    # 1. Exact match
    result = next(
        (g for g in gift_data if g["relationship"] == relationship
         and g["occasion"] == occasion and g["budget"] == budget), None)

    # 2. anyone + same occasion + same budget
    if not result:
        result = next(
            (g for g in gift_data if g["relationship"] == "anyone"
             and g["occasion"] == occasion and g["budget"] == budget), None)

    # 3. same relationship + same occasion, any budget
    if not result:
        result = next(
            (g for g in gift_data if g["relationship"] == relationship
             and g["occasion"] == occasion), None)

    # 4. anyone + same occasion, any budget
    if not result:
        result = next(
            (g for g in gift_data if g["relationship"] == "anyone"
             and g["occasion"] == occasion), None)

    # 5. same relationship + birthday (universal fallback occasion)
    if not result:
        result = next(
            (g for g in gift_data if g["relationship"] == relationship
             and g["occasion"] == "birthday" and g["budget"] == budget), None)

    # 6. anyone + birthday + same budget (last resort)
    if not result:
        result = next(
            (g for g in gift_data if g["relationship"] == "anyone"
             and g["occasion"] == "housewarming" and g["budget"] == budget), None)

    if not result:
        raise HTTPException(status_code=404, detail="No recommendations found. Try adjusting your filters.")

    db = get_db()
    db.execute(
        "INSERT INTO search_logs (user_id, relationship, occasion, budget, gender) VALUES (?,?,?,?,?)",
        (x_user_id, relationship, occasion, budget, gender)
    )
    db.commit()

    gifts_with_scores = []
    for gift in result["gifts"]:
        row = db.execute(
            "SELECT COALESCE(SUM(vote),0) as score FROM gift_votes WHERE gift_name=? AND relationship=? AND occasion=?",
            (gift, relationship, occasion)
        ).fetchone()
        gifts_with_scores.append({"name": gift, "score": row["score"]})
    db.close()

    gifts_with_scores.sort(key=lambda x: x["score"], reverse=True)

    return {
        "relationship": relationship,
        "occasion": occasion,
        "budget": budget,
        "gender": gender,
        "recommendations": gifts_with_scores,
    }

# ─── SEARCH HISTORY (per user) ────────────────────────────────
@app.get("/api/history")
def get_history(x_user_id: Optional[str] = Header(default=None)):
    if not x_user_id:
        raise HTTPException(status_code=400, detail="User ID required")
    db = get_db()
    rows = db.execute(
        "SELECT * FROM search_logs WHERE user_id=? ORDER BY created_at DESC LIMIT 50",
        (x_user_id,)
    ).fetchall()
    db.close()
    return [dict(r) for r in rows]

@app.delete("/api/history/{log_id}")
def delete_history(log_id: int, x_user_id: Optional[str] = Header(default=None)):
    db = get_db()
    db.execute("DELETE FROM search_logs WHERE id=? AND user_id=?", (log_id, x_user_id))
    db.commit()
    db.close()
    return {"message": "Deleted"}

@app.delete("/api/history")
def clear_history(x_user_id: Optional[str] = Header(default=None)):
    if not x_user_id:
        raise HTTPException(status_code=400, detail="User ID required")
    db = get_db()
    db.execute("DELETE FROM search_logs WHERE user_id=?", (x_user_id,))
    db.commit()
    db.close()
    return {"message": "History cleared"}

# ─── OPTIONS ──────────────────────────────────────────────────
@app.get("/api/options")
def options():
    relationships = list({g["relationship"] for g in gift_data})
    occasions = list({g["occasion"] for g in gift_data})
    return {"relationships": sorted(relationships), "occasions": sorted(occasions)}

# ─── VOTE ─────────────────────────────────────────────────────
class VotePayload(BaseModel):
    gift_name: str
    relationship: str
    occasion: str
    vote: int

@app.post("/api/vote")
def vote(payload: VotePayload):
    if payload.vote not in (1, -1):
        raise HTTPException(status_code=400, detail="Vote must be 1 or -1")
    db = get_db()
    db.execute(
        "INSERT INTO gift_votes (gift_name, relationship, occasion, vote) VALUES (?,?,?,?)",
        (payload.gift_name, payload.relationship, payload.occasion, payload.vote)
    )
    db.commit()
    db.close()
    return {"message": "Vote recorded"}

# ─── WISHLIST (per user) ───────────────────────────────────────
class WishlistPayload(BaseModel):
    gift_name: str
    relationship: str
    occasion: str
    budget: str

@app.post("/api/wishlist")
def add_wishlist(payload: WishlistPayload, x_user_id: Optional[str] = Header(default=None)):
    db = get_db()
    db.execute(
        "INSERT INTO wishlist (user_id, gift_name, relationship, occasion, budget) VALUES (?,?,?,?,?)",
        (x_user_id, payload.gift_name, payload.relationship, payload.occasion, payload.budget)
    )
    db.commit()
    db.close()
    return {"message": "Added to wishlist"}

@app.get("/api/wishlist")
def get_wishlist(x_user_id: Optional[str] = Header(default=None)):
    db = get_db()
    rows = db.execute(
        "SELECT * FROM wishlist WHERE user_id=? ORDER BY created_at DESC",
        (x_user_id,)
    ).fetchall()
    db.close()
    return [dict(r) for r in rows]

@app.delete("/api/wishlist/{item_id}")
def delete_wishlist(item_id: int, x_user_id: Optional[str] = Header(default=None)):
    db = get_db()
    db.execute("DELETE FROM wishlist WHERE id=? AND user_id=?", (item_id, x_user_id))
    db.commit()
    db.close()
    return {"message": "Removed"}

# ─── ANALYTICS (global — backend/admin view) ──────────────────
@app.get("/api/analytics")
def analytics():
    db = get_db()

    total = db.execute("SELECT COUNT(*) as count FROM search_logs").fetchone()["count"]

    top_occasions = db.execute("""
        SELECT occasion, COUNT(*) as count FROM search_logs
        GROUP BY occasion ORDER BY count DESC LIMIT 10
    """).fetchall()

    top_relationships = db.execute("""
        SELECT relationship, COUNT(*) as count FROM search_logs
        GROUP BY relationship ORDER BY count DESC LIMIT 10
    """).fetchall()

    gender_breakdown = db.execute("""
        SELECT gender, COUNT(*) as count FROM search_logs
        GROUP BY gender ORDER BY count DESC
    """).fetchall()

    top_gifts = db.execute("""
        SELECT gift_name, relationship, occasion, SUM(vote) as score, COUNT(*) as votes
        FROM gift_votes GROUP BY gift_name, relationship, occasion
        ORDER BY score DESC LIMIT 10
    """).fetchall()

    festival_occasions = ('diwali','holi','navratri','raksha_bandhan','baisakhi',
                          'ganesh_chaturthi','onam','ugadi','eid','eid_adha',
                          'christmas','easter','chinese_new_year','mid_autumn',
                          'hanukkah','rosh_hashanah','new_year','thanksgiving','halloween')
    festival_count = db.execute(
        f"SELECT COUNT(*) as count FROM search_logs WHERE occasion IN ({','.join('?'*len(festival_occasions))})",
        festival_occasions
    ).fetchone()["count"]

    daily = db.execute("""
        SELECT DATE(created_at) as day, COUNT(*) as count
        FROM search_logs WHERE created_at >= DATE('now','-7 days')
        GROUP BY day ORDER BY day
    """).fetchall()

    # unique users
    unique_users = db.execute(
        "SELECT COUNT(DISTINCT user_id) as count FROM search_logs WHERE user_id IS NOT NULL"
    ).fetchone()["count"]

    db.close()

    return {
        "total_searches": total,
        "unique_users": unique_users,
        "festival_searches": festival_count,
        "non_festival_searches": total - festival_count,
        "top_occasions": [dict(r) for r in top_occasions],
        "top_relationships": [dict(r) for r in top_relationships],
        "gender_breakdown": [dict(r) for r in gender_breakdown],
        "top_gifts": [dict(r) for r in top_gifts],
        "daily_searches": [dict(r) for r in daily],
    }


# ─── CUSTOM GIFT MARKETPLACE ──────────────────────────────────

class OrderPayload(BaseModel):
    buyer_name: str
    title: str
    description: str
    occasion: Optional[str] = ""
    budget_min: int = 0
    budget_max: int = 0
    deadline: Optional[str] = ""

class OfferPayload(BaseModel):
    seller_name: str
    description: str
    price: int
    delivery_days: int = 7

class MessagePayload(BaseModel):
    sender_name: str
    message: str
    offer_id: Optional[int] = None

class OfferStatusPayload(BaseModel):
    status: str  # accepted / rejected

@app.post("/api/marketplace/orders")
def create_order(payload: OrderPayload, x_user_id: Optional[str] = Header(default=None)):
    db = get_db()
    cur = db.execute(
        """INSERT INTO custom_orders
           (buyer_id,buyer_name,title,description,occasion,budget_min,budget_max,deadline)
           VALUES (?,?,?,?,?,?,?,?)""",
        (x_user_id, payload.buyer_name, payload.title, payload.description,
         payload.occasion, payload.budget_min, payload.budget_max, payload.deadline)
    )
    db.commit()
    order_id = cur.lastrowid
    db.close()
    return {"message": "Order posted", "order_id": order_id}

@app.get("/api/marketplace/orders")
def list_orders(status: str = "open"):
    db = get_db()
    rows = db.execute(
        "SELECT * FROM custom_orders WHERE status=? ORDER BY created_at DESC",
        (status,)
    ).fetchall()
    result = []
    for r in rows:
        o = dict(r)
        o["offer_count"] = db.execute(
            "SELECT COUNT(*) as c FROM custom_offers WHERE order_id=?", (o["id"],)
        ).fetchone()["c"]
        result.append(o)
    db.close()
    return result

@app.get("/api/marketplace/orders/mine")
def my_orders(x_user_id: Optional[str] = Header(default=None)):
    db = get_db()
    rows = db.execute(
        "SELECT * FROM custom_orders WHERE buyer_id=? ORDER BY created_at DESC",
        (x_user_id,)
    ).fetchall()
    db.close()
    return [dict(r) for r in rows]

@app.get("/api/marketplace/orders/{order_id}")
def get_order(order_id: int):
    db = get_db()
    order = db.execute("SELECT * FROM custom_orders WHERE id=?", (order_id,)).fetchone()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    offers = db.execute(
        "SELECT * FROM custom_offers WHERE order_id=? ORDER BY created_at ASC", (order_id,)
    ).fetchall()
    messages = db.execute(
        "SELECT * FROM custom_messages WHERE order_id=? ORDER BY created_at ASC", (order_id,)
    ).fetchall()
    db.close()
    return {
        "order": dict(order),
        "offers": [dict(o) for o in offers],
        "messages": [dict(m) for m in messages],
    }

@app.post("/api/marketplace/orders/{order_id}/offers")
def make_offer(order_id: int, payload: OfferPayload, x_user_id: Optional[str] = Header(default=None)):
    db = get_db()
    cur = db.execute(
        """INSERT INTO custom_offers
           (order_id,seller_id,seller_name,description,price,delivery_days)
           VALUES (?,?,?,?,?,?)""",
        (order_id, x_user_id, payload.seller_name, payload.description,
         payload.price, payload.delivery_days)
    )
    db.commit()
    offer_id = cur.lastrowid
    db.close()
    return {"message": "Offer submitted", "offer_id": offer_id}

@app.patch("/api/marketplace/offers/{offer_id}")
def update_offer_status(offer_id: int, payload: OfferStatusPayload,
                        x_user_id: Optional[str] = Header(default=None)):
    if payload.status not in ("accepted", "rejected"):
        raise HTTPException(status_code=400, detail="Invalid status")
    db = get_db()
    db.execute("UPDATE custom_offers SET status=? WHERE id=?", (payload.status, offer_id))
    if payload.status == "accepted":
        offer = db.execute("SELECT order_id FROM custom_offers WHERE id=?", (offer_id,)).fetchone()
        if offer:
            db.execute("UPDATE custom_orders SET status='in_progress' WHERE id=?", (offer["order_id"],))
    db.commit()
    db.close()
    return {"message": f"Offer {payload.status}"}

@app.post("/api/marketplace/orders/{order_id}/messages")
def send_message(order_id: int, payload: MessagePayload,
                 x_user_id: Optional[str] = Header(default=None)):
    db = get_db()
    db.execute(
        "INSERT INTO custom_messages (order_id,offer_id,sender_id,sender_name,message) VALUES (?,?,?,?,?)",
        (order_id, payload.offer_id, x_user_id, payload.sender_name, payload.message)
    )
    db.commit()
    db.close()
    return {"message": "Message sent"}

@app.delete("/api/marketplace/orders/{order_id}")
def close_order(order_id: int, x_user_id: Optional[str] = Header(default=None)):
    db = get_db()
    db.execute(
        "UPDATE custom_orders SET status='closed' WHERE id=? AND buyer_id=?",
        (order_id, x_user_id)
    )
    db.commit()
    db.close()
    return {"message": "Order closed"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=3001, reload=True)
