import mongoose, { Schema, Document } from "mongoose";

export interface ITask extends Document {
  title: string;
  description?: string;
  dueDate?: Date;
  completed: boolean;
  progress: number;
  estimatedHours?: number;
  actualTimeSpent?: number;
  userId: Schema.Types.ObjectId;
  routineId?: string;
  scheduledTime?: Date;
}

const TaskSchema = new Schema<ITask>(
  {
    title: { type: String, required: true },
    description: { type: String },
    dueDate: { type: Date },
    completed: { type: Boolean, default: false },
    progress: { type: Number, default: 0 }, // %
    estimatedHours: { type: Number },
    actualTimeSpent: { type: Number },
    scheduledTime: { type: Date },

    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    routineId: { type: Schema.Types.ObjectId, ref: "Routine" },
  },
  { timestamps: true }
);

export default mongoose.model<ITask>("Task", TaskSchema);
