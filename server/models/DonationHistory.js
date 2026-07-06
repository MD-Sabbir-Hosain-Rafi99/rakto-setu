import mongoose from "mongoose";

const donationHistorySchema = new mongoose.Schema(
    {
        donor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "DonorProfile",
            required: true,
        },

        bloodRequest: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "BloodRequest",
            required: true,
        },

        requester: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
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

        hospitalName: {
            type: String,
            required: true,
        },

        donationDate: {
            type: Date,
            default: Date.now,
        },

        unitsDonated: {
            type: Number,
            default: 1,
        },

        status: {
            type: String,
            enum: ["completed", "cancelled"],
            default: "completed",
        },

        certificateGenerated: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

export default mongoose.model(
    "DonationHistory",
    donationHistorySchema
);