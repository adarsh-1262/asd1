import express from "express";
import shortid from "shortid";
import Url from "../models/Url.js";
import { redisClient } from "../config/redisClient.js";

const router = express.Router();

// Create Short URL
router.post("/shorten", async (req, res) => {
    const { originalUrl } = req.body;

    if (!originalUrl) return res.status(400).json({ error: "URL is required" });

    console.log("Received URL:", originalUrl);

    try {
        const existingUrl = await Url.findOne({ originalUrl });
        if (existingUrl){
            console.log("Existing URL Found:", existingUrl);
            return res.json(existingUrl);
        } 

        const shortUrl = shortid.generate();
        console.log("Generated Short URL:", shortUrl);
        const newUrl = new Url({ originalUrl, shortUrl });
        await newUrl.save();

        console.log("Short URL Saved to Database:", newUrl);

        res.json(newUrl);
    } catch (error) {
        console.error("Error in URL Shortening:", error.message);
        res.status(500).json({ error: "Server error", details: error.message });
    }
});

// Get Original URL
router.get("/:shortUrl", async (req, res) => {
    const { shortUrl } = req.params;

    try {
        // Check Redis Cache
        const cachedUrl = await redisClient.get(shortUrl);
        if (cachedUrl) {
            console.log("Cache Hit");
            return res.redirect(cachedUrl);
        }

        const url = await Url.findOne({ shortUrl });
        if (!url) return res.status(404).json({ error: "URL Not Found" });

        url.clicks += 1;
        await url.save();

        // Store in Redis
        await redisClient.setEx(shortUrl, 3600, url.originalUrl);
        console.log("Cache Miss - Data Fetched from DB");

        res.redirect(url.originalUrl);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

export default router;
