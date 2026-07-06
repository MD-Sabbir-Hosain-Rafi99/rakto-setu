import mongoose from "mongoose";

const donorProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    bloodGroup: { type: String, required: true },
    district: { type: String, required: true },
    area: { type: String, required: true },

    lastDonationDate: { type: Date, default: null },
    eligibleAfter: { type: Date, default: null },
    totalDonations: { type: Number, default: 0 },
    livesSaved: { type: Number, default: 0 },

    availability: {
      type: String,
      enum: ["available", "busy", "recently_donated", "offline"],
      default: "available",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    verificationStatus: {
      type: String,
      enum: ["pending", "verified", "rejected", "suspended"],
      default: "pending",
    },

    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    verifiedAt: {
      type: Date,
      default: null,
    },

    rejectionReason: {
      type: String,
      default: "",
    },

    showContact: { type: Boolean, default: true },

    latitude: { type: Number, default: null },
    longitude: { type: Number, default: null },
  },
  { timestamps: true }
);

export default mongoose.model("DonorProfile", donorProfileSchema);