const express = require("express");
const cors = require("cors");
const recommendRouter = require("./routes/recommend");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/recommend", recommendRouter);

app.get("/", (req, res) => res.send("Smart Gift Recommender API running."));

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
