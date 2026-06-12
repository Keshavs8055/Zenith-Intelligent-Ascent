import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { errorHandler } from "./middlewares/errorHandler.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));
app.use(express.json());

// Health Check
app.get("/health", (_, res) =>
  res
    .status(200)
    .json({ success: true, statusCode: 200, message: "Smooth like butter!" })
);

// Routes
app.use("/api/auth", (await import("./routes/authRoutes.js")).default);
app.use("/api/plan", (await import("./routes/planRoutes.js")).default);
app.use("/api/tasks", (await import("./routes/taskRoutes.js")).default);
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

