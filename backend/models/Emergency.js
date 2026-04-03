const mongoose = require("mongoose");

const emergencySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [150, "Title cannot exceed 150 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    type: {
      type: String,
      required: [true, "Emergency type is required"],
      enum: ["injured", "abuse", "stray_colony", "rescue_needed", "other"],
    },
    urgency: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },
    images: [{ type: String }],
    location: {
      address: { type: String, required: [true, "Location is required"] },
      city: { type: String, required: [true, "City is required"] },
      state: { type: String },
      coordinates: {
        lat: { type: Number },
        lng: { type: Number },
      },
    },
    status: {
      type: String,
      enum: ["active", "in_progress", "resolved"],
      default: "active",
    },
    contactName: { type: String, trim: true },
    contactPhone: { type: String, trim: true },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    helpers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

emergencySchema.index({ status: 1, urgency: 1 });
emergencySchema.index({ "location.city": 1 });

module.exports = mongoose.model("Emergency", emergencySchema);