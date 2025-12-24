const express = require("express");
const router = express.Router();
const Food = require("../models/foodModel");

router.get("/", async (req, res) => {
    try {
        const query = req.query.q;

        if (!query || query.trim() === "") {
            return res.json([]);
        }

        const results = await Food.find({
            name: { $regex: query, $options: "i" }
        }).limit(6);

        res.json(results);
    } catch (error) {
        res.status(500).json({ message: "Search failed" });
    }
});

module.exports = router;
