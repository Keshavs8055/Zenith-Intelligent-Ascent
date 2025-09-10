import { Schema, model } from "mongoose";

const ProgressSnapshotSchema = new Schema(
  {
    planId: { type: Schema.Types.ObjectId, ref: "Plan" },
    date: { type: Date },
    completedHours: Number,
    remainingHours: Number,
    tasksCompletedCount: Number,
    streak: { type: Number, default: 0 }, // continuous days
    efficiency: { type: Number }, // ratio actual/estimated
  },
  { timestamps: true }
);

export default model("ProgressSnapshot", ProgressSnapshotSchema);
