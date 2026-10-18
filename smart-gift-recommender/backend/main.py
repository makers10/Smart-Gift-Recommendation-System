import logging
import traceback
from contextlib import asynccontextmanager, contextmanager
from typing import Optional

from fastapi import FastAPI, Query, HTTPException, Header, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from data.gifts import gift_data
from database import init_db, get_db

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("gift_recommender")

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield

app = FastAPI(title="Smart Gift Recommender API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@contextmanager
def db_session():
    """Context manager to ensure database connections are always closed safely."""
    conn = get_db()
    try:
        yield conn
    finally:
        conn.close()

# ─── GLOBAL EXCEPTION HANDLER (Prevents unhandled 500 crashes) ────────
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled error handling {request.method} {request.url.path}: {exc}\n{traceback.format_exc()}")
    return JSONResponse(
        status_code=500,
        content={
            "detail": "An unexpected server error occurred. Please try again.",
            "error_type": type(exc).__name__,
        },
    )

# ─── RECOMMEND ────────────────────────────────────────────────
@app.api_route("/api/recommend", methods=["GET", "HEAD"])
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

    user_id = x_user_id or "anonymous"
    gifts_with_scores = []

    with db_session() as db:
        db.execute(
            "INSERT INTO search_logs (user_id, relationship, occasion, budget, gender) VALUES (?,?,?,?,?)",
            (user_id, relationship, occasion, budget, gender)
        )
        db.commit()

        for gift in result["gifts"]:
            row = db.execute(
                "SELECT COALESCE(SUM(vote),0) as score FROM gift_votes WHERE gift_name=? AND relationship=? AND occasion=?",
                (gift, relationship, occasion)
            ).fetchone()
            score = row["score"] if row else 0
            gifts_with_scores.append({"name": gift, "score": score})

    gifts_with_scores.sort(key=lambda x: x["score"], reverse=True)

    return {
        "relationship": relationship,
        "occasion": occasion,
        "budget": budget,
        "gender": gender,
        "recommendations": gifts_with_scores,
    }

# ─── SEARCH HISTORY (per user) ────────────────────────────────
@app.api_route("/api/history", methods=["GET", "HEAD"])
def get_history(x_user_id: Optional[str] = Header(default=None)):
    if not x_user_id:
        return []
    with db_session() as db:
        rows = db.execute(
            "SELECT * FROM search_logs WHERE user_id=? ORDER BY created_at DESC LIMIT 50",
            (x_user_id,)
        ).fetchall()
        return [dict(r) for r in rows]

@app.delete("/api/history/{log_id}")
def delete_history(log_id: int, x_user_id: Optional[str] = Header(default=None)):
    user_id = x_user_id or "anonymous"
    with db_session() as db:
        db.execute("DELETE FROM search_logs WHERE id=? AND user_id=?", (log_id, user_id))
        db.commit()
    return {"message": "Deleted"}

@app.delete("/api/history")
def clear_history(x_user_id: Optional[str] = Header(default=None)):
    if not x_user_id:
        raise HTTPException(status_code=400, detail="User ID required")
    with db_session() as db:
        db.execute("DELETE FROM search_logs WHERE user_id=?", (x_user_id,))
        db.commit()
    return {"message": "History cleared"}

# ─── OPTIONS ──────────────────────────────────────────────────
@app.api_route("/api/options", methods=["GET", "HEAD"])
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
    with db_session() as db:
        db.execute(
            "INSERT INTO gift_votes (gift_name, relationship, occasion, vote) VALUES (?,?,?,?)",
            (payload.gift_name, payload.relationship, payload.occasion, payload.vote)
        )
        db.commit()
    return {"message": "Vote recorded"}

# ─── WISHLIST (per user) ───────────────────────────────────────
class WishlistPayload(BaseModel):
    gift_name: str
    relationship: str
    occasion: str
    budget: str

@app.post("/api/wishlist")
def add_wishlist(payload: WishlistPayload, x_user_id: Optional[str] = Header(default=None)):
    user_id = x_user_id or "anonymous"
    with db_session() as db:
        db.execute(
            "INSERT INTO wishlist (user_id, gift_name, relationship, occasion, budget) VALUES (?,?,?,?,?)",
            (user_id, payload.gift_name, payload.relationship, payload.occasion, payload.budget)
        )
        db.commit()
    return {"message": "Added to wishlist"}

@app.api_route("/api/wishlist", methods=["GET", "HEAD"])
def get_wishlist(x_user_id: Optional[str] = Header(default=None)):
    user_id = x_user_id or "anonymous"
    with db_session() as db:
        rows = db.execute(
            "SELECT * FROM wishlist WHERE user_id=? ORDER BY created_at DESC",
            (user_id,)
        ).fetchall()
        return [dict(r) for r in rows]

@app.delete("/api/wishlist/{item_id}")
def delete_wishlist(item_id: int, x_user_id: Optional[str] = Header(default=None)):
    user_id = x_user_id or "anonymous"
    with db_session() as db:
        db.execute("DELETE FROM wishlist WHERE id=? AND user_id=?", (item_id, user_id))
        db.commit()
    return {"message": "Removed"}

# ─── ANALYTICS (global — backend/admin view) ──────────────────
@app.api_route("/api/analytics", methods=["GET", "HEAD"])
def analytics():
    with db_session() as db:
        total_row = db.execute("SELECT COUNT(*) as count FROM search_logs").fetchone()
        total = total_row["count"] if total_row else 0

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
        festival_count_row = db.execute(
            f"SELECT COUNT(*) as count FROM search_logs WHERE occasion IN ({','.join('?'*len(festival_occasions))})",
            festival_occasions
        ).fetchone()
        festival_count = festival_count_row["count"] if festival_count_row else 0

        daily = db.execute("""
            SELECT DATE(created_at) as day, COUNT(*) as count
            FROM search_logs WHERE created_at >= DATE('now','-7 days')
            GROUP BY day ORDER BY day
        """).fetchall()

        unique_users_row = db.execute(
            "SELECT COUNT(DISTINCT user_id) as count FROM search_logs WHERE user_id IS NOT NULL AND user_id != 'anonymous'"
        ).fetchone()
        unique_users = unique_users_row["count"] if unique_users_row else 0

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
    buyer_id = x_user_id or "anonymous_buyer"
    with db_session() as db:
        cur = db.execute(
            """INSERT INTO custom_orders
               (buyer_id,buyer_name,title,description,occasion,budget_min,budget_max,deadline)
               VALUES (?,?,?,?,?,?,?,?)""",
            (buyer_id, payload.buyer_name, payload.title, payload.description,
             payload.occasion, payload.budget_min, payload.budget_max, payload.deadline)
        )
        db.commit()
        order_id = cur.lastrowid
    return {"message": "Order posted", "order_id": order_id}

@app.api_route("/api/marketplace/orders", methods=["GET", "HEAD"])
def list_orders(status: str = "open"):
    with db_session() as db:
        rows = db.execute(
            "SELECT * FROM custom_orders WHERE status=? ORDER BY created_at DESC",
            (status,)
        ).fetchall()
        result = []
        for r in rows:
            o = dict(r)
            offers_count = db.execute(
                "SELECT COUNT(*) as count FROM custom_offers WHERE order_id=?", (o["id"],)
            ).fetchone()["count"]
            o["offers_count"] = offers_count
            result.append(o)
        return result

@app.api_route("/api/marketplace/my-orders", methods=["GET", "HEAD"])
def my_orders(x_user_id: Optional[str] = Header(default=None)):
    if not x_user_id:
        return []
    with db_session() as db:
        rows = db.execute(
            "SELECT * FROM custom_orders WHERE buyer_id=? ORDER BY created_at DESC",
            (x_user_id,)
        ).fetchall()
        return [dict(r) for r in rows]

@app.api_route("/api/marketplace/orders/{order_id}", methods=["GET", "HEAD"])
def get_order(order_id: int):
    with db_session() as db:
        order = db.execute("SELECT * FROM custom_orders WHERE id=?", (order_id,)).fetchone()
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        offers = db.execute(
            "SELECT * FROM custom_offers WHERE order_id=? ORDER BY created_at ASC", (order_id,)
        ).fetchall()
        messages = db.execute(
            "SELECT * FROM custom_messages WHERE order_id=? ORDER BY created_at ASC", (order_id,)
        ).fetchall()
        return {
            "order": dict(order),
            "offers": [dict(o) for o in offers],
            "messages": [dict(m) for m in messages],
        }

@app.post("/api/marketplace/orders/{order_id}/offers")
def make_offer(order_id: int, payload: OfferPayload, x_user_id: Optional[str] = Header(default=None)):
    seller_id = x_user_id or "anonymous_seller"
    with db_session() as db:
        order = db.execute("SELECT id FROM custom_orders WHERE id=?", (order_id,)).fetchone()
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        cur = db.execute(
            """INSERT INTO custom_offers
               (order_id,seller_id,seller_name,description,price,delivery_days)
               VALUES (?,?,?,?,?,?)""",
            (order_id, seller_id, payload.seller_name, payload.description,
             payload.price, payload.delivery_days)
        )
        db.commit()
        offer_id = cur.lastrowid
    return {"message": "Offer submitted", "offer_id": offer_id}

@app.patch("/api/marketplace/offers/{offer_id}")
def update_offer_status(offer_id: int, payload: OfferStatusPayload,
                        x_user_id: Optional[str] = Header(default=None)):
    if payload.status not in ("accepted", "rejected"):
        raise HTTPException(status_code=400, detail="Invalid status")
    with db_session() as db:
        offer = db.execute("SELECT order_id FROM custom_offers WHERE id=?", (offer_id,)).fetchone()
        if not offer:
            raise HTTPException(status_code=404, detail="Offer not found")
        db.execute("UPDATE custom_offers SET status=? WHERE id=?", (payload.status, offer_id))
        if payload.status == "accepted":
            db.execute("UPDATE custom_orders SET status='in_progress' WHERE id=?", (offer["order_id"],))
        db.commit()
    return {"message": f"Offer {payload.status}"}

@app.post("/api/marketplace/orders/{order_id}/messages")
def send_message(order_id: int, payload: MessagePayload,
                 x_user_id: Optional[str] = Header(default=None)):
    sender_id = x_user_id or "anonymous_sender"
    with db_session() as db:
        order = db.execute("SELECT id FROM custom_orders WHERE id=?", (order_id,)).fetchone()
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        db.execute(
            "INSERT INTO custom_messages (order_id,offer_id,sender_id,sender_name,message) VALUES (?,?,?,?,?)",
            (order_id, payload.offer_id, sender_id, payload.sender_name, payload.message)
        )
        db.commit()
    return {"message": "Message sent"}

@app.delete("/api/marketplace/orders/{order_id}")
def close_order(order_id: int, x_user_id: Optional[str] = Header(default=None)):
    user_id = x_user_id or "anonymous_buyer"
    with db_session() as db:
        db.execute(
            "UPDATE custom_orders SET status='closed' WHERE id=? AND buyer_id=?",
            (order_id, user_id)
        )
        db.commit()
    return {"message": "Order closed"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=3001, reload=True)
