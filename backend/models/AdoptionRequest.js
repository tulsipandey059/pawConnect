const mongoose = require("mongoose");

const adoptionRequestSchema = new mongoose.Schema(
  {
    pet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pet",
      required: [true, "Pet reference is required"],
    },
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Requester reference is required"],
    },
    petOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Pet owner reference is required"],
    },
    message: {
      type: String,
      required: [true, "Please write a message about yourself and why you want to adopt"],
      maxlength: [1000, "Message cannot exceed 1000 characters"],
    },
    // Requester's living situation
    livingSituation: {
      type: String,
      enum: ["house_with_yard", "apartment", "house_no_yard", "farm", "other"],
      required: [true, "Living situation is required"],
    },
    hasOtherPets: { type: Boolean, default: false },
    hasChildren: { type: Boolean, default: false },
    experience: {
      type: String,
      enum: ["first_time", "some_experience", "experienced"],
      default: "first_time",
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "withdrawn"],
      default: "pending",
    },
    ownerNote: {
      type: String,
      maxlength: [500, "Note cannot exceed 500 characters"],
    },
  },
  { timestamps: true }
);

// Prevent duplicate requests
adoptionRequestSchema.index({ pet: 1, requester: 1 }, { unique: true });

module.exports = mongoose.model("AdoptionRequest", adoptionRequestSchema);