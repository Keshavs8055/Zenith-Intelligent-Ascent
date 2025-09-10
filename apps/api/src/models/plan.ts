import mongoose, { Schema, Document } from "mongoose";

export interface IPlan extends Document {
  userId: Schema.Types.ObjectId;
  title: string;
  prompt: string;
  taskIds: Schema.Types.ObjectId[];
  deadline?: Date | null;
  hoursPerDay?: number | null;
  status: "active" | "completed" | "archived";
  adaptive: boolean; // AI allowed to reschedule?
}

const PlanSchema = new Schema<IPlan>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    prompt: { type: String, required: true },
    taskIds: [{ type: Schema.Types.ObjectId, ref: "Task" }],
    deadline: { type: Date },
    hoursPerDay: { type: Number },
    status: {
      type: String,
      enum: ["active", "completed", "archived"],
      default: "active",
    },
    adaptive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

PlanSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model<IPlan>("Plan", PlanSchema);
