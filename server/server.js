import dns from "dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);


import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import authRoutes from "./routes/authRoutes.js";
import donorRoutes from "./routes/donorRoutes.js";
import requestRoutes from "./routes/requestRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import recommendationRoutes from "./routes/recommendationRoutes.js";
// AI
import automationRoutes from "./routes/automationRoutes.js";
// Telegram Routes
import telegramRoutes from "./routes/telegramRoutes.js";


dotenv.config({ path: "./.env" });


const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://rakto-setu.vercel.app",
    ],
    credentials: true,
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.send("RaktoSetu API is running...");
});

app.use("/api/auth", authRoutes);
app.use("/api/donors", donorRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/recommendations", recommendationRoutes);
// AI 
app.use("/api/automation", automationRoutes);
app.use("/api/telegram", telegramRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    console.log("Connected DB:", mongoose.connection.name);

    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((error) => {
    console.log("MongoDB Error:", error.message);
  });