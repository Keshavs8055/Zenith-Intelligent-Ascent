import mongoose, { Schema, Document } from "mongoose";

export interface ITask extends Document {
  userId: Schema.Types.ObjectId;
  planId?: Schema.Types.ObjectId;
  title: string;
  description?: string;
  dueDate?: Date;
  date?: Date;
  status: 'pending' | 'in_progress' | 'completed' | 'skipped';
  estimatedPomodoros: number;
  completedPomodoros: number;
  skipCount: number;
  priority: number;
  avoidanceScore: number;
  lastInteractedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const TaskSchema = new Schema<ITask>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    planId: { type: Schema.Types.ObjectId, ref: "Plan" },
    title: { type: String, required: true },
    description: { type: String },
    dueDate: { type: Date },
    date: { type: Date },
    status: { type: String, enum: ['pending', 'in_progress', 'completed', 'skipped'], default: 'pending' },
    estimatedPomodoros: { type: Number, default: 1 },
    completedPomodoros: { type: Number, default: 0 },
    skipCount: { type: Number, default: 0 },
    priority: { type: Number, default: 0 },
    avoidanceScore: { type: Number, default: 0 },
    lastInteractedAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model<ITask>("Task", TaskSchema);
