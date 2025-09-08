import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health Check
app.get("/health", (_, res) =>
  res
    .status(200)
    .json({ success: true, statusCode: 200, message: "Smooth like butter!" })
);

// Connect MongoDB
(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log("✅ MongoDB connected");
    app.listen(PORT, () =>
      console.log(`🚀 API running at http://localhost:${PORT}`)
    );
  } catch (err) {
    console.error("❌ DB connection failed:", err);
    process.exit(1);
  }
})();

// import { createClient } from "redis";

// const client = createClient({
//   username: "default",
//   password: "mdOQT4ztqJwz6grIlY1USJ0ewAMMGHqI",
//   socket: {
//     host: "redis-11143.c241.us-east-1-4.ec2.redns.redis-cloud.com",
//     port: 11143,
//   },
// });

// client.on("error", (err) => console.log("Redis Client Error", err));

// await client.connect();
