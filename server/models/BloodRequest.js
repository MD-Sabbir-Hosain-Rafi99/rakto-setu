import mongoose from "mongoose";

const bloodRequestSchema = new mongoose.Schema(
  {
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    patientName: {
      type: String,
      required: true,
    },
    bloodGroup: {
      type: String,
      required: true,
    },
    unitsNeeded: {
      type: Number,
      required: true,
    },
    hospitalName: {
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
    contactNumber: {
      type: String,
      required: true,
    },
    urgencyLevel: {
      type: String,
      enum: ["critical", "urgent", "normal"],
      default: "normal",
    },
    message: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "completed", "expired"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("BloodRequest", bloodRequestSchema);