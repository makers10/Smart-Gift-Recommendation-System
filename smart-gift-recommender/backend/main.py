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
    result = next(
        (g for g in gift_data if g["relationship"] == relationship
         and g["occasion"] == occasion and g["budget"] == budget), None)

    if not result:
        result = next(
            (g for g in gift_data if g["relationship"] == "anyone"
             and g["occasion"] == occasion and g["budget"] == budget), None)

    if not result:
        result = next(
            (g for g in gift_data if g["relationship"] == relationship
             and g["occasion"] == occasion), None)

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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=3001, reload=True)
