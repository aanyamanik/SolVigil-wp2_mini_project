import mongoose from "mongoose";

const alertSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Alert title is required"],
      trim: true
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true
    },
    severity: {
      type: String,
      enum: ["Low", "Moderate", "High", "Extreme"],
      default: "Moderate"
    },
    temperature: {
      type: String,
      default: "38°C"
    },
    expectedPeak: {
      type: String,
      default: "41°C"
    },
    peakTime: {
      type: String,
      default: "1:00 PM - 4:00 PM"
    },
    description: {
      type: String,
      required: [true, "Alert description is required"]
    },
    status: {
      type: String,
      enum: ["Active", "Monitoring", "Resolved"],
      default: "Active"
    },
    source: {
      type: String,
      default: "Project Demonstration"
    },
    isDemonstration: {
      type: Boolean,
      default: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    }
  },
  {
    timestamps: true
  }
);

export const Alert = mongoose.model("Alert", alertSchema);
