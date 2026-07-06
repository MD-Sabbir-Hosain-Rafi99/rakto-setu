import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    email: {
      type: String,
      lowercase: true,
      trim: true,
      default: undefined,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: { type: String, required: true },

    role: {
      type: String,
      enum: ["user", "donor", "admin"],
      default: "donor",
    },

    accountStatus: {
      type: String,
      enum: ["active", "suspended"],
      default: "active",
    },

    telegramChatId: {
      type: String,
      default: "",
    },

    telegramConnectCode: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);