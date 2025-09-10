import { Schema, model } from "mongoose";

const UserSchema = new Schema(
  {
    name: String,
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    isVerified: { type: Boolean, default: false },
    refreshToken: { type: String },

    // NEW: personalization fields
    timezone: { type: String, default: "UTC" },
    preferences: {
      dailyStudyHours: { type: Number, default: 2 },
      preferredStudyTimes: [{ type: String }], // e.g. ["08:00-10:00", "19:00-21:00"]
      notificationChannel: {
        type: String,
        enum: ["email", "push", "sms", "none"],
        default: "push",
      },
    },

    createdAt: Date,
    updatedAt: Date,
  },
  { timestamps: true }
);

export default model("User", UserSchema);
