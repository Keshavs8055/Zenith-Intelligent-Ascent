import { Schema, model } from "mongoose";

const NotificationSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    taskId: { type: Schema.Types.ObjectId, ref: "Task" },
    message: String,
    channel: {
      type: String,
      enum: ["email", "push", "sms"],
      default: "push",
    },
    sentAt: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["pending", "sent", "failed"],
      default: "sent",
    },
  },
  { timestamps: true }
);

export default model("Notification", NotificationSchema);
