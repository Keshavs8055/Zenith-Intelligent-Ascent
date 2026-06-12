import mongoose, { Schema, Document } from "mongoose";

export interface ITaskLog extends Document {
  taskId: Schema.Types.ObjectId;
  action: 'completed' | 'skipped' | 'edited';
  note?: string;
  createdAt: Date;
}

const TaskLogSchema = new Schema<ITaskLog>(
  {
    taskId: { type: Schema.Types.ObjectId, ref: "Task", required: true },
    action: { type: String, enum: ['completed', 'skipped', 'edited'], required: true },
    note: { type: String },
  },
  { timestamps: true }
);

TaskLogSchema.index({ taskId: 1, createdAt: -1 });

export default mongoose.model<ITaskLog>("TaskLog", TaskLogSchema);
