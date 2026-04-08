const express = require("express");
const router = express.Router();
const giftData = require("../data/gifts");

// GET /api/recommend?relationship=sister&occasion=wedding&budget=medium
router.get("/", (req, res) => {
  const { relationship, occasion, budget } = req.query;

  if (!relationship || !occasion || !budget) {
    return res.status(400).json({ error: "relationship, occasion, and budget are required." });
  }

  // Try exact match first
  let result = giftData.find(
    (item) =>
      item.relationship === relationship &&
      item.occasion === occasion &&
      item.budget === budget
  );

  // Fallback: match "anyone" relationship
  if (!result) {
    result = giftData.find(
      (item) =>
        item.relationship === "anyone" &&
        item.occasion === occasion &&
        item.budget === budget
    );
  }

  // Fallback: match relationship + occasion with any budget
  if (!result) {
    result = giftData.find(
      (item) =>
        item.relationship === relationship &&
        item.occasion === occasion
    );
  }

  if (!result) {
    return res.status(404).json({ message: "No recommendations found for this combination. Try adjusting your filters." });
  }

  res.json({
    relationship,
    occasion,
    budget,
    recommendations: result.gifts,
  });
});

// GET /api/recommend/options — returns all unique relationships and occasions
router.get("/options", (req, res) => {
  const relationships = [...new Set(giftData.map((d) => d.relationship))];
  const occasions = [...new Set(giftData.map((d) => d.occasion))];
  res.json({ relationships, occasions });
});

module.exports = router;
