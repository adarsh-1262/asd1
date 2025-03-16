import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import { connectRedis } from "./config/redisClient.js";
import urlRoutes from "./routes/urlRoutes.js";

dotenv.config();

const app = express();

//Middleware
app.use(express.json());
app.use(cors({ origin: "*" }));

//Routes
app.use("/api/url", urlRoutes);

//Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
    await connectDB();
    await connectRedis();
    console.log(`Server running on port ${PORT}`);
})