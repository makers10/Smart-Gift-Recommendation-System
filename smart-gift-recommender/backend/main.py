from fastapi import FastAPI, Query, HTTPException
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

    # log the search
    db = get_db()
    db.execute(
        "INSERT INTO search_logs (relationship, occasion, budget, gender) VALUES (?,?,?,?)",
        (relationship, occasion, budget, gender)
    )
    db.commit()
    db.close()

    # get vote scores for each gift
    db = get_db()
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
    vote: int  # 1 or -1

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

# ─── WISHLIST ─────────────────────────────────────────────────
class WishlistPayload(BaseModel):
    gift_name: str
    relationship: str
    occasion: str
    budget: str

@app.post("/api/wishlist")
def add_wishlist(payload: WishlistPayload):
    db = get_db()
    db.execute(
        "INSERT INTO wishlist (gift_name, relationship, occasion, budget) VALUES (?,?,?,?)",
        (payload.gift_name, payload.relationship, payload.occasion, payload.budget)
    )
    db.commit()
    db.close()
    return {"message": "Added to wishlist"}

@app.get("/api/wishlist")
def get_wishlist():
    db = get_db()
    rows = db.execute("SELECT * FROM wishlist ORDER BY created_at DESC").fetchall()
    db.close()
    return [dict(r) for r in rows]

@app.delete("/api/wishlist/{item_id}")
def delete_wishlist(item_id: int):
    db = get_db()
    db.execute("DELETE FROM wishlist WHERE id=?", (item_id,))
    db.commit()
    db.close()
    return {"message": "Removed from wishlist"}

# ─── ANALYTICS ────────────────────────────────────────────────
@app.get("/api/analytics")
def analytics():
    db = get_db()

    # total searches
    total = db.execute("SELECT COUNT(*) as count FROM search_logs").fetchone()["count"]

    # top occasions
    top_occasions = db.execute("""
        SELECT occasion, COUNT(*) as count FROM search_logs
        GROUP BY occasion ORDER BY count DESC LIMIT 10
    """).fetchall()

    # top relationships
    top_relationships = db.execute("""
        SELECT relationship, COUNT(*) as count FROM search_logs
        GROUP BY relationship ORDER BY count DESC LIMIT 10
    """).fetchall()

    # gender breakdown
    gender_breakdown = db.execute("""
        SELECT gender, COUNT(*) as count FROM search_logs
        GROUP BY gender ORDER BY count DESC
    """).fetchall()

    # top gifts by votes
    top_gifts = db.execute("""
        SELECT gift_name, relationship, occasion, SUM(vote) as score, COUNT(*) as votes
        FROM gift_votes GROUP BY gift_name, relationship, occasion
        ORDER BY score DESC LIMIT 10
    """).fetchall()

    # festival vs non-festival
    festival_occasions = ('diwali','holi','navratri','raksha_bandhan','baisakhi',
                          'ganesh_chaturthi','onam','ugadi','eid','eid_adha',
                          'christmas','easter','chinese_new_year','mid_autumn',
                          'hanukkah','rosh_hashanah','new_year','thanksgiving','halloween')
    festival_count = db.execute(
        f"SELECT COUNT(*) as count FROM search_logs WHERE occasion IN ({','.join('?'*len(festival_occasions))})",
        festival_occasions
    ).fetchone()["count"]

    # searches by day (last 7 days)
    daily = db.execute("""
        SELECT DATE(created_at) as day, COUNT(*) as count
        FROM search_logs WHERE created_at >= DATE('now','-7 days')
        GROUP BY day ORDER BY day
    """).fetchall()

    db.close()

    return {
        "total_searches": total,
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
    uvicorn.run("main:app", host="127.0.0.1", port=8001, reload=True)
