import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { errorHandler } from "middlewares/errorHandler.js";

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

// Routes
app.use("/api/auth", (await import("./routes/auth.js")).default);
app.use("/api/plan", (await import("./routes/plan.js")).default);
app.use("/api/tasks", (await import("./routes/task.js")).default);
app.use(errorHandler);

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

