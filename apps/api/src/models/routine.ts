import { Schema } from "mongoose";

const RoutineSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    title: String,
    cronOrRRule: String, // e.g. RRULE or cron-like representation
    averageHoursPerOccurrence: Number,
    nextRun: Date,
    active: Boolean,
  },
  { timestamps: true }
);
