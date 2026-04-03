const mongoose = require("mongoose");

const petSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      default: "Unknown",
    },
    type: {
      type: String,
      required: [true, "Pet type is required"],
      enum: ["dog", "cat", "bird", "rabbit", "other"],
    },
    breed: {
      type: String,
      trim: true,
      default: "Mixed / Unknown",
    },
    age: {
      type: String,
      trim: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "unknown"],
      default: "unknown",
    },
    color: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    // Each entry stores both the public URL and Cloudinary public_id
    // public_id is required to delete the image from Cloudinary later
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
      },
    ],
    status: {
      type: String,
      required: [true, "Status is required"],
      enum: ["lost", "found", "adoption"],
    },
    isResolved: {
      type: Boolean,
      default: false,
    },
    location: {
      address: { type: String, required: [true, "Location address is required"] },
      city: { type: String, required: [true, "City is required"] },
      state: { type: String },
      coordinates: {
        lat: { type: Number },
        lng: { type: Number },
      },
    },
    dateLostOrFound: {
      type: Date,
      default: Date.now,
    },
    // Adoption-only fields
    vaccinated: { type: Boolean, default: false },
    neutered: { type: Boolean, default: false },
    goodWithKids: { type: Boolean, default: false },
    goodWithPets: { type: Boolean, default: false },

    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

petSchema.index({ status: 1, isResolved: 1 });
petSchema.index({ "location.city": 1 });

module.exports = mongoose.model("Pet", petSchema);