import mongoose from "mongoose";

const donorProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    bloodGroup: {
      type: String,
      required: true,
    },
    district: {
      type: String,
      required: true,
    },
    area: {
      type: String,
      required: true,
    },
    lastDonationDate: {
      type: Date,
    },
    availability: {
      type: String,
      enum: ["available", "busy", "recently_donated", "offline"],
      default: "available",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    showContact: {
      type: Boolean,
      default: true,
    },
    latitude: {
      type: Number,
      default: null,
    },

    longitude: {
      type: Number,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("DonorProfile", donorProfileSchema);