from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
from data.gifts import gift_data

app = FastAPI(title="Smart Gift Recommender API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8001, reload=True)


@app.get("/")
def root():
    return {"message": "Smart Gift Recommender API is running."}


@app.get("/api/recommend")
def recommend(
    relationship: str = Query(...),
    occasion: str = Query(...),
    budget: str = Query(...),
):
    # 1. Exact match
    result = next(
        (g for g in gift_data
         if g["relationship"] == relationship
         and g["occasion"] == occasion
         and g["budget"] == budget),
        None,
    )

    # 2. Fallback: "anyone" + same occasion + same budget
    if not result:
        result = next(
            (g for g in gift_data
             if g["relationship"] == "anyone"
             and g["occasion"] == occasion
             and g["budget"] == budget),
            None,
        )

    # 3. Fallback: same relationship + occasion, ignore budget
    if not result:
        result = next(
            (g for g in gift_data
             if g["relationship"] == relationship
             and g["occasion"] == occasion),
            None,
        )

    if not result:
        raise HTTPException(
            status_code=404,
            detail="No recommendations found. Try adjusting your filters.",
        )

    return {
        "relationship": relationship,
        "occasion": occasion,
        "budget": budget,
        "recommendations": result["gifts"],
    }


@app.get("/api/options")
def options():
    relationships = list({g["relationship"] for g in gift_data})
    occasions = list({g["occasion"] for g in gift_data})
    return {"relationships": sorted(relationships), "occasions": sorted(occasions)}
