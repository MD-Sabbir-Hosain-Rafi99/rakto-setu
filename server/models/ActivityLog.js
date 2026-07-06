import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema(
    {
        admin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        action: {
            type: String,
            required: true,
        },
        targetType: {
            type: String,
            enum: ["donor", "request", "user", "system"],
            required: true,
        },
        targetId: {
            type: mongoose.Schema.Types.ObjectId,
            default: null,
        },
        details: {
            type: String,
            default: "",
        },
    },
    { timestamps: true }
);

export default mongoose.model("ActivityLog", activityLogSchema);